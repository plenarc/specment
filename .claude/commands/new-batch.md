以下の手順でバッチ定義ドキュメントを新規作成する。

引数: $ARGUMENTS
形式: `<id> <logical_name>`
例: `import-orders 注文取込`

## 手順

1. `docs/04-internal/batches/` 配下の `.mdx` ファイルを確認し、次の `sidebar_position` の値を決定する(既存ファイルの最大値 + 1)
1. 以下のテンプレートで `docs/04-internal/batches/{id}.mdx` を作成する
1. `docs/04-internal/batches/index.mdx` の該当セクションに行を追加する(セクション分類が不明な場合はユーザーに確認する)

## テンプレート

```mdx
---
sidebar_position: {sidebar_position}
tags:
  - batch
---
import { TBD } from '@site/src/components/TBD';

# {id} - {logical_name}
## 概要 {#overview}
1. <TBD/>

## 前提条件 {#prerequisite}
1. <TBD/>

## サイクル {#cycle}
1. cron
    1. `<TBD>`

## フロー {#flow}

:::info info
1. 設計はアクティビティ図ではなく、シーケンス図がオススメ
1. 各フェーズごとのエラー処理、メッセージ内容は明確にする
:::

```pumld
@startuml
participant User
User -> A: DoWork
activate A #FFBBBB
  A -> A: Internal call
  activate A #DarkSalmon
    A -> B: << createRequest >>
    activate B
      B --> A: RequestCreated
    deactivate B
  deactivate A
  A -> User: Done
deactivate A
@enduml
```

## 関数 {#functions}
```

## index.mdx への追加形式

既存の該当セクション末尾に追加する。

```markdown
| [{id}]({id}.mdx) | {logical_name} | <TBD/> | <TBD/> | <TBD/> | <TBD/> |
```
