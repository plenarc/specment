# 設計書

## 概要

現在のspecmentリポジトリを、pnpm workspaceを使用したmonorepo構成に移行します。この移行により、Docusaurusサイト（apps/docs）とCLIツール（packages/specment）を分離し、それぞれ独立して開発・デプロイできる環境を構築します。

## アーキテクチャ

### ディレクトリ構造

```
specment/
├── pnpm-workspace.yaml
├── package.json (ルートワークスペース)
├── README.md (更新)
├── .github/
│   └── workflows/
│       ├── deploy.yml (apps/docs用)
│       └── release.yml (packages/specment用)
├── apps/
│   └── docs/
│       ├── docs/ (移動)
│       ├── src/ (移動)
│       ├── static/ (移動)
│       ├── docusaurus.config.ts (移動・調整)
│       ├── sidebars.ts (移動)
│       ├── package.json (新規作成)
│       ├── tsconfig.json (新規作成)
│       └── .markdownlint.yaml (移動)
└── packages/
    └── specment/
        ├── bin/
        ├── templates/
        ├── recipes/
        ├── migrations/
        ├── assets/
        ├── package.json (新規作成)
        └── README.md (新規作成)
```

### ワークスペース構成

1. **ルートワークスペース**: 共通の開発ツール（biome、typescript等）を管理
1. **apps/docs**: Docusaurusサイト。既存の全コンテンツを保持
1. **packages/specment**: CLIツールパッケージ。将来的にnpm公開予定

## コンポーネントと インターフェース

### pnpm-workspace.yaml

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

### ルートpackage.json

1. 共通のdevDependenciesを管理
1. ワークスペース全体のスクリプトを定義
1. 既存のpnpm設定を保持

### apps/docs/package.json

1. Docusaurus関連の依存関係を移動
1. 既存のscriptsを保持
1. ワークスペース内での相対参照を設定

### packages/specment/package.json

1. パッケージ名: @plenarc/specment
1. CLIツールとしてのbin設定
1. 必要最小限の依存関係

## データモデル

### 移行対象ファイル

#### apps/docsに移動するファイル

1. **ディレクトリ**
    1. docs/ → apps/docs/docs/
    1. src/ → apps/docs/src/
    1. static/ → apps/docs/static/

1. **設定ファイル**
    1. docusaurus.config.ts → apps/docs/docusaurus.config.ts
    1. sidebars.ts → apps/docs/sidebars.ts
    1. .markdownlint.yaml → apps/docs/.markdownlint.yaml

#### packages/specmentに作成するファイル

1. **ディレクトリ構造**
    1. bin/ (CLIエントリーポイント)
    1. templates/ (ドキュメントテンプレート)
    1. recipes/ (プロジェクト設定レシピ)
    1. migrations/ (バージョン間マイグレーション)
    1. assets/ (静的リソース)

#### ルートに残すファイル

1. pnpm-lock.yaml
1. mise.toml
1. biome.jsonc
1. LICENSE
1. .gitignore
1. .vscode/
1. .git/

### 設定調整が必要なファイル

#### docusaurus.config.ts

1. パス参照の調整（相対パスの修正）
1. GitHub Pages設定の確認
1. 既存の設定値は保持

#### GitHub Actions

1. **deploy.yml**: apps/docsのビルド・デプロイに調整
1. **test-deploy.yml**: apps/docsでのテストに調整
1. **release.yml**: packages/specmentのnpm公開用（新規作成）

## エラーハンドリング

### 移行時のリスク対策

1. **ファイル移動の失敗**
    1. 移動前にバックアップを作成
    1. 段階的な移行でロールバック可能にする

1. **依存関係の解決失敗**
    1. package.jsonの依存関係を慎重に分割
    1. 移行後にpnpm installでの検証

1. **ビルドエラー**
    1. 各ワークスペースでの個別ビルド確認
    1. パス参照の修正確認

1. **CI/CDの失敗**
    1. GitHub Actionsの段階的更新
    1. テスト環境での事前検証

### 検証手順

1. **ローカル開発環境**
    1. pnpm install の成功確認
    1. apps/docs での pnpm start 確認
    1. apps/docs での pnpm build 確認

1. **CI/CD環境**
    1. GitHub Actionsでのビルド確認
    1. GitHub Pagesへのデプロイ確認

## テスト戦略

### 移行検証テスト

1. **機能テスト**
    1. Docusaurusサイトの全ページ表示確認
    1. ナビゲーション機能の確認
    1. 検索機能の確認
    1. PlantUML図表示の確認

1. **ビルドテスト**
    1. ローカルでのビルド成功確認
    1. CI環境でのビルド成功確認
    1. 生成されるファイルの整合性確認

1. **デプロイテスト**
    1. GitHub Pagesへの正常デプロイ確認
    1. 公開URLでのアクセス確認
    1. 既存URLからのリダイレクト確認

### 自動テスト

1. **Smoke Test**
    1. 既存のHTTP 200チェックを維持
    1. 主要ページの応答確認

1. **リンクチェック**
    1. 内部リンクの整合性確認
    1. 相対パス参照の正常性確認

### パフォーマンステスト

1. **ビルド時間**
    1. 移行前後のビルド時間比較
    1. ワークスペース分離による影響測定

1. **サイト表示速度**
    1. 既存サイトとの表示速度比較
    1. 静的リソースの読み込み確認

## 実装フェーズ

### フェーズ1: ワークスペース基盤構築

1. pnpm-workspace.yamlの作成
1. ルートpackage.jsonの調整
1. ディレクトリ構造の作成

### フェーズ2: Docusaurusサイトの移行

1. apps/docsディレクトリの作成
1. ファイル移動の実行
1. 設定ファイルの調整
1. ローカル動作確認

### フェーズ3: CI/CDの更新

1. GitHub Actionsワークフローの更新
1. デプロイテストの実行
1. 本番環境での動作確認

### フェーズ4: CLIパッケージ基盤

1. packages/specmentディレクトリの作成
1. 基本的なpackage.json設定
1. 将来のnpm公開準備

### フェーズ5: ドキュメント更新

1. README.mdの更新
1. 開発手順の文書化
1. 移行完了の確認