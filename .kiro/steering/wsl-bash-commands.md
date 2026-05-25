# WSL Bash コマンド設定

## コマンド実行環境

1. **デフォルトシェル**: WSL (bash)
1. **適用範囲**: すべてのコマンド出力とターミナル操作
1. **例外**: 明示的にPowerShellでの実行が指示された場合のみ

## コマンド出力ガイドライン

1. すべてのコマンドはbash/Linux形式で出力する
1. PowerShell固有のコマンドレット(`Move-Item`, `Set-Location`など)は使用しない
1. 標準的なUnix/Linuxコマンド(`mv`, `cd`, `ls`など)を使用する
1. パス区切り文字はスラッシュ(`/`)を使用する

## コマンド例

### ファイル操作
```bash
# ファイル移動
mv source.txt destination.txt

# ディレクトリ移動
cd /path/to/directory

# ファイル一覧
ls -la

# ディレクトリ作成
mkdir new-directory

# ファイル削除
rm file.txt

# ディレクトリ削除
rm -rf directory
```

### Git操作
```bash
# クローン
git clone https://github.com/user/repo.git

# コミット
git add .
git commit -m "commit message"
git push
```

## 注意事項

1. WSL環境では、Windowsのパスは`/mnt/c/`のような形式でアクセス可能
1. ただし、通常はWSL内のホームディレクトリ(`~`)を基準に作業する
1. executePwshツールを使用する場合でも、bashコマンドを実行する
