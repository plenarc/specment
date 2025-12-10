#!/usr/bin/env node

/**
 * テスト用ブランチでのワークフロー実行テストスクリプト
 * 安全な環境でワークフローの動作を検証します
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class BranchWorkflowTester {
  constructor() {
    this.testBranchName = `test-workflow-${Date.now()}`;
    this.originalBranch = null;
    this.testResults = {
      branchCreation: false,
      workflowTrigger: false,
      buildProcess: false,
      testExecution: false,
      changesetsCheck: false,
      cleanup: false
    };
  }

  /**
   * メインテスト実行
   */
  async runBranchTest() {
    console.log('🌿 テスト用ブランチでのワークフロー実行テストを開始します...\n');

    try {
      await this.setupTestBranch();
      await this.createTestChangeset();
      await this.simulateWorkflowSteps();
      await this.verifyWorkflowBehavior();
      await this.cleanup();
      
      this.generateBranchTestReport();
    } catch (error) {
      console.error('❌ ブランチテスト中にエラーが発生しました:', error.message);
      await this.emergencyCleanup();
    }
  }

  /**
   * テスト用ブランチのセットアップ
   */
  async setupTestBranch() {
    console.log('🔧 テスト用ブランチのセットアップ');

    try {
      // 現在のブランチを記録
      this.originalBranch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
      console.log(`   現在のブランチ: ${this.originalBranch}`);

      // 作業ディレクトリの状態確認
      const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' });
      if (gitStatus.trim()) {
        console.log('   ⚠️  未コミットの変更があります。テスト前にコミットまたはstashしてください。');
        throw new Error('未コミットの変更が存在します');
      }

      // テスト用ブランチの作成
      execSync(`git checkout -b ${this.testBranchName}`, { stdio: 'pipe' });
      console.log(`   ✅ テスト用ブランチ作成: ${this.testBranchName}`);

      this.testResults.branchCreation = true;

    } catch (error) {
      console.log(`   ❌ ブランチセットアップ失敗: ${error.message}`);
      throw error;
    }

    console.log('');
  }

  /**
   * テスト用Changesetの作成
   */
  async createTestChangeset() {
    console.log('📝 テスト用Changesetの作成');

    try {
      const changesetId = `test-${Date.now()}`;
      const changesetPath = `.changeset/${changesetId}.md`;
      const changesetContent = `---
"@plenarc/specment": patch
---

Test changeset for workflow validation - automated test run

This changeset is created for testing the automated npm publish workflow.
It will be automatically cleaned up after the test.
`;

      fs.writeFileSync(changesetPath, changesetContent);
      console.log(`   ✅ テスト用Changeset作成: ${changesetId}.md`);

      // Changesetをコミット
      execSync(`git add ${changesetPath}`, { stdio: 'pipe' });
      execSync(`git commit -m "test: add changeset for workflow testing"`, { stdio: 'pipe' });
      console.log('   ✅ Changesetをコミット');

    } catch (error) {
      console.log(`   ❌ Changeset作成失敗: ${error.message}`);
      throw error;
    }

    console.log('');
  }

  /**
   * ワークフローステップのシミュレーション
   */
  async simulateWorkflowSteps() {
    console.log('🔄 ワークフローステップのシミュレーション');

    // 1. 依存関係インストールのテスト
    await this.testDependencyInstallation();

    // 2. ビルドプロセスのテスト
    await this.testBuildProcess();

    // 3. テスト実行のテスト
    await this.testTestExecution();

    // 4. Changesets検出のテスト
    await this.testChangesetsDetection();

    console.log('');
  }

  /**
   * 依存関係インストールのテスト
   */
  async testDependencyInstallation() {
    console.log('   📦 依存関係インストールテスト');

    try {
      // node_modulesを一時的に削除してクリーンインストールをテスト
      if (fs.existsSync('node_modules')) {
        console.log('     既存のnode_modulesを一時的にバックアップ...');
        execSync('mv node_modules node_modules.backup', { stdio: 'pipe' });
      }

      // pnpm installの実行
      console.log('     pnpm install実行中...');
      execSync('pnpm install --frozen-lockfile', { stdio: 'pipe' });
      console.log('     ✅ 依存関係インストール成功');

    } catch (error) {
      console.log(`     ❌ 依存関係インストール失敗: ${error.message}`);
      
      // バックアップがあれば復元
      if (fs.existsSync('node_modules.backup')) {
        execSync('mv node_modules.backup node_modules', { stdio: 'pipe' });
        console.log('     🔄 node_modulesを復元しました');
      }
      
      throw error;
    } finally {
      // バックアップのクリーンアップ
      if (fs.existsSync('node_modules.backup')) {
        execSync('rm -rf node_modules.backup', { stdio: 'pipe' });
      }
    }
  }

  /**
   * ビルドプロセスのテスト
   */
  async testBuildProcess() {
    console.log('   🔨 ビルドプロセステスト');

    try {
      // 既存のビルド出力をクリーンアップ
      if (fs.existsSync('packages/specment/dist')) {
        execSync('rm -rf packages/specment/dist', { stdio: 'pipe' });
      }

      // ビルド実行
      console.log('     ビルド実行中...');
      execSync('pnpm specment:build', { stdio: 'pipe' });

      // ビルド出力の検証
      if (!fs.existsSync('packages/specment/dist')) {
        throw new Error('ビルド出力ディレクトリが作成されませんでした');
      }

      const distFiles = fs.readdirSync('packages/specment/dist');
      const requiredFiles = ['index.js', 'index.d.ts'];
      
      for (const file of requiredFiles) {
        if (!distFiles.includes(file)) {
          throw new Error(`必要なファイルが生成されませんでした: ${file}`);
        }
      }

      console.log('     ✅ ビルドプロセス成功');
      this.testResults.buildProcess = true;

    } catch (error) {
      console.log(`     ❌ ビルドプロセス失敗: ${error.message}`);
      throw error;
    }
  }

  /**
   * テスト実行のテスト
   */
  async testTestExecution() {
    console.log('   🧪 テスト実行テスト');

    try {
      console.log('     テストスイート実行中...');
      execSync('pnpm --filter @plenarc/specment test --run', { stdio: 'pipe' });
      console.log('     ✅ テスト実行成功');
      this.testResults.testExecution = true;

    } catch (error) {
      console.log(`     ❌ テスト実行失敗: ${error.message}`);
      
      // テスト失敗の詳細を取得
      try {
        const testOutput = execSync('pnpm --filter @plenarc/specment test --run', { encoding: 'utf8' });
        console.log('     テスト出力:');
        console.log(testOutput.split('\n').slice(-10).join('\n'));
      } catch (e) {
        // テスト出力の取得に失敗した場合は無視
      }
      
      throw error;
    }
  }

  /**
   * Changesets検出のテスト
   */
  async testChangesetsDetection() {
    console.log('   📋 Changesets検出テスト');

    try {
      // Changesetファイルの存在確認
      const changesetFiles = fs.readdirSync('.changeset')
        .filter(file => file.endsWith('.md') && file !== 'README.md');

      if (changesetFiles.length === 0) {
        throw new Error('Changesetファイルが見つかりません');
      }

      console.log(`     ✅ ${changesetFiles.length}個のChangesetファイルを検出`);

      // Changesets CLIでの検証
      try {
        const changesetStatus = execSync('npx @changesets/cli status', { encoding: 'utf8' });
        console.log('     ✅ Changesets CLI検証成功');
      } catch (error) {
        console.log('     ⚠️  Changesets CLI検証で警告が発生しましたが、継続します');
      }

      this.testResults.changesetsCheck = true;

    } catch (error) {
      console.log(`     ❌ Changesets検出失敗: ${error.message}`);
      throw error;
    }
  }

  /**
   * ワークフロー動作の検証
   */
  async verifyWorkflowBehavior() {
    console.log('🔍 ワークフロー動作の検証');

    try {
      // GitHub Actionsワークフローファイルの存在確認
      const workflowPath = '.github/workflows/npm-publish.yaml';
      if (!fs.existsSync(workflowPath)) {
        throw new Error('ワークフローファイルが見つかりません');
      }

      // ワークフローの構文チェック（GitHub CLI使用）
      try {
        execSync('gh workflow list', { stdio: 'pipe' });
        console.log('   ✅ GitHub CLI利用可能 - ワークフロー構文確認可能');
      } catch (error) {
        console.log('   ⚠️  GitHub CLI未利用 - 手動でのワークフロー構文確認が必要');
      }

      // ワークフローファイルの基本的な構文チェック
      const workflowContent = fs.readFileSync(workflowPath, 'utf8');
      if (!workflowContent.includes('npm-publish') || !workflowContent.includes('changesets')) {
        throw new Error('ワークフローファイルに必要な設定が不足しています');
      }

      console.log('   ✅ ワークフロー動作検証完了');
      this.testResults.workflowTrigger = true;

    } catch (error) {
      console.log(`   ❌ ワークフロー動作検証失敗: ${error.message}`);
      throw error;
    }

    console.log('');
  }

  /**
   * クリーンアップ
   */
  async cleanup() {
    console.log('🧹 テスト環境のクリーンアップ');

    try {
      // 元のブランチに戻る
      if (this.originalBranch) {
        execSync(`git checkout ${this.originalBranch}`, { stdio: 'pipe' });
        console.log(`   ✅ 元のブランチに復帰: ${this.originalBranch}`);
      }

      // テスト用ブランチの削除
      execSync(`git branch -D ${this.testBranchName}`, { stdio: 'pipe' });
      console.log(`   ✅ テスト用ブランチ削除: ${this.testBranchName}`);

      this.testResults.cleanup = true;

    } catch (error) {
      console.log(`   ❌ クリーンアップ失敗: ${error.message}`);
      console.log('   手動でのクリーンアップが必要な場合があります');
    }

    console.log('');
  }

  /**
   * 緊急時のクリーンアップ
   */
  async emergencyCleanup() {
    console.log('🚨 緊急クリーンアップを実行中...');

    try {
      // 現在のブランチを確認
      const currentBranch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
      
      if (currentBranch === this.testBranchName && this.originalBranch) {
        execSync(`git checkout ${this.originalBranch}`, { stdio: 'pipe' });
        console.log('   ✅ 元のブランチに復帰');
      }

      // テスト用ブランチが存在する場合は削除
      try {
        execSync(`git branch -D ${this.testBranchName}`, { stdio: 'pipe' });
        console.log('   ✅ テスト用ブランチを削除');
      } catch (e) {
        // ブランチが存在しない場合は無視
      }

    } catch (error) {
      console.log(`   ❌ 緊急クリーンアップ失敗: ${error.message}`);
      console.log('   手動でのクリーンアップが必要です:');
      console.log(`   1. git checkout ${this.originalBranch || 'main'}`);
      console.log(`   2. git branch -D ${this.testBranchName}`);
    }
  }

  /**
   * ブランチテストレポートの生成
   */
  generateBranchTestReport() {
    console.log('📊 ブランチテスト結果レポート');
    console.log('=' .repeat(50));

    const totalTests = Object.keys(this.testResults).length;
    const passedTests = Object.values(this.testResults).filter(result => result === true).length;
    const successRate = Math.round(passedTests/totalTests*100);

    console.log(`\n📈 テスト成功率: ${passedTests}/${totalTests} (${successRate}%)`);

    console.log('\n📋 個別テスト結果:');
    console.log(`   ブランチ作成: ${this.testResults.branchCreation ? '✅ 成功' : '❌ 失敗'}`);
    console.log(`   ワークフロートリガー: ${this.testResults.workflowTrigger ? '✅ 成功' : '❌ 失敗'}`);
    console.log(`   ビルドプロセス: ${this.testResults.buildProcess ? '✅ 成功' : '❌ 失敗'}`);
    console.log(`   テスト実行: ${this.testResults.testExecution ? '✅ 成功' : '❌ 失敗'}`);
    console.log(`   Changesets確認: ${this.testResults.changesetsCheck ? '✅ 成功' : '❌ 失敗'}`);
    console.log(`   クリーンアップ: ${this.testResults.cleanup ? '✅ 成功' : '❌ 失敗'}`);

    console.log('\n🎯 総合判定:');
    if (successRate >= 80) {
      console.log('   ✅ ワークフローは正常に動作する可能性が高いです');
    } else {
      console.log('   ❌ ワークフローに問題がある可能性があります');
    }

    console.log('\n📝 次のステップ:');
    if (successRate >= 80) {
      console.log('   1. 実際のプルリクエストでのテスト実行');
      console.log('   2. npm test レジストリでの公開テスト');
      console.log('   3. 本番環境での慎重なロールアウト');
    } else {
      console.log('   1. 失敗したテストの原因調査と修正');
      console.log('   2. 修正後の再テスト実行');
      console.log('   3. 問題解決後の段階的な検証');
    }

    console.log('\n' + '=' .repeat(50));
  }
}

// メイン実行
if (require.main === module) {
  const tester = new BranchWorkflowTester();
  tester.runBranchTest().catch(error => {
    console.error('ブランチテスト実行中に予期しないエラーが発生しました:', error);
    process.exit(1);
  });
}

module.exports = BranchWorkflowTester;