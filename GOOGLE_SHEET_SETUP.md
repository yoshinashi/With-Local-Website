# Googleスプレッドシート連携セットアップ手順

## 現在の問題と解決方法

**問題**: スプレッドシートに一部の情報が反映されない

**原因**: 
1. Google Apps ScriptのスプレッドシートIDが設定されていない
2. フォームのフィールド名とGoogle Apps Scriptで期待しているフィールド名が一致していない

**解決方法**: 以下の手順で設定を完了してください

## 1. Googleスプレッドシートの準備

1. **新しいGoogleスプレッドシートを作成**
   - [Google Sheets](https://sheets.google.com) にアクセス
   - 新しいスプレッドシートを作成

2. **ヘッダー行を設定**
   - A1: Timestamp (送信日時)
   - B1: Name (お名前)
   - C1: Email (メールアドレス)
   - D1: Phone (電話番号)
   - E1: Tour Time (希望開始時間)
   - F1: Tour Date 1 (第1希望日程)
   - G1: Tour Date 2 (第2希望日程)
   - H1: Participants (参加人数)
   - I1: Message (詳細メッセージ)

3. **スプレッドシートIDを取得**
   - スプレッドシートのURLをコピー
   - 例: `https://docs.google.com/spreadsheets/d/1ABC123DEF456GHI789JKL/edit`
   - `1ABC123DEF456GHI789JKL` の部分がスプレッドシートID

## 2. Google Apps Scriptの設定

1. **Google Apps Scriptを開く**
   - [Google Apps Script](https://script.google.com) にアクセス
   - 新しいプロジェクトを作成

2. **コードを貼り付け**
   - `google-apps-script.gs` ファイルの内容をコピー
   - Apps Scriptエディタに貼り付け

3. **スプレッドシートIDを設定**
   - `google-apps-script.gs` の `YOUR_SPREADSHEET_ID_HERE` を実際のIDに変更
   - 例: `const spreadsheetId = '1ABC123DEF456GHI789JKL';`

4. **デプロイ**
   - 「デプロイ」→「新しいデプロイ」をクリック
   - 種類: 「ウェブアプリ」
   - 説明: 任意の説明
   - 次のユーザーとして実行: 「自分」
   - アクセスできるユーザー: 「全員」
   - 「デプロイ」をクリック

5. **URLを取得**
   - デプロイ後に表示されるURLをコピー
   - 例: `https://script.google.com/macros/s/AKfycbz.../exec`

## 3. ウェブサイトの設定

1. **JavaScriptファイルの更新**
   - `script.js` の `scriptUrl` を実際のURLに変更
   - 2箇所あります：
     - 約100行目付近の `scriptUrl`
     - 約1540行目付近の `scriptUrl`

## 4. テスト

1. **フォームを送信**
   - ウェブサイトでフォームにデータを入力
   - 「Send Message」をクリック

2. **スプレッドシートを確認**
   - Googleスプレッドシートを開く
   - 新しい行にデータが追加されていることを確認

## 5. トラブルシューティング

### データが保存されない場合
1. **スプレッドシートIDを確認**
   - `google-apps-script.gs` の `spreadsheetId` が正しいか確認
   - スプレッドシートのURLからIDを再確認

2. **Google Apps Scriptの権限設定を確認**
   - 初回実行時に権限を許可する必要があります
   - 「詳細」→「安全でないページに移動」をクリック

3. **ブラウザのコンソールでエラーメッセージを確認**
   - F12キーを押してコンソールを開く
   - エラーメッセージがないか確認

### CORSエラーが発生する場合
- `mode: 'no-cors'` を使用しているため、通常は問題ありません
- それでもエラーが発生する場合は、Google Apps Scriptの設定を確認

### 権限エラーが発生する場合
- Google Apps Scriptの実行権限を許可
- スプレッドシートへのアクセス権限を確認

## 6. セキュリティ注意事項

- Google Apps ScriptのURLは公開されるため、機密情報は含めない
- 必要に応じて、追加の認証機能を実装
- 定期的にログを確認し、不正なアクセスがないか監視

## 7. カスタマイズ

### 追加フィールドの設定
1. HTMLフォームに新しいフィールドを追加
2. Google Apps Scriptの `rowData` 配列に新しいフィールドを追加
3. スプレッドシートに新しい列を追加

### メール通知の追加
Google Apps Scriptに以下のコードを追加：

```javascript
// メール通知を送信
function sendEmailNotification(data) {
  const subject = 'New Tour Inquiry';
  const message = `
    Name: ${data.name}
    Email: ${data.email}
    Phone: ${data.phone}
    Tour Time: ${data['tour-time']}
    Tour Date 1: ${data['tour-date1']}
    Tour Date 2: ${data['tour-date2']}
    Participants: ${data.participants}
    Message: ${data.message}
  `;
  
  MailApp.sendEmail('your-email@example.com', subject, message);
}
```

この機能により、フォーム送信時に自動的にメール通知を受け取ることができます。

## 8. 重要な修正点

### フィールド名の統一
以下のフィールド名が正しく設定されていることを確認：
- `name` - お名前
- `email` - メールアドレス
- `phone` - 電話番号
- `tour-time` - 希望開始時間
- `tour-date1` - 第1希望日程
- `tour-date2` - 第2希望日程
- `participants` - 参加人数
- `message` - 詳細メッセージ

### 必須項目の確認
フォームの必須項目が正しく設定されていることを確認：
- お名前
- メールアドレス
- 希望開始時間
- 第1希望日程
- 参加人数 