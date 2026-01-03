---
inclusion: always
---

# Markdown出力フォーマット設定

## 多言語ドキュメント出力ルール

GitHubのissueやドキュメントなど、多言語対応が必要なMarkdownファイルを作成する際は、以下のフォーマットに従う
コミットメッセージもこのルールに従うこと

### 基本構造

1. 各セクションで英語を先に記載し、その後に日本語を記載する
1. 番号付きリストを使用して言語を明確に区別する
1. `en`と`jp`のラベルを使用して言語を識別する

### フォーマット例

```markdown
## Section Title

1. en
    1. First point in English
    1. Second point in English
    1. Third point in English
1. jp
    1. 日本語での最初のポイント
    1. 日本語での2番目のポイント
    1. 日本語での3番目のポイント
```

### 適用対象

1. GitHubのissue description
1. プロジェクトドキュメント
1. READMEファイル
1. 仕様書やガイドライン

### 注意事項

1. コードブロックは言語セクションの外に配置し、共通で使用する
1. 画像やリンクも共通で使用できる場合は、言語セクションの外に配置する
1. 各言語セクション内では、適切なインデントを維持する
1. 箇条書きの階層構造を保つ
1. 箇条書きは常に `1. ` を使用する。インクリメント不要
1. 全角カッコ(`（`、`）`)の使用禁止。利用時は半角カッコ(`(`、`)`)を使用する

## 実装例

### GitHub Issue

```markdown
# Issue Title (English only)

## Problem Summary

1. en
    1. Description of the problem in English
    1. Additional context
1. jp
    1. 問題の説明(日本語)
    1. 追加のコンテキスト

## Steps to Reproduce

1. en
    1. Step 1 in English
    1. Step 2 in English
1. jp
    1. ステップ1(日本語)
    1. ステップ2(日本語)
```

### ドキュメント

```markdown
## Feature Description

1. en
    1. This feature allows users to...
    1. Key benefits include:
        1. Benefit A
        1. Benefit B
1. jp
    1. この機能により、ユーザーは...
    1. 主な利点:
        1. 利点A
        1. 利点B
```
