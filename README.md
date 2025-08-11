# Specment
https://plenarc.github.io/specment/

'specification' + 'document' => specment

Template for making a site for documentation of a development project using Docusaurus.

> [!WARNING]
> en: Still being created in ge
> jp: まだ全般的に作成中

## Preparation - 前準備

> [!INFO]
> 1. Recommended: mise
>     1. GitHub: https://github.com/jdx/mise

### Tools to use
1. Node.js
    1. LTS Recommended.
    1. ```bash
        mise use node@lts
        ```
1. pnpm
    1. ```bash
        mise use node@latest
        ```

### Install
```bash
pnpm install
```

## Checking if it works locally - localでの動作確認
```bash
pnpm run start
```

## Pre-commit checks
### formatter
```bash
pnpm run check
```

### lint
```bash
pnpm run lint
or
pnpm run lint:fix
```

### Build and start development server - ビルドと開発サーバーの起動
```bash
pnpm run build
pnpm run serve
```

## Example of creating a new requirements specification file

ja: 新しい要求仕様ファイルの作成例

```bash
cd docs/02-requirements/functional/
cp _req-template.mdx req-002.mdx
```
