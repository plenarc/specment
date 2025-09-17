#!/usr/bin/env node

/**
 * テスト用プルリクエスト作成スクリプト
 * 
 * このスクリプトは統合テストの一環として、実際のプルリクエストマージでの
 * 動作テストを行うためのテストブランチとChangesetを作成します。
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const crypto = require('crypto');

// ログ出力用のヘルパー関数
function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = {
    info: '📋',
    success: '✅',
    error: '❌',
    warning: '⚠️',
    test: '🧪'
  }[type] || '📋';
  
  console.log(`${prefix} [${timestamp}] ${message}`);
}

// コマンド実行のヘルパー関数
function executeCommand(command, options = {}) {
  try {
    log(`Executing: ${command}`, 'info');
    const result = execSync(command, { 
      encoding: 'utf8', 
      stdio: options.silent ? 'pipe' : 'inherit',
      ...options 
    });
    return { success: true, output: result };
  } catch (error) {
    return { success: false, error: error.message, output: error.stdout || '' };
  }
}

// 現在のGitブランチを取得
function getCurrentBranch() {
  try {
    const result = execSync('git branch --show-current', { encoding: 'utf8' });
    return result.trim();
  } catch (error) {
    log(`Failed to get current branch: ${error.message}`, 'error');
    return null;
  }
}

// テスト用のChangesetを作成
function createTestChangeset() {
  const changesetId = crypto.randomBytes(8).toString('hex');
  const timestamp = new Date().toISOString().split('T')[0];
  
  const changesetContent = `---
"@plenarc/specment": patch
---

Integration test changeset - ${timestamp}

This is a test changeset created for integration testing of the automated npm publish workflow. This changeset includes:

- Workflow validation testing
- Package publication verification  
- Documentation accuracy confirmation
- Team usage validation

Test ID: ${changesetId}
Created: ${new Date().toISOString()}
Purpose: Automated workflow integration testing
`;

  const changesetFileName = `.changeset/integration-test-${changesetId}.md`;
  
  try {
    fs.writeFileSync(changesetFileName, changesetContent);
    log(`Test changeset created: ${changesetFileName}`, 'success');
    return changesetFileName;
  } catch (error) {
    log(`Failed to create test changeset: ${error.message}`, 'error');
    return null;
  }
}

// テスト用のコード変更を作成（軽微な変更）
function createTestCodeChange() {
  const testFilePath = 'packages/specment/src/test-integration.ts';
  const testContent = `/**
 * Integration test marker file
 * 
 * This file is created during integration testing to verify that the automated
 * npm publish workflow correctly handles code changes and publishes updates.
 * 
 * Generated: ${new Date().toISOString()}
 * Purpose: Workflow integration testing
 */

export const INTEGRATION_TEST_MARKER = {
  timestamp: '${new Date().toISOString()}',
  testId: '${crypto.randomBytes(8).toString('hex')}',
  purpose: 'automated-workflow-testing'
};

export function getIntegrationTestInfo() {
  return INTEGRATION_TEST_MARKER;
}
`;

  try {
    // ディレクトリが存在しない場合は作成
    const dir = path.dirname(testFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(testFilePath, testContent);
    log(`Test code change created: ${testFilePath}`, 'success');
    return testFilePath;
  } catch (error) {
    log(`Failed to create test code change: ${error.message}`, 'error');
    return null;
  }
}

// テストブランチの作成とプッシュ
async function createTestBranch() {
  const currentBranch = getCurrentBranch();
  if (!currentBranch) {
    log('Failed to determine current branch', 'error');
    return false;
  }
  
  log(`Current branch: ${currentBranch}`, 'info');
  
  // mainブランチでない場合は警告
  if (currentBranch !== 'main') {
    log(`Warning: Not on main branch. Current: ${currentBranch}`, 'warning');
    log('It is recommended to run this script from the main branch', 'warning');
  }
  
  // テストブランチ名を生成
  const timestamp = new Date().toISOString().split('T')[0].replace(/-/g, '');
  const testBranchName = `test/integration-workflow-${timestamp}`;
  
  log(`Creating test branch: ${testBranchName}`, 'info');
  
  // 新しいブランチを作成
  const createBranchResult = executeCommand(`git checkout -b ${testBranchName}`);
  if (!createBranchResult.success) {
    log(`Failed to create test branch: ${createBranchResult.error}`, 'error');
    return false;
  }
  
  // テスト用の変更を作成
  log('Creating test changes...', 'info');
  
  const changesetFile = createTestChangeset();
  const codeChangeFile = createTestCodeChange();
  
  if (!changesetFile || !codeChangeFile) {
    log('Failed to create test changes', 'error');
    return false;
  }
  
  // 変更をステージング
  const addResult = executeCommand(`git add ${changesetFile} ${codeChangeFile}`);
  if (!addResult.success) {
    log(`Failed to stage changes: ${addResult.error}`, 'error');
    return false;
  }
  
  // コミット
  const commitMessage = `test: integration test for automated npm publish workflow

This commit includes test changes for validating the automated npm publish workflow:

- Test changeset for patch version bump
- Test code change to trigger build process
- Integration test validation

Branch: ${testBranchName}
Created: ${new Date().toISOString()}
Purpose: Automated workflow integration testing`;

  const commitResult = executeCommand(`git commit -m "${commitMessage}"`);
  if (!commitResult.success) {
    log(`Failed to commit changes: ${commitResult.error}`, 'error');
    return false;
  }
  
  log('Test changes committed successfully', 'success');
  
  // ブランチをプッシュ（リモートが設定されている場合）
  log('Pushing test branch to remote...', 'info');
  const pushResult = executeCommand(`git push -u origin ${testBranchName}`);
  
  if (pushResult.success) {
    log(`Test branch pushed successfully: ${testBranchName}`, 'success');
    
    // プルリクエスト作成の案内
    console.log('\n' + '='.repeat(80));
    console.log('🎯 NEXT STEPS FOR INTEGRATION TESTING');
    console.log('='.repeat(80));
    console.log(`\n1. Create a Pull Request:`);
    console.log(`   - Source branch: ${testBranchName}`);
    console.log(`   - Target branch: main`);
    console.log(`   - Title: "Integration Test: Automated NPM Publish Workflow"`);
    console.log(`\n2. Review the PR and merge it to trigger the automated workflow`);
    console.log(`\n3. Monitor the GitHub Actions execution:`);
    console.log(`   - Go to: https://github.com/plenarc/specment/actions`);
    console.log(`   - Look for the "NPM Publish" workflow execution`);
    console.log(`\n4. Verify the results:`);
    console.log(`   - Check if the package version was updated`);
    console.log(`   - Verify npm publication`);
    console.log(`   - Confirm Git tag creation`);
    console.log(`\n5. Clean up after testing:`);
    console.log(`   - Delete the test branch: git branch -d ${testBranchName}`);
    console.log(`   - Remove test files if needed`);
    console.log('\n' + '='.repeat(80));
    
  } else {
    log(`Failed to push test branch: ${pushResult.error}`, 'error');
    log('You can manually push the branch later with:', 'info');
    log(`git push -u origin ${testBranchName}`, 'info');
  }
  
  return true;
}

// GitHub CLIを使用してプルリクエストを自動作成（オプション）
async function createPullRequestWithGH() {
  log('Attempting to create pull request with GitHub CLI...', 'info');
  
  // GitHub CLIの利用可能性確認
  const ghResult = executeCommand('gh --version', { silent: true });
  if (!ghResult.success) {
    log('GitHub CLI not available. Please create the PR manually.', 'warning');
    return false;
  }
  
  const currentBranch = getCurrentBranch();
  if (!currentBranch || currentBranch === 'main') {
    log('Not on a test branch. Cannot create PR.', 'error');
    return false;
  }
  
  const prTitle = 'Integration Test: Automated NPM Publish Workflow';
  const prBody = `## Integration Test PR

This pull request is created for testing the automated npm publish workflow.

### Test Changes
- ✅ Test changeset for patch version bump
- ✅ Test code change to trigger build process
- ✅ Integration test validation

### Expected Workflow Behavior
When this PR is merged to main, the GitHub Actions workflow should:

1. **Build & Test**: Execute build and test processes
2. **Changeset Detection**: Detect the test changeset
3. **Version Update**: Bump the patch version
4. **NPM Publish**: Publish the updated package to npm
5. **Git Tag**: Create a new git tag for the version
6. **Cleanup**: Complete the workflow successfully

### Verification Steps
After merging, please verify:
- [ ] GitHub Actions workflow executed successfully
- [ ] Package version was updated in package.json
- [ ] New version was published to npm
- [ ] Git tag was created
- [ ] No errors in the workflow logs

### Test Information
- **Branch**: ${currentBranch}
- **Created**: ${new Date().toISOString()}
- **Purpose**: Automated workflow integration testing
- **Test ID**: ${crypto.randomBytes(8).toString('hex')}

---

**Note**: This is a test PR for integration testing. The changes are minimal and safe for production.`;

  const createPRResult = executeCommand(
    `gh pr create --title "${prTitle}" --body "${prBody}" --base main --head ${currentBranch}`,
    { silent: true }
  );
  
  if (createPRResult.success) {
    log('Pull request created successfully with GitHub CLI', 'success');
    console.log('\n📋 Pull Request Details:');
    console.log(createPRResult.output);
    return true;
  } else {
    log(`Failed to create PR with GitHub CLI: ${createPRResult.error}`, 'error');
    return false;
  }
}

// メイン実行関数
async function main() {
  log('Starting integration test PR creation...', 'info');
  
  // 現在のディレクトリがプロジェクトルートかチェック
  if (!fs.existsSync('package.json') || !fs.existsSync('.changeset')) {
    log('This script must be run from the project root directory', 'error');
    log('Please ensure you are in the correct directory with package.json and .changeset/', 'error');
    process.exit(1);
  }
  
  // Gitリポジトリかチェック
  if (!fs.existsSync('.git')) {
    log('This directory is not a Git repository', 'error');
    process.exit(1);
  }
  
  try {
    // テストブランチの作成
    const branchCreated = await createTestBranch();
    if (!branchCreated) {
      log('Failed to create test branch', 'error');
      process.exit(1);
    }
    
    // GitHub CLIでのPR作成を試行（オプション）
    const prCreated = await createPullRequestWithGH();
    if (!prCreated) {
      log('Please create the pull request manually on GitHub', 'info');
    }
    
    log('Integration test setup completed successfully! 🎉', 'success');
    
  } catch (error) {
    log(`Integration test setup failed: ${error.message}`, 'error');
    console.error(error);
    process.exit(1);
  }
}

// スクリプトが直接実行された場合のみ実行
if (require.main === module) {
  main();
}

module.exports = {
  createTestBranch,
  createTestChangeset,
  createTestCodeChange,
  createPullRequestWithGH
};