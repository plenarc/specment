# Requirements Document

## Introduction

Specmentリポジトリを、v0.1.4時点のシンプルなフォルダ構成に戻し、最新のnpmパッケージバージョンを適用する。現在の複雑なモノレポ構造から、ドキュメントサイトテンプレートとしての本来の目的に特化したシンプルな構造に変更する。

## Glossary

- **Specment**: 仕様書作成に特化したDocusaurusベースのドキュメントサイトテンプレート
- **Simple_Structure**: v0.1.4時点のシンプルなフォルダ構成
- **Repository**: 現在のSpecmentリポジトリ
- **Monorepo_Structure**: 現在の複雑なモノレポ構成
- **Documentation_Site**: 生成されるドキュメントサイト

## Requirements

### Requirement 1: フォルダ構造の簡素化

**User Story:** 開発者として、v0.1.4のようなシンプルなフォルダ構成でSpecmentを使用したい

#### Acceptance Criteria

1. THE Repository SHALL v0.1.4時点のフォルダ構成を復元する
2. WHEN モノレポ構造が削除される時、THE Repository SHALL 単一のDocusaurusプロジェクト構造になる
3. THE Repository SHALL `apps/website/`の内容をルートディレクトリに移動する
4. THE Repository SHALL `packages/`ディレクトリを完全に削除する
5. THE Repository SHALL `pnpm-workspace.yaml`を削除する

### Requirement 2: 最新パッケージバージョンの適用

**User Story:** 開発者として、最新のnpmパッケージを使用してセキュリティと機能を向上させたい

#### Acceptance Criteria

1. THE Repository SHALL すべてのnpm依存関係を最新バージョンに更新する
2. THE Repository SHALL Docusaurusを最新の安定版に更新する
3. THE Repository SHALL TypeScriptを最新の安定版に更新する
4. THE Repository SHALL 開発依存関係を最新バージョンに更新する
5. WHEN パッケージが更新される時、THE Repository SHALL 互換性を確保する

### Requirement 3: バージョン更新

**User Story:** 開発者として、リポジトリのバージョンを適切に管理したい

#### Acceptance Criteria

1. THE Repository SHALL package.jsonのバージョンを1.0.1に更新する
2. THE Repository SHALL 新しいバージョンでの動作を確認する
3. THE Repository SHALL バージョン更新に伴う変更を記録する
4. THE Repository SHALL 1.0.1としてリリース準備を整える
5. THE Repository SHALL バージョン管理の一貫性を保つ

### Requirement 4: 設定ファイルの簡素化

**User Story:** 開発者として、シンプルな設定ファイルでプロジェクトを管理したい

#### Acceptance Criteria

1. THE Repository SHALL package.jsonからモノレポ関連のスクリプトを削除する
2. THE Repository SHALL 標準的なDocusaurusスクリプトのみを保持する
3. THE Repository SHALL changesetとpublish関連の設定を削除する
4. THE Repository SHALL 複雑なビルドスクリプトを削除する
5. THE Repository SHALL シンプルなTypeScript設定を適用する

### Requirement 5: ドキュメントコンテンツの保持

**User Story:** ユーザーとして、既存のドキュメントコンテンツを失うことなく構造を簡素化したい

#### Acceptance Criteria

1. THE Repository SHALL `apps/website/docs/`の内容を`docs/`に移動する
2. THE Repository SHALL `apps/website/src/`の内容を`src/`に移動する
3. THE Repository SHALL `apps/website/static/`の内容を`static/`に移動する
4. THE Repository SHALL `apps/website/templates/`の内容を`templates/`に移動する
5. THE Repository SHALL すべてのドキュメントファイルの内容を保持する

### Requirement 6: 不要なファイルの削除

**User Story:** 開発者として、不要なファイルを削除してリポジトリをクリーンに保ちたい

#### Acceptance Criteria

1. THE Repository SHALL `.kiro/specs/#00031-specment-interactive-setup/`を削除する
2. THE Repository SHALL `packages/`ディレクトリ全体を削除する
3. THE Repository SHALL `apps/`ディレクトリを削除する
4. THE Repository SHALL `.changeset/`ディレクトリを削除する
5. THE Repository SHALL モノレポ関連の設定ファイルを削除する

### Requirement 7: README.mdの更新

**User Story:** ユーザーとして、このリポジトリがサンプルリポジトリであることと、create-specmentとの関係を理解したい

#### Acceptance Criteria

1. THE Repository SHALL README.mdにサンプルリポジトリであることを明記する
2. THE Repository SHALL 導入手順を削除し、https://github.com/plenarc/create-specment への誘導のみを記載する
3. THE Repository SHALL create-specmentで作った結果がこのサイトになることを説明する
4. THE Repository SHALL カスタマイズ方法はDocusaurus公式ドキュメント参照と記載する
5. THE Repository SHALL フォークに関する説明を削除する

### Requirement 8: 動作確認

**User Story:** 開発者として、簡素化後もプロジェクトが正常に動作することを確認したい

#### Acceptance Criteria

1. WHEN `pnpm install`が実行される時、THE Repository SHALL 依存関係を正常にインストールする
2. WHEN `pnpm start`が実行される時、THE Repository SHALL 開発サーバーを起動する
3. WHEN `pnpm build`が実行される時、THE Repository SHALL 本番用ビルドを生成する
4. THE Repository SHALL すべてのドキュメントページが正常に表示される
5. THE Repository SHALL ナビゲーションが正常に機能する

### Requirement 9: 互換性の維持

**User Story:** 既存ユーザーとして、サンプルリポジトリとしての役割を理解したい

#### Acceptance Criteria

1. THE Repository SHALL サンプルリポジトリとしての明確な位置づけを示す
2. THE Repository SHALL create-specmentとの関係を明確に説明する
3. THE Repository SHALL 標準的なDocusaurusワークフローをサポートする
4. THE Repository SHALL 既存のテンプレートファイルとの互換性を保つ
5. THE Repository SHALL create-specmentで生成されるサイトの例として機能する