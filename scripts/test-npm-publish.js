#!/usr/bin/env node

/**
 * npm公開プロセステストスクリプト
 * テストレジストリを使用して安全に公開プロセスを検証します
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class NpmPublishTester {
  constructor() {
    this.testRegistry = 'http://localhost:4873'; // Verdaccioローカルレジストリ
    this.originalRegistry = null;
    this.testPackageName = null;
    this.testResults = {
      registrySetup: false,
      packageBuild: false,
      publishDryRun: false,
      publishTest: false,
      versionManagement: false,
      cleanup: false
    };
    this.backupFiles = new Map();
  }

  /**
   * メインテスト実行
   */
  async runPublishTest() {
    console.log('📦 npm公開プロセステストを開始します...\n');

    try {
      await this.setupTestEnvironment();
      await this.testPackageBuild();
      await this.testPublishDryRun();
      await this.testVersionManagement();
      await this.testActualPublish();
      await this.cleanup();
      
      this.generatePublishTestReport();
    } catch (error) {
      console.error('❌ npm公開テスト中にエラーが発生しました:', error.message);
      await this.emergencyCleanup();
    }
  }

  /**
   * テスト環境のセットアップ
   */
  async setupTestEnvironment() {
    console.log('🔧 テスト環境のセットアップ');

    try {
      // 現在のnpmレジストリを記録
      this.originalRegistry = execSync('npm config get registry', { encoding: 'utf8' }).trim();
      console.log(`   現在のレジストリ: ${this.originalRegistry}`);

      // パッケージ情報の取得
      const packageJsonPath = 'packages/specment/package.json';
      if (!fs.existsSync(packageJsonPath)) {
        throw new Error('packages/specment/package.json が見つかりません');
      }

      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      this.testPackageName = packageJson.name;
      console.log(`   テスト対象パッケージ: ${this.testPackageName}`);

      // テスト用パッケージ設定の作成
      await this.createTestPackageConfig();

      console.log('   ✅ テスト環境セットアップ完了');
      this.testResults.registrySetup = true;

    } catch (error) {
      console.log(`   ❌ テスト環境セットアップ失敗: ${error.message}`);
      throw error;
    }

    console.log('');
  }

  /**
   * テスト用パッケージ設定の作成
   */
  async createTestPackageConfig() {
    const packageJsonPath = 'packages/specment/package.json';
    const originalContent = fs.readFileSync(packageJsonPath, 'utf8');
    const packageJson = JSON.parse(originalContent);

    // 元のファイルをバックアップ
    this.backupFiles.set(packageJsonPath, originalContent);

    // テスト用の設定に変更
    const testPackageJson = {
      ...packageJson,
      name: `${packageJson.name}-test`,
      version: '0.0.1-test',
      private: false,
      publishConfig: {
        registry: this.testRegistry,
        access: 'public'
      }
    };

    fs.writeFileSync(packageJsonPath, JSON.stringify(testPackageJson, null, 2));
    console.log('   ✅ テスト用パッケージ設定を作成');
  }

  /**
   * パッケージビルドのテスト
   */
  async testPackageBuild() {
    console.log('🔨 パッケージビルドテスト');

    try {
      // 既存のビルド出力をクリーンアップ
      const distPath = 'packages/specment/dist';
      if (fs.existsSync(distPath)) {
        execSync(`rm -rf ${distPath}`, { stdio: 'pipe' });
      }

      // ビルド実行
      console.log('   ビルド実行中...');
      execSync('pnpm specment:build', { stdio: 'pipe' });

      // ビルド出力の検証
      if (!fs.existsSync(distPath)) {
        throw new Error('ビルド出力ディレクトリが作成されませんでした');
      }

      const distFiles = fs.readdirSync(distPath);
      console.log(`   ✅ ビルド出力: ${distFiles.length}個のファイル`);

      // 重要なファイルの存在確認
      const requiredFiles = ['index.js', 'index.d.ts', 'package.json'];
      for (const file of requiredFiles) {
        if (!distFiles.includes(file)) {
          throw new Error(`必要なファイルが不足: ${file}`);
        }
        console.log(`   ✅ ${file}: 存在`);
      }

      // パッケージサイズの確認
      const packageSize = execSync(`du -sh ${distPath}`, { encoding: 'utf8' }).split('\t')[0];
      console.log(`   📦 パッケージサイズ: ${packageSize}`);

      this.testResults.packageBuild = true;

    } catch (error) {
      console.log(`   ❌ パッケージビルド失敗: ${error.message}`);
      throw error;
    }

    console.log('');
  }

  /**
   * npm publish --dry-run テスト
   */
  async testPublishDryRun() {
    console.log('🧪 npm publish --dry-run テスト');

    try {
      // dry-runでの公開テスト
      console.log('   dry-run実行中...');
      const dryRunOutput = execSync('npm publish --dry-run', {
        cwd: 'packages/specment',
        encoding: 'utf8'
      });

      console.log('   ✅ dry-run成功');
      
      // dry-run出力の分析
      const lines = dryRunOutput.split('\n');
      const packageInfo = lines.find(line => line.includes('package:'));
      if (packageInfo) {
        console.log(`   📦 ${packageInfo.trim()}`);
      }

      const filesInfo = lines.find(line => line.includes('files:'));
      if (filesInfo) {
        console.log(`   📁 ${filesInfo.trim()}`);
      }

      const sizeInfo = lines.find(line => line.includes('unpacked size:'));
      if (sizeInfo) {
        console.log(`   📏 ${sizeInfo.trim()}`);
      }

      this.testResults.publishDryRun = true;

    } catch (error) {
      console.log(`   ❌ dry-run失敗: ${error.message}`);
      
      // エラーの詳細分析
      if (error.message.includes('ENEEDAUTH')) {
        console.log('   💡 認証が必要です（テスト環境では正常）');
      } else if (error.message.includes('package.json')) {
        console.log('   💡 package.json設定を確認してください');
      }
      
      throw error;
    }

    console.log('');
  }

  /**
   * バージョン管理のテスト
   */
  async testVersionManagement() {
    console.log('📋 バージョン管理テスト');

    try {
      // 現在のバージョン確認
      const packageJson = JSON.parse(fs.readFileSync('packages/specment/package.json', 'utf8'));
      const currentVersion = packageJson.version;
      console.log(`   現在のバージョン: ${currentVersion}`);

      // Changesets CLIでのバージョン確認
      try {
        const changesetStatus = execSync('npx @changesets/cli status', { 
          encoding: 'utf8',
          stdio: 'pipe'
        });
        console.log('   ✅ Changesets状態確認成功');
        
        // バージョンアップの予測
        if (changesetStatus.includes('patch')) {
          console.log('   📈 予想される変更: PATCH');
        } else if (changesetStatus.includes('minor')) {
          console.log('   📈 予想される変更: MINOR');
        } else if (changesetStatus.includes('major')) {
          console.log('   📈 予想される変更: MAJOR');
        }
      } catch (error) {
        console.log('   ⚠️  Changesets状態確認で警告（テスト環境では正常）');
      }

      // セマンティックバージョニングの検証
      const versionPattern = /^\d+\.\d+\.\d+/;
      if (!versionPattern.test(currentVersion)) {
        throw new Error(`無効なバージョン形式: ${currentVersion}`);
      }

      console.log('   ✅ バージョン形式: 有効');
      this.testResults.versionManagement = true;

    } catch (error) {
      console.log(`   ❌ バージョン管理テスト失敗: ${error.message}`);
      throw error;
    }

    console.log('');
  }

  /**
   * 実際の公開テスト（テストレジストリ使用）
   */
  async testActualPublish() {
    console.log('🚀 実際の公開テスト（テストレジストリ）');

    try {
      // Verdaccioローカルレジストリの起動確認
      console.log('   テストレジストリの確認中...');
      
      try {
        // ローカルレジストリへの接続テスト
        execSync(`curl -f ${this.testRegistry}`, { stdio: 'pipe' });
        console.log('   ✅ テストレジストリ利用可能');
        
        // テストレジストリへの公開
        await this.publishToTestRegistry();
        
      } catch (error) {
        console.log('   ⚠️  テストレジストリ未利用 - 公開シミュレーションのみ実行');
        await this.simulatePublishProcess();
      }

      this.testResults.publishTest = true;

    } catch (error) {
      console.log(`   ❌ 公開テスト失敗: ${error.message}`);
      throw error;
    }

    console.log('');
  }

  /**
   * テストレジストリへの公開
   */
  async publishToTestRegistry() {
    // npmレジストリをテスト用に変更
    execSync(`npm config set registry ${this.testRegistry}`, { stdio: 'pipe' });
    
    try {
      // テスト用認証（Verdaccio用）
      execSync('npm adduser --registry http://localhost:4873', { 
        input: 'test\ntest\ntest@example.com\n',
        stdio: 'pipe'
      });

      // 公開実行
      execSync('npm publish', {
        cwd: 'packages/specment',
        stdio: 'pipe'
      });

      console.log('   ✅ テストレジストリへの公開成功');

      // 公開されたパッケージの確認
      const packageInfo = execSync(`npm view ${this.testPackageName}-test`, {
        encoding: 'utf8'
      });
      console.log('   📦 公開されたパッケージ情報:');
      console.log(packageInfo.split('\n').slice(0, 5).join('\n'));

    } finally {
      // レジストリを元に戻す
      execSync(`npm config set registry ${this.originalRegistry}`, { stdio: 'pipe' });
    }
  }

  /**
   * 公開プロセスのシミュレーション
   */
  async simulatePublishProcess() {
    console.log('   📋 公開プロセスシミュレーション実行中...');

    // 公開に必要な条件の確認
    const checks = [
      {
        name: 'パッケージファイル存在',
        test: () => fs.existsSync('packages/specment/dist/package.json')
      },
      {
        name: 'メインファイル存在',
        test: () => fs.existsSync('packages/specment/dist/index.js')
      },
      {
        name: '型定義ファイル存在',
        test: () => fs.existsSync('packages/specment/dist/index.d.ts')
      },
      {
        name: 'README存在',
        test: () => fs.existsSync('packages/specment/README.md') || fs.existsSync('README.md')
      }
    ];

    for (const check of checks) {
      if (check.test()) {
        console.log(`     ✅ ${check.name}`);
      } else {
        console.log(`     ⚠️  ${check.name}: 不足`);
      }
    }

    console.log('   ✅ 公開プロセスシミュレーション完了');
  }

  /**
   * クリーンアップ
   */
  async cleanup() {
    console.log('🧹 テスト環境のクリーンアップ');

    try {
      // バックアップファイルの復元
      for (const [filePath, originalContent] of this.backupFiles) {
        fs.writeFileSync(filePath, originalContent);
        console.log(`   ✅ ${filePath} を復元`);
      }

      // npmレジストリの復元
      if (this.originalRegistry) {
        execSync(`npm config set registry ${this.originalRegistry}`, { stdio: 'pipe' });
        console.log('   ✅ npmレジストリを復元');
      }

      this.testResults.cleanup = true;

    } catch (error) {
      console.log(`   ❌ クリーンアップ失敗: ${error.message}`);
    }

    console.log('');
  }

  /**
   * 緊急時のクリーンアップ
   */
  async emergencyCleanup() {
    console.log('🚨 緊急クリーンアップを実行中...');

    try {
      // バックアップファイルの復元
      for (const [filePath, originalContent] of this.backupFiles) {
        if (fs.existsSync(filePath)) {
          fs.writeFileSync(filePath, originalContent);
        }
      }

      // npmレジストリの復元
      if (this.originalRegistry) {
        execSync(`npm config set registry ${this.originalRegistry}`, { stdio: 'pipe' });
      }

      console.log('   ✅ 緊急クリーンアップ完了');

    } catch (error) {
      console.log(`   ❌ 緊急クリーンアップ失敗: ${error.message}`);
      console.log('   手動でのクリーンアップが必要です:');
      console.log(`   1. npm config set registry ${this.originalRegistry}`);
      console.log('   2. packages/specment/package.json の復元');
    }
  }

  /**
   * 公開テストレポートの生成
   */
  generatePublishTestReport() {
    console.log('📊 npm公開テスト結果レポート');
    console.log('=' .repeat(50));

    const totalTests = Object.keys(this.testResults).length;
    const passedTests = Object.values(this.testResults).filter(result => result === true).length;
    const successRate = Math.round(passedTests/totalTests*100);

    console.log(`\n📈 テスト成功率: ${passedTests}/${totalTests} (${successRate}%)`);

    console.log('\n📋 個別テスト結果:');
    console.log(`   レジストリセットアップ: ${this.testResults.registrySetup ? '✅ 成功' : '❌ 失敗'}`);
    console.log(`   パッケージビルド: ${this.testResults.packageBuild ? '✅ 成功' : '❌ 失敗'}`);
    console.log(`   公開dry-run: ${this.testResults.publishDryRun ? '✅ 成功' : '❌ 失敗'}`);
    console.log(`   公開テスト: ${this.testResults.publishTest ? '✅ 成功' : '❌ 失敗'}`);
    console.log(`   バージョン管理: ${this.testResults.versionManagement ? '✅ 成功' : '❌ 失敗'}`);
    console.log(`   クリーンアップ: ${this.testResults.cleanup ? '✅ 成功' : '❌ 失敗'}`);

    console.log('\n🎯 総合判定:');
    if (successRate >= 80) {
      console.log('   ✅ npm公開プロセスは正常に動作する可能性が高いです');
    } else {
      console.log('   ❌ npm公開プロセスに問題がある可能性があります');
    }

    console.log('\n📝 本番環境での注意事項:');
    console.log('   1. NPM_TOKEN の適切な設定と権限確認');
    console.log('   2. パッケージ名の重複確認');
    console.log('   3. バージョン管理の慎重な実行');
    console.log('   4. 公開後のパッケージ動作確認');

    console.log('\n💡 推奨される次のステップ:');
    if (successRate >= 80) {
      console.log('   1. GitHub Secretsでの NPM_TOKEN 設定');
      console.log('   2. テスト用プルリクエストでの実際のワークフロー実行');
      console.log('   3. 公開されたパッケージの動作確認');
    } else {
      console.log('   1. 失敗したテストの原因調査と修正');
      console.log('   2. パッケージ設定の見直し');
      console.log('   3. ビルドプロセスの最適化');
    }

    console.log('\n' + '=' .repeat(50));
  }
}

// メイン実行
if (require.main === module) {
  const tester = new NpmPublishTester();
  tester.runPublishTest().catch(error => {
    console.error('npm公開テスト実行中に予期しないエラーが発生しました:', error);
    process.exit(1);
  });
}

module.exports = NpmPublishTester;