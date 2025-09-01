# 要件定義書

## はじめに

現在のspecmentリポジトリを、CLIツール（@plenarc/specment）とDocusaurusドキュメントサイト（apps/docs）に分離したpnpm workspace構成に移行します。これにより、CLIツールとしてのspecmentを独立したパッケージとして公開し、ドキュメントサイトでそのツールを実際に使用する（ドッグフード運用）環境を構築します。

## 要件

### 要件1: Workspace構成の設定

**ユーザーストーリー:** 開発者として、monorepo構成でCLIツールとドキュメントサイトを管理したいので、pnpm workspaceを使用した適切なディレクトリ構造を構築する

#### 受入基準

1. WHEN pnpm-workspace.yamlファイルが作成される THEN apps/*とpackages/*がワークスペースとして定義される
1. WHEN ルートディレクトリでpnpm installを実行する THEN 全てのワークスペースの依存関係が正しくインストールされる
1. WHEN 各ワークスペースでスクリプトを実行する THEN 相互依存関係が正しく解決される

### 要件2: Docusaurusサイトの移設

**ユーザーストーリー:** 開発者として、既存のDocusaurusサイトを維持しながらapps/docs/に移設したいので、全ての機能が正常に動作する状態で移行する

#### 受入基準

1. WHEN docs/, src/, static/ディレクトリがapps/docs/に移動される THEN 既存のコンテンツが全て保持される
1. WHEN docusaurus.config.ts, package.json, sidebars.tsがapps/docs/に移動される THEN 設定が正しく動作する
1. WHEN apps/docs/でpnpm startを実行する THEN ローカル開発サーバーが正常に起動する
1. WHEN apps/docs/でpnpm buildを実行する THEN 静的サイトが正常にビルドされる

### 要件3: CI/CDパイプラインの設定

**ユーザーストーリー:** 開発者として、自動デプロイと公開を行いたいので、GitHub ActionsでDocusaurusサイトのデプロイとnpmパッケージの公開を自動化する

#### 受入基準

1. WHEN .github/workflows/deploy.ymlが作成される THEN apps/docsがGitHub Pagesに自動デプロイされる
1. WHEN .github/workflows/release.ymlが作成される THEN packages/specmentがnpmに自動公開される
1. WHEN changesetsが設定される THEN バージョン管理とCHANGELOGが自動生成される
1. WHEN PRがマージされる THEN 適切なワークフローが実行される

### 要件4: バージョン管理とマイグレーション

**ユーザーストーリー:** 開発者として、CLIツールのバージョンアップを安全に行いたいので、SemVerとマイグレーション機能を実装する

#### 受入基準

1. WHEN packages/specment/migrations/ディレクトリが作成される THEN バージョン間のマイグレーションスクリプトが格納される
1. WHEN specment upgradeコマンドが実行される THEN 必要なマイグレーションが自動実行される
1. WHEN CHANGELOGが生成される THEN SemVerに従った変更履歴が記録される
1. WHEN 破壊的変更が発生する THEN メジャーバージョンが適切に更新される

### 要件5: ドッグフード運用の実現

**ユーザーストーリー:** 開発者として、apps/docsで@plenarc/specmentを実際に使用したいので、CLIツールを使ってドキュメントサイトを管理できる環境を構築する

#### 受入基準

1. WHEN apps/docsでspecmentツールが使用される THEN 既存の構造と整合性を保つ
1. WHEN 新しいドキュメントテンプレートが追加される THEN specmentの標準に従う
1. WHEN プロジェクトの健全性がチェックされる THEN specmentのルールに準拠する

### 要件6: 互換性の維持

**ユーザーストーリー:** 開発者として、既存の開発フローを維持したいので、monorepo化後も単独での使用が可能な構成にする

#### 受入基準

1. WHEN specmentツールが単独で使用される THEN monorepo外でも正常に動作する
1. WHEN 既存のREADME.mdが更新される THEN 新しい構成での使用方法が記載される
1. WHEN ローカル開発環境が構築される THEN 起動/ビルド確認手順が自動生成される
1. WHEN 依存関係が変更される THEN 既存の機能に影響を与えない