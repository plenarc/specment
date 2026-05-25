# Spec作成ルール

## ディレクトリ命名規則

1. **Issue ID形式**: `#00000-feature-name`
   1. GitHub issue番号を5桁でゼロパディング
   1. ハイフンで区切ってfeature名をkebab-case形式で追加
   1. 例: `#00033-api-documentation-display`

1. **Feature名**: kebab-case形式
   1. 小文字とハイフンのみ使用
   1. 機能を簡潔に表現
   1. 例: `api-documentation-display`, `user-authentication`

## 必須ファイル

1. **requirements.md**: 要件定義書
1. **design.md**: 設計書
1. **tasks.md**: 実装タスクリスト

## 要件書の構造

1. **Introduction**: 機能の概要説明
1. **Glossary**: 用語定義（システム名、技術用語）
1. **Requirements**: EARS形式での要件定義
   1. User Story形式
   1. Acceptance Criteria（EARS形式）

## 参考

1. 既存のspecsを参考にする
1. EARS形式の詳細は `ears-format.md` を参照
1. 多言語対応は `markdown-output-format.md` を参照
