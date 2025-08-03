# スプレッドシートID設定手順

## 問題の原因
現在、Google Apps Scriptのコードで `spreadsheetId = 'YOUR_SPREADSHEET_ID_HERE'` となっているため、データが保存されていません。

## 解決手順

### 1. スプレッドシートIDを取得

1. **Googleスプレッドシートを開く**
   - データを保存したいスプレッドシートを開く

2. **URLからIDをコピー**
   - ブラウザのアドレスバーのURLを確認
   - 例: `https://docs.google.com/spreadsheets/d/1ABC123DEF456GHI789JKL012345678901234567890/edit#gid=0`
   - `1ABC123DEF456GHI789JKL012345678901234567890` の部分がスプレッドシートID

### 2. Google Apps Scriptを修正

1. **Google Apps Scriptを開く**
   - [Google Apps Script](https://script.google.com) にアクセス
   - プロジェクトを開く

2. **コードを修正**
   - `google-apps-script.gs` ファイルを開く
   - 以下の行を探す：
   ```javascript
   const spreadsheetId = 'YOUR_SPREADSHEET_ID_HERE';
   ```
   - 実際のスプレッドシートIDに変更：
   ```javascript
   const spreadsheetId = '1ABC123DEF456GHI789JKL012345678901234567890';
   ```

### 3. 再デプロイ

1. **デプロイを実行**
   - 「デプロイ」→「新しいデプロイ」をクリック
   - 種類: 「ウェブアプリ」
   - 説明: 「Updated with spreadsheet ID」
   - 次のユーザーとして実行: 「自分」
   - アクセスできるユーザー: 「全員」
   - 「デプロイ」をクリック

2. **新しいURLを取得**
   - デプロイ後に表示される新しいURLをコピー

### 4. JavaScriptファイルを更新

1. **script.jsファイルを開く**
   - 約100行目付近の `scriptUrl` を新しいURLに変更
   - 約1540行目付近の `scriptUrl` も新しいURLに変更

### 5. テスト

1. **test-form.htmlでテスト**
   - ブラウザで `test-form.html` を開く
   - フォームにデータを入力して送信
   - スプレッドシートにデータが追加されることを確認

## トラブルシューティング

### 権限エラーが発生する場合
1. Google Apps Scriptの初回実行時に権限を許可
2. 「詳細」→「安全でないページに移動」をクリック
3. Googleアカウントでログインして権限を許可

### データが保存されない場合
1. スプレッドシートIDが正しいか再確認
2. Google Apps Scriptのログを確認（「実行」→「実行ログ」）
3. ブラウザのコンソール（F12）でエラーメッセージを確認

### ログの確認方法
1. Google Apps Scriptで「実行」→「実行ログ」をクリック
2. 最新の実行ログを確認
3. 「受信したデータ」と「スプレッドシートに保存するデータ」のログを確認

## 重要な注意点

- スプレッドシートIDは長い文字列です（例: 44文字）
- スプレッドシートのURLから正確にコピーしてください
- 変更後は必ず再デプロイしてください
- 新しいURLが生成されるので、JavaScriptファイルも更新が必要です 