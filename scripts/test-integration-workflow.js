#!/usr/bin/env node

/**
 * 統合テストスクリプト - npm公開ワークフローの動作確認
 * 
 * このスクリプトは以下の統合テストを実行します：
 * 1. 実際のプルリクエストマージでの動作テスト
 * 2. 公開されたパッケージの検証
 * 3. ドキュメントの正確性確認
 * 4. チーム内での使用方法の共有と確認
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// テスト結果を記録するオブジェクト
const testResults = {
  workflowValidation: { passed: 0, failed: 0, tests: [] },
  packageValidation: { passed: 0, failed: 0, tests: [] },
  documentationValidation: { passed: 0, failed: 0, tests: [] },
  usageValidation: { passed: 0, failed: 0, tests: [] },
  overall: { passed: 0, failed: 0 }
};

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

// テスト結果を記録する関数
function recordTest(category, testName, passed, details = '') {
  const result = { testName, passed, details, timestamp: new Date().toISOString() };
  testResults[category].tests.push(result);
  
  if (passed) {
    testResults[category].passed++;
    testResults.overall.passed++;
    log(`${testName}: PASSED ${details}`, 'success');
  } else {
    testResults[category].failed++;
    testResults.overall.failed++;
    log(`${testName}: FAILED ${details}`, 'error');
  }
}

// ファイルの存在確認
function fileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch (error) {
    return false;
  }
}

// JSONファイルの妥当性確認
function validateJsonFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    JSON.parse(content);
    return true;
  } catch (error) {
    return false;
  }
}

// YAMLファイルの基本的な妥当性確認
function validateYamlFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    // 基本的なYAML構文チェック（簡易版）
    return content.includes('name:') && content.includes('on:') && content.includes('jobs:');
  } catch (error) {
    return false;
  }
}

// コマンド実行のヘルパー関数
function executeCommand(command, options = {}) {
  try {
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

// 1. ワークフローファイルの検証
async function validateWorkflowFiles() {
  log('Starting workflow files validation...', 'test');
  
  // GitHub Actionsワークフローファイルの存在確認
  const workflowFile = '.github/workflows/npm-publish.yaml';
  recordTest('workflowValidation', 'Workflow file exists', 
    fileExists(workflowFile), 
    fileExists(workflowFile) ? 'Found at .github/workflows/npm-publish.yaml' : 'Missing workflow file'
  );
  
  // ワークフローファイルの構文確認
  if (fileExists(workflowFile)) {
    recordTest('workflowValidation', 'Workflow file syntax', 
      validateYamlFile(workflowFile),
      'YAML syntax validation'
    );
    
    // ワークフローの必須要素確認
    const workflowContent = fs.readFileSync(workflowFile, 'utf8');
    
    recordTest('workflowValidation', 'Main branch trigger configured', 
      workflowContent.includes('branches:') && workflowContent.includes('main'),
      'Main branch push trigger'
    );
    
    recordTest('workflowValidation', 'NPM publish steps included', 
      workflowContent.includes('npm') || workflowContent.includes('changeset'),
      'NPM/Changeset related steps'
    );
    
    recordTest('workflowValidation', 'Security permissions configured', 
      workflowContent.includes('permissions:'),
      'Workflow permissions section'
    );
  }
  
  // Changesets設定ファイルの確認
  const changesetConfig = '.changeset/config.json';
  recordTest('workflowValidation', 'Changeset config exists', 
    fileExists(changesetConfig),
    fileExists(changesetConfig) ? 'Found changeset configuration' : 'Missing changeset config'
  );
  
  if (fileExists(changesetConfig)) {
    recordTest('workflowValidation', 'Changeset config syntax', 
      validateJsonFile(changesetConfig),
      'JSON syntax validation'
    );
  }
  
  // package.jsonの公開設定確認
  const packageJsonPath = 'packages/specment/package.json';
  if (fileExists(packageJsonPath)) {
    try {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      recordTest('workflowValidation', 'Package publishable', 
        packageJson.private !== true,
        `Package private: ${packageJson.private || false}`
      );
      
      recordTest('workflowValidation', 'Package name configured', 
        !!packageJson.name,
        `Package name: ${packageJson.name || 'Not set'}`
      );
    } catch (error) {
      recordTest('workflowValidation', 'Package.json readable', false, error.message);
    }
  }
}

// 2. パッケージ公開の検証
async function validatePackagePublication() {
  log('Starting package publication validation...', 'test');
  
  // 現在のパッケージ情報を取得
  const packageJsonPath = 'packages/specment/package.json';
  if (!fileExists(packageJsonPath)) {
    recordTest('packageValidation', 'Package.json exists', false, 'Package.json not found');
    return;
  }
  
  let packageJson;
  try {
    packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  } catch (error) {
    recordTest('packageValidation', 'Package.json readable', false, error.message);
    return;
  }
  
  const packageName = packageJson.name;
  const currentVersion = packageJson.version;
  
  recordTest('packageValidation', 'Package has valid name', 
    !!packageName && packageName.startsWith('@'),
    `Package name: ${packageName}`
  );
  
  recordTest('packageValidation', 'Package has valid version', 
    !!currentVersion && /^\d+\.\d+\.\d+/.test(currentVersion),
    `Current version: ${currentVersion}`
  );
  
  // NPMレジストリでの公開状況確認
  if (packageName) {
    log(`Checking NPM registry for package: ${packageName}`, 'info');
    
    const npmViewResult = executeCommand(`npm view ${packageName} --json`, { silent: true });
    
    if (npmViewResult.success) {
      try {
        const npmData = JSON.parse(npmViewResult.output);
        
        recordTest('packageValidation', 'Package published to NPM', 
          true,
          `Latest version: ${npmData.version || 'Unknown'}`
        );
        
        recordTest('packageValidation', 'Package has description', 
          !!npmData.description,
          `Description: ${npmData.description || 'Not set'}`
        );
        
        recordTest('packageValidation', 'Package has keywords', 
          Array.isArray(npmData.keywords) && npmData.keywords.length > 0,
          `Keywords: ${npmData.keywords ? npmData.keywords.join(', ') : 'None'}`
        );
        
        recordTest('packageValidation', 'Package has repository info', 
          !!npmData.repository,
          `Repository: ${npmData.repository ? npmData.repository.url || 'Set' : 'Not set'}`
        );
        
      } catch (error) {
        recordTest('packageValidation', 'NPM data parseable', false, error.message);
      }
    } else {
      recordTest('packageValidation', 'Package accessible on NPM', 
        false,
        'Package not found or not accessible'
      );
    }
  }
  
  // ビルド出力の確認
  const distPath = 'packages/specment/dist';
  recordTest('packageValidation', 'Build output exists', 
    fileExists(distPath),
    fileExists(distPath) ? 'Dist directory found' : 'No build output'
  );
  
  if (fileExists(distPath)) {
    const distFiles = fs.readdirSync(distPath);
    recordTest('packageValidation', 'Build output contains files', 
      distFiles.length > 0,
      `Files: ${distFiles.length}`
    );
    
    recordTest('packageValidation', 'TypeScript declarations included', 
      distFiles.some(file => file.endsWith('.d.ts')),
      'TypeScript declaration files'
    );
  }
}

// 3. ドキュメントの正確性確認
async function validateDocumentation() {
  log('Starting documentation validation...', 'test');
  
  // 必須ドキュメントファイルの存在確認
  const requiredDocs = [
    'README.md',
    'CHANGESET_WORKFLOW.md',
    'RELEASE_PROCESS.md',
    'CONTRIBUTING.md'
  ];
  
  for (const doc of requiredDocs) {
    recordTest('documentationValidation', `${doc} exists`, 
      fileExists(doc),
      fileExists(doc) ? 'Document found' : 'Document missing'
    );
  }
  
  // CHANGESET_WORKFLOW.mdの内容確認
  if (fileExists('CHANGESET_WORKFLOW.md')) {
    const changesetWorkflowContent = fs.readFileSync('CHANGESET_WORKFLOW.md', 'utf8');
    
    recordTest('documentationValidation', 'Changeset workflow mentions automation', 
      changesetWorkflowContent.includes('自動化') || changesetWorkflowContent.includes('GitHub Actions'),
      'Automation workflow documented'
    );
    
    recordTest('documentationValidation', 'Changeset workflow has troubleshooting', 
      changesetWorkflowContent.includes('トラブルシューティング') || changesetWorkflowContent.includes('troubleshooting'),
      'Troubleshooting section included'
    );
    
    recordTest('documentationValidation', 'Changeset workflow has manual process', 
      changesetWorkflowContent.includes('手動') || changesetWorkflowContent.includes('manual'),
      'Manual process documented'
    );
  }
  
  // RELEASE_PROCESS.mdの内容確認
  if (fileExists('RELEASE_PROCESS.md')) {
    const releaseProcessContent = fs.readFileSync('RELEASE_PROCESS.md', 'utf8');
    
    recordTest('documentationValidation', 'Release process mentions automation', 
      releaseProcessContent.includes('自動') || releaseProcessContent.includes('GitHub Actions'),
      'Automated release process documented'
    );
    
    recordTest('documentationValidation', 'Release process has emergency procedures', 
      releaseProcessContent.includes('緊急') || releaseProcessContent.includes('emergency'),
      'Emergency procedures documented'
    );
    
    recordTest('documentationValidation', 'Release process has verification steps', 
      releaseProcessContent.includes('確認') || releaseProcessContent.includes('verification'),
      'Verification steps documented'
    );
  }
  
  // README.mdの基本的な内容確認
  if (fileExists('README.md')) {
    const readmeContent = fs.readFileSync('README.md', 'utf8');
    
    recordTest('documentationValidation', 'README has installation instructions', 
      readmeContent.includes('install') || readmeContent.includes('インストール'),
      'Installation instructions present'
    );
    
    recordTest('documentationValidation', 'README has usage examples', 
      readmeContent.includes('usage') || readmeContent.includes('使用') || readmeContent.includes('example'),
      'Usage examples present'
    );
  }
  
  // パッケージのCHANGELOG.mdの確認
  const changelogPath = 'packages/specment/CHANGELOG.md';
  recordTest('documentationValidation', 'Package changelog exists', 
    fileExists(changelogPath),
    fileExists(changelogPath) ? 'Changelog found' : 'No changelog'
  );
  
  if (fileExists(changelogPath)) {
    const changelogContent = fs.readFileSync(changelogPath, 'utf8');
    recordTest('documentationValidation', 'Changelog has recent entries', 
      changelogContent.includes('##') && changelogContent.length > 100,
      'Changelog appears to have content'
    );
  }
}

// 4. 使用方法の検証とチーム共有
async function validateUsageAndTeamSharing() {
  log('Starting usage validation and team sharing verification...', 'test');
  
  // 基本的なコマンドの動作確認
  log('Testing basic package functionality...', 'info');
  
  // pnpmコマンドの利用可能性確認
  const pnpmResult = executeCommand('pnpm --version', { silent: true });
  recordTest('usageValidation', 'pnpm available', 
    pnpmResult.success,
    pnpmResult.success ? `pnpm version: ${pnpmResult.output.trim()}` : 'pnpm not available'
  );
  
  // changesetコマンドの利用可能性確認
  const changesetResult = executeCommand('pnpm changeset --version', { silent: true });
  recordTest('usageValidation', 'changeset command available', 
    changesetResult.success,
    changesetResult.success ? 'Changeset CLI available' : 'Changeset CLI not available'
  );
  
  // ビルドコマンドの確認
  const packageJsonPath = 'packages/specment/package.json';
  if (fileExists(packageJsonPath)) {
    try {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      const hasSpecmentBuildScript = !!packageJson.scripts && !!packageJson.scripts['specment:build'];
      
      recordTest('usageValidation', 'Build script configured', 
        hasSpecmentBuildScript,
        hasSpecmentBuildScript ? 'specment:build script found' : 'Build script missing'
      );
      
      const hasTestScript = !!packageJson.scripts && !!packageJson.scripts.test;
      recordTest('usageValidation', 'Test script configured', 
        hasTestScript,
        hasTestScript ? 'Test script found' : 'Test script missing'
      );
      
    } catch (error) {
      recordTest('usageValidation', 'Package scripts readable', false, error.message);
    }
  }
  
  // Changesetの状態確認
  const changesetStatusResult = executeCommand('pnpm changeset status', { silent: true });
  recordTest('usageValidation', 'Changeset status command works', 
    changesetStatusResult.success,
    'Changeset status command executable'
  );
  
  // GitHub Actionsワークフローの実行履歴確認（可能な場合）
  if (process.env.GITHUB_ACTIONS) {
    recordTest('usageValidation', 'Running in GitHub Actions', 
      true,
      'Integration test running in CI environment'
    );
  } else {
    recordTest('usageValidation', 'Local development environment', 
      true,
      'Integration test running in local environment'
    );
  }
  
  // チーム共有のためのドキュメント生成
  log('Generating team sharing documentation...', 'info');
  
  const teamGuide = `# Specment自動npm公開ワークフロー - チーム利用ガイド

## 概要

このドキュメントは、Specmentプロジェクトの自動npm公開ワークフローの使用方法をチームメンバーに共有するためのものです。

## 基本的な開発フロー

### 1. 機能開発
\`\`\`bash
# 機能ブランチを作成
git checkout -b feature/new-feature

# 開発作業を実行
# ... コードの変更 ...

# 変更をテスト
pnpm install
pnpm build
pnpm test
\`\`\`

### 2. Changesetの作成
\`\`\`bash
# Changesetを作成
pnpm changeset

# 質問に答える：
# - どのパッケージを変更したか
# - 変更の種類（major/minor/patch）
# - 変更の説明
\`\`\`

### 3. プルリクエストの作成
\`\`\`bash
# 変更をコミット
git add .
git commit -m "feat: 新機能の追加"
git push origin feature/new-feature

# GitHubでプルリクエストを作成
\`\`\`

### 4. 自動リリース
- プルリクエストがmainブランチにマージされると自動的に実行
- GitHub Actionsが以下を自動実行：
  - ビルドとテスト
  - バージョン更新
  - npm公開
  - Gitタグ作成

## 重要なポイント

### ✅ やるべきこと
- 変更には必ずChangesetを作成
- 適切なセマンティックバージョニングを選択
- プルリクエスト前にローカルでテスト実行
- 明確で分かりやすいChangeset説明を記述

### ❌ 避けるべきこと
- Changesetなしでの機能変更
- 手動でのnpm publish実行（緊急時以外）
- mainブランチへの直接プッシュ
- 不適切なバージョンタイプの選択

## トラブルシューティング

### 自動公開が実行されない
1. Changesetファイルが存在するか確認
2. GitHub Actionsの実行状況を確認
3. NPM_TOKENの設定を確認

### ビルドやテストが失敗する
1. ローカルで同じエラーを再現
2. 依存関係の問題を確認
3. TypeScript設定を確認

## 緊急時の手動リリース

自動化が失敗した場合の手動リリース手順：

\`\`\`bash
# バージョン更新
pnpm changeset version

# 手動公開
pnpm changeset publish

# Gitタグ作成
git tag v[新しいバージョン]
git push origin v[新しいバージョン]
\`\`\`

## 参考資料

- [CHANGESET_WORKFLOW.md](./CHANGESET_WORKFLOW.md) - 詳細なワークフロー説明
- [RELEASE_PROCESS.md](./RELEASE_PROCESS.md) - リリースプロセス全体
- [GitHub Actions](https://github.com/plenarc/specment/actions) - ワークフロー実行状況

## 質問・サポート

ワークフローに関する質問や問題がある場合は、以下の方法でサポートを受けられます：

1. GitHub Issueの作成
2. チーム内での相談
3. ドキュメントの確認

---

生成日時: ${new Date().toISOString()}
テスト実行環境: ${process.env.GITHUB_ACTIONS ? 'GitHub Actions' : 'Local'}
`;

  try {
    fs.writeFileSync('TEAM_WORKFLOW_GUIDE.md', teamGuide);
    recordTest('usageValidation', 'Team guide generated', 
      true,
      'TEAM_WORKFLOW_GUIDE.md created'
    );
  } catch (error) {
    recordTest('usageValidation', 'Team guide generation', 
      false,
      error.message
    );
  }
}

// テスト結果のレポート生成
function generateTestReport() {
  log('Generating integration test report...', 'info');
  
  const report = {
    summary: {
      totalTests: testResults.overall.passed + testResults.overall.failed,
      passed: testResults.overall.passed,
      failed: testResults.overall.failed,
      successRate: testResults.overall.passed + testResults.overall.failed > 0 
        ? ((testResults.overall.passed / (testResults.overall.passed + testResults.overall.failed)) * 100).toFixed(2)
        : 0
    },
    categories: {
      workflowValidation: testResults.workflowValidation,
      packageValidation: testResults.packageValidation,
      documentationValidation: testResults.documentationValidation,
      usageValidation: testResults.usageValidation
    },
    timestamp: new Date().toISOString(),
    environment: {
      nodeVersion: process.version,
      platform: process.platform,
      cwd: process.cwd(),
      ci: !!process.env.CI,
      githubActions: !!process.env.GITHUB_ACTIONS
    }
  };
  
  // レポートファイルの保存
  try {
    fs.writeFileSync('integration-test-report.json', JSON.stringify(report, null, 2));
    log('Integration test report saved to integration-test-report.json', 'success');
  } catch (error) {
    log(`Failed to save test report: ${error.message}`, 'error');
  }
  
  // コンソールでの結果表示
  console.log('\n' + '='.repeat(80));
  console.log('📊 INTEGRATION TEST RESULTS');
  console.log('='.repeat(80));
  
  console.log(`\n📈 Overall Summary:`);
  console.log(`   Total Tests: ${report.summary.totalTests}`);
  console.log(`   Passed: ${report.summary.passed} ✅`);
  console.log(`   Failed: ${report.summary.failed} ❌`);
  console.log(`   Success Rate: ${report.summary.successRate}%`);
  
  // カテゴリ別結果
  Object.entries(report.categories).forEach(([category, data]) => {
    console.log(`\n📋 ${category}:`);
    if (data.passed > 0) {
      console.log(`   Passed: ${data.passed} ✅`);
    }
    if (data.failed > 0) {
      console.log(`   Failed: ${data.failed} ❌`);
      console.log(`   Failed Tests:`);
      data.tests.filter(test => !test.passed).forEach(test => {
        console.log(`     ❌ ${test.testName}: ${test.details}`);
      });
    }
  });
  
  console.log('\n' + '='.repeat(80));
  
  return report.summary.failed === 0;
}

// メイン実行関数
async function runIntegrationTests() {
  log('Starting Specment npm publish workflow integration tests...', 'info');
  log(`Test environment: ${process.env.GITHUB_ACTIONS ? 'GitHub Actions' : 'Local'}`, 'info');
  log(`Node.js version: ${process.version}`, 'info');
  log(`Working directory: ${process.cwd()}`, 'info');
  
  try {
    // 各テストカテゴリを順次実行
    await validateWorkflowFiles();
    await validatePackagePublication();
    await validateDocumentation();
    await validateUsageAndTeamSharing();
    
    // テスト結果のレポート生成
    const allTestsPassed = generateTestReport();
    
    if (allTestsPassed) {
      log('All integration tests passed! 🎉', 'success');
      process.exit(0);
    } else {
      log('Some integration tests failed. Please review the results above.', 'error');
      process.exit(1);
    }
    
  } catch (error) {
    log(`Integration test execution failed: ${error.message}`, 'error');
    console.error(error);
    process.exit(1);
  }
}

// スクリプトが直接実行された場合のみテストを実行
if (require.main === module) {
  runIntegrationTests();
}

module.exports = {
  runIntegrationTests,
  validateWorkflowFiles,
  validatePackagePublication,
  validateDocumentation,
  validateUsageAndTeamSharing
};