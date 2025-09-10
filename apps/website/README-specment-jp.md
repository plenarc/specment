# Specment ドッグフード運用ガイド

[English](README-specment.md) | [日本語](README-specment-jp.md)

> **📖 プロジェクト概要**: [Specmentについて](../../README-jp.md) - 完全な価値提案、使用パターン、クイックスタートガイド
>
> **🔧 CLIリファレンス**: [CLIツールドキュメント](../../packages/specment/README-jp.md) - インストール、コマンド、設定オプション

このドキュメントは、このプロジェクト自身のドキュメントワークフローを通じて実際のSpecment使用方法を実演します。

## 概要

apps/websiteプロジェクトでは、@plenarc/specmentツールを使用してドキュメント管理を行います。これにより、一貫性のあるドキュメント作成とバリデーションが可能になります。

## セットアップ

specmentツールは既にプロジェクトに組み込まれており、以下のnpmスクリプトで利用できます：

```bash
# テンプレート一覧の表示
pnpm spec:list --templates

# 新しいドキュメントの作成
pnpm spec:create

# ドキュメントのバリデーション
pnpm spec:validate

# プロジェクト構造の表示
pnpm spec:list
```

## 利用可能なテンプレート

現在、以下のテンプレートが利用可能です：

### 1. functional-requirement

1. 機能要件ドキュメント用のテンプレート
1. 配置先: \`docs/02-requirements/functional/\`
1. ファイル名規則: \`req-XXX.mdx\`

### 2. non-functional-requirement

1. 非機能要件ドキュメント用のテンプレート
1. 配置先: \`docs/02-requirements/non-functional/\`
1. ファイル名規則: \`nfr-XXX.mdx\`

### 3. screen-specification

1. 画面仕様書用のテンプレート
1. 配置先: \`docs/04-internal/screens/\`
1. ファイル名規則: \`screen-XXX.mdx\`

### 4. table-specification

1. テーブル仕様書用のテンプレート
1. 配置先: \`docs/04-internal/tables/\`
1. ファイル名規則: \`table-XXX.mdx\`

## 使用方法

### 新しいドキュメントの作成

```bash
pnpm spec:create
```

このコマンドを実行すると、インタラクティブなプロンプトが表示され、以下を選択できます：

1. 使用するテンプレート
1. ファイル名
1. 配置するカテゴリ

### ドキュメントのバリデーション

```bash
pnpm spec:validate
```

このコマンドは以下をチェックします：

1. フロントマターの存在
1. ファイル名規則の準拠
1. カテゴリ構造の整合性

### プロジェクト構造の確認

```bash
pnpm spec:list
```

現在のドキュメント構造をツリー形式で表示します。

## 設定ファイル

\`specment.config.json\`ファイルで、specmentの動作をカスタマイズできます：

```json
{
  "templatesDir": "./templates",
  "outputDir": "./docs",
  "defaultTemplate": "feature-spec",
  "categories": {
    "overview": {
      "path": "01-overview",
      "description": "プロジェクト概要とコンテキストドキュメント"
    },
    "requirements": {
      "path": "02-requirements", 
      "description": "機能要件と非機能要件"
    },
    "external": {
      "path": "03-external",
      "description": "外部インターフェースとビジネスモデル"
    },
    "internal": {
      "path": "04-internal",
      "description": "内部システム仕様"
    }
  },
  "validation": {
    "rules": [
      "markdown-lint",
      "frontmatter-required",
      "category-structure",
      "naming-convention"
    ]
  },
  "naming": {
    "pattern": "flexible",
    "allowedPatterns": ["kebab-case", "snake_case", "underscore-prefix"],
    "exceptions": [
      "_*",
      "customer_details",
      "*_template"
    ]
  }
}
```

## 既存構造との整合性

specmentツールは既存のドキュメント構造と整合性を保つように設定されています：

1. アンダースコアプレフィックス (\`\_assumptions-constraints.mdx\` など) 例外として許可
1. スネークケース (\`customer\_details.mdx\` など) も許可
1. テンプレートファイル (\`\*\_template.mdx\`) 例外として許可

## ベストプラクティス

### テンプレートの使用

新しいドキュメントを作成する際は、必ずテンプレートを使用してください

### 定期的なバリデーション

コミット前に\`pnpm spec:validate\`を実行してください

### 命名規則の遵守

新しいファイルはkebab-caseを使用してください

### フロントマターの記述

すべてのドキュメントにはフロントマターを含めてください

## トラブルシューティング

### バリデーションエラーが発生した場合

1. ファイル名が命名規則に従っているか確認
1. フロントマターが正しく記述されているか確認
1. 適切なカテゴリに配置されているか確認

### テンプレートが見つからない場合

1. \`templates/\`ディレクトリが存在するか確認
1. テンプレートファイルが\`.mdx\`拡張子で保存されているか確認
1. \`specment.config.json\`の\`templatesDir\`設定を確認

## 今後の拡張予定

1. 自動的なドキュメント生成機能
1. より詳細なバリデーションルール
1. カスタムテンプレートの追加
1. Docusaurusとの統合強化