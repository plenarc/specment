# Spec #018: SpecmentのNPM登録

## 概要
SpecmentをNPMパッケージとして公開し、ユーザーがnpmを通じてインストール・使用できるようにする。

## 目標
- `@plenarc/specment`パッケージをNPMレジストリに公開
- NPMからのインストール確認
- インストール後のspecment動作確認
- 継続的なリリースプロセスの確立

## 要件

### 機能要件
1. **NPM公開準備**
   - package.jsonの設定確認・最適化
   - ビルドプロセスの確認
   - ファイル構成の最適化

2. **NPM公開**
   - NPMレジストリへの初回公開
   - 適切なバージョン管理
   - パッケージメタデータの設定

3. **動作確認**
   - NPMからのインストール確認
   - CLIコマンドの動作確認
   - テンプレート生成機能の確認

4. **継続的リリース**
   - changesetを使用したバージョン管理
   - 自動公開プロセスの設定

### 非機能要件
1. **セキュリティ**
   - NPMトークンの適切な管理
   - パッケージの署名・検証

2. **品質**
   - 公開前のテスト実行
   - ビルド成果物の検証

3. **ドキュメント**
   - インストール手順の更新
   - 使用方法の明確化

## 実装計画

### Phase 1: 公開準備
- [ ] package.jsonの最終確認
- [ ] ビルドプロセスの検証
- [ ] filesフィールドの最適化
- [ ] READMEの更新

### Phase 2: NPM公開
- [ ] NPMアカウント・組織の設定
- [ ] 初回公開の実行
- [ ] 公開確認

### Phase 3: 動作確認
- [ ] 新しい環境でのインストールテスト
- [ ] CLIコマンドの動作確認
- [ ] テンプレート機能の確認

### Phase 4: 継続的リリース
- [ ] changesetワークフローの確認
- [ ] 自動公開の設定
- [ ] リリースプロセスの文書化

## 成功基準
1. `npm install -g @plenarc/specment`でインストール可能
2. `specment --version`でバージョン情報が表示される
3. `specment init`でプロジェクト初期化が実行される
4. テンプレート生成機能が正常に動作する
5. changesetを使用したバージョン更新・公開が可能

## リスク・課題
1. **NPMアカウント・組織の設定**
   - @plenarcscopeの利用可能性
   - 適切な権限設定

2. **パッケージ名の競合**
   - 既存パッケージとの名前衝突
   - スコープ付きパッケージの利用

3. **依存関係の問題**
   - Node.jsバージョン互換性
   - 依存パッケージの脆弱性

## 参考資料
- [NPM Publishing Guide](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [Changesets Documentation](https://github.com/changesets/changesets)
- [Package.json Fields](https://docs.npmjs.com/cli/v10/configuring-npm/package-json)