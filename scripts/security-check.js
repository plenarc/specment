#!/usr/bin/env node

/**
 * セキュリティ設定検証スクリプト
 * GitHub Actionsワークフローのセキュリティ設定を検証します
 */

const fs = require('fs');
const path = require('path');

class SecurityChecker {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.passed = [];
  }

  /**
   * ワークフローファイルのセキュリティ設定を検証
   */
  async checkWorkflowSecurity() {
    console.log('🔐 GitHub Actionsワークフローのセキュリティ設定を検証中...\n');

    const workflowPath = '.github/workflows/npm-publish.yaml';
    
    if (!fs.existsSync(workflowPath)) {
      this.errors.push('ワークフローファイルが見つかりません: ' + workflowPath);
      return;
    }

    try {
      const workflowContent = fs.readFileSync(workflowPath, 'utf8');

      // 権限設定の確認
      this.checkPermissions(workflowContent);
      
      // シークレット使用の確認
      this.checkSecrets(workflowContent);
      
      // 環境変数の確認
      this.checkEnvironmentVariables(workflowContent);
      
      // ログ出力の確認
      this.checkLogSecurity(workflowContent);
      
      // 実行環境の確認
      this.checkRunnerSecurity(workflowContent);

    } catch (error) {
      this.errors.push(`ワークフローファイルの解析エラー: ${error.message}`);
    }
  }

  /**
   * 権限設定の確認
   */
  checkPermissions(workflowContent) {
    console.log('📋 権限設定の確認...');
    
    // permissions設定の存在確認
    if (!workflowContent.includes('permissions:')) {
      this.errors.push('permissions設定が定義されていません');
      return;
    }

    const requiredPermissions = {
      'contents: write': 'contents権限（write）',
      'id-token: write': 'id-token権限（write）',
      'actions: read': 'actions権限（read）',
      'checks: read': 'checks権限（read）'
    };

    for (const [permission, description] of Object.entries(requiredPermissions)) {
      if (workflowContent.includes(permission)) {
        this.passed.push(`✓ ${description}が設定されています`);
      } else {
        this.warnings.push(`${description}が設定されていません`);
      }
    }

    // 不要な権限の確認（permissions:セクション内のみ）
    const unnecessaryPermissions = ['pull-requests:', 'issues:', 'discussions:'];
    const permissionsSection = this.extractPermissionsSection(workflowContent);
    
    if (permissionsSection) {
      for (const permission of unnecessaryPermissions) {
        if (permissionsSection.includes(permission)) {
          this.warnings.push(`不要な権限が設定されています: ${permission.replace(':', '')}`);
        }
      }
    }
  }

  /**
   * permissions:セクションを抽出
   */
  extractPermissionsSection(workflowContent) {
    const permissionsMatch = workflowContent.match(/permissions:\s*\n((?:\s+\w+:\s*\w+\s*(?:#.*)?(?:\n|$))*)/);
    return permissionsMatch ? permissionsMatch[0] : null;
  }

  /**
   * シークレット使用の確認
   */
  checkSecrets(workflowContent) {
    console.log('🔑 シークレット使用の確認...');
    
    // NPM_TOKENの使用確認
    if (workflowContent.includes('secrets.NPM_TOKEN')) {
      this.passed.push('✓ NPM_TOKENが適切に参照されています');
    } else {
      this.errors.push('NPM_TOKENが参照されていません');
    }

    // GITHUB_TOKENの使用確認
    if (workflowContent.includes('secrets.GITHUB_TOKEN')) {
      this.passed.push('✓ GITHUB_TOKENが適切に参照されています');
    } else {
      this.warnings.push('GITHUB_TOKENが参照されていません');
    }

    // ハードコードされたトークンの確認
    const tokenPatterns = [
      /npm_[a-zA-Z0-9]{36}/g,
      /ghp_[a-zA-Z0-9]{36}/g,
      /github_pat_[a-zA-Z0-9_]{82}/g
    ];

    for (const pattern of tokenPatterns) {
      if (pattern.test(workflowContent)) {
        this.errors.push('ハードコードされたトークンが検出されました');
      }
    }
  }

  /**
   * 環境変数の確認
   */
  checkEnvironmentVariables(workflowContent) {
    console.log('🌍 環境変数設定の確認...');
    
    // 必要な環境変数の確認
    const requiredEnvVars = ['NPM_TOKEN', 'GITHUB_TOKEN'];
    for (const envVar of requiredEnvVars) {
      if (workflowContent.includes(`${envVar}:`)) {
        this.passed.push(`✓ ${envVar}環境変数が設定されています`);
      } else {
        this.warnings.push(`${envVar}環境変数が設定されていません`);
      }
    }

    // セキュリティコメントの確認
    if (workflowContent.includes('# セキュリティ:')) {
      this.passed.push('✓ セキュリティ関連のコメントが含まれています');
    } else {
      this.warnings.push('セキュリティ関連のコメントが不足しています');
    }
  }

  /**
   * ログ出力のセキュリティ確認
   */
  checkLogSecurity(workflowContent) {
    console.log('📝 ログ出力のセキュリティ確認...');
    
    // 機密情報の隠蔽確認
    if (workflowContent.includes('VALUE HIDDEN FOR SECURITY')) {
      this.passed.push('✓ 機密情報の隠蔽が実装されています');
    } else {
      this.warnings.push('機密情報の隠蔽が不十分です');
    }

    // デバッグ出力の抑制確認
    if (workflowContent.includes('2>/dev/null')) {
      this.passed.push('✓ デバッグ出力の抑制が実装されています');
    } else {
      this.warnings.push('デバッグ出力の抑制が不十分です');
    }

    // npm provenanceの確認
    if (workflowContent.includes('NPM_CONFIG_PROVENANCE=true')) {
      this.passed.push('✓ npm provenanceが有効化されています');
    } else {
      this.warnings.push('npm provenanceが有効化されていません');
    }
  }

  /**
   * 実行環境のセキュリティ確認
   */
  checkRunnerSecurity(workflowContent) {
    console.log('🖥️ 実行環境のセキュリティ確認...');
    
    // 実行環境の確認
    if (workflowContent.includes('runs-on:')) {
      this.passed.push('✓ 実行環境が指定されています');
      
      // セキュアな実行環境の確認
      if (workflowContent.includes('ubuntu-latest') || workflowContent.includes('windows-latest')) {
        this.passed.push('✓ 推奨される実行環境を使用しています');
      }
    } else {
      this.errors.push('実行環境が指定されていません');
    }

    // 同時実行制御の確認
    if (workflowContent.includes('concurrency:')) {
      this.passed.push('✓ 同時実行制御が設定されています');
    } else {
      this.warnings.push('同時実行制御が設定されていません');
    }

    // シェル設定の確認
    if (workflowContent.includes('shell:')) {
      this.passed.push('✓ シェル設定が明示的に指定されています');
    } else {
      this.warnings.push('シェル設定が明示的に指定されていません');
    }
  }

  /**
   * 結果の表示
   */
  displayResults() {
    console.log('\n' + '='.repeat(60));
    console.log('🔐 セキュリティ検証結果');
    console.log('='.repeat(60));

    if (this.passed.length > 0) {
      console.log('\n✅ 合格項目:');
      this.passed.forEach(item => console.log(`  ${item}`));
    }

    if (this.warnings.length > 0) {
      console.log('\n⚠️ 警告項目:');
      this.warnings.forEach(item => console.log(`  ${item}`));
    }

    if (this.errors.length > 0) {
      console.log('\n❌ エラー項目:');
      this.errors.forEach(item => console.log(`  ${item}`));
    }

    console.log('\n' + '='.repeat(60));
    console.log(`合格: ${this.passed.length}, 警告: ${this.warnings.length}, エラー: ${this.errors.length}`);
    
    if (this.errors.length === 0) {
      console.log('🎉 セキュリティ検証に合格しました！');
      return true;
    } else {
      console.log('🚨 セキュリティ上の問題が検出されました。修正が必要です。');
      return false;
    }
  }

  /**
   * セキュリティ推奨事項の表示
   */
  displayRecommendations() {
    console.log('\n📋 セキュリティ推奨事項:');
    console.log('1. NPM_TOKENは定期的に更新してください');
    console.log('2. 最小権限の原則に従って権限を設定してください');
    console.log('3. ログ出力で機密情報が漏洩しないよう注意してください');
    console.log('4. npm provenanceを有効にしてサプライチェーンセキュリティを強化してください');
    console.log('5. ワークフローの実行ログを定期的に監査してください');
  }
}

// メイン実行
async function main() {
  const checker = new SecurityChecker();
  
  try {
    await checker.checkWorkflowSecurity();
    const success = checker.displayResults();
    checker.displayRecommendations();
    
    process.exit(success ? 0 : 1);
  } catch (error) {
    console.error('❌ セキュリティ検証中にエラーが発生しました:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = SecurityChecker;