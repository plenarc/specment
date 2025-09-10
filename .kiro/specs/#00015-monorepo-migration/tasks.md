# 実装計画

## ワークスペース基盤構築

- [x] 1. pnpm workspace設定ファイルの作成
  - pnpm-workspace.yamlファイルを作成し、apps/*とpackages/*をワークスペースとして定義
  - _要件: 1.1_

- [x] 2. ルートpackage.jsonの調整
  - 共通のdevDependenciesを整理し、ワークスペース管理用の設定を追加
  - 既存のpnpm設定とengines設定を保持
  - _要件: 1.1, 1.2_

## Docusaurusサイトの移行

- [x] 3. apps/docsディレクトリ構造の作成
  - apps/docsディレクトリを作成
  - 必要なサブディレクトリ構造を準備
  - _要件: 2.1_

- [x] 4. コンテンツディレクトリの移動
  - docs/ディレクトリをapps/docs/docs/に移動
  - src/ディレクトリをapps/docs/src/に移動  
  - static/ディレクトリをapps/docs/static/に移動
  - _要件: 2.1_

- [x] 5. 設定ファイルの移動と調整
  - docusaurus.config.tsをapps/docs/に移動し、パス参照を調整
  - sidebars.tsをapps/docs/に移動
  - .markdownlint.yamlをapps/docs/に移動
  - _要件: 2.2_

- [x] 6. apps/docs用package.jsonの作成
  - Docusaurus関連の依存関係を移動
  - 既存のscriptsを適切に設定
  - ワークスペース内での相対参照を設定
  - _要件: 2.2_

- [x] 7. apps/docs用tsconfig.jsonの作成
  - TypeScript設定をワークスペース構成に適合させる
  - 既存の型定義との互換性を保持
  - _要件: 2.2_

- [x] 8. apps/docsでのローカル動作確認
  - pnpm startコマンドでの開発サーバー起動テスト
  - pnpm buildコマンドでの静的サイトビルドテスト
  - 全ページの表示確認とリンク動作確認
  - _要件: 2.3, 2.4_

## CI/CDパイプラインの更新

- [x] 9. GitHub Actions deploy.ymlの更新
  - apps/docsディレクトリでのビルド処理に変更
  - ワークスペース構成に対応したpnpm installとbuildコマンドの調整
  - _要件: 3.1_

- [x] 10. GitHub Actions test-deploy.ymlの更新
  - apps/docsでのテストデプロイ処理に変更
  - Smoke testのパス調整
  - _要件: 3.1_

- [x] 11. CI/CD動作確認
  - テストブランチでのGitHub Actions実行確認
  - GitHub Pagesへの正常デプロイ確認
  - _要件: 3.1, 3.4_

## CLIパッケージ基盤の準備

- [x] 12. packages/specmentディレクトリ構造の作成
  - packages/specmentディレクトリを作成
  - bin/, templates/, recipes/, migrations/, assets/サブディレクトリを作成
  - _要件: 4.1, 4.2_

- [x] 13. packages/specment用package.jsonの作成


  - @plenarc/specmentパッケージ名で設定
  - 将来のnpm公開に向けた基本設定
  - CLIツールとしてのbin設定準備
  - _要件: 4.1, 4.2_

- [x] 14. packages/specment用README.mdの作成
  - CLIツールとしての基本的な使用方法を記載
  - インストール手順とコマンド概要を記載
  - _要件: 4.2_

## バージョン管理とリリース準備

- [x] 15. changesetsの設定
  - @changesets/cliの導入と設定
  - ワークスペース対応のchangeset設定
  - _要件: 3.3, 4.3_

- [x] 16. GitHub Actions release.ymlの作成


- [x] 16.1 npmアカウント設定とスコープ確認


  - npm loginでアカウント認証
  - @plenarcスコープの使用権限確認
  - 必要に応じて初回パッケージ公開の準備
  - _要件: 4.3_
- [x] 16.2 GitHub Actions release.ymlの作成
  - packages/specmentのnpm公開用ワークフロー作成
  - changesetsと連携したバージョン管理設定
  - NPM_TOKENシークレットの設定準備
  - _要件: 3.2, 3.3_

## ドキュメント更新と最終確認

- [x] 17. ルートREADME.mdの更新


  - monorepo構成での開発手順を記載
  - 各ワークスペースでの起動/ビルド手順を記載
  - _要件: 6.2, 6.3_

- [x] 17.5. package.json設定の統一
  - 全ワークスペースのpackage.jsonでバージョン統一（0.1.4）
  - lint・formatterをbiome使用に統一
  - 共通依存関係のバージョン統一（TypeScript、Node.jsなど）
  - engines設定の統一（node: ">=22.0"）
  - 不要な重複依存関係の整理
  - _要件: 1.2, 6.2_

- [x] 18. 不要ファイルのクリーンアップ
  - ルートディレクトリから移動済みファイルの削除
  - .gitignoreの調整
  - _要件: 6.4_

- [x] 19. 最終動作確認
  - 全ワークスペースでのpnpm installテスト
  - apps/docsでの完全なビルド・デプロイテスト
  - 既存機能の回帰テスト実行
  - _要件: 1.2, 1.3, 2.3, 2.4, 6.4_

- [x] 20. ドッグフード運用の準備
  - apps/docsでのspecmentツール使用環境の構築
  - 既存ドキュメント構造との整合性確認
  - _要件: 5.1, 5.2, 5.3_
