# プロジェクトガイドライン

仕様書をDocusaurusでHTML化するドキュメントサイトプロジェクト。
コードから仕様書を自動生成するスラッシュコマンドも提供する。

## 出力・応答ルール

1. すべての応答は日本語で行う
1. 簡潔で実用的な情報を優先する
1. 冗長な説明や繰り返しを避ける
1. ユーザーの質問に直接答える

### コミュニケーション

1. 敬語丁寧語で応答する
1. 技術的な内容でも分かりやすく説明する
1. 不明な点があれば具体的に質問する
1. 推測ではなく事実に基づいて回答する

### コード出力

1. 最小限の実装に留める
1. コメントは日本語で記述する
1. 実行可能なコードのみ提供する
1. 冗長なコードや不要な機能は含めない

### ファイル操作

1. ファイル作成・編集時は目的を明確にする
1. 変更内容を簡潔に説明する
1. バックアップが必要な場合は事前に確認する
1. Markdown記述ルールは `docs/04-internal/rules/markdown.mdx` を参照

### エラー対応

1. エラーの原因を具体的に特定する
1. 解決手順を段階的に提示する
1. 代替案がある場合は併せて提案する

### 進行管理

1. 作業の進捗状況を明確に伝える
1. 次のステップを具体的に示す
1. ユーザーの承認が必要な場合は明示する

## Git使用ガイドライン

### 基本方針

1. このプロジェクトではgitを使用する

### Claudeの操作範囲

1. ファイルの作成・編集・削除は実行してよい
1. `git add`(ステージング)までは実行してよい
1. `git commit` は実行禁止（ユーザーが行う）
1. `git push` は実行禁止（ユーザーが行う）
1. `git fetch` や `git checkout` は必要に応じて実行してよい

### ブランチ運用

1. 作業前に `develop` から新しいブランチを作成する
1. ブランチ命名規則の詳細は `docs/04-internal/policies/branch-naming-rules.mdx` を参照
1. 必ずGitHub Issueを作成してからブランチを作成する

### コミットメッセージ

詳細は `docs/04-internal/policies/github.mdx` を参照。

## バージョン管理ルール

詳細は `.claude/rules/versioning.md` を参照。

1. コミット時は必ずルートの `package.json` のバージョンをインクリメントする
1. `feature/` ブランチ → マイナーバンプ（例: `1.3.0` → `1.4.0`）
1. `bugfix/` `hotfix/` ブランチ → リビジョンバンプ（例: `1.3.0` → `1.3.1`）
1. `git add package.json` を忘れずにステージングに含める

## スラッシュコマンド

| コマンド | 用途 |
| -------- | ---- |
| `/new-screen <physical_name> <logical_name>` | 画面定義ドキュメントを新規作成 |
| `/new-table <physical_name> <logical_name> <schema> <description>` | テーブル定義ドキュメントを新規作成 |
| `/new-batch <id> <logical_name>` | バッチ定義ドキュメントを新規作成 |
| `/analyze-repo <repo_path>` | ローカルリポジトリを解析して仕様書を自動生成 |

## 参照ドキュメント

| ルール | 参照先 |
| ------ | ------ |
| Markdown記述ルール | `docs/04-internal/rules/markdown.mdx` |
| ドキュメント作成ルール | `docs/04-internal/rules/document-creation-rules.mdx` |
| DB命名規約 | `docs/04-internal/rules/database.mdx` |
| レビュープロセス | `docs/04-internal/rules/review-process.mdx` |
| ブランチ命名規約 | `docs/04-internal/policies/branch-naming-rules.mdx` |
| PR運用フロー | `docs/04-internal/policies/pull-request-operation-flow.mdx` |

## 開発コマンド

1. `nlx biome check` - Biomeチェック
1. `nlx biome check --write` - Biome自動修正

## ドキュメント執筆ルール

1. 作成、編集時は `docs/internal/rules/` 配下のルールに従う
1. 画面仕様は `docs/internal/frontend/screens/_screen-temlate.mdx` 、テーブル定義は `docs/internal/backend/tables/_table-template.mdx` のテンプレートに準拠

## 工程別サブエージェント

1. 要件定義
    1. `requiremnts-writer` 
        1. 対象読者: PM・発注者
        1. 主要出力: 業務課題, 機能・非機能要件 (`docs/requiremtns/`)
1. 外部設計
    1. `<未定>` 
        1. 対象読者: リードエンジニア、実務担当
        1. 主要出力: 外部設計 (`docs/external/`)
1. DB設計
    1. `db-designer` 
        1. 対象読者: 実務担当, ER図作成、 schema.prismaからの逆算
        1. 主要出力: 外部設計 (`docs/external/`)
1. 図表生成
    1. `diagram-writer`
        1. 対象読者: 全員
        1. 主要出力: PlantUML, draw.io
