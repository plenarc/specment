---
description: Merge 後の後処理。specment はサイトのため、CI が自動生成したタグ/リリース/デプロイを検証する。
---

Merge 済みであることが前提。

## 1. main へ切替え・最新化

- `git checkout main && git fetch --prune && git pull`

## 2. リリースの確認(このリポジトリは CI が自動生成)

specment は公開サイト(GitHub Pages)。`.github/workflows/release-on-merge.yaml` が main への push で
`package.json` の version 変更を検知し、タグ `v{version}` と GitHub リリース(自動リリースノート)を
**自動生成**する。npm publish は不要(`deploy.yaml` が Pages へデプロイ)。

したがって**手動でタグ/リリースを作らない**。以下を確認する:

- `VERSION=$(jq -r .version package.json)`
- `git ls-remote --tags origin | grep "v$VERSION"` … タグ生成を確認
  (未生成なら CI 実行中。`gh run list --workflow=release-on-merge.yaml` で状況を見る)
- `gh release view "v$VERSION"` … リリース生成を確認
- `gh run list --workflow=deploy.yaml` … Pages デプロイの成功を確認(failed なら内容を提示)

## 3. issue の close 確認

- 関連 issue が close されたか確認し、漏れがあれば `gh issue close` する。
