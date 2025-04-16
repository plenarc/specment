# docsite-template
Template for creating specification-specific websites using docusaurus.

## 依存関係のインストール
pnpm add -D @biomejs/biome

## TypeScript関連
pnpm add -D typescript @types/react @types/node


## 新しい要求仕様ファイルの作成
```bash
cp src/docs/requirements/template.mdx src/docs/requirements/functional/req-002.mdx
```

### フォーマットの確認
```bash
pnpm run check
```

## ビルドと開発サーバーの起動
```bash
pnpm run dev
```
