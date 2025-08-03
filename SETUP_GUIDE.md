# With Local お問い合わせフォーム - Googleスプレッドシート連携セットアップガイド

## 概要
このガイドでは、With Localのウェブサイトのお問い合わせフォームからGoogleスプレッドシートにデータを自動保存する機能のセットアップ手順を説明します。

## セットアップ手順

### 1. Googleスプレッドシートの作成
1. [Googleスプレッドシート](https://sheets.google.com)にアクセス
2. 新しいスプレッドシートを作成
3. スプレッドシートのURLからIDをコピー
   - URL例: `https://docs.google.com/spreadsheets/d/1ABC123DEF456GHI789JKL/edit#gid=0`
   - ID: `1ABC123DEF456GHI789JKL`

### 2. Google Apps Scriptの設定
1. [Google Apps Script](https://script.google.com)にアクセス
2. 「新しいプロジェクト」をクリック
3. プロジェクト名を「With Local Contact Form」に変更
4. `google-apps-script.js`ファイルの内容をコピーして貼り付け
5. スプレッドシートIDを更新:
   ```javascript
   const spreadsheetId = 'YOUR_SPREADSHEET_ID_HERE'; // 実際のIDに変更
   ```

### 3. Google Apps Scriptのデプロイ
1. 「デプロイ」→「新しいデプロイ」をクリック
2. 「種類の選択」で「ウェブアプリ」を選択
3. 以下の設定を行う:
   - 説明: `With Local Contact Form API`
   - 次のユーザーとして実行: `自分`
   - アクセスできるユーザー: `全員`
4. 「デプロイ」をクリック
5. 承認を求められたら「許可を確認」→「詳細」→「安全でないページに移動」
6. デプロイURLをコピー

### 4. ウェブサイトの設定
1. `script.js`ファイルを開く
2. 以下の行を探して、実際のデプロイURLに変更:
   ```javascript
   const scriptUrl = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE'; // 実際のURLに変更
   ```

### 5. スプレッドシートの初期設定
1. Google Apps Scriptエディタに戻る
2. `setupSpreadsheet()`関数を実行
3. 初回実行時は承認が必要です

## 動作確認
1. ウェブサイトのお問い合わせフォームにテストデータを入力
2. 「送信する」ボタンをクリック
3. Googleスプレッドシートにデータが追加されることを確認

## データの保存内容
スプレッドシートには以下の情報が保存されます:
- 送信日時（日本時間）
- お名前
- メールアドレス
- 電話番号（任意）
- お問い合わせ内容

## トラブルシューティング

### CORSエラーの場合
- `mode: 'no-cors'`が設定されていることを確認
- Google Apps Scriptのデプロイ設定で「全員」にアクセス権限があることを確認

### データが保存されない場合
1. Google Apps Scriptのログを確認
2. スプレッドシートIDが正しいことを確認
3. スプレッドシートへの書き込み権限があることを確認

### フォームが送信されない場合
1. ブラウザの開発者ツールでエラーを確認
2. ネットワーク接続を確認
3. JavaScriptが有効になっていることを確認

## セキュリティに関する注意事項
- Google Apps ScriptのURLは公開されるため、必要に応じて追加の認証を検討
- スプレッドシートの共有設定を適切に管理
- 定期的にログを確認して不正なアクセスがないかチェック

## カスタマイズ
- フォームの項目を追加/変更する場合は、HTML、JavaScript、Google Apps Scriptの3箇所を同時に更新
- メール通知機能を追加する場合は、Google Apps Scriptにメール送信機能を追加可能
- データの検証ルールを追加する場合は、JavaScriptのバリデーション部分を修正

## サポート
問題が発生した場合は、以下を確認してください:
1. Google Apps Scriptのログ
2. ブラウザの開発者ツールのコンソール
3. ネットワークタブでのリクエスト/レスポンス 