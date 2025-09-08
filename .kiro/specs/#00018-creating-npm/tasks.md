# 実装タスク: SpecmentのNPM登録

## Phase 1: 公開準備

### Task 1.1: package.jsonの最終確認
- [x] パッケージ名の確認 (`@plenarc/specment`)
- [x] バージョン情報の確認
- [x] メタデータ（description, keywords, author等）の確認
- [x] リポジトリ情報の確認
- [x] エンジン要件の確認

### Task 1.2: ビルドプロセスの検証
- [x] TypeScriptビルドの実行確認
- [x] 出力ファイルの検証
- [x] binフィールドの動作確認
- [x] 依存関係の最適化

### Task 1.3: filesフィールドの最適化
- [x] 公開対象ファイルの確認
- [x] 不要ファイルの除外
- [x] .npmignoreの設定（必要に応じて）

### Task 1.4: READMEの更新
- [x] インストール手順の追加
- [x] 使用方法の明確化
- [x] バッジの追加（NPMバージョン等）

## Phase 2: NPM公開

### Task 2.1: NPMアカウント・組織の設定
- [x] NPMアカウントの確認
- [x] @plenarcscopeの設定
- [x] 公開権限の確認

### Task 2.2: 初回公開の実行
- [x] `npm login`でログイン
- [x] `pnpm changeset:publish`で公開
- [x] 公開ログの確認

### Task 2.3: 公開確認
- [x] NPMレジストリでの確認
- [x] パッケージページの確認
- [x] メタデータの確認

## Phase 3: 動作確認

### Task 3.1: 新しい環境でのインストールテスト
- [x] 新しいディレクトリでのテスト
- [x] `npm install -g @plenarc/specment`の実行
- [x] インストール成功の確認

### Task 3.2: CLIコマンドの動作確認
- [x] `specment --version`の実行
- [x] `specment --help`の実行
- [x] バージョン情報の確認

### Task 3.3: テンプレート機能の確認
- [x] `specment init`の実行
- [x] プロジェクト初期化の確認
- [x] テンプレート生成の確認

## Phase 4: 継続的リリース

### Task 4.1: changesetワークフローの確認
- [x] changesetファイルの作成テスト
- [x] バージョン更新の確認
- [x] 公開プロセスの確認

### Task 4.2: 自動公開の設定
- [x] GitHub Actionsの設定確認
- [x] NPMトークンの設定
- [x] 自動公開の動作確認

### Task 4.3: リリースプロセスの文書化
- [x] リリース手順の文書化
- [x] トラブルシューティングガイドの作成
- [x] 貢献者向けガイドの更新

## 検証項目

### 公開前チェックリスト
- [x] ビルドが正常に完了する
- [x] テストが全て通る（テストファイルなし）
- [x] package.jsonの設定が適切
- [x] READMEが最新

### 公開後チェックリスト
- [x] NPMからインストール可能
- [x] CLIコマンドが動作する
- [x] テンプレート機能が動作する
- [x] バージョン情報が正しい

### 継続的リリースチェックリスト
- [x] changesetでバージョン更新可能
- [x] 自動公開が動作する
- [x] リリースノートが生成される
- [x] ドキュメントが更新される

## Phase 5: バージョン更新

### Task 5.1: 全package.jsonのバージョン更新
- [x] ルートpackage.jsonを0.1.6に更新
- [x] packages/specment/package.jsonを0.1.6に更新
- [x] apps/website/package.jsonを0.1.6に更新
- [x] バージョン整合性の確認