# セキュリティガイドライン

## 概要

このドキュメントでは、npm自動公開ワークフローのセキュリティ設定と運用ガイドラインについて説明します。

## NPM_TOKEN設定

### 必要な権限

NPM_TOKENは以下の権限を持つ必要があります：

- **Automation**: 自動化されたワークフローでの使用
- **Publish**: パッケージの公開権限
- **Read**: パッケージ情報の読み取り権限

### トークンの作成手順

1. [npm公式サイト](https://www.npmjs.com/)にログイン
2. アカウント設定 > Access Tokens に移動
3. "Generate New Token" をクリック
4. Token Type: "Automation" を選択
5. 生成されたトークンをコピー（一度しか表示されません）

### GitHub Secretsへの設定

1. GitHubリポジトリの Settings > Secrets and variables > Actions に移動
2. "New repository secret" をクリック
3. Name: `NPM_TOKEN`
4. Value: 生成したnpmトークンを貼り付け
5. "Add secret" をクリック

## セキュリティベストプラクティス

### 1. 最小権限の原則

- ワークフローには必要最小限の権限のみを付与
- NPM_TOKENは公開権限のみに制限
- GITHUB_TOKENは必要な操作のみに制限

### 2. 機密情報の保護

- トークンはGitHub Secretsに保存
- ログ出力で機密情報を隠蔽
- デバッグ情報の出力を制限

### 3. サプライチェーンセキュリティ

- npm provenanceを有効化
- パッケージの署名と検証
- 依存関係の定期的な監査

### 4. 監査とモニタリング

- ワークフロー実行ログの定期確認
- 異常なアクセスパターンの監視
- トークンの定期的な更新

## セキュリティ検証

### 自動検証

セキュリティ設定の検証スクリプトを実行：

```bash
node scripts/security-check.js
```

### 手動検証チェックリスト

- [ ] NPM_TOKENが適切に設定されている
- [ ] ワークフロー権限が最小限に制限されている
- [ ] ログ出力で機密情報が隠蔽されている
- [ ] npm provenanceが有効化されている
- [ ] 同時実行制御が設定されている

## インシデント対応

### トークン漏洩時の対応

1. **即座にトークンを無効化**
   - npm公式サイトでトークンを削除
   - GitHub Secretsから古いトークンを削除

2. **新しいトークンの生成**
   - 新しいAutomationトークンを生成
   - GitHub Secretsに新しいトークンを設定

3. **影響範囲の調査**
   - 不正な公開がないか確認
   - パッケージの整合性を検証

### 不正アクセスの検出

1. **異常なワークフロー実行の確認**
   - 予期しない時間での実行
   - 失敗率の異常な増加

2. **パッケージの整合性確認**
   - 公開されたパッケージの内容確認
   - バージョン履歴の検証

## 定期メンテナンス

### 月次タスク

- [ ] NPM_TOKENの有効期限確認
- [ ] ワークフロー実行ログの監査
- [ ] 依存関係の脆弱性スキャン

### 四半期タスク

- [ ] NPM_TOKENの更新
- [ ] セキュリティ設定の見直し
- [ ] インシデント対応手順の確認

## 参考資料

- [npm Token Management](https://docs.npmjs.com/creating-and-viewing-access-tokens)
- [GitHub Actions Security](https://docs.github.com/en/actions/security-guides)
- [npm Provenance](https://docs.npmjs.com/generating-provenance-statements)

## 連絡先

セキュリティに関する問題や質問がある場合は、プロジェクトメンテナーまでご連絡ください。