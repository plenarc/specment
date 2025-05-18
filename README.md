# Specment
https://plenarc.github.io/specment/

'specification' + 'document' => specment

> [!WARNING]
> まだ全般的に作成中

## 依存関係のインストール
pnpm add -D @biomejs/biome

## TypeScript関連
pnpm add -D typescript @types/react @types/node

## 利用各種
### フォーマットの確認
```bash
pnpm run check
```

### lint
```bash
pnpm run lint
or
pnpm run lint:fix
```

### localでの動作確認
```bash
pnpm run start
```

### ビルドと開発サーバーの起動
```bash
pnpm run build
pnpm run serve
```

### 新しい要求仕様ファイルの作成例
```bash
cd docs/02-requirements/functional/
cp _req-template.mdx req-002.mdx
```
