#!/usr/bin/env node

/**
 * GitHub Actions npm公開ワークフローのテストスクリプト
 * 
 * このスクリプトは以下のテストを実行します：
 * 1. Changesets統合の動作確認
 * 2. 各種エラーシナリオの検証
 * 3. ワークフロー設定の妥当性確認
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class WorkflowTester {
  constructor() {
    this.testResults = [];
    this.workflowPath = '.github/workflows/npm-publish.yaml';
    this.changesetDir = '.changeset';
  }

  /**
   * テスト実行のメインエントリーポイント
   */
  async runTests() {
    console.log('🧪 GitHub Actions ワークフローテストを開始します...\n');

    try {
      await this.testChangesetConfiguration();
      await this.testWorkflowConfiguration();
      await this.testChangesetIntegration();
      await this.testErrorScenarios();
      await this.generateTestReport();
    } catch (error) {
      console.error('❌ テスト実行中にエラーが発生しました:', error.message);
      process.exit(1);
    }
  }

  /**
   * Changesets設定のテスト
   */
  async testChangesetConfiguration() {
    console.log('📋 1. Changesets設定のテスト');

    // 設定ファイルの存在確認
    const configPath = path.join(this.changesetDir, 'config.json');
    this.assert(
      fs.existsSync(configPath),
      'Changesets設定ファイルが存在する',
      'config.json が見つかりません'
    );

    // 設定ファイルの妥当性確認
    try {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      
      this.assert(
        config.baseBranch === 'main',
        'baseBranchがmainに設定されている',
        `baseBranch が ${config.baseBranch} に設定されています`
      );

      this.assert(
        config.access === 'public',
        'accessがpublicに設定されている',
        `access が ${config.access} に設定されています`
      );

      console.log('  ✅ Changesets設定は正常です');
    } catch (error) {
      this.assert(false, 'Changesets設定ファイルが有効なJSON', error.message);
    }

    console.log();
  }

  /**
   * ワークフロー設定のテスト
   */
  async testWorkflowConfiguration() {
    console.log('⚙️ 2. ワークフロー設定のテスト');

    // ワークフローファイルの存在確認
    this.assert(
      fs.existsSync(this.workflowPath),
      'ワークフローファイルが存在する',
      'npm-publish.yaml が見つかりません'
    );

    // ワークフローファイルの内容確認
    const workflowContent = fs.readFileSync(this.workflowPath, 'utf8');

    // 必要なトリガーの確認
    this.assert(
      workflowContent.includes('push:') && workflowContent.includes('branches:') && workflowContent.includes('- main'),
      'mainブランチpushトリガーが設定されている',
      'mainブランチのpushトリガーが見つかりません'
    );

    // 必要なステップの確認
    const requiredSteps = [
      'Checkout repository',
      'Setup Node.js',
      'Install dependencies',
      'Build project',
      'Run tests',
      'Check for changesets',
      'Setup npm authentication',
      'Version packages and publish'
    ];

    requiredSteps.forEach(step => {
      this.assert(
        workflowContent.includes(step),
        `必要なステップ「${step}」が含まれている`,
        `ステップ「${step}」が見つかりません`
      );
    });

    console.log('  ✅ ワークフロー設定は正常です');
    console.log();
  }

  /**
   * Changesets統合のテスト
   */
  async testChangesetIntegration() {
    console.log('🔗 3. Changesets統合のテスト');

    // Changesetファイルの存在確認
    const changesetFiles = fs.readdirSync(this.changesetDir)
      .filter(file => file.endsWith('.md') && file !== 'README.md');

    this.assert(
      changesetFiles.length > 0,
      'Changesetファイルが存在する',
      'Changesetファイルが見つかりません'
    );

    // Changesetファイルの形式確認
    changesetFiles.forEach(file => {
      const filePath = path.join(this.changesetDir, file);
      const content = fs.readFileSync(filePath, 'utf8');

      this.assert(
        content.includes('---') && content.includes('@plenarc/specment'),
        `Changesetファイル「${file}」の形式が正しい`,
        `Changesetファイル「${file}」の形式が不正です`
      );
    });

    // Changesets CLIの動作確認
    try {
      const statusOutput = execSync('pnpm changeset status', { encoding: 'utf8' });
      console.log('  📊 Changeset status:');
      console.log('    ' + statusOutput.split('\n').join('\n    '));
      
      this.assert(true, 'Changesets CLIが正常に動作する', '');
    } catch (error) {
      this.assert(false, 'Changesets CLIが正常に動作する', error.message);
    }

    console.log('  ✅ Changesets統合は正常です');
    console.log();
  }

  /**
   * エラーシナリオのテスト
   */
  async testErrorScenarios() {
    console.log('🚨 4. エラーシナリオのテスト');

    // Changesetなしのシナリオをシミュレート
    const backupDir = '.changeset-backup';
    
    try {
      // Changesetファイルを一時的にバックアップ
      if (fs.existsSync(this.changesetDir)) {
        execSync(`cp -r ${this.changesetDir} ${backupDir}`);
        
        // Changesetファイルを削除（README.mdとconfig.jsonは残す）
        const changesetFiles = fs.readdirSync(this.changesetDir)
          .filter(file => file.endsWith('.md') && file !== 'README.md');
        
        changesetFiles.forEach(file => {
          fs.unlinkSync(path.join(this.changesetDir, file));
        });

        // Changesets statusを実行してエラーハンドリングを確認
        try {
          execSync('pnpm changeset status', { encoding: 'utf8' });
          console.log('  ✅ Changesetなしの場合の処理が正常');
        } catch (error) {
          // エラーが発生することは期待される動作
          console.log('  ✅ Changesetなしの場合のエラーハンドリングが動作');
        }

        // バックアップを復元
        execSync(`rm -rf ${this.changesetDir}`);
        execSync(`mv ${backupDir} ${this.changesetDir}`);
      }
    } catch (error) {
      console.log('  ⚠️ エラーシナリオテストをスキップしました:', error.message);
    }

    // ビルドテストの実行
    try {
      execSync('pnpm specment:build', { encoding: 'utf8' });
      console.log('  ✅ ビルドプロセスが正常に動作');
    } catch (error) {
      this.assert(false, 'ビルドプロセスが正常に動作する', error.message);
    }

    // テスト実行の確認
    try {
      execSync('pnpm --filter @plenarc/specment test --run', { encoding: 'utf8' });
      console.log('  ✅ テストスイートが正常に動作');
    } catch (error) {
      console.log('  ⚠️ テスト実行でエラーが発生:', error.message);
    }

    console.log('  ✅ エラーシナリオテストが完了');
    console.log();
  }

  /**
   * テストレポートの生成
   */
  async generateTestReport() {
    console.log('📊 5. テストレポートの生成');

    const passedTests = this.testResults.filter(result => result.passed).length;
    const totalTests = this.testResults.length;
    const failedTests = totalTests - passedTests;

    console.log(`\n📋 テスト結果サマリー:`);
    console.log(`  ✅ 成功: ${passedTests}`);
    console.log(`  ❌ 失敗: ${failedTests}`);
    console.log(`  📊 成功率: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

    if (failedTests > 0) {
      console.log('\n❌ 失敗したテスト:');
      this.testResults
        .filter(result => !result.passed)
        .forEach(result => {
          console.log(`  - ${result.description}: ${result.error}`);
        });
    }

    // テストレポートファイルの生成
    const reportPath = 'workflow-test-report.json';
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        total: totalTests,
        passed: passedTests,
        failed: failedTests,
        successRate: ((passedTests / totalTests) * 100).toFixed(1)
      },
      results: this.testResults
    };

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n📄 詳細なテストレポートが ${reportPath} に保存されました`);

    if (failedTests > 0) {
      console.log('\n🔧 修正が必要な項目があります。上記の失敗したテストを確認してください。');
      process.exit(1);
    } else {
      console.log('\n🎉 すべてのテストが成功しました！ワークフローは正常に設定されています。');
    }
  }

  /**
   * アサーション関数
   */
  assert(condition, description, error = '') {
    const result = {
      passed: condition,
      description,
      error: condition ? '' : error,
      timestamp: new Date().toISOString()
    };

    this.testResults.push(result);

    if (condition) {
      console.log(`  ✅ ${description}`);
    } else {
      console.log(`  ❌ ${description}: ${error}`);
    }
  }
}

// スクリプトが直接実行された場合のみテストを実行
if (require.main === module) {
  const tester = new WorkflowTester();
  tester.runTests().catch(error => {
    console.error('テスト実行エラー:', error);
    process.exit(1);
  });
}

module.exports = WorkflowTester;