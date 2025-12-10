# リリースプロセス

このドキュメントでは、Specmentプロジェクトのリリースプロセスについて説明します。

## 概要

Specmentは[Changesets](https://github.com/changesets/changesets)を使用してバージョン管理を行い、GitHub Actionsによる完全自動化されたリリースプロセスを採用しています。メインブランチへのマージ時に自動的にnpmパッケージが公開され、手動作業を最小限に抑えた効率的なリリースフローを実現しています。

## 自動リリースプロセス（推奨）

### 1. 変更の追加とChangeset作成

新機能やバグ修正を行った後、changesetを作成します：

```bash
pnpm changeset
```

このコマンドを実行すると、以下の質問が表示されます：
- どのパッケージを変更したか
- 変更の種類（major/minor/patch）
- 変更の説明

**ベストプラクティス**:
- 変更の種類は[セマンティックバージョニング](https://semver.org/)に従って選択
- 説明は具体的で分かりやすく記述
- 複数の変更がある場合は、それぞれ個別のchangesetを作成

### 2. 変更のコミットとプルリクエスト

changesetファイルと変更内容をコミットし、プルリクエストを作成します：

```bash
git add .
git commit -m "feat: 新機能の追加"
git push origin feature-branch
```

### 3. 自動リリースの実行

mainブランチにプルリクエストがマージされると、GitHub Actionsが自動的に以下を実行します：

#### 3.1 ワークフロー実行条件の確認
- Changesetファイルの存在確認
- 変更内容の検証

#### 3.2 品質チェック
- 依存関係のインストール
- TypeScriptビルドの実行
- テストスイートの実行

#### 3.3 バージョン更新とパッケージ公開
- Changesetに基づくバージョン更新
- package.jsonファイルの更新
- npmレジストリへの自動公開
- Gitタグの作成
- GitHub Releaseの作成

#### 3.4 実行結果の通知
- 成功時：公開されたパッケージ情報をログに記録
- 失敗時：詳細なエラー情報と対処法を表示

### 自動リリースの利点

- **一貫性**: 毎回同じプロセスで確実にリリース
- **効率性**: 手動作業の削減により時間短縮
- **品質保証**: 自動テストによる品質チェック
- **透明性**: 全ての操作がGitHub Actionsで可視化
- **セキュリティ**: 認証情報の安全な管理

## 緊急時の手動リリース

自動リリースが失敗した場合や緊急パッチが必要な場合の手動リリース手順です。

### 手動リリースが必要な状況

- GitHub Actionsワークフローの障害
- npm公開の失敗（ネットワーク問題等）
- 緊急セキュリティパッチの適用
- 自動化システムのメンテナンス中

### 事前準備

1. **NPMトークンの確認**
   ```bash
   npm whoami
   ```
   
2. **権限の確認**
   - @plenarc/specmentパッケージへの公開権限があることを確認

3. **環境の準備**
   ```bash
   # 最新のmainブランチを取得
   git checkout main
   git pull origin main
   
   # 依存関係のインストール
   pnpm install
   ```

### 手動リリース手順

#### ステップ1: 品質チェック

```bash
# TypeScriptの型チェック
pnpm --filter @plenarc/specment typecheck

# テストの実行
pnpm --filter @plenarc/specment test

# ビルドの実行
pnpm --filter @plenarc/specment build
```

#### ステップ2: Changesetの確認

```bash
# 未処理のchangesetがあることを確認
ls .changeset/*.md

# changesetの内容を確認
cat .changeset/[changeset-file].md
```

#### ステップ3: バージョン更新

```bash
# バージョンの更新（CHANGELOGも自動生成）
pnpm changeset version

# 更新内容の確認
git diff packages/specment/package.json
git diff packages/specment/CHANGELOG.md
```

#### ステップ4: 変更のコミット

```bash
# バージョン更新をコミット
git add .
git commit -m "chore: release version [新しいバージョン番号]"
git push origin main
```

#### ステップ5: パッケージ公開

```bash
# npmへの公開
pnpm changeset publish

# 公開の確認
npm view @plenarc/specment version
```

#### ステップ6: Gitタグとリリースの作成

```bash
# Gitタグの作成
git tag v[新しいバージョン番号]
git push origin v[新しいバージョン番号]
```

GitHub Releaseは手動でGitHub UIから作成するか、GitHub CLIを使用：

```bash
gh release create v[新しいバージョン番号] --generate-notes
```

### 手動リリース後の対応

1. **自動化システムの復旧**: 手動リリースの原因となった問題を解決
2. **チームへの通知**: 手動リリースを実行したことをチームに報告
3. **ドキュメント更新**: 必要に応じて手順や設定の見直し

## リリース後の確認手順

リリース（自動・手動問わず）後は以下の確認を必ず実行してください：

### 1. パッケージ公開の確認

#### NPMレジストリでの確認
```bash
# 最新バージョンの確認
npm view @plenarc/specment version

# パッケージ詳細の確認
npm view @plenarc/specment

# 公開時刻の確認
npm view @plenarc/specment time
```

#### Webブラウザでの確認
- NPMパッケージページ: https://www.npmjs.com/package/@plenarc/specment
- ダウンロード統計やバージョン履歴を確認

### 2. GitHub Releaseの確認

- GitHub Releaseページ: https://github.com/plenarc/specment/releases
- リリースノートの内容確認
- 添付ファイルの確認（該当する場合）

### 3. 機能テスト

#### 基本インストールテスト
```bash
# グローバルインストール
npm install -g @plenarc/specment@latest

# バージョン確認
specment --version

# 基本機能テスト
specment --help
```

#### プロジェクトでのテスト
```bash
# 新しいディレクトリでテスト
mkdir test-specment-release
cd test-specment-release

# ローカルインストール
npm init -y
npm install @plenarc/specment@latest

# 基本機能の動作確認
npx specment init
npx specment generate
```

### 4. ドキュメントの確認

- README.mdの内容が最新バージョンに対応しているか
- インストール手順が正しく動作するか
- サンプルコードが新しいバージョンで動作するか

### 5. 互換性テスト

#### 既存プロジェクトでのテスト
```bash
# 既存のspecmentプロジェクトで更新テスト
cd existing-specment-project
npm update @plenarc/specment
npm test
```

#### Node.jsバージョン互換性
- サポート対象のNode.jsバージョンでの動作確認
- package.jsonのenginesフィールドとの整合性確認

### 6. 問題発生時の対応

#### ロールバック手順
問題が発見された場合の緊急対応：

```bash
# 問題のあるバージョンを非推奨に設定
npm deprecate @plenarc/specment@[問題のあるバージョン] "問題の説明"

# 必要に応じて前のバージョンをlatestタグに設定
npm dist-tag add @plenarc/specment@[安全なバージョン] latest
```

#### 緊急パッチリリース
重大な問題の場合は緊急パッチリリースを実行：

1. 問題の修正
2. パッチバージョンのchangeset作成
3. 緊急手動リリースの実行

## ベストプラクティスとガイドライン

### Changeset作成のベストプラクティス

#### 適切な変更タイプの選択
- **patch**: バグ修正、ドキュメント更新、内部リファクタリング
- **minor**: 新機能追加、既存APIの拡張（後方互換性あり）
- **major**: 破壊的変更、APIの削除や変更

#### 効果的な変更説明の書き方
```markdown
# 良い例
- Add support for TypeScript 5.0
- Fix memory leak in template processing
- Improve error messages for invalid configurations

# 避けるべき例
- Fix bug
- Update code
- Various improvements
```

#### 複数変更の管理
- 関連する変更は1つのPRにまとめる
- 独立した機能は別々のPRとchangesetで管理
- 大きな機能は段階的にリリース

### リリースタイミングのガイドライン

#### 定期リリース
- 週次または隔週でのマイナーリリース
- 月次でのメジャーリリース検討
- 緊急時のパッチリリースは随時

#### リリース前チェックリスト
- [ ] 全てのテストが通過
- [ ] ドキュメントが更新済み
- [ ] 破壊的変更がある場合はマイグレーションガイド作成
- [ ] セキュリティ脆弱性のチェック完了

### セキュリティベストプラクティス

#### NPMトークン管理
- 定期的なトークンローテーション（3-6ヶ月）
- 最小権限の原則（公開権限のみ）
- トークン漏洩時の即座な無効化

#### 依存関係管理
```bash
# 脆弱性チェック
npm audit

# 依存関係の更新
pnpm update

# セキュリティ修正の適用
npm audit fix
```

## トラブルシューティング

### 自動リリース関連の問題

#### GitHub Actionsワークフローが実行されない
**原因と対処法**:
- Changesetファイルが存在しない → `pnpm changeset`で作成
- ワークフロー設定の問題 → `.github/workflows/npm-publish.yaml`を確認
- 権限の問題 → リポジトリ設定のActionsタブを確認

#### NPM公開エラー
**原因と対処法**:
- NPM_TOKENの期限切れ → GitHub Secretsで新しいトークンを設定
- パッケージ名の重複 → package.jsonのnameフィールドを確認
- ネットワークエラー → 手動リリースで対応

#### バージョン更新エラー
**原因と対処法**:
- Changesetの形式エラー → `.changeset/`内のファイルを確認
- Gitの競合 → mainブランチを最新に更新してリベース
- 権限不足 → リポジトリの書き込み権限を確認

### 手動リリース関連の問題

#### NPMログインエラー
```bash
# NPMトークンの再設定
npm logout
npm login

# 2FAが有効な場合
npm login --auth-type=web
```

#### ビルドエラー
```bash
# キャッシュクリア
pnpm store prune
rm -rf node_modules
pnpm install

# TypeScript設定確認
pnpm --filter @plenarc/specment typecheck
```

#### Changesetエラー
```bash
# Changeset設定の確認
cat .changeset/config.json

# 未処理changesetの確認
pnpm changeset status
```

### 緊急時対応手順

#### 重大な問題が発見された場合
1. **即座の対応**
   ```bash
   # 問題バージョンを非推奨に設定
   npm deprecate @plenarc/specment@[バージョン] "Critical issue found"
   ```

2. **修正版の準備**
   - 問題の修正
   - パッチバージョンのchangeset作成
   - 緊急リリースの実行

3. **事後対応**
   - 問題の原因調査
   - 再発防止策の実装
   - チームへの報告とドキュメント更新

#### ロールバック手順
```bash
# 前のバージョンをlatestに設定
npm dist-tag add @plenarc/specment@[安全なバージョン] latest

# 問題バージョンの削除（公開から24時間以内のみ）
npm unpublish @plenarc/specment@[問題のバージョン]
```

## 関連ファイルとディレクトリ

### 設定ファイル
- `.changeset/config.json`: Changeset設定
- `.github/workflows/npm-publish.yaml`: 自動npm公開ワークフロー
- `packages/specment/package.json`: パッケージ設定
- `packages/specment/tsconfig.json`: TypeScript設定

### 自動生成ファイル
- `packages/specment/CHANGELOG.md`: 変更履歴（Changesetにより自動生成）
- `.changeset/*.md`: 個別のchangesetファイル

### ドキュメント
- `CHANGESET_WORKFLOW.md`: Changesetワークフローの詳細
- `CONTRIBUTING.md`: 貢献ガイドライン
- `README.md`: プロジェクト概要とインストール手順

## 参考資料

### 公式ドキュメント
- [Changesets Documentation](https://github.com/changesets/changesets)
- [NPM Publishing Guide](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [Semantic Versioning](https://semver.org/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

### ベストプラクティス
- [NPM Best Practices](https://docs.npmjs.com/misc/developers)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### ツールとサービス
- [GitHub CLI](https://cli.github.com/): コマンドラインからのGitHub操作
- [npm-check-updates](https://www.npmjs.com/package/npm-check-updates): 依存関係更新チェック
- [npm audit](https://docs.npmjs.com/cli/v8/commands/npm-audit): セキュリティ脆弱性チェック