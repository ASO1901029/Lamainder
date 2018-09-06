var CHANNEL_ACCESS_TOKEN = 'dgDrEBaqM0cmwld6UAZ1eARTNcKQ5MhPdT35pfzL82SXAlmBR2ODo+cTOWAOUWiTnK3Doe0EKIEVFAsMWnKhbCEY6Cdzqnxb/1+oo/2dO83kYZzLqE2vT4ThsUE+zf+mrWmxjozaLxAza0SzSkErTgdB04t89/1O/w1cDnyilFU=';
var spreadSheetUrl = 'https://docs.google.com/spreadsheets/d/1AaOUSwANgpWZGVuQFpJoOKgby8BJuTy_vL05xFuvbCE/edit';//スプレッドシートURL

var spreadsheet = SpreadsheetApp.openByUrl(spreadSheetUrl);//スプレッドシートを開く
var remindSheet = spreadsheet.getSheetByName("remind");//開いたスプレッドシートから指定した名前のシートを選択
var remindLastRow = remindSheet.getLastRow();//最終行の取得
var remindSheetData = remindSheet.getSheetValues(1, 1, remindLastRow, 5);//5列目までの範囲で取得
var remindSheetDataTrans = _.zip.apply(_,remindSheetData); //検索(.indexOf)用に行列を入れ替える

var userSheet = spreadsheet.getSheetByName("user");//開いたスプレッドシートから指定した名前のシートを選択
var userLastRow = userSheet.getLastRow();
var userSheetData = userSheet.getSheetValues(1, 1, userLastRow, 2);
var userSheetDataTrans = _.zip.apply(_,userSheetData);
