# リリースプロセス

このドキュメントでは、Specmentプロジェクトのリリースプロセスについて説明します。

## 概要

Specmentは[Changesets](https://github.com/changesets/changesets)を使用してバージョン管理と自動公開を行っています。

## リリースフロー

### 1. 変更の追加

新機能やバグ修正を行った後、changesetを作成します：

```bash
pnpm changeset
```

このコマンドを実行すると、以下の質問が表示されます：
- どのパッケージを変更したか
- 変更の種類（major/minor/patch）
- 変更の説明

### 2. 変更のコミット

changesetファイルと変更内容をコミットします：

```bash
git add .
git commit -m "feat: 新機能の追加"
git push origin feature-branch
```

### 3. プルリクエストの作成

mainブランチに対してプルリクエストを作成します。

### 4. 自動リリース

mainブランチにマージされると、GitHub Actionsが自動的に：

1. **バージョン更新PR作成**: changesetに基づいてバージョンを更新するPRを作成
2. **自動公開**: バージョン更新PRがマージされると、NPMに自動公開
3. **GitHub Release作成**: リリースノートと共にGitHub Releaseを作成

## 手動リリース

緊急時やテスト目的で手動リリースを行う場合：

```bash
# 1. ビルド
pnpm specment:build

# 2. バージョン更新
pnpm changeset:version

# 3. 公開
pnpm changeset:publish
```

## リリース後の確認

リリース後は以下を確認してください：

1. **NPMパッケージ**: https://www.npmjs.com/package/@plenarc/specment
2. **GitHub Release**: https://github.com/plenarc/specment/releases
3. **インストールテスト**:
   ```bash
   npm install -g @plenarc/specment@latest
   specment --version
   ```

## トラブルシューティング

### NPMトークンエラー

GitHub SecretsでNPM_TOKENが設定されていることを確認してください。

### ビルドエラー

TypeScriptのビルドエラーが発生した場合：

```bash
pnpm --filter @plenarc/specment typecheck
pnpm --filter @plenarc/specment build
```

### changesetエラー

changesetの設定に問題がある場合、`.changeset/config.json`を確認してください。

## 関連ファイル

- `.changeset/config.json`: changeset設定
- `.github/workflows/release.yml`: 自動リリースワークフロー
- `packages/specment/package.json`: パッケージ設定
- `packages/specment/CHANGELOG.md`: 変更履歴（自動生成）

## 参考資料

- [Changesets Documentation](https://github.com/changesets/changesets)
- [NPM Publishing Guide](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [Semantic Versioning](https://semver.org/)