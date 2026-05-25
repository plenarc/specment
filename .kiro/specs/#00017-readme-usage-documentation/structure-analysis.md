# README.md 構造分析と新セクション設計

## 3つのREADMEファイルの役割分析

### 1. ルート `README.md` (プロジェクト全体)
- **対象**: プロジェクト全体の概要を求める人（新規ユーザー、評価検討者、開発者）
- **現在の役割**: monorepoの開発者向け情報が中心
- **必要な改善**: 新規ユーザー向けの価値提案、Usage Patterns、Quick Startの追加

### 2. `packages/specment/README.md` (CLIツール)
- **対象**: CLIツールの直接ユーザー（NPMからインストールする人）
- **現在の役割**: 基本的なCLI使用方法を説明
- **必要な改善**: より詳細な使用例、設定オプション、実例への参照

### 3. `apps/docs/README-specment.md` (ドッグフード運用ガイド)
- **対象**: このプロジェクト内でSpecmentを使う開発者
- **現在の役割**: 実際の運用方法を詳細に説明（実例として機能）
- **必要な改善**: ルートREADMEとの連携、参照関係の明確化

## ルート README.md の構造分析

### 既存セクション分析

#### 保持すべき開発者向け情報
1. **Project Structure - プロジェクト構成**
   - 対象: 開発者、コントリビューター
   - 内容: monorepoの構造説明
   - 配置: 中間部（新規ユーザー向けセクション後）

2. **Preparation - 前準備**
   - 対象: 開発者
   - 内容: 開発環境セットアップ（mise, Node.js, pnpm）
   - 配置: Development セクション内に統合

3. **Development - 開発**
   - 対象: 開発者、コントリビューター
   - 内容: 開発サーバー起動、ビルド、テスト手順
   - 配置: 後半部（開発者向けセクション）

4. **Code Quality - コード品質**
   - 対象: 開発者、コントリビューター
   - 内容: フォーマッター、リンター、型チェック
   - 配置: 後半部（開発者向けセクション）

5. **Release Management - リリース管理**
   - 対象: メンテナー
   - 内容: Changesets を使用したリリースワークフロー
   - 配置: 後半部（開発者向けセクション）

6. **Contributing - 貢献**
   - 対象: コントリビューター
   - 内容: 貢献ガイドライン
   - 配置: 最終部

#### 改善が必要な既存内容
1. **冒頭の説明**
   - 現状: 技術的な説明のみ（"monorepo containing a CLI tool"）
   - 問題: エンドユーザーにとって価値が不明
   - 改善: Specmentの目的と価値を明確に説明

2. **Example セクション**
   - 現状: 単一の技術的な例のみ
   - 問題: 運用パターンが不明
   - 改善: 2つの運用パターンを明確に説明

## 新セクション設計

### 新規追加セクション

#### 1. About Specment（新規）
- **配置**: 冒頭（タイトル直後）
- **目的**: ツールの価値提案を明確に伝える
- **対象**: 新規ユーザー、評価検討者
- **内容**:
  - Specmentとは何か（仕様書管理ツール）
  - 解決する問題（仕様書作成の煩雑さ、サイト化の手間）
  - 主な機能（テンプレート管理、Docusaurus統合、自動化）
  - 利点（効率化、一貫性、保守性）
  - 視覚的要素: `img/screenshot-overview.png` を使用

#### 2. Usage Patterns（新規）
- **配置**: About Specment の後
- **目的**: 2つの運用方法とそれぞれのメリットを説明
- **対象**: 導入検討者、プロジェクトマネージャー
- **内容**:
  - **Standalone Project（単独サイト運用）**
    - 特徴: 専用の仕様書サイト
    - メリット: シンプルなセットアップ、完全な制御
    - 適用場面: 新規プロジェクト、専用ドキュメントサイト
  - **Monorepo Integration（Monorepo導入）**
    - 特徴: ワークスペース依存関係として統合
    - メリット: 一貫性、共有テンプレート、既存ワークフローとの統合
    - 適用場面: 既存monorepo、複数パッケージの統一仕様書

#### 3. Quick Start（新規）
- **配置**: Usage Patterns の後
- **目的**: 各パターンの具体的な導入手順を提供
- **対象**: 実装担当者
- **内容**:
  - **Standalone Setup**
    ```bash
    npm install -g @plenarc/specment
    specment init
    # 基本設定例
    ```
  - **Monorepo Integration**
    ```bash
    pnpm add -D @plenarc/specment
    # ワークスペース設定例
    ```
  - 実例への参照: `apps/docs` の設定を参照

### 再編成される既存セクション

#### Project Structure（移動・調整）
- **現在の配置**: 冒頭部
- **新しい配置**: Quick Start の後
- **調整内容**: 
  - 新規ユーザー向けの説明を追加
  - 各ディレクトリの役割をより明確に説明

#### Development（統合・再編成）
- **統合内容**: Preparation セクションを統合
- **新しい構造**:
  - Prerequisites（前準備）
  - Documentation Site Development
  - CLI Tool Development
  - Build All

## 3つのREADMEファイルの連携設計

### ルート README.md の新構造
```
README.md (プロジェクト全体)
├── # Specment (タイトル)
├── About Specment (新規)
├── Usage Patterns (新規)
├── Quick Start (新規)
│   ├── Standalone Setup → packages/specment/README.md への参照
│   └── Monorepo Integration → apps/docs/README-specment.md への参照
├── Project Structure (既存・移動・調整)
├── Development (既存・統合・再編成)
├── Code Quality (既存・保持)
├── Release Management (既存・保持)
└── Contributing (既存・保持)
```

### packages/specment/README.md の改善点
```
packages/specment/README.md (CLIツール)
├── # @plenarc/specment (既存)
├── Installation (既存・改善)
├── Usage (既存・拡張)
│   ├── Basic Commands (既存)
│   ├── Advanced Examples (新規)
│   └── Real-world Usage → apps/docs への参照
├── Templates (既存・拡張)
├── Configuration (既存・詳細化)
└── Development (既存・ルートへの参照)
```

### apps/docs/README-specment.md の位置づけ
```
apps/docs/README-specment.md (実例ガイド)
├── 現在の構造を維持
├── ルートREADMEからの参照を受ける
└── packages/specment/README.mdからの参照を受ける
```

## セクション間の論理的な流れ

### ユーザージャーニー設計

1. **発見・理解段階** (About Specment)
   - 「Specmentとは何か？」
   - 「なぜ使うべきか？」

2. **評価・選択段階** (Usage Patterns)
   - 「どの運用方法が適しているか？」
   - 「それぞれのメリットは？」

3. **導入・実装段階** (Quick Start)
   - 「どうやって始めるか？」
   - 「具体的な手順は？」

4. **理解・探索段階** (Project Structure)
   - 「プロジェクトはどう構成されているか？」
   - 「各部分の役割は？」

5. **開発・貢献段階** (Development以降)
   - 「開発環境をどう構築するか？」
   - 「どう貢献するか？」

### 情報の階層化

- **レベル1**: 新規ユーザー向け（About, Usage Patterns, Quick Start）
- **レベル2**: 理解深化（Project Structure）
- **レベル3**: 開発者向け（Development以降）

## 3つのREADMEファイル間の参照関係

### 参照フロー設計
1. **ルート README.md** → **packages/specment/README.md**
   - Quick Start の Standalone Setup から詳細なCLI使用方法へ
   
2. **ルート README.md** → **apps/docs/README-specment.md**
   - Quick Start の Monorepo Integration から実例運用ガイドへ
   
3. **packages/specment/README.md** → **apps/docs/README-specment.md**
   - Real-world Usage セクションから実際の運用例へ
   
4. **apps/docs/README-specment.md** → **ルート README.md**
   - プロジェクト全体の理解のための逆参照

## 要件との対応

- **要件1.1**: ルートREADMEのAbout Specmentセクションでツールの目的と価値を明確に説明
- **要件5.1**: 3つのREADMEそれぞれで既存の開発者向け情報を適切な位置に保持
- **要件5.3**: 3つのREADMEファイル間の論理的な流れと参照関係を確立し、目的別アクセスを改善

## 実装上の考慮事項

### 多言語対応
- 英語版と日本語版で同じ構造を維持
- セクションタイトルの一貫性

### 視覚的要素
- `img/screenshot-overview.png`: About Specmentセクションで使用
- `img/screenshot-top.png`: Usage Patternsセクションで使用可能
- `img/screenshot-as-is.png`: Quick Startセクションで使用可能

### リンク戦略
- 内部セクション間のナビゲーション
- 外部リソース（apps/docs）への適切な参照
- GitHub Pages サイトへのリンク維持
#
# 各READMEファイルの編集優先度

### 高優先度: ルート README.md
- 新規ユーザーの最初の接点
- プロジェクト全体の価値提案が必要
- 3つのREADMEの中で最も影響が大きい

### 中優先度: packages/specment/README.md
- NPMパッケージとして独立して参照される
- CLI使用者の直接的なドキュメント
- より詳細な使用例と設定が必要

### 低優先度: apps/docs/README-specment.md
- 既に充実した内容
- 実例として機能している
- 主に参照関係の追加のみ必要

## 実装戦略

1. **Phase 1**: ルート README.md の新セクション追加と既存セクション再編成
2. **Phase 2**: packages/specment/README.md の拡張と実例参照の追加
3. **Phase 3**: 3つのREADMEファイル間の参照関係の確立