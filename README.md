# Specment
https://plenarc.github.io/specment/

'specification' + 'document' => specment

A monorepo containing a CLI tool for managing specification documents and a Docusaurus documentation site.

> [!WARNING]
> en: Still being created in general
> jp: まだ全般的に作成中

## Project Structure - プロジェクト構成

This is a pnpm workspace monorepo with the following structure:

```
specment/
├── apps/
│   └── docs/          # Docusaurus documentation site (@specment/docs)
└── packages/
    └── specment/      # CLI tool package (@plenarc/specment)
```

## Preparation - 前準備

> [!INFO]
> 1. Recommended: mise
>     1. GitHub: https://github.com/jdx/mise

### Tools to use
1. Node.js (>=22.0)
    1. LTS Recommended.
    1. ```bash
        mise use node@lts
        ```
1. pnpm
    1. ```bash
        mise use pnpm@latest
        ```

### Install

```bash
pnpm install
```

## Development - 開発

### Documentation Site (apps/docs)

#### Start development server - 開発サーバーの起動

```bash
# From root
pnpm docs:start

# Or from apps/docs directory
cd apps/docs
pnpm start
```

#### Build documentation site - ドキュメントサイトのビルド

```bash
# From root
pnpm docs:build

# Or from apps/docs directory
cd apps/docs
pnpm build
```

#### Serve built site - ビルド済みサイトの配信

```bash
# From root
pnpm docs:serve

# Or from apps/docs directory
cd apps/docs
pnpm serve
```

### CLI Tool (packages/specment)

#### Build CLI tool - CLIツールのビルド

```bash
# From root
pnpm specment:build

# Or from packages/specment directory
cd packages/specment
pnpm build
```

#### Development mode - 開発モード

```bash
cd packages/specment
pnpm dev
```

#### Run tests - テスト実行

```bash
cd packages/specment
pnpm test
```

### Build All - 全体ビルド

```bash
pnpm build:all
```

## Code Quality - コード品質

### Formatter - フォーマッター

```bash
# From root (all workspaces)
pnpm format

# Individual workspace
cd apps/docs
pnpm format

cd packages/specment
pnpm format
```

### Linter - リンター

```bash
# From root (all workspaces)
pnpm lint
# or with auto-fix
pnpm lint:fix

# Individual workspace
cd apps/docs
pnpm lint

cd packages/specment
pnpm lint
```

### Type checking - 型チェック

```bash
# From root
pnpm typecheck

# Individual workspace
cd apps/docs
pnpm typecheck

cd packages/specment
pnpm typecheck
```

### Pre-commit checks - コミット前チェック

```bash
pnpm check
```

## Release Management - リリース管理

This project uses [Changesets](https://github.com/changesets/changesets) for version management.

### Create a changeset - 変更セットの作成

```bash
pnpm changeset
```

### Version packages - パッケージのバージョン更新

```bash
pnpm changeset:version
```

### Publish packages - パッケージの公開

```bash
pnpm changeset:publish
```

### Full release workflow - 完全なリリースワークフロー

```bash
pnpm release
```

## Example of creating a new requirements specification file

ja: 新しい要求仕様ファイルの作成例

```bash
cd apps/docs/docs/02-requirements/functional/
cp _req-template.mdx req-002.mdx
```

## Contributing - 貢献

1. Fork the repository
1. Create a feature branch
1. Make your changes
1. Run tests and quality checks
1. Create a changeset if needed
1. Submit a pull request

## License

MIT
