#!/usr/bin/env node

/**
 * ワークフロー統合テストランナー
 * すべてのワークフローテストを順次実行し、総合的な検証を行います
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// テストクラスのインポート
const WorkflowValidator = require('./test-workflow-validation.js');
const BranchWorkflowTester = require('./test-branch-workflow.js');
const NpmPublishTester = require('./test-npm-publish.js');
const ErrorScenarioTester = require('./test-error-scenarios.js');

class IntegratedWorkflowTester {
  constructor() {
    this.testSuites = [
      {
        name: 'ワークフロー構文・設定検証',
        class: WorkflowValidator,
        method: 'runAllTests',
        critical: true
      },
      {
        name: 'エラーシナリオテスト',
        class: ErrorScenarioTester,
        method: 'runErrorScenarioTests',
        critical: true
      },
      {
        name: 'npm公開プロセステスト',
        class: NpmPublishTester,
        method: 'runPublishTest',
        critical: false
      },
      {
        name: 'ブランチワークフローテスト',
        class: BranchWorkflowTester,
        method: 'runBranchTest',
        critical: false
      }
    ];

    this.results = {
      totalSuites: this.testSuites.length,
      passedSuites: 0,
      failedSuites: 0,
      skippedSuites: 0,
      criticalFailures: 0,
      suiteResults: []
    };

    this.startTime = Date.now();
  }

  /**
   * メインテスト実行
   */
  async runIntegratedTests() {
    console.log('🚀 GitHub Actions ワークフロー統合テストを開始します');
    console.log('=' .repeat(60));
    console.log(`開始時刻: ${new Date().toLocaleString()}`);
    console.log(`テストスイート数: ${this.testSuites.length}`);
    console.log('=' .repeat(60));
    console.log('');

    // 事前チェック
    await this.performPreChecks();

    // 各テストスイートの実行
    for (let i = 0; i < this.testSuites.length; i++) {
      const suite = this.testSuites[i];
      console.log(`📋 [${i + 1}/${this.testSuites.length}] ${suite.name}`);
      console.log('-'.repeat(40));

      try {
        await this.runTestSuite(suite);
        this.results.passedSuites++;
        console.log(`✅ ${suite.name}: 成功\n`);
      } catch (error) {
        this.results.failedSuites++;
        if (suite.critical) {
          this.results.criticalFailures++;
        }
        
        console.log(`❌ ${suite.name}: 失敗`);
        console.log(`   エラー: ${error.message}\n`);

        // クリティカルなテストが失敗した場合の処理
        if (suite.critical) {
          console.log('⚠️  クリティカルなテストが失敗しました。');
          const shouldContinue = await this.askContinueAfterCriticalFailure();
          if (!shouldContinue) {
            console.log('テストを中断します。');
            break;
          }
        }
      }
    }

    // 最終レポートの生成
    await this.generateFinalReport();
  }

  /**
   * 事前チェックの実行
   */
  async performPreChecks() {
    console.log('🔍 事前チェックを実行中...');

    const checks = [
      {
        name: 'Node.js環境',
        check: () => {
          const version = process.version;
          console.log(`   Node.js: ${version}`);
          return version.startsWith('v18') || version.startsWith('v20');
        }
      },
      {
        name: 'pnpm利用可能性',
        check: () => {
          try {
            const version = execSync('pnpm --version', { encoding: 'utf8' }).trim();
            console.log(`   pnpm: ${version}`);
            return true;
          } catch (error) {
            console.log('   pnpm: 未インストール');
            return false;
          }
        }
      },
      {
        name: 'Git環境',
        check: () => {
          try {
            const version = execSync('git --version', { encoding: 'utf8' }).trim();
            console.log(`   ${version}`);
            return true;
          } catch (error) {
            console.log('   Git: 未インストール');
            return false;
          }
        }
      },
      {
        name: 'ワークフローファイル存在',
        check: () => {
          const exists = fs.existsSync('.github/workflows/npm-publish.yaml');
          console.log(`   ワークフローファイル: ${exists ? '存在' : '不存在'}`);
          return exists;
        }
      },
      {
        name: 'Changesets設定',
        check: () => {
          const exists = fs.existsSync('.changeset/config.json');
          console.log(`   Changesets設定: ${exists ? '存在' : '不存在'}`);
          return exists;
        }
      },
      {
        name: 'パッケージ構造',
        check: () => {
          const exists = fs.existsSync('packages/specment/package.json');
          console.log(`   パッケージ構造: ${exists ? '正常' : '異常'}`);
          return exists;
        }
      }
    ];

    let passedChecks = 0;
    for (const check of checks) {
      try {
        if (check.check()) {
          passedChecks++;
        }
      } catch (error) {
        console.log(`   ${check.name}: エラー - ${error.message}`);
      }
    }

    console.log(`\n事前チェック結果: ${passedChecks}/${checks.length} 通過`);

    if (passedChecks < checks.length) {
      console.log('⚠️  一部の事前チェックが失敗しました。テストに影響する可能性があります。');
    } else {
      console.log('✅ すべての事前チェックが通過しました。');
    }

    console.log('');
  }

  /**
   * 個別テストスイートの実行
   */
  async runTestSuite(suite) {
    const startTime = Date.now();
    
    try {
      const tester = new suite.class();
      await tester[suite.method]();
      
      const duration = Date.now() - startTime;
      this.results.suiteResults.push({
        name: suite.name,
        status: 'success',
        duration,
        critical: suite.critical
      });

    } catch (error) {
      const duration = Date.now() - startTime;
      this.results.suiteResults.push({
        name: suite.name,
        status: 'failed',
        duration,
        critical: suite.critical,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * クリティカル失敗後の継続確認
   */
  async askContinueAfterCriticalFailure() {
    // 自動化環境では継続しない
    if (process.env.CI || process.env.AUTOMATED_TEST) {
      return false;
    }

    // インタラクティブ環境では継続するかユーザーに確認
    console.log('残りのテストを継続しますか？ (y/N): ');
    
    return new Promise((resolve) => {
      process.stdin.once('data', (data) => {
        const input = data.toString().trim().toLowerCase();
        resolve(input === 'y' || input === 'yes');
      });
    });
  }

  /**
   * 最終レポートの生成
   */
  async generateFinalReport() {
    const endTime = Date.now();
    const totalDuration = endTime - this.startTime;

    console.log('📊 ワークフロー統合テスト最終レポート');
    console.log('=' .repeat(60));

    // 実行時間情報
    console.log(`\n⏱️  実行時間情報:`);
    console.log(`   開始時刻: ${new Date(this.startTime).toLocaleString()}`);
    console.log(`   終了時刻: ${new Date(endTime).toLocaleString()}`);
    console.log(`   総実行時間: ${Math.round(totalDuration / 1000)}秒`);

    // テストスイート結果
    console.log(`\n📈 テストスイート結果:`);
    console.log(`   総スイート数: ${this.results.totalSuites}`);
    console.log(`   成功: ${this.results.passedSuites}`);
    console.log(`   失敗: ${this.results.failedSuites}`);
    console.log(`   成功率: ${Math.round(this.results.passedSuites / this.results.totalSuites * 100)}%`);

    // 個別スイート結果
    console.log(`\n📋 個別スイート結果:`);
    for (const result of this.results.suiteResults) {
      const status = result.status === 'success' ? '✅' : '❌';
      const critical = result.critical ? ' [CRITICAL]' : '';
      const duration = Math.round(result.duration / 1000);
      console.log(`   ${status} ${result.name}${critical} (${duration}秒)`);
      if (result.error) {
        console.log(`      エラー: ${result.error}`);
      }
    }

    // クリティカル失敗の確認
    if (this.results.criticalFailures > 0) {
      console.log(`\n⚠️  クリティカル失敗: ${this.results.criticalFailures}件`);
      console.log('   これらの問題は本番環境での使用前に修正が必要です。');
    }

    // 総合判定
    console.log(`\n🎯 総合判定:`);
    if (this.results.criticalFailures === 0 && this.results.passedSuites >= this.results.totalSuites * 0.8) {
      console.log('   ✅ ワークフローは本番環境での使用準備が整っています');
      console.log('   推奨される次のステップ:');
      console.log('   1. GitHub SecretsでのNPM_TOKEN設定');
      console.log('   2. テスト用プルリクエストでの実際のワークフロー実行');
      console.log('   3. 公開されたパッケージの動作確認');
    } else if (this.results.criticalFailures === 0) {
      console.log('   ⚠️  ワークフローは基本的に動作しますが、改善の余地があります');
      console.log('   推奨される次のステップ:');
      console.log('   1. 失敗したテストの原因調査と修正');
      console.log('   2. 修正後の再テスト実行');
      console.log('   3. 段階的な本番環境での検証');
    } else {
      console.log('   ❌ ワークフローに重大な問題があります');
      console.log('   必須の修正事項:');
      console.log('   1. クリティカルな問題の修正');
      console.log('   2. 全テストの再実行と検証');
      console.log('   3. 問題解決後の段階的なロールアウト');
    }

    // レポートファイルの保存
    await this.saveDetailedReport();

    console.log('\n' + '=' .repeat(60));
    console.log('テスト完了');
  }

  /**
   * 詳細レポートの保存
   */
  async saveDetailedReport() {
    const reportData = {
      timestamp: new Date().toISOString(),
      execution: {
        startTime: this.startTime,
        endTime: Date.now(),
        duration: Date.now() - this.startTime
      },
      results: this.results,
      environment: {
        nodeVersion: process.version,
        platform: process.platform,
        cwd: process.cwd()
      },
      recommendations: this.generateRecommendations()
    };

    const reportPath = 'workflow-integration-test-report.json';
    fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2));
    console.log(`\n📄 詳細レポートを保存しました: ${reportPath}`);
  }

  /**
   * 推奨事項の生成
   */
  generateRecommendations() {
    const recommendations = [];

    if (this.results.criticalFailures > 0) {
      recommendations.push({
        priority: 'high',
        category: 'critical',
        message: 'クリティカルな問題を修正してください',
        actions: [
          'ワークフロー構文の確認と修正',
          'エラーハンドリングの実装',
          '設定ファイルの検証'
        ]
      });
    }

    if (this.results.failedSuites > 0) {
      recommendations.push({
        priority: 'medium',
        category: 'improvement',
        message: '失敗したテストの改善を検討してください',
        actions: [
          'テスト失敗の原因調査',
          'ワークフローの最適化',
          'エラー処理の強化'
        ]
      });
    }

    if (this.results.passedSuites === this.results.totalSuites) {
      recommendations.push({
        priority: 'low',
        category: 'next-steps',
        message: '本番環境での段階的なロールアウトを開始できます',
        actions: [
          'GitHub SecretsでのNPM_TOKEN設定',
          'テスト用プルリクエストでの検証',
          '本番環境での慎重な実行'
        ]
      });
    }

    return recommendations;
  }
}

// メイン実行
if (require.main === module) {
  const tester = new IntegratedWorkflowTester();
  tester.runIntegratedTests().catch(error => {
    console.error('統合テスト実行中に予期しないエラーが発生しました:', error);
    process.exit(1);
  });
}

module.exports = IntegratedWorkflowTester;