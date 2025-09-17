#!/usr/bin/env node

/**
 * ワークフロー統合テストスクリプト
 * 
 * GitHub Actions npm公開ワークフローの全テストを
 * 統合して実行し、包括的な検証を行います。
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// テストモジュールのインポート
const WorkflowTester = require('./test-workflow.js');
const NpmPublishSimulator = require('./test-npm-publish-simulation.js');
const NpmPublishDryRun = require('./npm-publish-dry-run.js');

class IntegratedWorkflowTester {
  constructor() {
    this.testSuites = [];
    this.overallResults = {
      total: 0,
      passed: 0,
      failed: 0,
      skipped: 0
    };
    this.startTime = new Date();
  }

  /**
   * 統合テスト実行のメインエントリーポイント
   */
  async runIntegratedTests() {
    console.log('🚀 GitHub Actions ワークフロー統合テストを開始します...\n');
    console.log(`⏰ 開始時刻: ${this.startTime.toISOString()}\n`);

    try {
      await this.displayTestPlan();
      await this.runPreTestChecks();
      await this.runTestSuite1_Configuration();
      await this.runTestSuite2_Simulation();
      await this.runTestSuite3_DryRun();
      await this.runTestSuite4_Integration();
      await this.generateFinalReport();
    } catch (error) {
      console.error('❌ 統合テスト実行中にエラーが発生しました:', error.message);
      await this.generateErrorReport(error);
      process.exit(1);
    }
  }

  /**
   * テスト計画の表示
   */
  async displayTestPlan() {
    console.log('📋 テスト計画');
    console.log(`
🎯 実行予定のテストスイート:

1. **設定検証テスト** (test-workflow.js)
   - Changesets設定の確認
   - ワークフロー設定の検証
   - 必要なファイルの存在確認

2. **プロセスシミュレーションテスト** (test-npm-publish-simulation.js)
   - ワークフローステップのシミュレーション
   - エラーシナリオの検証
   - セキュリティ対策の確認

3. **npm公開ドライランテスト** (npm-publish-dry-run.js)
   - 実際のChangesetプロセス実行
   - ビルドとパッケージング検証
   - npm公開プロセスのドライラン

4. **統合検証テスト**
   - 全体的な整合性確認
   - パフォーマンス測定
   - 最終的な推奨事項生成

📊 予想実行時間: 3-5分
🔧 必要な前提条件: Node.js, pnpm, Git
⚠️ 注意: 一部のテストでファイルの一時的な変更が行われます
`);

    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    return new Promise((resolve) => {
      rl.question('続行しますか？ (y/n): ', (answer) => {
        rl.close();
        if (answer.toLowerCase() !== 'y') {
          console.log('テストを中止しました。');
          process.exit(0);
        }
        console.log();
        resolve();
      });
    });
  }

  /**
   * 事前チェックの実行
   */
  async runPreTestChecks() {
    console.log('🔍 事前チェック');

    const checks = [
      {
        name: 'Node.js バージョン',
        check: () => {
          const version = process.version;
          const majorVersion = parseInt(version.slice(1).split('.')[0]);
          return { success: majorVersion >= 18, message: `Node.js ${version}` };
        }
      },
      {
        name: 'pnpm インストール',
        check: () => {
          try {
            const version = execSync('pnpm --version', { encoding: 'utf8' }).trim();
            return { success: true, message: `pnpm ${version}` };
          } catch (error) {
            return { success: false, message: 'pnpm がインストールされていません' };
          }
        }
      },
      {
        name: 'Git リポジトリ',
        check: () => {
          try {
            execSync('git rev-parse --git-dir', { encoding: 'utf8' });
            return { success: true, message: 'Git リポジトリが確認されました' };
          } catch (error) {
            return { success: false, message: 'Git リポジトリではありません' };
          }
        }
      },
      {
        name: 'ワークスペース構造',
        check: () => {
          const requiredDirs = ['packages/specment', '.changeset', '.github/workflows'];
          const missing = requiredDirs.filter(dir => !fs.existsSync(dir));
          if (missing.length === 0) {
            return { success: true, message: 'ワークスペース構造が正しいです' };
          } else {
            return { success: false, message: `不足ディレクトリ: ${missing.join(', ')}` };
          }
        }
      }
    ];

    let allChecksPassed = true;
    checks.forEach(({ name, check }) => {
      const result = check();
      if (result.success) {
        console.log(`  ✅ ${name}: ${result.message}`);
      } else {
        console.log(`  ❌ ${name}: ${result.message}`);
        allChecksPassed = false;
      }
    });

    if (!allChecksPassed) {
      throw new Error('事前チェックに失敗しました。上記の問題を解決してから再実行してください。');
    }

    console.log('  ✅ すべての事前チェックが完了しました\n');
  }

  /**
   * テストスイート1: 設定検証テスト
   */
  async runTestSuite1_Configuration() {
    console.log('📋 テストスイート1: 設定検証テスト');
    
    try {
      const tester = new WorkflowTester();
      
      // 元のconsole.logを保存
      const originalLog = console.log;
      const logs = [];
      
      // ログをキャプチャ
      console.log = (...args) => {
        logs.push(args.join(' '));
        originalLog(...args);
      };
      
      await tester.runTests();
      
      // console.logを復元
      console.log = originalLog;
      
      const suite = {
        name: 'Configuration Tests',
        results: tester.testResults,
        logs: logs,
        duration: 0 // 実際の実行時間は測定されていない
      };
      
      this.testSuites.push(suite);
      this.updateOverallResults(suite.results);
      
      console.log('  ✅ 設定検証テストが完了しました\n');
      
    } catch (error) {
      console.log(`  ❌ 設定検証テストでエラーが発生しました: ${error.message}\n`);
      
      const suite = {
        name: 'Configuration Tests',
        results: [{ passed: false, description: 'Test Suite Execution', error: error.message }],
        logs: [],
        duration: 0
      };
      
      this.testSuites.push(suite);
      this.updateOverallResults(suite.results);
    }
  }

  /**
   * テストスイート2: プロセスシミュレーションテスト
   */
  async runTestSuite2_Simulation() {
    console.log('🎭 テストスイート2: プロセスシミュレーションテスト');
    
    try {
      const simulator = new NpmPublishSimulator();
      
      const originalLog = console.log;
      const logs = [];
      
      console.log = (...args) => {
        logs.push(args.join(' '));
        originalLog(...args);
      };
      
      await simulator.runSimulation();
      
      console.log = originalLog;
      
      const suite = {
        name: 'Process Simulation Tests',
        results: simulator.testResults,
        logs: logs,
        duration: 0
      };
      
      this.testSuites.push(suite);
      this.updateOverallResults(suite.results);
      
      console.log('  ✅ プロセスシミュレーションテストが完了しました\n');
      
    } catch (error) {
      console.log(`  ❌ プロセスシミュレーションテストでエラーが発生しました: ${error.message}\n`);
      
      const suite = {
        name: 'Process Simulation Tests',
        results: [{ passed: false, description: 'Test Suite Execution', error: error.message }],
        logs: [],
        duration: 0
      };
      
      this.testSuites.push(suite);
      this.updateOverallResults(suite.results);
    }
  }

  /**
   * テストスイート3: npm公開ドライランテスト
   */
  async runTestSuite3_DryRun() {
    console.log('🧪 テストスイート3: npm公開ドライランテスト');
    
    try {
      const dryRun = new NpmPublishDryRun();
      
      const originalLog = console.log;
      const logs = [];
      
      console.log = (...args) => {
        logs.push(args.join(' '));
        originalLog(...args);
      };
      
      await dryRun.runDryRun();
      
      console.log = originalLog;
      
      const suite = {
        name: 'NPM Publish Dry Run Tests',
        results: dryRun.testResults,
        logs: logs,
        duration: 0
      };
      
      this.testSuites.push(suite);
      this.updateOverallResults(suite.results);
      
      console.log('  ✅ npm公開ドライランテストが完了しました\n');
      
    } catch (error) {
      console.log(`  ❌ npm公開ドライランテストでエラーが発生しました: ${error.message}\n`);
      
      const suite = {
        name: 'NPM Publish Dry Run Tests',
        results: [{ passed: false, description: 'Test Suite Execution', error: error.message }],
        logs: [],
        duration: 0
      };
      
      this.testSuites.push(suite);
      this.updateOverallResults(suite.results);
    }
  }

  /**
   * テストスイート4: 統合検証テスト
   */
  async runTestSuite4_Integration() {
    console.log('🔗 テストスイート4: 統合検証テスト');
    
    const integrationTests = [
      {
        name: 'ワークフロー設定の整合性',
        test: () => this.validateWorkflowConsistency()
      },
      {
        name: 'セキュリティ設定の検証',
        test: () => this.validateSecuritySettings()
      },
      {
        name: 'パフォーマンス要件の確認',
        test: () => this.validatePerformanceRequirements()
      },
      {
        name: 'エラーハンドリングの網羅性',
        test: () => this.validateErrorHandling()
      }
    ];

    const results = [];
    
    for (const { name, test } of integrationTests) {
      try {
        console.log(`  🔍 ${name}を実行中...`);
        const result = await test();
        results.push({
          passed: result.success,
          description: name,
          error: result.success ? '' : result.message,
          timestamp: new Date().toISOString()
        });
        
        if (result.success) {
          console.log(`    ✅ ${name}: ${result.message}`);
        } else {
          console.log(`    ❌ ${name}: ${result.message}`);
        }
      } catch (error) {
        results.push({
          passed: false,
          description: name,
          error: error.message,
          timestamp: new Date().toISOString()
        });
        console.log(`    ❌ ${name}: ${error.message}`);
      }
    }
    
    const suite = {
      name: 'Integration Tests',
      results: results,
      logs: [],
      duration: 0
    };
    
    this.testSuites.push(suite);
    this.updateOverallResults(suite.results);
    
    console.log('  ✅ 統合検証テストが完了しました\n');
  }

  /**
   * ワークフロー設定の整合性検証
   */
  async validateWorkflowConsistency() {
    const workflowPath = '.github/workflows/npm-publish.yaml';
    const changesetConfigPath = '.changeset/config.json';
    
    if (!fs.existsSync(workflowPath) || !fs.existsSync(changesetConfigPath)) {
      return { success: false, message: '必要な設定ファイルが見つかりません' };
    }
    
    const workflowContent = fs.readFileSync(workflowPath, 'utf8');
    const changesetConfig = JSON.parse(fs.readFileSync(changesetConfigPath, 'utf8'));
    
    // baseBranchの整合性確認
    const workflowBranch = workflowContent.includes('- main') ? 'main' : 'master';
    if (workflowBranch !== changesetConfig.baseBranch) {
      return { 
        success: false, 
        message: `ブランチ設定の不整合: ワークフロー(${workflowBranch}) vs Changesets(${changesetConfig.baseBranch})` 
      };
    }
    
    return { success: true, message: 'ワークフロー設定の整合性が確認されました' };
  }

  /**
   * セキュリティ設定の検証
   */
  async validateSecuritySettings() {
    const workflowPath = '.github/workflows/npm-publish.yaml';
    const workflowContent = fs.readFileSync(workflowPath, 'utf8');
    
    // GitHub Secretsの使用確認
    if (!workflowContent.includes('${{ secrets.NPM_TOKEN }}')) {
      return { success: false, message: 'NPM_TOKENがGitHub Secretsから取得されていません' };
    }
    
    // 機密情報の直接記載チェック
    const sensitivePatterns = [
      /npm_[a-zA-Z0-9]{36}/g,
      /password\s*[:=]\s*[^\s]+/gi
    ];
    
    for (const pattern of sensitivePatterns) {
      const matches = workflowContent.match(pattern);
      if (matches && matches.some(match => !match.includes('${{ secrets.'))) {
        return { success: false, message: '機密情報が直接記載されている可能性があります' };
      }
    }
    
    return { success: true, message: 'セキュリティ設定が適切に構成されています' };
  }

  /**
   * パフォーマンス要件の確認
   */
  async validatePerformanceRequirements() {
    const workflowPath = '.github/workflows/npm-publish.yaml';
    const workflowContent = fs.readFileSync(workflowPath, 'utf8');
    
    // キャッシュ設定の確認
    if (!workflowContent.includes('actions/cache@')) {
      return { success: false, message: 'キャッシュ設定が見つかりません' };
    }
    
    // 並列実行の可能性確認
    const stepCount = (workflowContent.match(/- name:/g) || []).length;
    if (stepCount > 15) {
      return { 
        success: false, 
        message: `ステップ数が多すぎます (${stepCount}個) - 並列化を検討してください` 
      };
    }
    
    return { success: true, message: 'パフォーマンス要件を満たしています' };
  }

  /**
   * エラーハンドリングの網羅性確認
   */
  async validateErrorHandling() {
    const workflowPath = '.github/workflows/npm-publish.yaml';
    const workflowContent = fs.readFileSync(workflowPath, 'utf8');
    
    // 条件実行の確認
    if (!workflowContent.includes('if:')) {
      return { success: false, message: '条件実行によるエラーハンドリングが不十分です' };
    }
    
    // 失敗時の処理確認
    const errorHandlingPatterns = [
      'success()',
      'failure()',
      'always()'
    ];
    
    const hasErrorHandling = errorHandlingPatterns.some(pattern => 
      workflowContent.includes(pattern)
    );
    
    if (!hasErrorHandling) {
      return { success: false, message: '明示的なエラーハンドリングが見つかりません' };
    }
    
    return { success: true, message: 'エラーハンドリングが適切に実装されています' };
  }

  /**
   * 全体結果の更新
   */
  updateOverallResults(results) {
    results.forEach(result => {
      this.overallResults.total++;
      if (result.passed) {
        this.overallResults.passed++;
      } else {
        this.overallResults.failed++;
      }
    });
  }

  /**
   * 最終レポートの生成
   */
  async generateFinalReport() {
    const endTime = new Date();
    const duration = endTime - this.startTime;
    
    console.log('📊 統合テスト最終レポート');
    console.log('='.repeat(50));
    
    console.log(`\n⏰ 実行時間: ${Math.round(duration / 1000)}秒`);
    console.log(`📅 実行日時: ${this.startTime.toISOString()} - ${endTime.toISOString()}`);
    
    console.log(`\n📋 全体結果サマリー:`);
    console.log(`  ✅ 成功: ${this.overallResults.passed}`);
    console.log(`  ❌ 失敗: ${this.overallResults.failed}`);
    console.log(`  📊 成功率: ${this.overallResults.total > 0 ? ((this.overallResults.passed / this.overallResults.total) * 100).toFixed(1) : 100}%`);
    
    console.log(`\n📋 テストスイート別結果:`);
    this.testSuites.forEach(suite => {
      const passed = suite.results.filter(r => r.passed).length;
      const total = suite.results.length;
      const rate = total > 0 ? ((passed / total) * 100).toFixed(1) : 100;
      
      console.log(`  ${suite.name}: ${passed}/${total} (${rate}%)`);
    });
    
    // 失敗したテストの詳細
    const failedTests = [];
    this.testSuites.forEach(suite => {
      suite.results.filter(r => !r.passed).forEach(result => {
        failedTests.push({
          suite: suite.name,
          test: result.description,
          error: result.error
        });
      });
    });
    
    if (failedTests.length > 0) {
      console.log(`\n❌ 失敗したテスト (${failedTests.length}個):`);
      failedTests.forEach(({ suite, test, error }) => {
        console.log(`  - [${suite}] ${test}: ${error}`);
      });
    }
    
    // 推奨事項の生成
    console.log(`\n💡 推奨事項:`);
    
    if (this.overallResults.failed === 0) {
      console.log(`  🎉 すべてのテストが成功しました！`);
      console.log(`  ✅ ワークフローは本番環境で使用する準備ができています`);
      console.log(`  📝 次のステップ:`);
      console.log(`    1. GitHub SecretsにNPM_TOKENを設定`);
      console.log(`    2. テストブランチでワークフローを実行`);
      console.log(`    3. 実際のリリースプロセスでの動作確認`);
    } else {
      console.log(`  🔧 ${this.overallResults.failed}個の問題を修正してください`);
      console.log(`  📋 修正後に再度テストを実行することを推奨します`);
    }
    
    // 詳細レポートファイルの生成
    const reportPath = 'integrated-workflow-test-report.json';
    const report = {
      timestamp: endTime.toISOString(),
      duration: duration,
      summary: this.overallResults,
      testSuites: this.testSuites,
      failedTests: failedTests,
      recommendations: this.generateRecommendations()
    };
    
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n📄 詳細レポートが ${reportPath} に保存されました`);
    
    // 終了コードの設定
    if (this.overallResults.failed > 0) {
      console.log(`\n❌ テストに失敗があるため、終了コード1で終了します`);
      process.exit(1);
    } else {
      console.log(`\n✅ すべてのテストが成功しました`);
    }
  }

  /**
   * 推奨事項の生成
   */
  generateRecommendations() {
    const recommendations = [];
    
    if (this.overallResults.failed === 0) {
      recommendations.push({
        type: 'success',
        message: 'ワークフローは本番環境で使用する準備ができています',
        actions: [
          'GitHub SecretsにNPM_TOKENを設定',
          'テストブランチでワークフローを実行',
          '実際のリリースプロセスでの動作確認'
        ]
      });
    } else {
      recommendations.push({
        type: 'warning',
        message: '修正が必要な問題があります',
        actions: [
          '失敗したテストの詳細を確認',
          '問題を修正',
          'テストを再実行'
        ]
      });
    }
    
    return recommendations;
  }

  /**
   * エラーレポートの生成
   */
  async generateErrorReport(error) {
    const errorReport = {
      timestamp: new Date().toISOString(),
      error: {
        message: error.message,
        stack: error.stack
      },
      completedSuites: this.testSuites,
      partialResults: this.overallResults
    };
    
    const errorReportPath = 'integrated-workflow-test-error-report.json';
    fs.writeFileSync(errorReportPath, JSON.stringify(errorReport, null, 2));
    
    console.log(`\n📄 エラーレポートが ${errorReportPath} に保存されました`);
  }
}

// スクリプトが直接実行された場合のみテストを実行
if (require.main === module) {
  const tester = new IntegratedWorkflowTester();
  tester.runIntegratedTests().catch(error => {
    console.error('統合テスト実行エラー:', error);
    process.exit(1);
  });
}

module.exports = IntegratedWorkflowTester;