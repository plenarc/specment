# draft PR を作成する（specment）

グローバルの `/create-pr` に加え、このリポジトリ固有の手順を実施する。

## ベースブランチ（グローバル手順 3 を上書き）

このワークスペースに `develop` ブランチは存在しない。ベースブランチは常に `main`。

## lint / format（グローバル手順 2 を上書き）

PR 作成前に以下を実行する:

```bash
nlx biome check --write
```

エラーが残る場合は中断してユーザーに報告する。

## GitHub Actions について

PR 作成後に以下のワークフローが自動実行される:

- `test-deploy.yaml`: build + smoke test（HTTP 200 確認）

`gh pr checks --watch` で結果を監視し、失敗した場合はエラー内容をユーザーに報告する。
