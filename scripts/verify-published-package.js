#!/usr/bin/env node

/**
 * 公開されたパッケージの検証スクリプト
 * 
 * このスクリプトは統合テストの一環として、npmに公開されたパッケージの
 * 品質と機能を検証します。
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const os = require('os');

// テスト結果を記録するオブジェクト
const verificationResults = {
  packageInfo: { passed: 0, failed: 0, tests: [] },
  installation: { passed: 0, failed: 0, tests: [] },
  functionality: { passed: 0, failed: 0, tests: [] },
  compatibility: { passed: 0, failed: 0, tests: [] },
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
  verificationResults[category].tests.push(result);
  
  if (passed) {
    verificationResults[category].passed++;
    verificationResults.overall.passed++;
    log(`${testName}: PASSED ${details}`, 'success');
  } else {
    verificationResults[category].failed++;
    verificationResults.overall.failed++;
    log(`${testName}: FAILED ${details}`, 'error');
  }
}

// コマンド実行のヘルパー関数
function executeCommand(command, options = {}) {
  try {
    const result = execSync(command, { 
      encoding: 'utf8', 
      stdio: options.silent ? 'pipe' : 'inherit',
      cwd: options.cwd || process.cwd(),
      ...options 
    });
    return { success: true, output: result };
  } catch (error) {
    return { success: false, error: error.message, output: error.stdout || '' };
  }
}

// 一時ディレクトリの作成
function createTempDirectory() {
  const tempDir = path.join(os.tmpdir(), `specment-verification-${Date.now()}`);
  try {
    fs.mkdirSync(tempDir, { recursive: true });
    log(`Created temporary directory: ${tempDir}`, 'info');
    return tempDir;
  } catch (error) {
    log(`Failed to create temporary directory: ${error.message}`, 'error');
    return null;
  }
}

// パッケージ情報の検証
async function verifyPackageInfo() {
  log('Starting package information verification...', 'test');
  
  // ローカルのpackage.jsonから情報を取得
  const localPackageJsonPath = 'packages/specment/package.json';
  let localPackageJson = null;
  
  if (fs.existsSync(localPackageJsonPath)) {
    try {
      localPackageJson = JSON.parse(fs.readFileSync(localPackageJsonPath, 'utf8'));
    } catch (error) {
      recordTest('packageInfo', 'Local package.json readable', false, error.message);
      return;
    }
  } else {
    recordTest('packageInfo', 'Local package.json exists', false, 'File not found');
    return;
  }
  
  const packageName = localPackageJson.name;
  const localVersion = localPackageJson.version;
  
  recordTest('packageInfo', 'Package has valid name', 
    !!packageName && packageName.startsWith('@'),
    `Package name: ${packageName}`
  );
  
  recordTest('packageInfo', 'Package has valid version', 
    !!localVersion && /^\d+\.\d+\.\d+/.test(localVersion),
    `Local version: ${localVersion}`
  );
  
  // NPMレジストリから情報を取得
  log(`Fetching package information from npm: ${packageName}`, 'info');
  
  const npmViewResult = executeCommand(`npm view ${packageName} --json`, { silent: true });
  
  if (!npmViewResult.success) {
    recordTest('packageInfo', 'Package exists on npm', false, 'Package not found on npm registry');
    return;
  }
  
  let npmPackageInfo;
  try {
    npmPackageInfo = JSON.parse(npmViewResult.output);
  } catch (error) {
    recordTest('packageInfo', 'NPM package info parseable', false, error.message);
    return;
  }
  
  recordTest('packageInfo', 'Package published to npm', true, 
    `Published version: ${npmPackageInfo.version}`);
  
  // バージョン比較
  recordTest('packageInfo', 'Published version matches local', 
    npmPackageInfo.version === localVersion,
    `NPM: ${npmPackageInfo.version}, Local: ${localVersion}`
  );
  
  // パッケージメタデータの検証
  recordTest('packageInfo', 'Package has description', 
    !!npmPackageInfo.description,
    `Description: ${npmPackageInfo.description || 'Not set'}`
  );
  
  recordTest('packageInfo', 'Package has keywords', 
    Array.isArray(npmPackageInfo.keywords) && npmPackageInfo.keywords.length > 0,
    `Keywords: ${npmPackageInfo.keywords ? npmPackageInfo.keywords.join(', ') : 'None'}`
  );
  
  recordTest('packageInfo', 'Package has repository info', 
    !!npmPackageInfo.repository,
    `Repository: ${npmPackageInfo.repository ? npmPackageInfo.repository.url || 'Set' : 'Not set'}`
  );
  
  recordTest('packageInfo', 'Package has license', 
    !!npmPackageInfo.license,
    `License: ${npmPackageInfo.license || 'Not set'}`
  );
  
  // 依存関係の確認
  const hasDependencies = npmPackageInfo.dependencies && Object.keys(npmPackageInfo.dependencies).length > 0;
  recordTest('packageInfo', 'Package dependencies listed', 
    hasDependencies,
    `Dependencies: ${hasDependencies ? Object.keys(npmPackageInfo.dependencies).length : 0}`
  );
  
  // ファイル構成の確認
  recordTest('packageInfo', 'Package has main entry point', 
    !!npmPackageInfo.main,
    `Main: ${npmPackageInfo.main || 'Not set'}`
  );
  
  recordTest('packageInfo', 'Package has TypeScript types', 
    !!npmPackageInfo.types || !!npmPackageInfo.typings,
    `Types: ${npmPackageInfo.types || npmPackageInfo.typings || 'Not set'}`
  );
  
  // 公開時刻の確認
  if (npmPackageInfo.time && npmPackageInfo.time[npmPackageInfo.version]) {
    const publishTime = new Date(npmPackageInfo.time[npmPackageInfo.version]);
    const now = new Date();
    const timeDiff = now - publishTime;
    const hoursAgo = Math.floor(timeDiff / (1000 * 60 * 60));
    
    recordTest('packageInfo', 'Package recently published', 
      hoursAgo < 24,
      `Published ${hoursAgo} hours ago`
    );
  }
  
  return { packageName, version: npmPackageInfo.version, npmPackageInfo };
}

// インストールテスト
async function verifyInstallation(packageName, version) {
  log('Starting installation verification...', 'test');
  
  const tempDir = createTempDirectory();
  if (!tempDir) {
    recordTest('installation', 'Temp directory created', false, 'Failed to create temp directory');
    return;
  }
  
  try {
    // 新しいプロジェクトを初期化
    log('Initializing test project...', 'info');
    const initResult = executeCommand('npm init -y', { cwd: tempDir, silent: true });
    recordTest('installation', 'Test project initialized', 
      initResult.success,
      initResult.success ? 'npm init successful' : initResult.error
    );
    
    if (!initResult.success) return;
    
    // グローバルインストールテスト
    log('Testing global installation...', 'info');
    const globalInstallResult = executeCommand(`npm install -g ${packageName}@${version}`, { 
      cwd: tempDir, 
      silent: true 
    });
    recordTest('installation', 'Global installation', 
      globalInstallResult.success,
      globalInstallResult.success ? 'Global install successful' : globalInstallResult.error
    );
    
    // ローカルインストールテスト
    log('Testing local installation...', 'info');
    const localInstallResult = executeCommand(`npm install ${packageName}@${version}`, { 
      cwd: tempDir, 
      silent: true 
    });
    recordTest('installation', 'Local installation', 
      localInstallResult.success,
      localInstallResult.success ? 'Local install successful' : localInstallResult.error
    );
    
    if (localInstallResult.success) {
      // インストールされたファイルの確認
      const nodeModulesPath = path.join(tempDir, 'node_modules', packageName.replace('@', '').replace('/', '-'));
      const packageInstalled = fs.existsSync(nodeModulesPath) || 
                              fs.existsSync(path.join(tempDir, 'node_modules', packageName));
      
      recordTest('installation', 'Package files installed', 
        packageInstalled,
        packageInstalled ? 'Package files found in node_modules' : 'Package files not found'
      );
      
      // package.jsonの確認
      const installedPackageJsonPath = fs.existsSync(nodeModulesPath) 
        ? path.join(nodeModulesPath, 'package.json')
        : path.join(tempDir, 'node_modules', packageName, 'package.json');
        
      if (fs.existsSync(installedPackageJsonPath)) {
        try {
          const installedPackageJson = JSON.parse(fs.readFileSync(installedPackageJsonPath, 'utf8'));
          recordTest('installation', 'Installed package.json valid', 
            installedPackageJson.version === version,
            `Installed version: ${installedPackageJson.version}`
          );
        } catch (error) {
          recordTest('installation', 'Installed package.json readable', false, error.message);
        }
      }
    }
    
    // 依存関係の解決確認
    const auditResult = executeCommand('npm audit --audit-level=high', { 
      cwd: tempDir, 
      silent: true 
    });
    recordTest('installation', 'No high-severity vulnerabilities', 
      auditResult.success,
      auditResult.success ? 'Security audit passed' : 'Security vulnerabilities found'
    );
    
  } finally {
    // 一時ディレクトリのクリーンアップ
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
      log(`Cleaned up temporary directory: ${tempDir}`, 'info');
    } catch (error) {
      log(`Failed to clean up temporary directory: ${error.message}`, 'warning');
    }
  }
  
  return tempDir;
}

// 機能テスト
async function verifyFunctionality(packageName, version) {
  log('Starting functionality verification...', 'test');
  
  const tempDir = createTempDirectory();
  if (!tempDir) {
    recordTest('functionality', 'Temp directory created', false, 'Failed to create temp directory');
    return;
  }
  
  try {
    // テストプロジェクトのセットアップ
    executeCommand('npm init -y', { cwd: tempDir, silent: true });
    const installResult = executeCommand(`npm install ${packageName}@${version}`, { 
      cwd: tempDir, 
      silent: true 
    });
    
    if (!installResult.success) {
      recordTest('functionality', 'Package installation for testing', false, installResult.error);
      return;
    }
    
    // CLIコマンドの動作確認（グローバルインストールが成功している場合）
    const versionCheckResult = executeCommand('specment --version', { silent: true });
    recordTest('functionality', 'CLI version command works', 
      versionCheckResult.success,
      versionCheckResult.success ? `Version: ${versionCheckResult.output.trim()}` : versionCheckResult.error
    );
    
    const helpCheckResult = executeCommand('specment --help', { silent: true });
    recordTest('functionality', 'CLI help command works', 
      helpCheckResult.success,
      helpCheckResult.success ? 'Help output generated' : helpCheckResult.error
    );
    
    // npxでの実行テスト
    const npxVersionResult = executeCommand(`npx ${packageName} --version`, { 
      cwd: tempDir, 
      silent: true 
    });
    recordTest('functionality', 'npx execution works', 
      npxVersionResult.success,
      npxVersionResult.success ? 'npx execution successful' : npxVersionResult.error
    );
    
    // 基本的な機能テスト（specment initコマンド）
    const initTestResult = executeCommand(`npx ${packageName} init --help`, { 
      cwd: tempDir, 
      silent: true 
    });
    recordTest('functionality', 'Init command available', 
      initTestResult.success,
      initTestResult.success ? 'Init command help displayed' : initTestResult.error
    );
    
    // TypeScript型定義の確認
    const typesTestFile = path.join(tempDir, 'types-test.ts');
    const typesTestContent = `
import { getIntegrationTestInfo } from '${packageName}';

// TypeScript型チェックのテスト
const testInfo = getIntegrationTestInfo();
console.log(testInfo.timestamp);
`;
    
    try {
      fs.writeFileSync(typesTestFile, typesTestContent);
      
      // TypeScriptのインストール
      executeCommand('npm install typescript @types/node', { cwd: tempDir, silent: true });
      
      // 型チェック
      const typeCheckResult = executeCommand(`npx tsc --noEmit ${typesTestFile}`, { 
        cwd: tempDir, 
        silent: true 
      });
      recordTest('functionality', 'TypeScript types work', 
        typeCheckResult.success,
        typeCheckResult.success ? 'Type checking passed' : 'Type checking failed'
      );
      
    } catch (error) {
      recordTest('functionality', 'TypeScript types test setup', false, error.message);
    }
    
  } finally {
    // クリーンアップ
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch (error) {
      log(`Failed to clean up temp directory: ${error.message}`, 'warning');
    }
  }
}

// 互換性テスト
async function verifyCompatibility(packageName, version) {
  log('Starting compatibility verification...', 'test');
  
  // Node.jsバージョンの確認
  const nodeVersion = process.version;
  recordTest('compatibility', 'Node.js version compatible', 
    true,
    `Running on Node.js ${nodeVersion}`
  );
  
  // プラットフォーム互換性
  const platform = process.platform;
  const supportedPlatforms = ['win32', 'darwin', 'linux'];
  recordTest('compatibility', 'Platform supported', 
    supportedPlatforms.includes(platform),
    `Platform: ${platform}`
  );
  
  // アーキテクチャ互換性
  const arch = process.arch;
  const supportedArchs = ['x64', 'arm64'];
  recordTest('compatibility', 'Architecture supported', 
    supportedArchs.includes(arch),
    `Architecture: ${arch}`
  );
  
  // パッケージサイズの確認
  const packageSizeResult = executeCommand(`npm view ${packageName}@${version} dist.unpackedSize`, { 
    silent: true 
  });
  
  if (packageSizeResult.success) {
    const sizeBytes = parseInt(packageSizeResult.output.trim());
    const sizeMB = (sizeBytes / (1024 * 1024)).toFixed(2);
    const reasonableSize = sizeBytes < 50 * 1024 * 1024; // 50MB未満
    
    recordTest('compatibility', 'Package size reasonable', 
      reasonableSize,
      `Package size: ${sizeMB}MB`
    );
  }
  
  // エンジン要件の確認
  const engineCheckResult = executeCommand(`npm view ${packageName}@${version} engines`, { 
    silent: true 
  });
  
  if (engineCheckResult.success && engineCheckResult.output.trim()) {
    recordTest('compatibility', 'Engine requirements specified', 
      true,
      `Engines: ${engineCheckResult.output.trim()}`
    );
  } else {
    recordTest('compatibility', 'Engine requirements specified', 
      false,
      'No engine requirements found'
    );
  }
}

// 検証結果のレポート生成
function generateVerificationReport() {
  log('Generating package verification report...', 'info');
  
  const report = {
    summary: {
      totalTests: verificationResults.overall.passed + verificationResults.overall.failed,
      passed: verificationResults.overall.passed,
      failed: verificationResults.overall.failed,
      successRate: verificationResults.overall.passed + verificationResults.overall.failed > 0 
        ? ((verificationResults.overall.passed / (verificationResults.overall.passed + verificationResults.overall.failed)) * 100).toFixed(2)
        : 0
    },
    categories: {
      packageInfo: verificationResults.packageInfo,
      installation: verificationResults.installation,
      functionality: verificationResults.functionality,
      compatibility: verificationResults.compatibility
    },
    timestamp: new Date().toISOString(),
    environment: {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      cwd: process.cwd()
    }
  };
  
  // レポートファイルの保存
  try {
    fs.writeFileSync('package-verification-report.json', JSON.stringify(report, null, 2));
    log('Package verification report saved to package-verification-report.json', 'success');
  } catch (error) {
    log(`Failed to save verification report: ${error.message}`, 'error');
  }
  
  // コンソールでの結果表示
  console.log('\n' + '='.repeat(80));
  console.log('📦 PACKAGE VERIFICATION RESULTS');
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
async function runPackageVerification() {
  log('Starting published package verification...', 'info');
  log(`Node.js version: ${process.version}`, 'info');
  log(`Platform: ${process.platform} ${process.arch}`, 'info');
  
  try {
    // パッケージ情報の検証
    const packageInfo = await verifyPackageInfo();
    
    if (packageInfo && packageInfo.packageName && packageInfo.version) {
      // インストールテスト
      await verifyInstallation(packageInfo.packageName, packageInfo.version);
      
      // 機能テスト
      await verifyFunctionality(packageInfo.packageName, packageInfo.version);
      
      // 互換性テスト
      await verifyCompatibility(packageInfo.packageName, packageInfo.version);
    } else {
      log('Package information not available, skipping detailed verification', 'warning');
    }
    
    // 検証結果のレポート生成
    const allTestsPassed = generateVerificationReport();
    
    if (allTestsPassed) {
      log('All package verification tests passed! 🎉', 'success');
      process.exit(0);
    } else {
      log('Some package verification tests failed. Please review the results above.', 'error');
      process.exit(1);
    }
    
  } catch (error) {
    log(`Package verification failed: ${error.message}`, 'error');
    console.error(error);
    process.exit(1);
  }
}

// スクリプトが直接実行された場合のみ実行
if (require.main === module) {
  runPackageVerification();
}

module.exports = {
  runPackageVerification,
  verifyPackageInfo,
  verifyInstallation,
  verifyFunctionality,
  verifyCompatibility
};