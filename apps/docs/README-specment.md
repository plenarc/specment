# Specment Dogfooding Guide - ドッグフード運用ガイド

1. EN: This document explains how to use the specment tool in the apps/docs project.
1. JP: このドキュメントは、apps/docsプロジェクトでspecmentツールを使用する方法について説明します。

## Overview - 概要

1. EN: The apps/docs project uses the @plenarc/specment tool for document management. This enables consistent document creation and validation.
1. JP: apps/docsプロジェクトでは、@plenarc/specmentツールを使用してドキュメント管理を行います。これにより、一貫性のあるドキュメント作成とバリデーションが可能になります。

## Setup - セットアップ

1. EN: The specment tool is already integrated into the project and can be used with the following npm scripts:
1. JP: specmentツールは既にプロジェクトに組み込まれており、以下のnpmスクリプトで利用できます：

```bash
# Display template list - テンプレート一覧の表示
pnpm spec:list --templates

# Create new document - 新しいドキュメントの作成
pnpm spec:create

# Validate documents - ドキュメントのバリデーション
pnpm spec:validate

# Display project structure - プロジェクト構造の表示
pnpm spec:list
```

## Available Templates - 利用可能なテンプレート

1. EN: The following templates are currently available:
1. JP: 現在、以下のテンプレートが利用可能です：

### 1. functional-requirement
1. EN:
    1. Template for functional requirement documents
    1. Location: `docs/02-requirements/functional/`
    1. Naming convention: `req-XXX.mdx`
1. JP:
    1. 機能要件ドキュメント用のテンプレート
    1. 配置先: `docs/02-requirements/functional/`
    1. ファイル名規則: `req-XXX.mdx`

### 1. non-functional-requirement
1. EN:
    1. 非機能要件ドキュメント用のテンプレート
    1. 配置先: `docs/02-requirements/non-functional/`
    1. ファイル名規則: `nfr-XXX.mdx`
1. JP:
    1. 非機能要件ドキュメント用のテンプレート
    1. 配置先: `docs/02-requirements/non-functional/`
    1. ファイル名規則: `nfr-XXX.mdx`

### 1. screen-specification
1. EN:
    1. 画面仕様書用のテンプレート
    1. 配置先: `docs/04-internal/screens/`
    1. ファイル名規則: `screen-XXX.mdx`
1. JP:
    1. 画面仕様書用のテンプレート
    1. 配置先: `docs/04-internal/screens/`
    1. ファイル名規則: `screen-XXX.mdx`

### 1. table-specification
1. EN:
    1. テーブル仕様書用のテンプレート
    1. 配置先: `docs/04-internal/tables/`
    1. ファイル名規則: `table-XXX.mdx`
1. JP:
    1. テーブル仕様書用のテンプレート
    1. 配置先: `docs/04-internal/tables/`
    1. ファイル名規則: `table-XXX.mdx`

## Usage - 使用方法

### Creating New Documents - 新しいドキュメントの作成

```bash
pnpm spec:create
```

1. EN:
    1. Running this command displays an interactive prompt where you can select:
       1. Template to use
       1. File name
       1. Category to place
2. JP:
    1. このコマンドを実行すると、インタラクティブなプロンプトが表示され、以下を選択できます：
       1. 使用するテンプレート
       1. ファイル名
       1. 配置するカテゴリ

### Document Validation - ドキュメントのバリデーション

```bash
pnpm spec:validate
```

1. EN:
    1. This command checks the following:
    1. Presence of frontmatter
    1. Compliance with naming conventions
    1. Category structure consistency
1. JP:
    1. このコマンドは以下をチェックします：
    1. フロントマターの存在
    1. ファイル名規則の準拠
    1. カテゴリ構造の整合性

### Project Structure Check - プロジェクト構造の確認

```bash
pnpm spec:list
```

1. EN: Displays the current document structure in tree format.
1. JP: 現在のドキュメント構造をツリー形式で表示します。

## Configuration File - 設定ファイル

1. EN: You can customize specment behavior with the `specment.config.json` file:
1. JP: `specment.config.json`ファイルで、specmentの動作をカスタマイズできます：

```json
{
  "templatesDir": "./templates",
  "outputDir": "./docs",
  "defaultTemplate": "feature-spec",
  "categories": {
    "overview": {
      "path": "01-overview",
      "description": "Project overview and context documents - プロジェクト概要とコンテキストドキュメント"
    },
    "requirements": {
      "path": "02-requirements", 
      "description": "Functional and non-functional requirements - 機能要件と非機能要件"
    },
    "external": {
      "path": "03-external",
      "description": "External interfaces and business models - 外部インターフェースとビジネスモデル"
    },
    "internal": {
      "path": "04-internal",
      "description": "Internal system specifications - 内部システム仕様"
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

## Consistency with Existing Structure - 既存構造との整合性

1. EN:
    1. The specment tool is configured to maintain consistency with the existing document structure:
    1. Underscore prefix (`_assumptions-constraints.mdx` etc.) allowed as exceptions
    1. Snake case (`customer_details.mdx` etc.) also allowed
    1. Template files (`*_template.mdx`) allowed as exceptions
1. JP:
    1. specmentツールは既存のドキュメント構造と整合性を保つように設定されています：
    1. アンダースコアプレフィックス (`_assumptions-constraints.mdx` など) 例外として許可
    1. スネークケース (`customer_details.mdx` など) も許可
    1. テンプレートファイル (`*_template.mdx`) 例外として許可

## Best Practices - ベストプラクティス

1. **Use templates - テンプレートの使用**:
    1. EN: Always use templates when creating new documents
    1. JP: 新しいドキュメントを作成する際は、必ずテンプレートを使用してください
1. **Regular validation - 定期的なバリデーション**:
    1. EN: Run `pnpm spec:validate` before committing
    1. JP: コミット前に`pnpm spec:validate`を実行してください
1. **Follow naming conventions - 命名規則の遵守**:
    1. EN: Use kebab-case for new files
    1. JP: 新しいファイルはkebab-caseを使用してください
1. **Include frontmatter - フロントマターの記述**:
    1. EN: All documents should include frontmatter
    1. JP: すべてのドキュメントにはフロントマターを含めてください

## Troubleshooting - トラブルシューティング

### When Validation Errors Occur - バリデーションエラーが発生した場合

1. EN:
    1. Check if file names follow naming conventions
    1. Check if frontmatter is correctly written
    1. Check if placed in appropriate category
1. JP:
    1. ファイル名が命名規則に従っているか確認
    1. フロントマターが正しく記述されているか確認
    1. 適切なカテゴリに配置されているか確認

### When Templates Are Not Found - テンプレートが見つからない場合

1. EN:
    1. Check if `templates/` directory exists
    1. Check if template files are saved with `.mdx` extension
    1. Check `templatesDir` setting in `specment.config.json`
1. JP:
    1. `templates/`ディレクトリが存在するか確認
    1. テンプレートファイルが`.mdx`拡張子で保存されているか確認
    1. `specment.config.json`の`templatesDir`設定を確認

## Future Extensions - 今後の拡張予定

1. Automatic document generation - 自動的なドキュメント生成機能
1. More detailed validation rules - より詳細なバリデーションルール
1. Custom template additions - カスタムテンプレートの追加
1. Enhanced Docusaurus integration - Docusaurusとの統合強化