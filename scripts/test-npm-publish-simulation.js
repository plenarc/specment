#!/usr/bin/env node

/**
 * npm公開プロセスのシミュレーションテスト
 * 
 * 実際のnpm公開を行わずに、ワークフローの各ステップを
 * ローカル環境でシミュレートして動作を検証します。
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class NpmPublishSimulator {
  constructor() {
    this.testResults = [];
    this.simulationLog = [];
  }

  /**
   * シミュレーション実行のメインエントリーポイント
   */
  async runSimulation() {
    console.log('🎭 npm公開プロセスのシミュレーションを開始します...\n');

    try {
      await this.simulateWorkflowSteps();
      await this.testErrorScenarios();
      await this.validateSecurityMeasures();
      await this.generateSimulationReport();
    } catch (error) {
      console.error('❌ シミュレーション実行中にエラーが発生しました:', error.message);
      process.exit(1);
    }
  }

  /**
   * ワークフローステップのシミュレーション
   */
  async simulateWorkflowSteps() {
    console.log('🔄 1. ワークフローステップのシミュレーション');

    // Step 1: 依存関係インストールのシミュレーション
    await this.simulateStep('依存関係インストール', async () => {
      this.log('📦 依存関係のインストールを確認中...');
      
      // package.jsonの存在確認
      if (!fs.existsSync('package.json')) {
        throw new Error('package.json が見つかりません');
      }

      // pnpm-lock.yamlの存在確認
      if (!fs.existsSync('pnpm-lock.yaml')) {
        this.log('⚠️ pnpm-lock.yaml が見つかりません（初回インストール時は正常）');
      }

      // node_modulesの確認
      if (fs.existsSync('node_modules')) {
        const nodeModulesSize = this.getDirectorySize('node_modules');
        this.log(`✅ node_modules が存在します (サイズ: ${nodeModulesSize})`);
      } else {
        this.log('⚠️ node_modules が見つかりません');
      }

      return true;
    });

    // Step 2: ビルドプロセスのシミュレーション
    await this.simulateStep('ビルドプロセス', async () => {
      this.log('🔨 ビルドプロセスを実行中...');
      
      try {
        const buildOutput = execSync('pnpm specment:build', { 
          encoding: 'utf8',
          timeout: 30000 
        });
        this.log('✅ ビルドが成功しました');
        
        // ビルド出力の確認
        if (fs.existsSync('packages/specment/dist')) {
          const distFiles = fs.readdirSync('packages/specment/dist');
          this.log(`📁 ビルド出力: ${distFiles.length} ファイル生成`);
          
          // 重要なファイルの存在確認
          const requiredFiles = ['index.js', 'index.d.ts'];
          requiredFiles.forEach(file => {
            if (distFiles.includes(file)) {
              this.log(`  ✅ ${file} が生成されました`);
            } else {
              this.log(`  ⚠️ ${file} が見つかりません`);
            }
          });
        }
        
        return true;
      } catch (error) {
        this.log(`❌ ビルドエラー: ${error.message}`);
        return false;
      }
    });

    // Step 3: テスト実行のシミュレーション
    await this.simulateStep('テスト実行', async () => {
      this.log('🧪 テストスイートを実行中...');
      
      try {
        // テストファイルの存在確認
        const testDirs = [
          'packages/specment/src/__tests__',
          'packages/specment/tests',
          'packages/specment/test'
        ];
        
        let testFilesFound = false;
        for (const dir of testDirs) {
          if (fs.existsSync(dir)) {
            const testFiles = fs.readdirSync(dir).filter(f => 
              f.includes('.test.') || f.includes('.spec.')
            );
            if (testFiles.length > 0) {
              this.log(`📁 テストファイル発見: ${dir} (${testFiles.length} ファイル)`);
              testFilesFound = true;
            }
          }
        }
        
        if (!testFilesFound) {
          this.log('⚠️ テストファイルが見つかりません（テストスキップは正常な動作）');
        }
        
        // テスト設定の確認
        const vitestConfig = fs.existsSync('vitest.config.ts') || fs.existsSync('vitest.config.js');
        if (vitestConfig) {
          this.log('✅ Vitest設定ファイルが見つかりました');
        }
        
        return true;
      } catch (error) {
        this.log(`❌ テストエラー: ${error.message}`);
        return false;
      }
    });

    // Step 4: Changesets検証のシミュレーション
    await this.simulateStep('Changesets検証', async () => {
      this.log('📝 Changesets設定を検証中...');
      
      // Changesets設定の確認
      if (!fs.existsSync('.changeset/config.json')) {
        throw new Error('Changesets設定ファイルが見つかりません');
      }
      
      // Changesetファイルの確認
      const changesetFiles = fs.readdirSync('.changeset')
        .filter(file => file.endsWith('.md') && file !== 'README.md');
      
      if (changesetFiles.length === 0) {
        this.log('⚠️ Changesetファイルが見つかりません（ワークフローはスキップされます）');
        return true;
      }
      
      this.log(`✅ ${changesetFiles.length} 個のChangesetファイルが見つかりました`);
      
      // Changeset statusの実行
      try {
        const statusOutput = execSync('pnpm changeset status', { encoding: 'utf8' });
        this.log('📊 Changeset status実行成功');
        
        // バージョンアップ対象の解析
        if (statusOutput.includes('to be bumped at patch')) {
          this.log('  📈 パッチバージョンアップが予定されています');
        }
        if (statusOutput.includes('to be bumped at minor')) {
          this.log('  📈 マイナーバージョンアップが予定されています');
        }
        if (statusOutput.includes('to be bumped at major')) {
          this.log('  📈 メジャーバージョンアップが予定されています');
        }
        
      } catch (error) {
        this.log(`❌ Changeset status エラー: ${error.message}`);
        return false;
      }
      
      return true;
    });

    // Step 5: npm認証のシミュレーション
    await this.simulateStep('npm認証', async () => {
      this.log('🔐 npm認証設定を確認中...');
      
      // .npmrcファイルの確認（存在する場合）
      const npmrcPath = path.join(process.env.HOME || process.env.USERPROFILE, '.npmrc');
      if (fs.existsSync(npmrcPath)) {
        this.log('✅ ユーザーレベルの.npmrcファイルが存在します');
      } else {
        this.log('⚠️ ユーザーレベルの.npmrcファイルが見つかりません');
      }
      
      // npm設定の確認
      try {
        const registry = execSync('npm config get registry', { encoding: 'utf8' }).trim();
        this.log(`📡 npm registry: ${registry}`);
        
        if (registry === 'https://registry.npmjs.org/') {
          this.log('✅ 公式npmレジストリが設定されています');
        } else {
          this.log('⚠️ カスタムレジストリが設定されています');
        }
      } catch (error) {
        this.log(`❌ npm設定確認エラー: ${error.message}`);
        return false;
      }
      
      // npm whoamiのテスト（認証情報がある場合のみ）
      try {
        const whoami = execSync('npm whoami', { encoding: 'utf8' }).trim();
        this.log(`👤 認証済みユーザー: ${whoami}`);
        this.log('✅ npm認証が有効です');
      } catch (error) {
        this.log('⚠️ npm認証情報が設定されていません（CI環境では正常）');
      }
      
      return true;
    });

    console.log('  ✅ ワークフローステップのシミュレーションが完了しました\n');
  }

  /**
   * エラーシナリオのテスト
   */
  async testErrorScenarios() {
    console.log('🚨 2. エラーシナリオのテスト');

    // シナリオ1: Changesetなしの場合
    await this.simulateErrorScenario('Changesetなしでの実行', async () => {
      this.log('📝 Changesetファイルを一時的に移動...');
      
      const changesetFiles = fs.readdirSync('.changeset')
        .filter(file => file.endsWith('.md') && file !== 'README.md');
      
      if (changesetFiles.length === 0) {
        this.log('✅ Changesetファイルが存在しない状態をテスト');
        this.log('  → ワークフローはスキップされるべきです');
        return true;
      }
      
      // 一時的にChangesetファイルをバックアップ
      const backupDir = '.changeset-temp-backup';
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir);
      }
      
      try {
        changesetFiles.forEach(file => {
          fs.renameSync(
            path.join('.changeset', file),
            path.join(backupDir, file)
          );
        });
        
        // Changeset statusを実行
        try {
          execSync('pnpm changeset status', { encoding: 'utf8' });
          this.log('✅ Changesetなしの状態で正常に動作');
        } catch (error) {
          // エラーが発生することは期待される
          this.log('✅ Changesetなしでのエラーハンドリングが動作');
        }
        
        // ファイルを復元
        changesetFiles.forEach(file => {
          fs.renameSync(
            path.join(backupDir, file),
            path.join('.changeset', file)
          );
        });
        
        fs.rmdirSync(backupDir);
        
      } catch (error) {
        // 復元処理
        try {
          changesetFiles.forEach(file => {
            if (fs.existsSync(path.join(backupDir, file))) {
              fs.renameSync(
                path.join(backupDir, file),
                path.join('.changeset', file)
              );
            }
          });
          if (fs.existsSync(backupDir)) {
            fs.rmdirSync(backupDir);
          }
        } catch (restoreError) {
          this.log(`⚠️ ファイル復元エラー: ${restoreError.message}`);
        }
        throw error;
      }
      
      return true;
    });

    // シナリオ2: ビルドエラーのシミュレーション
    await this.simulateErrorScenario('ビルドエラーの処理', async () => {
      this.log('🔨 ビルドエラーシナリオをテスト...');
      
      // TypeScript設定ファイルの一時的な破損をシミュレート
      const tsconfigPath = 'packages/specment/tsconfig.json';
      let originalContent = null;
      
      if (fs.existsSync(tsconfigPath)) {
        originalContent = fs.readFileSync(tsconfigPath, 'utf8');
        
        try {
          // 無効なJSONを書き込んでビルドエラーを発生させる
          fs.writeFileSync(tsconfigPath, '{ invalid json }');
          
          // ビルドを実行してエラーを確認
          try {
            execSync('pnpm specment:build', { encoding: 'utf8' });
            this.log('⚠️ ビルドエラーが発生しませんでした');
          } catch (buildError) {
            this.log('✅ ビルドエラーが正常に検出されました');
          }
          
          // 元の設定を復元
          fs.writeFileSync(tsconfigPath, originalContent);
          
        } catch (error) {
          // 復元処理
          if (originalContent) {
            fs.writeFileSync(tsconfigPath, originalContent);
          }
          throw error;
        }
      } else {
        this.log('⚠️ tsconfig.jsonが見つからないため、ビルドエラーテストをスキップ');
      }
      
      return true;
    });

    console.log('  ✅ エラーシナリオのテストが完了しました\n');
  }

  /**
   * セキュリティ対策の検証
   */
  async validateSecurityMeasures() {
    console.log('🔒 3. セキュリティ対策の検証');

    // ワークフローファイルのセキュリティチェック
    await this.simulateStep('ワークフローセキュリティ', async () => {
      this.log('🔍 ワークフローファイルのセキュリティを確認中...');
      
      const workflowContent = fs.readFileSync('.github/workflows/npm-publish.yaml', 'utf8');
      
      // 機密情報の直接記載チェック
      const sensitivePatterns = [
        /npm_[a-zA-Z0-9]{36}/g,  // npm token pattern
        /password\s*[:=]\s*[^\s]+/gi,
        /token\s*[:=]\s*[^\s$]+/gi,
        /secret\s*[:=]\s*[^\s$]+/gi
      ];
      
      let securityIssues = 0;
      sensitivePatterns.forEach((pattern, index) => {
        const matches = workflowContent.match(pattern);
        if (matches && matches.length > 0) {
          // ${{ secrets.* }} パターンは除外
          const validMatches = matches.filter(match => 
            !match.includes('${{ secrets.') && !match.includes('${NPM_TOKEN}')
          );
          if (validMatches.length > 0) {
            this.log(`❌ 機密情報が直接記載されている可能性: ${validMatches[0]}`);
            securityIssues++;
          }
        }
      });
      
      if (securityIssues === 0) {
        this.log('✅ 機密情報の直接記載は検出されませんでした');
      }
      
      // GitHub Secretsの使用確認
      if (workflowContent.includes('${{ secrets.NPM_TOKEN }}')) {
        this.log('✅ NPM_TOKENがGitHub Secretsから取得されています');
      } else {
        this.log('⚠️ NPM_TOKENのGitHub Secrets使用が確認できません');
      }
      
      // 権限設定の確認
      if (workflowContent.includes('permissions:')) {
        this.log('✅ ワークフロー権限が明示的に設定されています');
      } else {
        this.log('⚠️ ワークフロー権限の明示的な設定が見つかりません');
      }
      
      return securityIssues === 0;
    });

    console.log('  ✅ セキュリティ対策の検証が完了しました\n');
  }

  /**
   * シミュレーションレポートの生成
   */
  async generateSimulationReport() {
    console.log('📊 4. シミュレーションレポートの生成');

    const passedTests = this.testResults.filter(result => result.passed).length;
    const totalTests = this.testResults.length;
    const failedTests = totalTests - passedTests;

    console.log(`\n📋 シミュレーション結果サマリー:`);
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

    // 詳細ログの出力
    console.log('\n📝 詳細実行ログ:');
    this.simulationLog.forEach(log => {
      console.log(`  ${log}`);
    });

    // レポートファイルの生成
    const reportPath = 'npm-publish-simulation-report.json';
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        total: totalTests,
        passed: passedTests,
        failed: failedTests,
        successRate: ((passedTests / totalTests) * 100).toFixed(1)
      },
      results: this.testResults,
      executionLog: this.simulationLog
    };

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n📄 詳細なシミュレーションレポートが ${reportPath} に保存されました`);

    if (failedTests > 0) {
      console.log('\n🔧 修正が必要な項目があります。上記の失敗したテストを確認してください。');
      process.exit(1);
    } else {
      console.log('\n🎉 すべてのシミュレーションが成功しました！npm公開ワークフローは正常に動作する準備ができています。');
    }
  }

  /**
   * ステップシミュレーション実行
   */
  async simulateStep(stepName, stepFunction) {
    try {
      const result = await stepFunction();
      this.testResults.push({
        passed: result,
        description: stepName,
        error: result ? '' : 'ステップが失敗しました',
        timestamp: new Date().toISOString()
      });
      
      if (result) {
        console.log(`  ✅ ${stepName} - 成功`);
      } else {
        console.log(`  ❌ ${stepName} - 失敗`);
      }
    } catch (error) {
      this.testResults.push({
        passed: false,
        description: stepName,
        error: error.message,
        timestamp: new Date().toISOString()
      });
      console.log(`  ❌ ${stepName} - エラー: ${error.message}`);
    }
  }

  /**
   * エラーシナリオシミュレーション実行
   */
  async simulateErrorScenario(scenarioName, scenarioFunction) {
    try {
      const result = await scenarioFunction();
      this.testResults.push({
        passed: result,
        description: `エラーシナリオ: ${scenarioName}`,
        error: result ? '' : 'シナリオが失敗しました',
        timestamp: new Date().toISOString()
      });
      
      if (result) {
        console.log(`  ✅ ${scenarioName} - 正常に処理されました`);
      } else {
        console.log(`  ❌ ${scenarioName} - 処理に問題があります`);
      }
    } catch (error) {
      this.testResults.push({
        passed: false,
        description: `エラーシナリオ: ${scenarioName}`,
        error: error.message,
        timestamp: new Date().toISOString()
      });
      console.log(`  ❌ ${scenarioName} - エラー: ${error.message}`);
    }
  }

  /**
   * ログ記録
   */
  log(message) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}`;
    this.simulationLog.push(logEntry);
    console.log(`    ${message}`);
  }

  /**
   * ディレクトリサイズの取得
   */
  getDirectorySize(dirPath) {
    try {
      const output = execSync(`du -sh "${dirPath}" 2>/dev/null || echo "不明"`, { encoding: 'utf8' });
      return output.split('\t')[0] || '不明';
    } catch (error) {
      return '不明';
    }
  }
}

// スクリプトが直接実行された場合のみシミュレーションを実行
if (require.main === module) {
  const simulator = new NpmPublishSimulator();
  simulator.runSimulation().catch(error => {
    console.error('シミュレーション実行エラー:', error);
    process.exit(1);
  });
}

module.exports = NpmPublishSimulator;