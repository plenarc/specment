# @plenarc/specment

[English](README.md) | [日本語](README-jp.md)

Specment用のCLI開発ツール - markdown(MDX)で仕様サイトを作り、仕様をGit管理するためのリポジトリベースソリューション。

> **📖 プロジェクト概要**: [Specmentについて](../../README-jp.md) - 完全な価値提案、使用パターン、クイックスタートガイド

## インストール

> **前準備**: Node.jsとパッケージマネージャーのセットアップについては、メインREADMEの[環境要件](../../README-jp.md#前準備)を参照してください。

### グローバルインストール

```bash
npm install -g @plenarc/specment
```

### プロジェクト内インストール

```bash
# npm使用の場合
npm install --save-dev @plenarc/specment

# pnpm使用の場合(推奨)
pnpm add -D @plenarc/specment

# yarn使用の場合
yarn add --dev @plenarc/specment
```

### インストール確認

```bash
# バージョン確認
specment --version

# ヘルプ表示
specment --help
```

## 使用方法

### 基本コマンド

```bash
# 新しい仕様書プロジェクトの初期化
specment init

# 新しい仕様書ドキュメントの作成
specment create <template-name>

# 利用可能なテンプレートの一覧表示
specment list

# 仕様書からドキュメントの生成
specment generate

# 既存仕様書のマイグレーション
specment migrate <version>
```

### 基本的な使用例

```bash
# デフォルトテンプレートで新しいプロジェクトを初期化
specment init my-project

# 新しいAPI仕様書を作成
specment create api-spec

# HTMLドキュメントを生成
specment generate --format html

# 利用可能なテンプレートをすべて表示
specment list --templates
```

### 高度な使用例

#### プロジェクト初期化のカスタマイズ

```bash
# 特定のテンプレートディレクトリを指定して初期化
specment init my-project --template-dir ./custom-templates

# 出力ディレクトリを指定して初期化
specment init my-project --output-dir ./specifications

# 設定ファイルを指定して初期化
specment init my-project --config ./custom-config.json
```

#### 複数形式でのドキュメント生成

```bash
# HTML形式で生成
specment generate --format html --output ./dist/html

# PDF形式で生成(要追加設定)
specment generate --format pdf --output ./dist/pdf

# 複数形式で同時生成
specment generate --format html,pdf --output ./dist
```

#### テンプレート管理

```bash
# カスタムテンプレートの追加
specment template add ./my-custom-template

# テンプレートの詳細情報表示
specment template info api-spec

# テンプレートの削除
specment template remove custom-template
```

#### バッチ処理

```bash
# 複数の仕様書を一括作成
specment batch create --templates api-spec,feature-spec --count 5

# ディレクトリ内のすべての仕様書を検証
specment validate --recursive ./specs

# 設定に基づいて複数の出力形式を生成
specment generate --config-based
```

## テンプレート

Specmentには一般的な仕様書タイプ用の組み込みテンプレートが含まれています：

- **api-spec**: REST API仕様書テンプレート
- **feature-spec**: 機能仕様書テンプレート
- **design-doc**: 設計ドキュメントテンプレート
- **user-story**: ユーザーストーリーテンプレート

### カスタムテンプレートの作成

```bash
# 新しいテンプレートの作成
specment template create my-template

# 既存テンプレートをベースにした作成
specment template create my-template --base feature-spec
```

## 設定

Specmentはプロジェクトルートの`specment.config.json`ファイルで設定できます：

```json
{
  "templatesDir": "./templates",
  "outputDir": "./docs",
  "defaultTemplate": "feature-spec",
  "validation": {
    "enabled": true,
    "rules": ["required-sections", "format-check"]
  },
  "generation": {
    "formats": ["html"],
    "theme": "default",
    "customCss": "./styles/custom.css"
  }
}
```

### 設定オプション

| オプション           | 説明                           | デフォルト値   |
| -------------------- | ------------------------------ | -------------- |
| `templatesDir`       | テンプレートディレクトリのパス | `./templates`  |
| `outputDir`          | 出力ディレクトリのパス         | `./docs`       |
| `defaultTemplate`    | デフォルトテンプレート名       | `feature-spec` |
| `validation.enabled` | 検証機能の有効/無効            | `true`         |
| `generation.formats` | 生成形式の配列                 | `["html"]`     |

## 実例と詳細情報

### 実際の運用例

このSpecmentプロジェクト自体がCLIツールの実際の使用例です：

**🔗 [実例運用ガイド](../../apps/website/README-specment-jp.md)** - Specmentを使った実際のドキュメントサイト運用方法

### 詳細なドキュメント

**🌐 [Specment公式サイト](https://plenarc.github.io/specment/)** - 包括的な使用方法とベストプラクティス

## 開発

このパッケージはSpecment monorepoの一部です。開発手順については、[メインリポジトリのREADME](../../README-jp.md)を参照してください。
