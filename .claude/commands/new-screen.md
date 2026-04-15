以下の手順で画面定義ドキュメントを新規作成する。

引数: $ARGUMENTS
形式: `<physical_name> <logical_name>`
例: `order-list 注文一覧`

## 手順

1. `docs/04-internal/screens/` 配下の `.mdx` ファイルを確認し、次の `sidebar_position` の値を決定する(既存ファイルの最大値 + 1)
1. 以下のテンプレートで `docs/04-internal/screens/{physical_name}.mdx` を作成する
1. `docs/04-internal/screens/index.mdx` の画面一覧に行を追加する

## テンプレート

```mdx
---
sidebar_position: {sidebar_position}
---
import { TBD } from '@site/src/components/TBD';

# {logical_name}
## ファイル
<!-- 1. frontend/src/routes/[{physical_name}.svelte](../../../../frontend/src/routes/{physical_name}.svelte) -->

## 概要
1. <TBD/>

## 画面イメージ
1. <TBD/>

## 項目説明
1. <TBD/>
```

## index.mdx への追加形式

既存の最終行の下に追加する。

```markdown
| [{physical_name}]({physical_name}.mdx) | {logical_name} | - |  |
```
