# Design Document

## Overview

README-jp.mdファイルに存在する2つの問題を修正します：

1. **画像リンクの問題**: クイックスタートセクションの画像リンクが正しくない、または順序が不適切
2. **ディレクトリ名の不一致**: `cd specment-mono`が記載されているが、実際にクローンされるディレクトリ名(`my-spec-site`)と一致していない

この修正は、ユーザーがクイックスタートの手順をスムーズに実行できるようにすることを目的としています。

## Architecture

この修正は単純なドキュメント修正であり、コードの変更は不要です。以下のアプローチで実施します：

### 修正対象ファイル

- `README-jp.md`: 日本語版READMEファイル

### 参照ファイル

- `README.md`: 英語版READMEファイル（正しい内容の参照元）

### 修正方針

1. **英語版との整合性を保つ**: README.mdの内容を基準として、README-jp.mdを修正
2. **最小限の変更**: 問題のある箇所のみを修正し、他の部分は変更しない
3. **検証可能性**: 修正後、実際にクイックスタートの手順を実行して動作確認

## Components and Interfaces

### 修正対象セクション

#### 1. クイックスタートセクションの画像リンク

**現状分析:**
- README-jp.mdとREADME.mdの両方を確認したところ、画像リンク自体は同じものを使用している
- 画像の順序も一致している
- 実際には画像リンクに問題は見つからなかった

**結論:**
- issue #27で報告された画像リンクの問題は、現在のREADME-jp.mdでは既に修正されている可能性がある
- または、問題の詳細が不明確である
- この項目については、ユーザーに確認が必要

#### 2. ディレクトリ名の不一致

**現状:**
```bash
cd ~/projects
git clone https://github.com/plenarc/specment.git my-spec-site
cd my-spec-site  # ← 正しい
```

**問題:**
- issue #27では`cd specment-mono`という誤った記載があると報告されているが、現在のREADME-jp.mdでは既に`cd my-spec-site`と正しく記載されている

**結論:**
- この問題も既に修正されている可能性がある
- ファイルの全体を再確認する必要がある

### 修正が必要な可能性のある箇所

README-jp.mdの以下のセクションを重点的に確認：

1. **パターン1: 単独プロジェクト運用**セクション
2. **パターン2: Monorepo統合**セクション
3. 画像リンクが含まれる全てのセクション

## Data Models

ドキュメント修正のため、データモデルは不要です。

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. 
Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Acceptance Criteria Testing Prework

#### 1.1 WHEN ユーザーがREADME-jp.mdのクイックスタートセクションを閲覧する時、THE システム SHALL 正しい画像ファイルへのリンクを表示する

**Thoughts:** これは画像リンクが正しいパスを指しているかを確認する要件です。全ての画像リンクに対して、ファイルが実際に存在し、パスが正しいことを確認できます。ただし、これは手動確認またはリンクチェッカーツールで検証する内容であり、プログラムの動作を検証するプロパティではありません。

**Testable:** no

#### 1.2 WHEN ユーザーが画像のキャプションを読む時、THE システム SHALL 画像の内容と一致する説明を提供する

**Thoughts:** これは画像の内容とキャプションの意味的な一致を確認する要件です。人間の判断が必要であり、自動テストでは検証できません。

**Testable:** no

#### 1.3 THE システム SHALL 英語版README.mdと同じ画像順序を維持する

**Thoughts:** これは2つのファイル間で画像の出現順序が一致しているかを確認する要件です。ファイルを解析して画像リンクを抽出し、順序を比較することで自動検証できます。

**Testable:** yes - property

#### 2.1 WHEN ユーザーがクイックスタートの`cd`コマンドを実行する時、THE システム SHALL `cd my-spec-site`を指示する

**Thoughts:** これは特定のコマンド文字列が正しく記載されているかを確認する要件です。ファイル内で`cd my-spec-site`が存在し、誤った`cd specment-mono`が存在しないことを確認できます。

**Testable:** yes - example

#### 2.2 WHEN ユーザーが`git clone https://github.com/plenarc/specment.git my-spec-site`を実行する時、THE システム SHALL その後の`cd my-spec-site`コマンドと一致する指示を提供する

**Thoughts:** これはgit cloneコマンドで指定されたディレクトリ名と、その後のcdコマンドで指定されたディレクトリ名が一致しているかを確認する要件です。パターンマッチングで検証できます。

**Testable:** yes - property

#### 2.3 IF mise警告が表示される場合、THEN THE システム SHALL ユーザーに適切な対処方法を説明する

**Thoughts:** これはドキュメントにmise警告に関する説明が含まれているかを確認する要件です。ただし、「適切な対処方法」の判断は人間が行う必要があります。

**Testable:** no

#### 3.1 THE システム SHALL 両方のREADMEファイルで同じ画像ファイルを参照する

**Thoughts:** これは2つのファイルで使用されている画像ファイルのパスが一致しているかを確認する要件です。ファイルを解析して画像リンクを抽出し、比較することで自動検証できます。

**Testable:** yes - property

#### 3.2 THE システム SHALL 両方のREADMEファイルで同じ手順構造を維持する

**Thoughts:** これは2つのファイルの構造的な一致を確認する要件ですが、「同じ手順構造」の定義が曖昧です。見出しの階層構造やセクションの順序を比較することは可能ですが、完全な自動検証は困難です。

**Testable:** no

#### 3.3 WHEN 英語版が更新される時、THE システム SHALL 日本語版も対応する更新を反映する

**Thoughts:** これは将来的な更新プロセスに関する要件であり、現在の修正作業では検証できません。継続的な同期プロセスの要件です。

**Testable:** no

### Property Reflection

テスト可能と判断されたプロパティを見直します：

- **1.3**: 英語版と日本語版の画像順序の一致
- **2.1**: 特定のコマンド文字列の存在確認（example）
- **2.2**: git cloneとcdコマンドのディレクトリ名の一致
- **3.1**: 両方のREADMEファイルで同じ画像ファイルを参照

**冗長性の確認:**
- プロパティ1.3と3.1は関連していますが、異なる側面を検証しています
  - 1.3: 画像の順序
  - 3.1: 画像ファイルのパス
  - これらは独立した検証価値があるため、両方を保持します

- プロパティ2.1と2.2も関連していますが、異なる側面を検証しています
  - 2.1: 特定の正しいコマンドの存在（example）
  - 2.2: コマンド間の一貫性（property）
  - 2.1はexampleなので、2.2で包含されません。両方を保持します

**結論:** 全てのプロパティは独立した検証価値があり、冗長性はありません。

### Correctness Properties

Property 1: 画像順序の一致
*For any* 画像リンクのリスト、README.mdとREADME-jp.mdで抽出された画像リンクの順序は同じでなければならない
**Validates: Requirements 1.3**

Property 2: ディレクトリ名の一致
*For any* git cloneコマンドとcdコマンドのペア、git cloneで指定されたディレクトリ名とその直後のcdコマンドで指定されたディレクトリ名は一致しなければならない
**Validates: Requirements 2.2**

Property 3: 画像ファイルパスの一致
*For any* 画像リンク、README.mdとREADME-jp.mdで使用されている画像ファイルのパスは同じでなければならない
**Validates: Requirements 3.1**

## Error Handling

ドキュメント修正のため、エラーハンドリングは不要です。

ただし、修正作業中に以下の確認を行います：

1. **ファイルの存在確認**: 修正対象のREADME-jp.mdが存在することを確認
2. **バックアップ**: 修正前にファイルのバックアップを取る（Gitで管理されているため、コミット前の状態で復元可能）
3. **構文チェック**: Markdown構文が壊れていないことを確認

## Testing Strategy

### Manual Testing

ドキュメント修正のため、主に手動テストを実施します：

1. **視覚的確認**
   - README-jp.mdをGitHubまたはMarkdownビューアで表示
   - 画像が正しく表示されることを確認
   - レイアウトが崩れていないことを確認

2. **実行テスト**
   - クイックスタートの手順を実際に実行
   - `git clone`コマンドが正しく動作することを確認
   - `cd my-spec-site`コマンドが正しいディレクトリに移動することを確認
   - mise警告が表示される場合、その内容を確認

3. **比較確認**
   - README.mdとREADME-jp.mdを並べて比較
   - 画像リンクの順序が一致していることを確認
   - 手順の構造が一致していることを確認

### Automated Testing (Optional)

以下の自動テストを実装することも可能です：

1. **リンクチェック**
   - Markdownファイル内の全てのリンクが有効であることを確認
   - 画像ファイルが実際に存在することを確認

2. **構文チェック**
   - Markdownlintを使用して構文エラーをチェック

3. **Property-Based Testing**
   - Property 1, 2, 3を実装して、継続的に検証

ただし、今回は単純なドキュメント修正のため、手動テストのみで十分です。

## Implementation Notes

### 修正手順

1. **現状確認**
   - README-jp.mdの現在の内容を確認
   - issue #27で報告された問題が実際に存在するか確認

2. **問題の特定**
   - 画像リンクの問題を特定
   - ディレクトリ名の不一致を特定

3. **修正実施**
   - 特定された問題を修正
   - README.mdとの整合性を確認

4. **検証**
   - 修正内容を確認
   - クイックスタートの手順を実行して動作確認

5. **コミット**
   - 修正内容をコミット
   - issue #27をクローズ

### 注意事項

1. **最小限の変更**: 問題のある箇所のみを修正し、不要な変更は避ける
2. **英語版との整合性**: README.mdの内容を基準として修正
3. **Markdown構文**: 修正後もMarkdown構文が正しいことを確認
4. **画像パス**: 相対パスが正しいことを確認（`.github/images/`から始まる）

### 既知の問題

現在のREADME-jp.mdを確認したところ、issue #27で報告された問題の一部は既に修正されている可能性があります：

- ディレクトリ名は既に`my-spec-site`と正しく記載されている
- 画像リンクも正しいパスを使用している

ただし、ファイル全体を再確認し、見落としがないか確認する必要があります。
