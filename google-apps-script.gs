function doPost(e) {
  try {
    // リクエストデータを取得（URLエンコード形式とJSON形式の両方に対応）
    let data;
    if (e.postData.type === 'application/json') {
      data = JSON.parse(e.postData.contents);
    } else {
      // URLエンコード形式の場合
      const params = e.parameter;
      data = {
        name: params.name || '',
        email: params.email || '',
        phone: params.phone || '',
        'tour-time': params['tour-time'] || '',
        'tour-date1': params['tour-date1'] || '',
        'tour-date2': params['tour-date2'] || '',
        participants: params.participants || '',
        message: params.message || ''
      };
    }
    
    // スプレッドシートを取得（スプレッドシートIDを実際のものに変更してください）
    const spreadsheetId = '1ksS7J-OSWvE3qTmVhenBcRGA--jtnNDU2_ir6247mes';
    const sheet = SpreadsheetApp.openById(spreadsheetId).getActiveSheet();
    
    // 現在の日時を取得
    const timestamp = new Date();
    
    // データを配列に整理
    const rowData = [
      timestamp,                    // 送信日時
      data.name || '',             // お名前
      data.email || '',            // メールアドレス
      formatAsText(data.phone),    // 電話番号（文字列保存）
      data['tour-time'] || '',     // 希望開始時間
      data['tour-date1'] || '',    // 第1希望日程
      data['tour-date2'] || '',    // 第2希望日程
      data.participants || '',     // 参加人数
      data.message || ''           // 詳細メッセージ
    ];
    
    // 追記先の行を取得し、電話番号の列(D列=4列目)をプレーンテキストに設定してから書き込む
    const targetRow = sheet.getLastRow() + 1;
    sheet.getRange(targetRow, 4).setNumberFormat('@');
    sheet.getRange(targetRow, 1, 1, rowData.length).setValues([rowData]);
    
    // 成功レスポンスを返す
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success', message: 'Data saved successfully' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // エラーレスポンスを返す
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// 数値扱いで先頭の0が落ちるのを防ぐため、常にテキストとして保存する
function formatAsText(value) {
  if (!value) return '';
  const str = String(value);
  // 既にアポストロフィで始まっていればそのまま返す
  return str.charAt(0) === "'" ? str : "'" + str;
}

function doGet(e) {
  // GETリクエストの場合は簡単なテストページを返す
  return ContentService
    .createTextOutput('Google Apps Script is working!')
    .setMimeType(ContentService.MimeType.TEXT);
} 