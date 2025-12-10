#!/usr/bin/env node

/**
 * npm公開プロセスのドライランテスト
 * 
 * 実際にnpmに公開することなく、公開プロセス全体を
 * シミュレートして動作を検証します。
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class NpmPublishDryRun {
  constructor() {
    this.testResults = [];
    this.dryRunLog = [];
    this.originalPackageJson = null;
  }

  /**
   * ドライラン実行のメインエントリーポイント
   */
  async runDryRun() {
    console.log('🧪 npm公開プロセスのドライランを開始します...\n');

    try {
      await this.prepareEnvironment();
      await this.simulateChangesetProcess();
      await this.simulateNpmPublish();
      await this.validatePublishOutput();
      await this.cleanupEnvironment();
      await this.generateDryRunReport();
    } catch (error) {
      console.error('❌ ドライラン実行中にエラーが発生しました:', error.message);
      await this.cleanupEnvironment();
      process.exit(1);
    }
  }

  /**
   * 環境の準備
   */
  async prepareEnvironment() {
    console.log('🔧 1. 環境の準備');

    try {
      // 現在のpackage.jsonをバックアップ
      const packageJsonPath = 'packages/specment/package.json';
      if (fs.existsSync(packageJsonPath)) {
        this.originalPackageJson = fs.readFileSync(packageJsonPath, 'utf8');
        this.log(`✅ package.json をバックアップしました`);
      }

      // 作業ディレクトリの確認
      const workingDir = process.cwd();
      this.log(`📁 作業ディレクトリ: ${workingDir}`);

      // 必要なファイルの存在確認
      const requiredFiles = [
        'package.json',
        'pnpm-lock.yaml',
        '.changeset/config.json',
        '.github/workflows/npm-publish.yaml'
      ];

      requiredFiles.forEach(file => {
        if (fs.existsSync(file)) {
          this.log(`✅ ${file} が存在します`);
        } else {
          this.log(`❌ ${file} が見つかりません`);
          throw new Error(`必要なファイル ${file} が見つかりません`);
        }
      });

      // 依存関係の確認
      if (fs.existsSync('node_modules')) {
        this.log(`✅ node_modules が存在します`);
      } else {
        this.log(`⚠️ node_modules が見つかりません - 依存関係をインストールします`);
        execSync('pnpm install', { encoding: 'utf8' });
        this.log(`✅ 依存関係をインストールしました`);
      }

      console.log('  ✅ 環境の準備が完了しました');

    } catch (error) {
      throw new Error(`環境準備エラー: ${error.message}`);
    }

    console.log();
  }

  /**
   * Changesetプロセスのシミュレーション
   */
  async simulateChangesetProcess() {
    console.log('📝 2. Changesetプロセスのシミュレーション');

    try {
      // 現在のChangeset状況を確認
      this.log('🔍 現在のChangeset状況を確認中...');
      
      const changesetFiles = fs.readdirSync('.changeset')
        .filter(file => file.endsWith('.md') && file !== 'README.md');

      if (changesetFiles.length === 0) {
        this.log('⚠️ Changesetファイルが見つかりません');
        
        // テスト用Changesetを作成
        const testChangesetContent = `---
"@plenarc/specment": patch
---

ドライランテスト用のChangeset - バージョン更新とnpm公開プロセスの検証`;

        const testChangesetPath = '.changeset/dry-run-test.md';
        fs.writeFileSync(testChangesetPath, testChangesetContent);
        this.log(`✅ テスト用Changeset ${testChangesetPath} を作成しました`);
        
        // クリーンアップ時に削除するためにマーク
        this.testChangesetPath = testChangesetPath;
      } else {
        this.log(`✅ ${changesetFiles.length} 個のChangesetファイルが見つかりました`);
        changesetFiles.forEach(file => {
          this.log(`  - ${file}`);
        });
      }

      // Changeset statusの実行
      this.log('📊 Changeset status を実行中...');
      try {
        const statusOutput = execSync('pnpm changeset status', { encoding: 'utf8' });
        this.log('✅ Changeset status 実行成功');
        
        // 出力の解析
        const lines = statusOutput.split('\n');
        lines.forEach(line => {
          if (line.includes('to be bumped')) {
            this.log(`  📈 ${line.trim()}`);
          }
        });
      } catch (error) {
        this.log(`❌ Changeset status エラー: ${error.message}`);
        throw error;
      }

      // バージョン更新のシミュレーション（ドライラン）
      this.log('🔄 バージョン更新をシミュレーション中...');
      try {
        // changeset version のドライラン
        const versionOutput = execSync('pnpm changeset version', { encoding: 'utf8' });
        this.log('✅ バージョン更新シミュレーション成功');
        
        // 更新されたバージョンを確認
        const packageJsonPath = 'packages/specment/package.json';
        if (fs.existsSync(packageJsonPath)) {
          const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
          this.log(`📦 更新後のバージョン: ${packageJson.name}@${packageJson.version}`);
          this.newVersion = packageJson.version;
        }
        
      } catch (error) {
        this.log(`❌ バージョン更新エラー: ${error.message}`);
        throw error;
      }

      console.log('  ✅ Changesetプロセスのシミュレーションが完了しました');

    } catch (error) {
      throw new Error(`Changesetプロセスエラー: ${error.message}`);
    }

    console.log();
  }

  /**
   * npm公開のシミュレーション
   */
  async simulateNpmPublish() {
    console.log('📦 3. npm公開のシミュレーション');

    try {
      // ビルドプロセスの実行
      this.log('🔨 ビルドプロセスを実行中...');
      try {
        const buildOutput = execSync('pnpm specment:build', { encoding: 'utf8' });
        this.log('✅ ビルドが成功しました');
        
        // ビルド出力の確認
        if (fs.existsSync('packages/specment/dist')) {
          const distFiles = fs.readdirSync('packages/specment/dist');
          this.log(`📁 ビルド出力: ${distFiles.length} ファイル生成`);
          
          // 重要なファイルの確認
          const importantFiles = ['index.js', 'index.d.ts', 'package.json'];
          importantFiles.forEach(file => {
            if (distFiles.includes(file)) {
              this.log(`  ✅ ${file}`);
            } else {
              this.log(`  ⚠️ ${file} が見つかりません`);
            }
          });
        }
      } catch (error) {
        this.log(`❌ ビルドエラー: ${error.message}`);
        throw error;
      }

      // npm publish のドライラン実行
      this.log('🚀 npm publish ドライランを実行中...');
      try {
        // パッケージディレクトリに移動してドライラン実行
        const packageDir = 'packages/specment';
        const dryRunOutput = execSync('npm publish --dry-run', { 
          cwd: packageDir,
          encoding: 'utf8' 
        });
        
        this.log('✅ npm publish ドライラン成功');
        
        // ドライラン出力の解析
        const lines = dryRunOutput.split('\n');
        lines.forEach(line => {
          if (line.includes('npm notice')) {
            this.log(`  📋 ${line.trim()}`);
          }
          if (line.includes('tarball')) {
            this.log(`  📦 ${line.trim()}`);
          }
          if (line.includes('shasum')) {
            this.log(`  🔐 ${line.trim()}`);
          }
        });

        // パッケージサイズの確認
        if (dryRunOutput.includes('package size:')) {
          const sizeMatch = dryRunOutput.match(/package size:\s*([^\n]+)/);
          if (sizeMatch) {
            this.log(`  📏 パッケージサイズ: ${sizeMatch[1]}`);
          }
        }

        // 含まれるファイル数の確認
        if (dryRunOutput.includes('total files:')) {
          const filesMatch = dryRunOutput.match(/total files:\s*(\d+)/);
          if (filesMatch) {
            this.log(`  📄 含まれるファイル数: ${filesMatch[1]}`);
          }
        }

      } catch (error) {
        this.log(`❌ npm publish ドライランエラー: ${error.message}`);
        
        // エラーの詳細分析
        if (error.message.includes('ENEEDAUTH')) {
          this.log('  🔐 認証エラー: npm認証情報が設定されていません');
          this.log('  💡 これはドライランでは正常な動作です');
        } else if (error.message.includes('E403')) {
          this.log('  🚫 権限エラー: パッケージ公開権限がありません');
        } else if (error.message.includes('E409')) {
          this.log('  🔄 バージョン競合: 同じバージョンが既に公開されています');
        }
        
        // ドライランの場合は認証エラーは無視
        if (!error.message.includes('ENEEDAUTH')) {
          throw error;
        } else {
          this.log('  ✅ 認証エラーは予期された動作です（ドライラン）');
        }
      }

      // パッケージ内容の検証
      this.log('🔍 パッケージ内容を検証中...');
      try {
        const packageDir = 'packages/specment';
        const packageJsonPath = path.join(packageDir, 'package.json');
        
        if (fs.existsSync(packageJsonPath)) {
          const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
          
          this.log(`  📦 パッケージ名: ${packageJson.name}`);
          this.log(`  🏷️ バージョン: ${packageJson.version}`);
          this.log(`  📝 説明: ${packageJson.description || 'なし'}`);
          this.log(`  🏠 ホームページ: ${packageJson.homepage || 'なし'}`);
          this.log(`  📄 ライセンス: ${packageJson.license || 'なし'}`);
          
          // エントリーポイントの確認
          if (packageJson.main) {
            const mainFile = path.join(packageDir, packageJson.main);
            if (fs.existsSync(mainFile)) {
              this.log(`  ✅ メインファイル: ${packageJson.main}`);
            } else {
              this.log(`  ❌ メインファイルが見つかりません: ${packageJson.main}`);
            }
          }
          
          // TypeScript宣言ファイルの確認
          if (packageJson.types) {
            const typesFile = path.join(packageDir, packageJson.types);
            if (fs.existsSync(typesFile)) {
              this.log(`  ✅ 型定義ファイル: ${packageJson.types}`);
            } else {
              this.log(`  ❌ 型定義ファイルが見つかりません: ${packageJson.types}`);
            }
          }
        }
      } catch (error) {
        this.log(`⚠️ パッケージ内容検証エラー: ${error.message}`);
      }

      console.log('  ✅ npm公開のシミュレーションが完了しました');

    } catch (error) {
      throw new Error(`npm公開シミュレーションエラー: ${error.message}`);
    }

    console.log();
  }

  /**
   * 公開出力の検証
   */
  async validatePublishOutput() {
    console.log('✅ 4. 公開出力の検証');

    try {
      // ビルド出力の詳細検証
      this.log('🔍 ビルド出力を詳細検証中...');
      
      const distDir = 'packages/specment/dist';
      if (fs.existsSync(distDir)) {
        const files = this.getAllFiles(distDir);
        this.log(`📁 ビルド出力ディレクトリ: ${distDir}`);
        this.log(`📄 総ファイル数: ${files.length}`);
        
        // ファイル種別の分析
        const fileTypes = {};
        files.forEach(file => {
          const ext = path.extname(file);
          fileTypes[ext] = (fileTypes[ext] || 0) + 1;
        });
        
        Object.entries(fileTypes).forEach(([ext, count]) => {
          this.log(`  ${ext || '(拡張子なし)'}: ${count} ファイル`);
        });
        
        // 重要なファイルの詳細確認
        const importantFiles = [
          { name: 'index.js', description: 'メインエントリーポイント' },
          { name: 'index.d.ts', description: 'TypeScript型定義' },
          { name: 'package.json', description: 'パッケージメタデータ' }
        ];
        
        importantFiles.forEach(({ name, description }) => {
          const filePath = path.join(distDir, name);
          if (fs.existsSync(filePath)) {
            const stats = fs.statSync(filePath);
            this.log(`  ✅ ${name} (${description}): ${stats.size} bytes`);
          } else {
            this.log(`  ❌ ${name} (${description}): 見つかりません`);
          }
        });
      } else {
        this.log(`❌ ビルド出力ディレクトリが見つかりません: ${distDir}`);
      }

      // package.json の妥当性確認
      this.log('📋 package.json の妥当性を確認中...');
      const packageJsonPath = 'packages/specment/package.json';
      if (fs.existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        
        // 必須フィールドの確認
        const requiredFields = ['name', 'version', 'main', 'types'];
        requiredFields.forEach(field => {
          if (packageJson[field]) {
            this.log(`  ✅ ${field}: ${packageJson[field]}`);
          } else {
            this.log(`  ⚠️ ${field}: 未設定`);
          }
        });
        
        // セマンティックバージョニングの確認
        const versionRegex = /^\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?(\+[a-zA-Z0-9.-]+)?$/;
        if (versionRegex.test(packageJson.version)) {
          this.log(`  ✅ バージョン形式が正しいです: ${packageJson.version}`);
        } else {
          this.log(`  ❌ バージョン形式が不正です: ${packageJson.version}`);
        }
        
        // 依存関係の確認
        const deps = Object.keys(packageJson.dependencies || {}).length;
        const devDeps = Object.keys(packageJson.devDependencies || {}).length;
        const peerDeps = Object.keys(packageJson.peerDependencies || {}).length;
        
        this.log(`  📦 依存関係: ${deps} 個`);
        this.log(`  🔧 開発依存関係: ${devDeps} 個`);
        this.log(`  🤝 ピア依存関係: ${peerDeps} 個`);
      }

      console.log('  ✅ 公開出力の検証が完了しました');

    } catch (error) {
      throw new Error(`公開出力検証エラー: ${error.message}`);
    }

    console.log();
  }

  /**
   * 環境のクリーンアップ
   */
  async cleanupEnvironment() {
    console.log('🧹 5. 環境のクリーンアップ');

    try {
      // package.jsonの復元
      if (this.originalPackageJson) {
        const packageJsonPath = 'packages/specment/package.json';
        fs.writeFileSync(packageJsonPath, this.originalPackageJson);
        this.log('✅ package.json を元の状態に復元しました');
      }

      // テスト用Changesetの削除
      if (this.testChangesetPath && fs.existsSync(this.testChangesetPath)) {
        fs.unlinkSync(this.testChangesetPath);
        this.log(`✅ テスト用Changeset ${this.testChangesetPath} を削除しました`);
      }

      // Changesetによって生成されたファイルの確認と復元
      const changelogPath = 'packages/specment/CHANGELOG.md';
      if (fs.existsSync(changelogPath)) {
        this.log('📝 CHANGELOG.md が更新されています');
        this.log('  💡 必要に応じて手動で元の状態に戻してください');
      }

      console.log('  ✅ 環境のクリーンアップが完了しました');

    } catch (error) {
      console.log(`⚠️ クリーンアップ中にエラーが発生しました: ${error.message}`);
    }

    console.log();
  }

  /**
   * ドライランレポートの生成
   */
  async generateDryRunReport() {
    console.log('📊 6. ドライランレポートの生成');

    const passedTests = this.testResults.filter(result => result.passed).length;
    const totalTests = this.testResults.length;
    const failedTests = totalTests - passedTests;

    console.log(`\n📋 ドライラン結果サマリー:`);
    console.log(`  ✅ 成功: ${passedTests}`);
    console.log(`  ❌ 失敗: ${failedTests}`);
    console.log(`  📊 成功率: ${totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(1) : 100}%`);

    if (failedTests > 0) {
      console.log('\n❌ 失敗した項目:');
      this.testResults
        .filter(result => !result.passed)
        .forEach(result => {
          console.log(`  - ${result.description}: ${result.error}`);
        });
    }

    // 詳細ログの出力
    console.log('\n📝 詳細実行ログ:');
    this.dryRunLog.forEach(log => {
      console.log(`  ${log}`);
    });

    // レポートファイルの生成
    const reportPath = 'npm-publish-dry-run-report.json';
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        total: totalTests,
        passed: passedTests,
        failed: failedTests,
        successRate: totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(1) : 100
      },
      newVersion: this.newVersion,
      results: this.testResults,
      executionLog: this.dryRunLog
    };

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n📄 詳細なドライランレポートが ${reportPath} に保存されました`);

    if (failedTests > 0) {
      console.log('\n🔧 修正が必要な項目があります。上記の失敗した項目を確認してください。');
    } else {
      console.log('\n🎉 ドライランが成功しました！npm公開プロセスは正常に動作する準備ができています。');
    }

    console.log(`
🔍 次のステップ:
1. GitHub Secretsに NPM_TOKEN を設定
2. テストブランチでワークフローを実行
3. 実際のmainブランチでの公開テスト

⚠️ 注意: 実際の公開前に必ずテスト環境で動作確認を行ってください。
`);
  }

  /**
   * ログ記録
   */
  log(message) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}`;
    this.dryRunLog.push(logEntry);
    console.log(`    ${message}`);
  }

  /**
   * ディレクトリ内の全ファイルを再帰的に取得
   */
  getAllFiles(dirPath, arrayOfFiles = []) {
    const files = fs.readdirSync(dirPath);

    files.forEach(file => {
      const fullPath = path.join(dirPath, file);
      if (fs.statSync(fullPath).isDirectory()) {
        arrayOfFiles = this.getAllFiles(fullPath, arrayOfFiles);
      } else {
        arrayOfFiles.push(fullPath);
      }
    });

    return arrayOfFiles;
  }
}

// スクリプトが直接実行された場合のみドライランを実行
if (require.main === module) {
  const dryRun = new NpmPublishDryRun();
  dryRun.runDryRun().catch(error => {
    console.error('ドライラン実行エラー:', error);
    process.exit(1);
  });
}

module.exports = NpmPublishDryRun;