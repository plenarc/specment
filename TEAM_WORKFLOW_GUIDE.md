# Specment自動npm公開ワークフロー - チーム利用ガイド

## 概要

このドキュメントは、Specmentプロジェクトの自動npm公開ワークフローの使用方法をチームメンバーに共有するためのものです。

## 基本的な開発フロー

### 1. 機能開発
```bash
# 機能ブランチを作成
git checkout -b feature/new-feature

# 開発作業を実行
# ... コードの変更 ...

# 変更をテスト
pnpm install
pnpm build
pnpm test
```

### 2. Changesetの作成
```bash
# Changesetを作成
pnpm changeset

# 質問に答える：
# - どのパッケージを変更したか
# - 変更の種類（major/minor/patch）
# - 変更の説明
```

### 3. プルリクエストの作成
```bash
# 変更をコミット
git add .
git commit -m "feat: 新機能の追加"
git push origin feature/new-feature

# GitHubでプルリクエストを作成
```

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

```bash
# バージョン更新
pnpm changeset version

# 手動公開
pnpm changeset publish

# Gitタグ作成
git tag v[新しいバージョン]
git push origin v[新しいバージョン]
```

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

生成日時: 2025-09-17T02:45:39.688Z
テスト実行環境: Local
