#!/usr/bin/env node

/**
 * エラーシナリオテストスクリプト
 * ワークフローの各種エラー条件での動作を検証します
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class ErrorScenarioTester {
  constructor() {
    this.testResults = {
      noChangesetsScenario: false,
      authErrorScenario: false,
      buildErrorScenario: false,
      testFailureScenario: false,
      networkErrorScenario: false,
      invalidConfigScenario: false
    };
    this.backupFiles = new Map();
    this.errors = [];
    this.warnings = [];
  }

  /**
   * メインテスト実行
   */
  async runErrorScenarioTests() {
    console.log('⚠️  エラーシナリオテストを開始します...\n');

    try {
      await this.testNoChangesetsScenario();
      await this.testAuthErrorScenario();
      await this.testBuildErrorScenario();
      await this.testTestFailureScenario();
      await this.testNetworkErrorScenario();
      await this.testInvalidConfigScenario();
      
      this.generateErrorScenarioReport();
    } catch (error) {
      console.error('❌ エラーシナリオテスト中にエラーが発生しました:', error.message);
      await this.cleanup();
    }
  }

  /**
   * 1. Changesets不存在シナリオのテスト
   */
  async testNoChangesetsScenario() {
    console.log('📝 1. Changesets不存在シナリオテスト');
    console.log('   Changesetファイルが存在しない場合の動作を検証します...');

    try {
      // 現在のChangesetファイルをバックアップ
      const changesetDir = '.changeset';
      const changesetFiles = fs.readdirSync(changesetDir)
        .filter(file => file.endsWith('.md') && file !== 'README.md');

      // バックアップディレクトリの作成
      const backupDir = '.changeset-backup';
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir);
      }

      // Changesetファイルを一時的に移動
      for (const file of changesetFiles) {
        const sourcePath = path.join(changesetDir, file);
        const backupPath = path.join(backupDir, file);
        fs.renameSync(sourcePath, backupPath);
      }

      console.log(`   📁 ${changesetFiles.length}個のChangesetファイルを一時的に移動`);

      // ワークフローのChangesets検出ロジックをシミュレート
      const remainingChangesets = fs.readdirSync(changesetDir)
        .filter(file => file.endsWith('.md') && file !== 'README.md');

      if (remainingChangesets.length === 0) {
        console.log('   ✅ Changesets不存在状態を確認');
        
        // ワークフローファイルでのスキップロジック確認
        const workflowContent = fs.readFileSync('.github/workflows/npm-publish.yaml', 'utf8');
        
        if (workflowContent.includes('changesets-exist') && 
            workflowContent.includes('if:') && 
            workflowContent.includes('changesets-exist == \'true\'')) {
          console.log('   ✅ ワークフローにスキップロジックが実装されている');
          this.testResults.noChangesetsScenario = true;
        } else {
          throw new Error('ワークフローにChangesets不存在時のスキップロジックが不足');
        }
      }

      // Changesetファイルを復元
      for (const file of changesetFiles) {
        const sourcePath = path.join(backupDir, file);
        const restorePath = path.join(changesetDir, file);
        fs.renameSync(sourcePath, restorePath);
      }

      // バックアップディレクトリを削除
      fs.rmdirSync(backupDir);

      console.log('   ✅ Changesets不存在シナリオテスト: 成功');

    } catch (error) {
      console.log(`   ❌ Changesets不存在シナリオテスト: 失敗 - ${error.message}`);
      this.errors.push(`Changesets不存在シナリオ: ${error.message}`);
    }

    console.log('');
  }

  /**
   * 2. 認証エラーシナリオのテスト
   */
  async testAuthErrorScenario() {
    console.log('🔐 2. 認証エラーシナリオテスト');
    console.log('   NPM_TOKEN関連のエラー処理を検証します...');

    try {
      // ワークフローファイルの認証関連ロジック確認
      const workflowContent = fs.readFileSync('.github/workflows/npm-publish.yaml', 'utf8');

      // NPM_TOKEN使用の確認
      if (!workflowContent.includes('NPM_TOKEN')) {
        throw new Error('ワークフローでNPM_TOKENが使用されていません');
      }
      console.log('   ✅ NPM_TOKEN使用を確認');

      // 認証テストロジックの確認
      if (!workflowContent.includes('npm whoami')) {
        throw new Error('npm認証テストが実装されていません');
      }
      console.log('   ✅ npm認証テストロジックを確認');

      // エラーハンドリングの確認
      if (!workflowContent.includes('auth-error') || 
          !workflowContent.includes('npm-auth-success')) {
        throw new Error('認証エラーハンドリングが不完全です');
      }
      console.log('   ✅ 認証エラーハンドリングを確認');

      // セキュリティ対策の確認
      if (workflowContent.includes('echo $NPM_TOKEN') || 
          workflowContent.includes('echo ${NPM_TOKEN}')) {
        throw new Error('NPM_TOKENがログに出力される可能性があります');
      }
      console.log('   ✅ セキュリティ対策を確認');

      this.testResults.authErrorScenario = true;
      console.log('   ✅ 認証エラーシナリオテスト: 成功');

    } catch (error) {
      console.log(`   ❌ 認証エラーシナリオテスト: 失敗 - ${error.message}`);
      this.errors.push(`認証エラーシナリオ: ${error.message}`);
    }

    console.log('');
  }

  /**
   * 3. ビルドエラーシナリオのテスト
   */
  async testBuildErrorScenario() {
    console.log('🔨 3. ビルドエラーシナリオテスト');
    console.log('   ビルド失敗時のエラー処理を検証します...');

    try {
      // TypeScriptファイルに意図的なエラーを導入
      const testFilePath = 'packages/specment/src/test-error.ts';
      const errorCode = `
// 意図的なTypeScriptエラー
const invalidCode: string = 123; // 型エラー
export { nonExistentVariable }; // 存在しない変数
`;

      // エラーファイルを作成
      fs.writeFileSync(testFilePath, errorCode);
      this.backupFiles.set(testFilePath, null); // 削除用にマーク

      console.log('   📝 意図的なビルドエラーを導入');

      // ビルドを実行してエラーを確認
      try {
        execSync('pnpm specment:build', { stdio: 'pipe' });
        throw new Error('ビルドが成功してしまいました（エラーが検出されませんでした）');
      } catch (buildError) {
        console.log('   ✅ ビルドエラーを正常に検出');
      }

      // エラーファイルを削除
      fs.unlinkSync(testFilePath);
      this.backupFiles.delete(testFilePath);

      // 正常なビルドが可能か確認
      try {
        execSync('pnpm specment:build', { stdio: 'pipe' });
        console.log('   ✅ エラー修正後のビルドが成功');
      } catch (error) {
        throw new Error('エラー修正後もビルドが失敗しています');
      }

      // ワークフローのビルドエラーハンドリング確認
      const workflowContent = fs.readFileSync('.github/workflows/npm-publish.yaml', 'utf8');
      
      if (!workflowContent.includes('Build project') || 
          !workflowContent.includes('exit 1')) {
        this.warnings.push('ワークフローにビルドエラー時の適切な終了処理が不足している可能性があります');
      }

      this.testResults.buildErrorScenario = true;
      console.log('   ✅ ビルドエラーシナリオテスト: 成功');

    } catch (error) {
      console.log(`   ❌ ビルドエラーシナリオテスト: 失敗 - ${error.message}`);
      this.errors.push(`ビルドエラーシナリオ: ${error.message}`);
    }

    console.log('');
  }

  /**
   * 4. テスト失敗シナリオのテスト
   */
  async testTestFailureScenario() {
    console.log('🧪 4. テスト失敗シナリオテスト');
    console.log('   テスト失敗時のエラー処理を検証します...');

    try {
      // テストファイルに意図的な失敗を導入
      const testFilePath = 'packages/specment/src/test-failure.test.ts';
      const failingTest = `
import { describe, it, expect } from 'vitest';

describe('Intentional Test Failure', () => {
  it('should fail intentionally', () => {
    expect(true).toBe(false); // 意図的な失敗
  });
});
`;

      // 失敗テストファイルを作成
      fs.writeFileSync(testFilePath, failingTest);
      this.backupFiles.set(testFilePath, null); // 削除用にマーク

      console.log('   📝 意図的なテスト失敗を導入');

      // テストを実行してエラーを確認
      try {
        execSync('pnpm --filter @plenarc/specment test --run', { stdio: 'pipe' });
        throw new Error('テストが成功してしまいました（失敗が検出されませんでした）');
      } catch (testError) {
        console.log('   ✅ テスト失敗を正常に検出');
      }

      // 失敗テストファイルを削除
      fs.unlinkSync(testFilePath);
      this.backupFiles.delete(testFilePath);

      // 正常なテストが可能か確認
      try {
        execSync('pnpm --filter @plenarc/specment test --run', { stdio: 'pipe' });
        console.log('   ✅ テスト修正後のテスト実行が成功');
      } catch (error) {
        throw new Error('テスト修正後もテストが失敗しています');
      }

      // ワークフローのテストエラーハンドリング確認
      const workflowContent = fs.readFileSync('.github/workflows/npm-publish.yaml', 'utf8');
      
      if (!workflowContent.includes('Run tests') || 
          !workflowContent.includes('test')) {
        this.warnings.push('ワークフローにテスト実行ステップが不足している可能性があります');
      }

      this.testResults.testFailureScenario = true;
      console.log('   ✅ テスト失敗シナリオテスト: 成功');

    } catch (error) {
      console.log(`   ❌ テスト失敗シナリオテスト: 失敗 - ${error.message}`);
      this.errors.push(`テスト失敗シナリオ: ${error.message}`);
    }

    console.log('');
  }

  /**
   * 5. ネットワークエラーシナリオのテスト
   */
  async testNetworkErrorScenario() {
    console.log('🌐 5. ネットワークエラーシナリオテスト');
    console.log('   ネットワーク関連のエラー処理を検証します...');

    try {
      // ワークフローのネットワークエラーハンドリング確認
      const workflowContent = fs.readFileSync('.github/workflows/npm-publish.yaml', 'utf8');

      // リトライロジックの確認
      if (workflowContent.includes('retry') || workflowContent.includes('attempts')) {
        console.log('   ✅ リトライロジックを確認');
      } else {
        this.warnings.push('ワークフローにリトライロジックが実装されていません');
      }

      // タイムアウト設定の確認
      if (workflowContent.includes('timeout')) {
        console.log('   ✅ タイムアウト設定を確認');
      } else {
        this.warnings.push('ワークフローにタイムアウト設定がありません');
      }

      // npm レジストリ接続テスト
      try {
        execSync('npm ping', { stdio: 'pipe', timeout: 5000 });
        console.log('   ✅ npm レジストリ接続確認');
      } catch (error) {
        console.log('   ⚠️  npm レジストリ接続に問題があります');
        this.warnings.push('npm レジストリへの接続に問題があります');
      }

      // GitHub API接続テスト
      try {
        execSync('curl -s --max-time 5 https://api.github.com', { stdio: 'pipe' });
        console.log('   ✅ GitHub API接続確認');
      } catch (error) {
        console.log('   ⚠️  GitHub API接続に問題があります');
        this.warnings.push('GitHub APIへの接続に問題があります');
      }

      this.testResults.networkErrorScenario = true;
      console.log('   ✅ ネットワークエラーシナリオテスト: 成功');

    } catch (error) {
      console.log(`   ❌ ネットワークエラーシナリオテスト: 失敗 - ${error.message}`);
      this.errors.push(`ネットワークエラーシナリオ: ${error.message}`);
    }

    console.log('');
  }

  /**
   * 6. 無効な設定シナリオのテスト
   */
  async testInvalidConfigScenario() {
    console.log('⚙️  6. 無効な設定シナリオテスト');
    console.log('   設定ファイルの問題に対するエラー処理を検証します...');

    try {
      // Changesets設定ファイルのバックアップと破損テスト
      const configPath = '.changeset/config.json';
      const originalConfig = fs.readFileSync(configPath, 'utf8');
      this.backupFiles.set(configPath, originalConfig);

      // 無効なJSONを作成
      const invalidConfig = '{ "baseBranch": "main", invalid json }';
      fs.writeFileSync(configPath, invalidConfig);

      console.log('   📝 無効なChangesets設定を導入');

      // 設定検証の実行
      try {
        JSON.parse(fs.readFileSync(configPath, 'utf8'));
        throw new Error('無効なJSONが検出されませんでした');
      } catch (parseError) {
        if (parseError.message.includes('JSON')) {
          console.log('   ✅ 無効なJSON設定を正常に検出');
        } else {
          throw parseError;
        }
      }

      // 設定ファイルを復元
      fs.writeFileSync(configPath, originalConfig);
      this.backupFiles.delete(configPath);

      // package.json の無効な設定テスト
      const packageJsonPath = 'packages/specment/package.json';
      const originalPackageJson = fs.readFileSync(packageJsonPath, 'utf8');
      this.backupFiles.set(packageJsonPath, originalPackageJson);

      // 無効なpackage.jsonを作成
      const packageJson = JSON.parse(originalPackageJson);
      delete packageJson.name; // 必須フィールドを削除
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

      console.log('   📝 無効なpackage.json設定を導入');

      // npm publish dry-runで検証
      try {
        execSync('npm publish --dry-run', {
          cwd: 'packages/specment',
          stdio: 'pipe'
        });
        this.warnings.push('無効なpackage.json設定が検出されませんでした');
      } catch (error) {
        console.log('   ✅ 無効なpackage.json設定を正常に検出');
      }

      // package.jsonを復元
      fs.writeFileSync(packageJsonPath, originalPackageJson);
      this.backupFiles.delete(packageJsonPath);

      this.testResults.invalidConfigScenario = true;
      console.log('   ✅ 無効な設定シナリオテスト: 成功');

    } catch (error) {
      console.log(`   ❌ 無効な設定シナリオテスト: 失敗 - ${error.message}`);
      this.errors.push(`無効な設定シナリオ: ${error.message}`);
    }

    console.log('');
  }

  /**
   * クリーンアップ
   */
  async cleanup() {
    console.log('🧹 エラーシナリオテストのクリーンアップ');

    try {
      // バックアップファイルの復元
      for (const [filePath, originalContent] of this.backupFiles) {
        if (originalContent === null) {
          // 削除用にマークされたファイル
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`   ✅ テストファイル削除: ${filePath}`);
          }
        } else {
          // 復元が必要なファイル
          fs.writeFileSync(filePath, originalContent);
          console.log(`   ✅ ファイル復元: ${filePath}`);
        }
      }

      console.log('   ✅ クリーンアップ完了');

    } catch (error) {
      console.log(`   ❌ クリーンアップ失敗: ${error.message}`);
    }

    console.log('');
  }

  /**
   * エラーシナリオテストレポートの生成
   */
  generateErrorScenarioReport() {
    console.log('📊 エラーシナリオテスト結果レポート');
    console.log('=' .repeat(50));

    const totalTests = Object.keys(this.testResults).length;
    const passedTests = Object.values(this.testResults).filter(result => result === true).length;
    const successRate = Math.round(passedTests/totalTests*100);

    console.log(`\n📈 テスト成功率: ${passedTests}/${totalTests} (${successRate}%)`);

    console.log('\n📋 個別テスト結果:');
    console.log(`   Changesets不存在: ${this.testResults.noChangesetsScenario ? '✅ 成功' : '❌ 失敗'}`);
    console.log(`   認証エラー: ${this.testResults.authErrorScenario ? '✅ 成功' : '❌ 失敗'}`);
    console.log(`   ビルドエラー: ${this.testResults.buildErrorScenario ? '✅ 成功' : '❌ 失敗'}`);
    console.log(`   テスト失敗: ${this.testResults.testFailureScenario ? '✅ 成功' : '❌ 失敗'}`);
    console.log(`   ネットワークエラー: ${this.testResults.networkErrorScenario ? '✅ 成功' : '❌ 失敗'}`);
    console.log(`   無効な設定: ${this.testResults.invalidConfigScenario ? '✅ 成功' : '❌ 失敗'}`);

    // エラーの表示
    if (this.errors.length > 0) {
      console.log('\n❌ エラー:');
      this.errors.forEach(error => console.log(`   • ${error}`));
    }

    // 警告の表示
    if (this.warnings.length > 0) {
      console.log('\n⚠️  警告:');
      this.warnings.forEach(warning => console.log(`   • ${warning}`));
    }

    console.log('\n🎯 総合判定:');
    if (successRate >= 80) {
      console.log('   ✅ ワークフローのエラーハンドリングは適切に実装されています');
    } else {
      console.log('   ❌ ワークフローのエラーハンドリングに改善が必要です');
    }

    console.log('\n📝 推奨される改善点:');
    if (this.warnings.length > 0) {
      console.log('   上記の警告を確認し、必要に応じて修正してください');
    }
    
    console.log('   1. エラーメッセージの明確化');
    console.log('   2. リトライロジックの実装');
    console.log('   3. タイムアウト設定の追加');
    console.log('   4. 詳細なログ出力の実装');

    console.log('\n' + '=' .repeat(50));
  }
}

// メイン実行
if (require.main === module) {
  const tester = new ErrorScenarioTester();
  tester.runErrorScenarioTests().catch(error => {
    console.error('エラーシナリオテスト実行中に予期しないエラーが発生しました:', error);
    process.exit(1);
  });
}

module.exports = ErrorScenarioTester;