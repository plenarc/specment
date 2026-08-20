# リポジトリ解析・仕様書自動生成

ローカルリポジトリを解析し、このサイトの仕様書ドキュメントを自動生成する。

引数: $ARGUMENTS
形式: `<repo_path>`
例: `/home/user/projects/my-app`

## 手順

### 1. リポジトリ構造を把握する

まず Explore サブエージェントを使い、以下を調査する:

1. 使用言語・フレームワーク
1. ディレクトリ構成（src, app, routes, models, migrations, jobs など）
1. DBスキーマの場所（migration files, schema.rb, prisma/schema.prisma, *.sql など）
1. 画面・ルートの場所（routes/, pages/, views/, components/ など）
1. バッチ・ジョブの場所（jobs/, workers/, tasks/, cron/ など）
1. README, package.json, Gemfile など技術スタックが読める設定ファイル

### 2. 並列サブエージェントで各仕様を解析・生成する

構造把握の結果をもとに、以下を **並列で** サブエージェントに委任する。
各サブエージェントには「対象ディレクトリ・ファイル」と「出力先・フォーマット」を明示して渡すこと。

#### サブエージェント A: テーブル定義生成

1. DBスキーマ・マイグレーションファイルを読み取る
1. テーブルごとに `docs/04-internal/tables/{physical_name}.mdx` を生成する
1. フォーマットは `/new-table` コマンドのテンプレートに従う
1. `docs/04-internal/tables/index.mdx` の一覧テーブルにも追記する

#### サブエージェント B: 画面定義生成

1. ルート定義・ページコンポーネント・ビューファイルを読み取る
1. 画面ごとに `docs/04-internal/screens/{physical_name}.mdx` を生成する
1. フォーマットは `/new-screen` コマンドのテンプレートに従う
1. `docs/04-internal/screens/index.mdx` の一覧テーブルにも追記する

#### サブエージェント C: バッチ定義生成

1. バッチ・ジョブ・ワーカーファイルを読み取る
1. バッチごとに `docs/04-internal/batches/{id}.mdx` を生成する
1. フォーマットは `/new-batch` コマンドのテンプレートに従う
1. `docs/04-internal/batches/index.mdx` の一覧テーブルにも追記する

#### サブエージェント D: 概要・システムコンテキスト生成

1. README, 設定ファイル, ディレクトリ構成全体を読み取る
1. `docs/01-overview/system-context.mdx` に技術スタック・アーキテクチャの概要を追記する
1. `docs/01-overview/as-is.mdx` の業務プロセス・システム構成セクションを埋める

### 3. 結果レポート

サブエージェントの完了後、以下を報告する:

1. 生成したファイル一覧（パス）
1. 解析できなかった・スキップした項目とその理由
1. `<TBD/>` で埋めた箇所（後から手動で補完が必要な箇所）

## 注意事項

1. 解析対象のリポジトリには **読み取りのみ** 行い、絶対に書き込まない
1. 推測で内容を補完せず、コードから読み取れない情報は `<TBD/>` とする
1. 既存ファイルが存在する場合は **上書きせず** ユーザーに確認する
1. `import { TBD } from '@site/src/components/TBD';` が必要な場合はファイル先頭に必ず追加する
