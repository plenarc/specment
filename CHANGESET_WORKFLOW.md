# Changeset Workflow for Specment Monorepo

## Overview

This monorepo uses Changesets to manage versioning and publishing of packages. The configuration is set up to handle the workspace structure with proper dependency management.

**重要**: このプロジェクトでは、メインブランチへのプルリクエストマージ時に自動的にnpmパッケージが公開される自動化されたワークフローが実装されています。手動でのnpm publishは通常不要です。

## Configuration

- **Access**: Public packages (can be published to npm)
- **Base Branch**: main
- **Ignored Packages**: @specment/docs (documentation app, not published)
- **Internal Dependencies**: Patch updates for workspace dependencies

## 自動化されたワークフロー vs 手動ワークフロー

| 項目 | 自動化されたワークフロー | 手動ワークフロー |
|------|------------------------|------------------|
| **トリガー** | メインブランチへのプルリクエストマージ | 開発者による手動実行 |
| **バージョン更新** | 自動実行（Changesets基準） | `pnpm changeset:version` |
| **ビルド・テスト** | 自動実行（公開前に必須） | 手動実行（任意） |
| **npm公開** | 自動実行 | `pnpm changeset:publish` |
| **Gitタグ作成** | 自動実行 | 手動作成 |
| **エラーハンドリング** | 自動停止・通知 | 手動対応 |
| **使用場面** | 通常のリリース | 緊急時・トラブル時 |

## 推奨ワークフロー（自動化）

### 1. 変更の実装とChangeset作成

パッケージに変更を加えた後：

```bash
# 変更後、changesetを作成
pnpm changeset
```

これにより以下が実行されます：
- 変更されたパッケージの選択
- 変更タイプの指定（major, minor, patch）
- 変更内容の要約入力

### 2. プルリクエストの作成

```bash
# 変更をコミットしてプッシュ
git add .
git commit -m "feat: 新機能の追加"
git push origin feature-branch
```

### 3. プルリクエストのマージ

- プルリクエストがメインブランチにマージされると、GitHub Actionsが自動的に実行されます
- 以下の処理が自動で行われます：
  1. 依存関係のインストール
  2. ビルドの実行
  3. テストの実行
  4. Changesetの確認
  5. バージョンの更新
  6. npmへの公開
  7. Gitタグの作成

### 4. リリース確認

```bash
# 現在のchangeset状況を確認
pnpm changeset:status
```

## 手動ワークフロー（緊急時・トラブル時）

自動化されたワークフローが失敗した場合や緊急リリースが必要な場合：

### 1. バージョン更新

```bash
# パッケージバージョンを手動で更新
pnpm changeset:version
```

### 2. 手動公開

```bash
# 更新されたパッケージを手動で公開
pnpm changeset:publish
```

### 3. 状況確認

```bash
# changeset状況の確認
pnpm changeset:status
```

## Package Structure

1. `@plenarc/specment` - Main CLI package (published)
2. `@specment/docs` - Documentation app (ignored, not published)

## 新しいワークフローでのChangeset作成手順

### 基本的な手順

1. **機能ブランチで開発**
   ```bash
   git checkout -b feature/new-feature
   # 開発作業を実行
   ```

2. **Changesetの作成**
   ```bash
   pnpm changeset
   ```
   - 変更されたパッケージを選択
   - セマンティックバージョニングに従って変更タイプを選択
   - ユーザー向けの明確な説明を記述

3. **プルリクエストの作成**
   - Changesetファイルを含めてコミット
   - プルリクエストを作成してレビューを依頼

4. **マージ後の自動処理**
   - メインブランチへのマージで自動公開が実行
   - GitHub Actionsの実行状況を確認

### Changeset作成のベストプラクティス

- **ユーザー影響のある変更には必ずChangesetを作成**
- **明確で理解しやすい説明を記述**
- **適切なセマンティックバージョニングを選択**
  - **patch**: バグ修正、内部改善
  - **minor**: 新機能、後方互換性あり
  - **major**: 破壊的変更
- **複数パッケージに影響する場合は適切に選択**

## トラブルシューティング

### よくある問題と解決方法

#### 1. 自動公開が実行されない

**症状**: プルリクエストをマージしても自動公開が開始されない

**原因と対処法**:
- **Changesetファイルが存在しない**
  ```bash
  # Changesetの状況を確認
  pnpm changeset:status
  # 必要に応じてChangesetを作成
  pnpm changeset
  ```
- **GitHub Actionsワークフローが無効**
  - `.github/workflows/npm-publish.yaml`ファイルの存在を確認
  - GitHubリポジトリのActionsタブで実行状況を確認

#### 2. npm公開が失敗する

**症状**: ワークフローは実行されるがnpm公開で失敗する

**原因と対処法**:
- **NPM_TOKENの問題**
  - GitHub SecretsでNPM_TOKENが正しく設定されているか確認
  - トークンの有効期限と権限を確認
- **パッケージ名の競合**
  - 既存のパッケージ名と重複していないか確認
  - package.jsonのnameフィールドを確認
- **ネットワーク問題**
  - 一時的な問題の場合、手動で再実行
  - 継続する場合は手動公開を実行

#### 3. ビルドまたはテストが失敗する

**症状**: 自動公開プロセスでビルドやテストが失敗する

**対処法**:
```bash
# ローカルでビルドとテストを実行して問題を特定
pnpm install
pnpm build
pnpm test

# 問題を修正後、再度プルリクエストを作成
```

#### 4. バージョン競合

**症状**: 同じバージョンが既に公開されている

**対処法**:
```bash
# 現在のバージョンを確認
npm view @plenarc/specment version

# 必要に応じて新しいChangesetを作成
pnpm changeset
```

### 緊急時の手動リリース手順

自動化されたワークフローが完全に失敗した場合：

1. **問題の特定**

   ```bash
   # GitHub Actionsのログを確認
   # エラーメッセージを分析
   ```

2. **ローカルでの検証**

   ```bash
   pnpm install
   pnpm build
   pnpm test
   ```

3. **手動でのバージョン更新と公開**
   ```bash
   # バージョン更新
   pnpm changeset:version
   
   # 公開
   pnpm changeset:publish
   ```

4. **Gitタグの手動作成**
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

### サポートとヘルプ

- **GitHub Actionsログ**: リポジトリのActionsタブで詳細なログを確認
- **Changesets公式ドキュメント**: https://github.com/changesets/changesets
- **npm公開ガイド**: https://docs.npmjs.com/cli/v8/commands/npm-publish

## Best Practices

1. Always create a changeset for user-facing changes
2. Use semantic versioning appropriately:
   - **patch**: Bug fixes, internal improvements
   - **minor**: New features, backwards compatible
   - **major**: Breaking changes
3. Write clear, user-focused changeset summaries
4. Review generated CHANGELOGs before publishing
5. **新規**: プルリクエスト作成前にローカルでビルドとテストを実行
6. **新規**: Changesetの説明は日本語または英語で明確に記述
7. **新規**: 自動公開の実行状況をGitHub Actionsで定期的に確認
