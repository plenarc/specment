以下の手順でテーブル定義ドキュメントを新規作成する。

引数: $ARGUMENTS
形式: `<physical_name> <logical_name> <schema> <description>`
例: `orders 注文 public 注文情報を管理するテーブル`

## 手順

1. `docs/04-internal/tables/` 配下の `.mdx` ファイルを確認し、次の `sidebar_position` の値を決定する(既存ファイルの最大値 + 1)
1. 以下のテンプレートで `docs/04-internal/tables/{physical_name}.mdx` を作成する
1. `docs/04-internal/tables/index.mdx` のテーブル一覧に行を追加する

## テンプレート

```mdx
---
sidebar_position: {sidebar_position}
hide_table_of_contents: true
---
import TOCInline from '@theme/TOCInline';

# {physical_name} - {logical_name}

<details>
  <summary>目次</summary>

  <TOCInline toc={toc} />
</details>

## 説明 {#description}
1. {description}

## 表領域(schema) {#schema}
1. `{schema}`

## 定義 {#definition}

| Physical name    | Logical name | Type      | Digit | Not null | Default value     | Comment |
| ---------------- | ------------ | --------- | ----: | :------: | ----------------- | ------- |
| id               | ID           | serial    |     - |   :o:    |                   |         |
| created_id       | 作成者ID     | integer   |     - |    -     |                   |         |
| created_at       | 作成日時     | timestamp |     - |   :o:    | current_timestamp |         |
| last_modified_id | 更新者ID     | integer   |     - |   :o:    |                   |         |
| last_modified_at | 更新日時     | timestamp |     - |   :o:    | current_timestamp |         |
```

## index.mdx への追加形式

既存の最終行の下に追加する。親テーブルがある場合は `└` でネストして記載すること。

```markdown
| [{physical_name}]({physical_name}.mdx) | {logical_name} | {schema} |  |
```
