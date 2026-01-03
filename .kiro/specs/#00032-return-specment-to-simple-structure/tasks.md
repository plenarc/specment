# Implementation Plan: Return Specment to Simple Structure

## Overview

Specmentリポジトリを現在の複雑なモノレポ構造からv0.1.4時点のシンプルなDocusaurusベースの構造に戻す。既存のドキュメントコンテンツを保持しながら、最新のnpm依存関係を適用し、サンプルリポジトリとしての役割を明確化する。

## Tasks

- [x] 1. 事前準備とバックアップ
  - 現在の構造を分析・記録
  - 重要ファイルのバックアップ作成
  - 移行対象ファイルのリスト作成
  - _Requirements: 全体_

- [x] 2. 不要ディレクトリとファイルの削除
- [x] 2.1 モノレポ関連ディレクトリの削除
  - `packages/`ディレクトリを完全削除
  - `.changeset/`ディレクトリを削除
  - `pnpm-workspace.yaml`を削除
  - _Requirements: 1.4, 1.5, 6.2, 6.4, 6.5_

- [x] 2.2 不要なスペックファイルの削除
  - `.kiro/specs/#00031-specment-interactive-setup/`を削除
  - _Requirements: 6.1_

- [x] 3. コンテンツファイルの移動
- [x] 3.1 ドキュメントファイルの移動
  - `apps/website/docs/`を`docs/`に移動
  - `apps/website/src/`を`src/`に移動
  - `apps/website/static/`を`static/`に移動
  - `apps/website/templates/`を`templates/`に移動
  - _Requirements: 1.3, 5.1, 5.2, 5.3, 5.4_

- [x] 3.2 設定ファイルの移動
  - `apps/website/docusaurus.config.ts`をルートに移動
  - `apps/website/sidebars.ts`をルートに移動
  - `apps/website/tsconfig.json`をルートに移動
  - _Requirements: 1.3_

- [ ]* 3.3 ファイル移動の整合性テスト
  - **Property 2: コンテンツ保持の一貫性**
  - **Validates: Requirements 5.5**

- [x] 4. package.jsonの更新
- [x] 4.1 基本情報の更新
  - バージョンを1.0.1に更新
  - nameフィールドの確認
  - descriptionの更新
  - _Requirements: 3.1_

- [x] 4.2 スクリプトの簡素化
  - モノレポ関連スクリプトを削除
  - 標準Docusaurusスクリプトのみ保持（start, build, serve）
  - 複雑なビルドスクリプトを削除
  - _Requirements: 4.1, 4.2, 4.4_

- [x] 4.3 依存関係の更新
  - すべてのnpm依存関係を最新バージョンに更新
  - Docusaurusを最新安定版に更新
  - TypeScriptを最新安定版に更新
  - 開発依存関係を最新バージョンに更新
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [ ]* 4.4 依存関係更新のテスト
  - **Property 3: 依存関係更新の正確性**
  - **Validates: Requirements 2.1, 2.4**

- [x] 5. 設定ファイルの更新
- [x] 5.1 TypeScript設定の簡素化
  - tsconfig.jsonをシンプルな設定に更新
  - モノレポ関連設定を削除
  - _Requirements: 4.5_

- [x] 5.2 その他設定ファイルの更新
  - changesetとpublish関連設定を削除
  - 不要な設定ファイルを削除
  - _Requirements: 4.3_

- [ ]* 5.3 設定ファイル簡素化のテスト
  - **Property 4: 設定ファイルの簡素化**
  - **Validates: Requirements 4.1, 4.2**

- [x] 6. README.mdの書き換え
- [x] 6.1 サンプルリポジトリとしての説明追加
  - サンプルリポジトリであることを明記
  - create-specmentで作った結果がこのサイトになることを説明
  - _Requirements: 7.1, 7.3_

- [x] 6.2 導入手順の変更
  - 既存の導入手順を削除
  - https://github.com/plenarc/create-specment への誘導のみ記載
  - _Requirements: 7.2_

- [x] 6.3 カスタマイズ方法の更新
  - カスタマイズ方法はDocusaurus公式ドキュメント参照と記載
  - フォークに関する説明を削除
  - _Requirements: 7.4, 7.5_

- [ ]* 6.4 README.md内容のテスト
  - 必要な内容が含まれていることを確認
  - 不要な内容が削除されていることを確認
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 7. appsディレクトリの削除
- [x] 7.1 移動完了後のappsディレクトリ削除
  - すべてのファイル移動完了を確認
  - `apps/`ディレクトリを削除
  - _Requirements: 6.3_

- [ ]* 7.2 不要ファイル削除のテスト
  - **Property 5: 不要ファイルの完全削除**
  - **Validates: Requirements 6.2, 6.3, 6.4**

- [x] 8. Checkpoint - 構造変更の完了確認
  - すべてのファイル移動と削除が完了していることを確認
  - ユーザーに質問があれば聞く

- [x] 9. 動作確認とテスト
- [x] 9.1 基本コマンドの動作確認
  - `pnpm install`の実行と成功確認
  - `pnpm start`の実行と開発サーバー起動確認
  - `pnpm build`の実行とビルド成功確認
  - _Requirements: 8.1, 8.2, 8.3_

- [ ]* 9.2 Docusaurusコマンド動作のテスト
  - **Property 6: Docusaurusコマンドの動作保証**
  - **Validates: Requirements 8.1, 8.2, 8.3**

- [x] 9.3 ページ表示の確認
  - すべてのドキュメントページが正常に表示されることを確認
  - ナビゲーションが正常に機能することを確認
  - 内部リンクが正常に動作することを確認
  - _Requirements: 8.4, 8.5_

- [ ]* 9.4 ページ表示のテスト
  - **Property 7: ページ表示の正常性**
  - **Validates: Requirements 8.4, 8.5**

- [x] 10. テンプレート機能の確認
- [x] 10.1 既存テンプレートファイルの動作確認
  - `templates/`ディレクトリ内のテンプレートファイルが正常に機能することを確認
  - テンプレートファイルの内容が保持されていることを確認
  - _Requirements: 9.4_

- [ ]* 10.2 テンプレート互換性のテスト
  - **Property 8: テンプレート互換性の維持**
  - **Validates: Requirements 9.4**

- [x] 11. 最終確認と統合テスト
- [x] 11.1 全体的な動作確認
  - サンプルリポジトリとしての機能確認
  - create-specmentとの関係説明の妥当性確認
  - v0.1.4スタイルの構造になっていることを確認
  - _Requirements: 9.1, 9.2, 9.3, 9.5_

- [ ]* 11.2 構造変更完全性のテスト
  - **Property 1: 構造変更の完全性**
  - **Validates: Requirements 1.2, 1.3**

- [x] 11.3 バージョン1.0.1の確認
  - package.jsonのバージョンが1.0.1になっていることを確認
  - 新しいバージョンでの動作を確認
  - _Requirements: 3.1, 3.2_

- [x] 12. Final Checkpoint - 全体動作確認
  - すべてのテストが通ることを確認し、ユーザーに質問があれば聞く

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- Templates directory will be organized later as mentioned in design
- Backup creation is essential before starting any destructive operations
- All content must be preserved during the migration process
