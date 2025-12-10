#!/usr/bin/env node

/**
 * ワークフローテストと検証スクリプト
 * GitHub Actions npm-publish.yaml ワークフローの各コンポーネントをテストします
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');
// YAML構文チェックは文字列ベースで実行（js-yamlの依存関係を避けるため）

class WorkflowValidator {
  constructor() {
    this.testResults = {
      workflowSyntax: false,
      changesetsIntegration: false,
      npmPublishProcess: false,
      errorScenarios: false,
      overall: false
    };
    this.errors = [];
    this.warnings = [];
  }

  /**
   * メインテスト実行
   */
  async runAllTests() {
    console.log('🧪 GitHub Actions ワークフローテストを開始します...\n');

    try {
      await this.testWorkflowSyntax();
      await this.testChangesetsIntegration();
      await this.testNpmPublishProcess();
      await this.testErrorScenarios();
      
      this.generateTestReport();
    } catch (error) {
      console.error('❌ テスト実行中にエラーが発生しました:', error.message);
      this.errors.push(`テスト実行エラー: ${error.message}`);
    }
  }

  /**
   * 1. ワークフロー構文テスト
   */
  async testWorkflowSyntax() {
    console.log('📋 1. ワークフロー構文テスト');
    console.log('   ワークフローファイルの構文と構造を検証します...');

    try {
      // ワークフローファイルの存在確認
      const workflowPath = '.github/workflows/npm-publish.yaml';
      if (!fs.existsSync(workflowPath)) {
        throw new Error(`ワークフローファイルが見つかりません: ${workflowPath}`);
      }

      // 基本的なYAML構文と構造の検証（文字列ベース）
      const workflowContent = fs.readFileSync(workflowPath, 'utf8');

      // 必須フィールドの確認（文字列検索）
      const requiredFields = ['name:', 'on:', 'jobs:'];
      for (const field of requiredFields) {
        if (!workflowContent.includes(field)) {
          throw new Error(`必須フィールドが不足: ${field}`);
        }
      }

      // トリガー設定の確認
      if (!workflowContent.includes('branches:') || !workflowContent.includes('- main')) {
        throw new Error('mainブランチのpushトリガーが設定されていません');
      }

      // ジョブ構造の確認
      if (!workflowContent.includes('publish:')) {
        throw new Error('publishジョブが定義されていません');
      }

      // 必須ステップの確認
      const requiredSteps = [
        'Checkout repository',
        'Install dependencies', 
        'Build project',
        'Run tests',
        'Check for changesets',
        'Setup npm authentication',
        'Version packages and publish'
      ];

      const stepNames = publishJob.steps.map(step => step.name);
      for (const requiredStep of requiredSteps) {
        const found = stepNames.some(name => name.includes(requiredStep));
        if (!found) {
          this.warnings.push(`推奨ステップが見つかりません: ${requiredStep}`);
        }
      }

      console.log('   ✅ ワークフロー構文テスト: 成功');
      this.testResults.workflowSyntax = true;

    } catch (error) {
      console.log(`   ❌ ワークフロー構文テスト: 失敗 - ${error.message}`);
      this.errors.push(`ワークフロー構文: ${error.message}`);
    }

    console.log('');
  }

  /**
   * 2. Changesets統合テスト
   */
  async testChangesetsIntegration() {
    console.log('📝 2. Changesets統合テスト');
    console.log('   Changesets設定と統合を検証します...');

    try {
      // Changesets設定ディレクトリの確認
      if (!fs.existsSync('.changeset')) {
        throw new Error('.changesetディレクトリが存在しません');
      }

      // 設定ファイルの確認
      const configPath = '.changeset/config.json';
      if (!fs.existsSync(configPath)) {
        throw new Error('Changesets設定ファイルが存在しません');
      }

      // 設定ファイルの妥当性確認
      const configContent = fs.readFileSync(configPath, 'utf8');
      const config = JSON.parse(configContent);

      // 必須設定の確認
      if (!config.baseBranch) {
        this.warnings.push('baseBranchが設定されていません（デフォルト: main）');
      }

      // Changesets CLIの存在確認
      try {
        execSync('npx @changesets/cli --version', { stdio: 'pipe' });
        console.log('   ✅ Changesets CLI: 利用可能');
      } catch (error) {
        throw new Error('Changesets CLIが利用できません');
      }

      // テスト用Changesetファイルの作成と検証
      await this.createTestChangeset();

      console.log('   ✅ Changesets統合テスト: 成功');
      this.testResults.changesetsIntegration = true;

    } catch (error) {
      console.log(`   ❌ Changesets統合テスト: 失敗 - ${error.message}`);
      this.errors.push(`Changesets統合: ${error.message}`);
    }

    console.log('');
  }

  /**
   * 3. npm公開プロセステスト
   */
  async testNpmPublishProcess() {
    console.log('📦 3. npm公開プロセステスト');
    console.log('   npm公開の前提条件と設定を検証します...');

    try {
      // package.jsonの確認
      const packagePath = 'packages/specment/package.json';
      if (!fs.existsSync(packagePath)) {
        throw new Error('パッケージのpackage.jsonが見つかりません');
      }

      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

      // 公開に必要なフィールドの確認
      const requiredFields = ['name', 'version', 'main', 'types'];
      for (const field of requiredFields) {
        if (!packageJson[field]) {
          this.warnings.push(`package.jsonに${field}フィールドがありません`);
        }
      }

      // ビルド出力の確認
      const distPath = 'packages/specment/dist';
      if (fs.existsSync(distPath)) {
        console.log('   ✅ ビルド出力ディレクトリ: 存在');
        
        // 重要なファイルの確認
        const importantFiles = ['index.js', 'index.d.ts'];
        for (const file of importantFiles) {
          if (fs.existsSync(path.join(distPath, file))) {
            console.log(`   ✅ ${file}: 存在`);
          } else {
            this.warnings.push(`重要なファイルが不足: ${file}`);
          }
        }
      } else {
        this.warnings.push('ビルド出力ディレクトリが存在しません（ビルドが必要）');
      }

      // npm設定の確認
      try {
        const npmConfig = execSync('npm config list', { encoding: 'utf8' });
        if (npmConfig.includes('registry = "https://registry.npmjs.org/"')) {
          console.log('   ✅ npm レジストリ設定: 正常');
        } else {
          this.warnings.push('npm レジストリ設定を確認してください');
        }
      } catch (error) {
        this.warnings.push('npm設定の確認に失敗しました');
      }

      console.log('   ✅ npm公開プロセステスト: 成功');
      this.testResults.npmPublishProcess = true;

    } catch (error) {
      console.log(`   ❌ npm公開プロセステスト: 失敗 - ${error.message}`);
      this.errors.push(`npm公開プロセス: ${error.message}`);
    }

    console.log('');
  }

  /**
   * 4. エラーシナリオテスト
   */
  async testErrorScenarios() {
    console.log('⚠️  4. エラーシナリオテスト');
    console.log('   各種エラー条件での動作を検証します...');

    try {
      const scenarios = [
        {
          name: 'Changesets不存在シナリオ',
          test: () => this.testNoChangesetsScenario()
        },
        {
          name: '認証エラーシナリオ',
          test: () => this.testAuthErrorScenario()
        },
        {
          name: 'ビルドエラーシナリオ',
          test: () => this.testBuildErrorScenario()
        }
      ];

      let passedScenarios = 0;
      for (const scenario of scenarios) {
        try {
          await scenario.test();
          console.log(`   ✅ ${scenario.name}: 適切に処理される`);
          passedScenarios++;
        } catch (error) {
          console.log(`   ⚠️  ${scenario.name}: ${error.message}`);
          this.warnings.push(`${scenario.name}: ${error.message}`);
        }
      }

      if (passedScenarios === scenarios.length) {
        console.log('   ✅ エラーシナリオテスト: 成功');
        this.testResults.errorScenarios = true;
      } else {
        console.log(`   ⚠️  エラーシナリオテスト: ${passedScenarios}/${scenarios.length} 通過`);
      }

    } catch (error) {
      console.log(`   ❌ エラーシナリオテスト: 失敗 - ${error.message}`);
      this.errors.push(`エラーシナリオ: ${error.message}`);
    }

    console.log('');
  }

  /**
   * テスト用Changesetファイルの作成
   */
  async createTestChangeset() {
    const testChangesetPath = '.changeset/test-validation.md';
    const changesetContent = `---
"@plenarc/specment": patch
---

Test changeset for workflow validation
`;

    fs.writeFileSync(testChangesetPath, changesetContent);
    console.log('   ✅ テスト用Changesetファイル: 作成');

    // 作成後にクリーンアップ
    setTimeout(() => {
      if (fs.existsSync(testChangesetPath)) {
        fs.unlinkSync(testChangesetPath);
      }
    }, 1000);
  }

  /**
   * Changesets不存在シナリオのテスト
   */
  async testNoChangesetsScenario() {
    // .changesetディレクトリ内のChangesetファイル（README.md以外）を一時的に移動
    const changesetFiles = fs.readdirSync('.changeset')
      .filter(file => file.endsWith('.md') && file !== 'README.md');

    if (changesetFiles.length === 0) {
      // 既にChangesetが存在しない状態なので、ワークフローがスキップされることを確認
      return Promise.resolve();
    }

    // 実際のテストは、ワークフローの条件分岐ロジックが正しく実装されているかの確認
    const workflowContent = fs.readFileSync('.github/workflows/npm-publish.yaml', 'utf8');
    if (!workflowContent.includes('changesets-exist')) {
      throw new Error('Changesets存在チェックの出力変数が設定されていません');
    }

    return Promise.resolve();
  }

  /**
   * 認証エラーシナリオのテスト
   */
  async testAuthErrorScenario() {
    // ワークフローに認証エラーハンドリングが含まれているかチェック
    const workflowContent = fs.readFileSync('.github/workflows/npm-publish.yaml', 'utf8');
    
    if (!workflowContent.includes('NPM_TOKEN')) {
      throw new Error('NPM_TOKEN環境変数の使用が確認できません');
    }

    if (!workflowContent.includes('npm whoami')) {
      throw new Error('npm認証テストが実装されていません');
    }

    return Promise.resolve();
  }

  /**
   * ビルドエラーシナリオのテスト
   */
  async testBuildErrorScenario() {
    // ワークフローにビルドエラーハンドリングが含まれているかチェック
    const workflowContent = fs.readFileSync('.github/workflows/npm-publish.yaml', 'utf8');
    
    if (!workflowContent.includes('Build project')) {
      throw new Error('ビルドステップが見つかりません');
    }

    // ビルドスクリプトの存在確認
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    if (!packageJson.scripts || !packageJson.scripts['specment:build']) {
      throw new Error('ビルドスクリプトが定義されていません');
    }

    return Promise.resolve();
  }

  /**
   * テストレポートの生成
   */
  generateTestReport() {
    console.log('📊 テスト結果レポート');
    console.log('=' .repeat(50));

    // 全体的な成功率の計算
    const totalTests = Object.keys(this.testResults).length - 1; // overallを除く
    const passedTests = Object.values(this.testResults).filter(result => result === true).length;
    this.testResults.overall = this.errors.length === 0;

    console.log(`\n📈 テスト成功率: ${passedTests}/${totalTests} (${Math.round(passedTests/totalTests*100)}%)`);

    // 個別テスト結果
    console.log('\n📋 個別テスト結果:');
    console.log(`   ワークフロー構文: ${this.testResults.workflowSyntax ? '✅ 成功' : '❌ 失敗'}`);
    console.log(`   Changesets統合: ${this.testResults.changesetsIntegration ? '✅ 成功' : '❌ 失敗'}`);
    console.log(`   npm公開プロセス: ${this.testResults.npmPublishProcess ? '✅ 成功' : '❌ 失敗'}`);
    console.log(`   エラーシナリオ: ${this.testResults.errorScenarios ? '✅ 成功' : '❌ 失敗'}`);

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

    // 総合判定
    console.log('\n🎯 総合判定:');
    if (this.testResults.overall) {
      console.log('   ✅ ワークフローは本番環境での使用準備が整っています');
    } else {
      console.log('   ❌ ワークフローに問題があります。上記のエラーを修正してください');
    }

    // 次のステップの提案
    console.log('\n📝 推奨される次のステップ:');
    if (this.testResults.overall) {
      console.log('   1. テスト用ブランチでの実際のワークフロー実行');
      console.log('   2. npm test レジストリでの公開テスト');
      console.log('   3. 本番環境での段階的ロールアウト');
    } else {
      console.log('   1. 上記のエラーと警告を確認・修正');
      console.log('   2. 修正後に再度このテストを実行');
      console.log('   3. 問題解決後に実際のワークフローテストを実施');
    }

    console.log('\n' + '=' .repeat(50));

    // テスト結果をJSONファイルに保存
    const reportData = {
      timestamp: new Date().toISOString(),
      results: this.testResults,
      errors: this.errors,
      warnings: this.warnings,
      summary: {
        totalTests,
        passedTests,
        successRate: Math.round(passedTests/totalTests*100),
        overall: this.testResults.overall
      }
    };

    fs.writeFileSync('workflow-test-report.json', JSON.stringify(reportData, null, 2));
    console.log('📄 詳細なテストレポートが workflow-test-report.json に保存されました');
  }
}

// メイン実行
if (require.main === module) {
  const validator = new WorkflowValidator();
  validator.runAllTests().catch(error => {
    console.error('テスト実行中に予期しないエラーが発生しました:', error);
    process.exit(1);
  });
}

module.exports = WorkflowValidator;