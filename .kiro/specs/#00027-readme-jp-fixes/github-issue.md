# Fix README-jp.md: Incorrect image links and directory name in Quick Start section

## Problem Summary

1. en
    1. There are two issues in the Quick Start section of README-jp.md:
        1. **Image link issues**: Image links in the Quick Start section are incorrect or in the wrong order
        1. **Directory name mismatch**: The command `cd specment-mono` is documented, but it doesn't match the actual cloned directory name. Additionally, mise warnings are displayed
1. jp
    1. README-jp.mdのクイックスタートセクションに2つの問題があります：
        1. **画像リンクの問題**: クイックスタートセクションの画像リンクが正しくない、または順序が不適切
        1. **ディレクトリ名の不一致**: `cd specment-mono`というコマンドが記載されているが、実際にクローンされるディレクトリ名と一致していない。また、mise警告が表示される

## Steps to Reproduce

1. en
    1. Check the Quick Start section in README-jp.md
    1. Follow the steps in "Pattern 1: Standalone Project Operation"
    1. Execute `cd specment-mono` - the directory doesn't exist or mise warnings appear
1. jp
    1. README-jp.mdのクイックスタートセクションを確認
    1. 「パターン1: 単独プロジェクト運用」の手順に従ってクローンを実行
    1. `cd specment-mono`を実行すると、ディレクトリが存在しないか、mise警告が表示される

```bash
$ cd ~/projects
$ git clone https://github.com/plenarc/specment.git my-spec-site
$ cd specment-mono  # ← This directory doesn't match the cloned directory name
mise WARN  Config files in ~/projects/specment-mono/mise.toml are not trusted.
```

## Expected Behavior

1. en
    1. Image links should display correctly
    1. The cd command after cloning should specify the correct directory name (`my-spec-site`)
    1. Content should be consistent with the English README.md
    1. Instructions for handling mise warnings should be included (if necessary)
1. jp
    1. 画像リンクが正しく表示される
    1. クローン後のcdコマンドが正しいディレクトリ名を指定している(`my-spec-site`)
    1. 英語版README.mdと一貫性のある内容になっている
    1. mise警告への対処方法が記載されている(必要に応じて)

## Files Affected

1. en
    1. `README-jp.md`
1. jp
    1. `README-jp.md`

## Proposed Fix

1. en
    1. Align image links in Quick Start section with English version
    1. Fix `cd specment-mono` to `cd my-spec-site`
    1. Add note about mise warnings (optional)
1. jp
    1. クイックスタートセクションの画像リンクを英語版と一致させる
    1. `cd specment-mono`を`cd my-spec-site`に修正
    1. mise警告に関する注記を追加(オプション)
