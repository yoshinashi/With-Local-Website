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
      data.phone || '',            // 電話番号
      data['tour-time'] || '',     // 希望開始時間
      data['tour-date1'] || '',    // 第1希望日程
      data['tour-date2'] || '',    // 第2希望日程
      data.participants || '',     // 参加人数
      data.message || ''           // 詳細メッセージ
    ];
    
    // スプレッドシートにデータを追加
    sheet.appendRow(rowData);
    
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

function doGet(e) {
  // GETリクエストの場合は簡単なテストページを返す
  return ContentService
    .createTextOutput('Google Apps Script is working!')
    .setMimeType(ContentService.MimeType.TEXT);
} 