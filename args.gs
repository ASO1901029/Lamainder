var _ = Underscore.load();
var url = 'https://api.line.me/v2/bot/message/reply';

var spreadsheet = SpreadsheetApp.openByUrl(spreadSheetUrl);//スプレッドシートを開く
var remindSheet = spreadsheet.getSheetByName("remind");//開いたスプレッドシートから指定した名前のシートを選択
var remindLastRow = remindSheet.getLastRow();
var remindSheetData = remindSheet.getSheetValues(1, 1, remindLastRow, 5);
var remindSheetDataTrans = _.zip.apply(_,remindSheetData);

var userSheet = spreadsheet.getSheetByName("user");//開いたスプレッドシートから指定した名前のシートを選択
var userLastRow = userSheet.getLastRow();
var userSheetData = userSheet.getSheetValues(1, 1, userLastRow, 2);
var userSheetDataTrans = _.zip.apply(_,userSheetData);

var messageData = [];
var message;
var e;
var jsonObj;
var replyToken;
var userId;
var type;
var jsonObj;
var userStatusIndex;
var userStatus;
var datetime;
var datetimeJp;
var date;
var userIdIndex;

var selectTimeText;
var textQR;
