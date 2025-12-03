# Requirements Document

## Introduction

README-jp.mdファイルに2つの問題が発見されました：
1. クイックスタートセクションの画像リンクが正しくない、または順序が不適切
2. `cd specment-mono`コマンド実行後にmise警告が表示される問題

これらの問題を修正し、ユーザーがスムーズにクイックスタートを実行できるようにします。

## Glossary

- **README-jp.md**: 日本語版のREADMEファイル
- **mise**: 開発環境管理ツール
- **クイックスタート**: ユーザーが最初に実行する手順セクション
- **画像リンク**: Markdownファイル内の画像参照パス

## Requirements

### Requirement 1

**User Story:** ユーザーとして、README-jp.mdのクイックスタートセクションで正しい画像が正しい順序で表示されることを期待する

#### Acceptance Criteria

1. WHEN ユーザーがREADME-jp.mdのクイックスタートセクションを閲覧する時、THE システム SHALL 正しい画像ファイルへのリンクを表示する
2. WHEN ユーザーが画像のキャプションを読む時、THE システム SHALL 画像の内容と一致する説明を提供する
3. THE システム SHALL 英語版README.mdと同じ画像順序を維持する

### Requirement 2

**User Story:** ユーザーとして、クイックスタートの手順を実行する際に、不要な警告やエラーが表示されないことを期待する

#### Acceptance Criteria

1. WHEN ユーザーがクイックスタートの`cd`コマンドを実行する時、THE システム SHALL `cd my-spec-site`を指示する
2. WHEN ユーザーが`git clone https://github.com/plenarc/specment.git my-spec-site`を実行する時、THE システム SHALL その後の`cd my-spec-site`コマンドと一致する指示を提供する
3. IF mise警告が表示される場合、THEN THE システム SHALL ユーザーに適切な対処方法を説明する

### Requirement 3

**User Story:** ユーザーとして、README-jp.mdとREADME.mdの内容が一貫していることを期待する

#### Acceptance Criteria

1. THE システム SHALL 両方のREADMEファイルで同じ画像ファイルを参照する
2. THE システム SHALL 両方のREADMEファイルで同じ手順構造を維持する
3. WHEN 英語版が更新される時、THE システム SHALL 日本語版も対応する更新を反映する
