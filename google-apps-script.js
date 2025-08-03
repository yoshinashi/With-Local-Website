// Google Apps Script for With Local Contact Form
// このコードをGoogle Apps Scriptにコピーして使用してください

function doPost(e) {
  try {
    // リクエストデータを取得
    const data = JSON.parse(e.postData.contents);
    
    // スプレッドシートのIDを設定（実際のスプレッドシートIDに変更してください）
    const spreadsheetId = '1VGofW-tvGdxzCogFmHuqRKYsTFyF_vg5xuZKfsRqRq0';
    const sheet = SpreadsheetApp.openById(spreadsheetId).getActiveSheet();
    
    // 現在の日時を取得
    const timestamp = new Date();
    const formattedDate = Utilities.formatDate(timestamp, 'Asia/Tokyo', 'yyyy/MM/dd HH:mm:ss');
    
    // データを配列に格納
    const rowData = [
      formattedDate,           // 送信日時
      data.name || '',         // お名前
      data.email || '',        // メールアドレス
      data.phone || '',        // 電話番号
      data.message || ''       // お問い合わせ内容
    ];
    
    // スプレッドシートにデータを追加
    sheet.appendRow(rowData);
    
    // 成功レスポンスを返す
    return ContentService
      .createTextOutput(JSON.stringify({
        'status': 'success',
        'message': 'お問い合わせを受け付けました。'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // エラーレスポンスを返す
    return ContentService
      .createTextOutput(JSON.stringify({
        'status': 'error',
        'message': 'エラーが発生しました: ' + error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// テスト用のGET関数（オプション）
function doGet(e) {
  return ContentService
    .createTextOutput('With Local Contact Form API is running')
    .setMimeType(ContentService.MimeType.TEXT);
}

// スプレッドシートの初期設定関数
function setupSpreadsheet() {
  // スプレッドシートのIDを設定（実際のスプレッドシートIDに変更してください）
  const spreadsheetId = '1VGofW-tvGdxzCogFmHuqRKYsTFyF_vg5xuZKfsRqRq0';
  const sheet = SpreadsheetApp.openById(spreadsheetId).getActiveSheet();
  
  // ヘッダー行を設定
  const headers = [
    '送信日時',
    'お名前',
    'メールアドレス',
    '電話番号',
    'お問い合わせ内容'
  ];
  
  // 既存のヘッダーがあるかチェック
  const existingHeaders = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  if (existingHeaders[0] !== headers[0]) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }
  
  // 列幅を自動調整
  sheet.autoResizeColumns(1, headers.length);
  
  // ヘッダー行のスタイルを設定
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#667eea');
  headerRange.setFontColor('white');
  
  console.log('スプレッドシートの設定が完了しました。');
} 