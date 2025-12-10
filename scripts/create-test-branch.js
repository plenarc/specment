#!/usr/bin/env node

/**
 * ワークフローテスト用ブランチ作成スクリプト
 * 
 * GitHub Actionsワークフローをテストするための
 * 専用ブランチを作成し、テスト環境を準備します。
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class TestBranchCreator {
  constructor() {
    this.testBranchName = 'test/workflow-validation';
    this.backupBranchName = 'backup/pre-workflow-test';
  }

  /**
   * テストブランチ作成のメインエントリーポイント
   */
  async createTestBranch() {
    console.log('🌿 ワークフローテスト用ブランチを作成します...\n');

    try {
      await this.checkGitStatus();
      await this.createBackupBranch();
      await this.createTestBranch();
      await this.setupTestEnvironment();
      await this.displayInstructions();
    } catch (error) {
      console.error('❌ テストブランチ作成中にエラーが発生しました:', error.message);
      process.exit(1);
    }
  }

  /**
   * Gitステータスの確認
   */
  async checkGitStatus() {
    console.log('📋 1. Gitステータスの確認');

    try {
      // 現在のブランチを確認
      const currentBranch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
      console.log(`  📍 現在のブランチ: ${currentBranch}`);

      // 未コミットの変更を確認
      const status = execSync('git status --porcelain', { encoding: 'utf8' });
      if (status.trim()) {
        console.log('  ⚠️ 未コミットの変更があります:');
        console.log(status.split('\n').map(line => `    ${line}`).join('\n'));
        
        const response = await this.promptUser('未コミットの変更をコミットしますか？ (y/n): ');
        if (response.toLowerCase() === 'y') {
          execSync('git add .');
          execSync('git commit -m "WIP: ワークフローテスト前の変更をコミット"');
          console.log('  ✅ 変更をコミットしました');
        } else {
          console.log('  ⚠️ 未コミットの変更がある状態で続行します');
        }
      } else {
        console.log('  ✅ 作業ディレクトリはクリーンです');
      }

      // リモートとの同期状況を確認
      try {
        execSync('git fetch origin', { encoding: 'utf8' });
        const behind = execSync(`git rev-list --count HEAD..origin/${currentBranch}`, { encoding: 'utf8' }).trim();
        const ahead = execSync(`git rev-list --count origin/${currentBranch}..HEAD`, { encoding: 'utf8' }).trim();
        
        if (behind !== '0') {
          console.log(`  ⚠️ リモートより ${behind} コミット遅れています`);
        }
        if (ahead !== '0') {
          console.log(`  📤 リモートより ${ahead} コミット進んでいます`);
        }
        if (behind === '0' && ahead === '0') {
          console.log('  ✅ リモートと同期されています');
        }
      } catch (error) {
        console.log('  ⚠️ リモート同期状況の確認をスキップしました');
      }

    } catch (error) {
      throw new Error(`Gitステータス確認エラー: ${error.message}`);
    }

    console.log();
  }

  /**
   * バックアップブランチの作成
   */
  async createBackupBranch() {
    console.log('💾 2. バックアップブランチの作成');

    try {
      // 既存のバックアップブランチを確認
      try {
        execSync(`git show-ref --verify --quiet refs/heads/${this.backupBranchName}`);
        console.log(`  ⚠️ バックアップブランチ ${this.backupBranchName} が既に存在します`);
        
        const response = await this.promptUser('既存のバックアップブランチを削除して新しく作成しますか？ (y/n): ');
        if (response.toLowerCase() === 'y') {
          execSync(`git branch -D ${this.backupBranchName}`);
          console.log(`  🗑️ 既存のバックアップブランチを削除しました`);
        } else {
          console.log(`  ⏭️ 既存のバックアップブランチを使用します`);
          console.log();
          return;
        }
      } catch (error) {
        // ブランチが存在しない場合は正常
      }

      // バックアップブランチを作成
      execSync(`git checkout -b ${this.backupBranchName}`);
      console.log(`  ✅ バックアップブランチ ${this.backupBranchName} を作成しました`);

      // 元のブランチに戻る
      execSync('git checkout -');
      console.log(`  🔄 元のブランチに戻りました`);

    } catch (error) {
      throw new Error(`バックアップブランチ作成エラー: ${error.message}`);
    }

    console.log();
  }

  /**
   * テストブランチの作成
   */
  async createTestBranch() {
    console.log('🧪 3. テストブランチの作成');

    try {
      // 既存のテストブランチを確認
      try {
        execSync(`git show-ref --verify --quiet refs/heads/${this.testBranchName}`);
        console.log(`  ⚠️ テストブランチ ${this.testBranchName} が既に存在します`);
        
        const response = await this.promptUser('既存のテストブランチを削除して新しく作成しますか？ (y/n): ');
        if (response.toLowerCase() === 'y') {
          execSync(`git branch -D ${this.testBranchName}`);
          console.log(`  🗑️ 既存のテストブランチを削除しました`);
        } else {
          execSync(`git checkout ${this.testBranchName}`);
          console.log(`  ✅ 既存のテストブランチに切り替えました`);
          console.log();
          return;
        }
      } catch (error) {
        // ブランチが存在しない場合は正常
      }

      // テストブランチを作成
      execSync(`git checkout -b ${this.testBranchName}`);
      console.log(`  ✅ テストブランチ ${this.testBranchName} を作成しました`);

    } catch (error) {
      throw new Error(`テストブランチ作成エラー: ${error.message}`);
    }

    console.log();
  }

  /**
   * テスト環境のセットアップ
   */
  async setupTestEnvironment() {
    console.log('⚙️ 4. テスト環境のセットアップ');

    try {
      // テスト用Changesetの作成
      const testChangesetPath = '.changeset/workflow-test.md';
      if (!fs.existsSync(testChangesetPath)) {
        const changesetContent = `---
"@plenarc/specment": patch
---

ワークフローテスト用のChangeset - GitHub Actions npm公開プロセスの検証`;

        fs.writeFileSync(testChangesetPath, changesetContent);
        console.log(`  ✅ テスト用Changeset ${testChangesetPath} を作成しました`);
      } else {
        console.log(`  ✅ テスト用Changeset ${testChangesetPath} が既に存在します`);
      }

      // テスト設定ファイルの作成
      const testConfigPath = 'workflow-test-config.json';
      const testConfig = {
        testBranch: this.testBranchName,
        backupBranch: this.backupBranchName,
        createdAt: new Date().toISOString(),
        testScenarios: [
          'normal-workflow-execution',
          'changeset-validation',
          'build-and-test-process',
          'npm-authentication',
          'error-handling'
        ],
        notes: [
          'このファイルはワークフローテスト用に自動生成されました',
          'テスト完了後は削除してください'
        ]
      };

      fs.writeFileSync(testConfigPath, JSON.stringify(testConfig, null, 2));
      console.log(`  ✅ テスト設定ファイル ${testConfigPath} を作成しました`);

      // テスト用READMEの作成
      const testReadmePath = 'WORKFLOW_TEST_README.md';
      const testReadmeContent = `# ワークフローテスト環境

このブランチは GitHub Actions npm公開ワークフローのテスト用に作成されました。

## テスト内容

1. **正常系テスト**
   - Changesetファイルの検証
   - ビルドプロセスの確認
   - テスト実行の確認
   - npm公開プロセスの検証

2. **エラーハンドリングテスト**
   - Changesetなしでの動作
   - ビルドエラー時の処理
   - テストエラー時の処理
   - 認証エラー時の処理

## テスト実行方法

\`\`\`bash
# ローカルシミュレーション
node scripts/test-npm-publish-simulation.js

# ワークフロー設定テスト
node scripts/test-workflow.js

# GitHub Actionsでのテスト実行
git push origin ${this.testBranchName}
\`\`\`

## 注意事項

- このブランチでの変更は本番環境に影響しません
- テスト完了後はブランチを削除してください
- npm公開はテストレジストリまたはドライランで実行されます

## 作成日時

${new Date().toISOString()}
`;

      fs.writeFileSync(testReadmePath, testReadmeContent);
      console.log(`  ✅ テスト用README ${testReadmePath} を作成しました`);

      // 変更をコミット
      execSync('git add .');
      execSync('git commit -m "feat: ワークフローテスト環境のセットアップ"');
      console.log(`  ✅ テスト環境の変更をコミットしました`);

    } catch (error) {
      throw new Error(`テスト環境セットアップエラー: ${error.message}`);
    }

    console.log();
  }

  /**
   * テスト実行手順の表示
   */
  async displayInstructions() {
    console.log('📋 5. テスト実行手順');

    console.log(`
🎯 ワークフローテスト環境が準備できました！

📍 現在のブランチ: ${this.testBranchName}
💾 バックアップブランチ: ${this.backupBranchName}

🧪 テスト実行手順:

1. **ローカルシミュレーション実行**
   \`\`\`bash
   node scripts/test-npm-publish-simulation.js
   \`\`\`

2. **ワークフロー設定確認**
   \`\`\`bash
   node scripts/test-workflow.js
   \`\`\`

3. **GitHub Actionsでのテスト実行**
   \`\`\`bash
   git push origin ${this.testBranchName}
   \`\`\`
   
   その後、GitHubのActionsタブでワークフローの実行状況を確認してください。

4. **テスト完了後のクリーンアップ**
   \`\`\`bash
   git checkout main
   git branch -D ${this.testBranchName}
   git branch -D ${this.backupBranchName}
   \`\`\`

⚠️ 重要な注意事項:
- NPM_TOKENがGitHub Secretsに設定されていることを確認してください
- テスト実行前に本番環境への影響がないことを確認してください
- テスト用Changesetは実際のリリースには含めないでください

🔗 関連ファイル:
- ワークフロー: .github/workflows/npm-publish.yaml
- テスト設定: workflow-test-config.json
- テスト用Changeset: .changeset/workflow-test.md
- テスト手順: WORKFLOW_TEST_README.md

📚 詳細なドキュメント:
- 要件: .kiro/specs/#00023-add-workflow-upload-npm/requirements.md
- 設計: .kiro/specs/#00023-add-workflow-upload-npm/design.md
- タスク: .kiro/specs/#00023-add-workflow-upload-npm/tasks.md
`);
  }

  /**
   * ユーザー入力の取得
   */
  async promptUser(question) {
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    return new Promise((resolve) => {
      rl.question(question, (answer) => {
        rl.close();
        resolve(answer);
      });
    });
  }
}

// スクリプトが直接実行された場合のみ実行
if (require.main === module) {
  const creator = new TestBranchCreator();
  creator.createTestBranch().catch(error => {
    console.error('テストブランチ作成エラー:', error);
    process.exit(1);
  });
}

module.exports = TestBranchCreator;