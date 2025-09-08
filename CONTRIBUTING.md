# 貢献ガイド

Specmentプロジェクトへの貢献をありがとうございます！このガイドでは、プロジェクトに貢献する方法について説明します。

## 開発環境のセットアップ

### 必要な環境

- Node.js 22.0以上
- pnpm 10.0以上

### セットアップ手順

1. **リポジトリのクローン**
   ```bash
   git clone https://github.com/plenarc/specment.git
   cd specment
   ```

2. **依存関係のインストール**
   ```bash
   pnpm install
   ```

3. **ビルド**
   ```bash
   pnpm specment:build
   ```

4. **動作確認**
   ```bash
   cd packages/specment
   node bin/specment.js --version
   ```

## 開発フロー

### 1. ブランチの作成

```bash
git checkout -b feature/your-feature-name
```

### 2. 開発

- `packages/specment/src/` でコードを編集
- TypeScriptで開発
- 適切なコメントとドキュメントを追加

### 3. ビルドとテスト

```bash
# ビルド
pnpm specment:build

# 型チェック
pnpm --filter @plenarc/specment typecheck

# リント
pnpm --filter @plenarc/specment lint:fix

# フォーマット
pnpm --filter @plenarc/specment format
```

### 4. changesetの作成

変更内容に応じてchangesetを作成：

```bash
pnpm changeset
```

- **patch**: バグ修正
- **minor**: 新機能追加
- **major**: 破壊的変更

### 5. コミットとプッシュ

```bash
git add .
git commit -m "feat: 新機能の説明"
git push origin feature/your-feature-name
```

### 6. プルリクエストの作成

GitHub上でプルリクエストを作成してください。

## コーディング規約

### TypeScript

- 厳密な型定義を使用
- `any`の使用は避ける
- 適切なインターフェースと型を定義

### コードスタイル

- Biomeを使用してフォーマット
- ESLintルールに従う
- 意味のある変数名と関数名を使用

### コミットメッセージ

Conventional Commitsに従ってください：

- `feat:` 新機能
- `fix:` バグ修正
- `docs:` ドキュメント更新
- `style:` コードスタイル変更
- `refactor:` リファクタリング
- `test:` テスト追加・修正
- `chore:` その他の変更

## プロジェクト構造

```
specment/
├── packages/
│   └── specment/           # メインCLIパッケージ
│       ├── src/           # TypeScriptソースコード
│       ├── bin/           # ビルド済みJavaScript
│       ├── templates/     # テンプレートファイル
│       └── package.json
├── apps/
│   └── website/           # ドキュメントサイト
├── .changeset/            # changeset設定
├── .github/workflows/     # GitHub Actions
└── docs/                  # プロジェクトドキュメント
```

## リリースプロセス

詳細は[RELEASE_PROCESS.md](./RELEASE_PROCESS.md)を参照してください。

## 質問・サポート

- **Issues**: バグ報告や機能要望は[GitHub Issues](https://github.com/plenarc/specment/issues)
- **Discussions**: 質問や議論は[GitHub Discussions](https://github.com/plenarc/specment/discussions)

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。詳細は[LICENSE](./LICENSE)ファイルを参照してください。