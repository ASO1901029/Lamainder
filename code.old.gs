//var _ = Underscore.load();
//var CHANNEL_ACCESS_TOKEN = 'HBw0BKB8G0XhAjkFTsyT+y/AB9Q9ruxINz2AgscBpdxSVttA+7nepI7I2+EIeP7hmRJEs1lAFmEtO4qPunaQLzKInEIPeiRcEp0EoGVBiTMvGASxs6eVqfZ3aIPLDVIVCJ4L1eQzV/8ySlZvWZkVxwdB04t89/1O/w1cDnyilFU='; 
//var url = 'https://api.line.me/v2/bot/message/reply';
//
//var spreadSheetUrl = 'https://docs.google.com/spreadsheets/d/1AaOUSwANgpWZGVuQFpJoOKgby8BJuTy_vL05xFuvbCE/edit';//スプレッドシートURL(Nakayama)
//var spreadsheet = SpreadsheetApp.openByUrl(spreadSheetUrl);//スプレッドシートを開く
//var remindSheet = spreadsheet.getSheetByName("remind");//開いたスプレッドシートから指定した名前のシートを選択
//var remindLastRow = remindSheet.getLastRow();
//var remindSheetData = remindSheet.getSheetValues(1, 1, remindLastRow, 5);
//var remindSheetDataTrans = _.zip.apply(_,remindSheetData);
//
//var userSheet = spreadsheet.getSheetByName("user");//開いたスプレッドシートから指定した名前のシートを選択
//var userLastRow = userSheet.getLastRow();
//var userSheetData = userSheet.getSheetValues(1, 1, userLastRow, 2);
//var userSheetDataTrans = _.zip.apply(_,userSheetData);
//
//var messageData = [];
//var message;
//var e;
//var jsonObj;
//var replyToken;
//var userId;
//var type;
//var jsonObj;
//var userStatusIndex;
//var userStatus;
//var datetime;
//var datetimeJp;
//var date;
//var userIdIndex;
//
//var selectTimeText;
//var textQR;
//
//function doPost(e) {  
//  jsonObj = JSON.parse(e.postData.contents); //POSTをJsonで受け取り
//  replyToken = jsonObj.events[0].replyToken; //リプライトークンの取り出し
//  userId = jsonObj.events[0].source.userId; //userIdの取り出し
//  type = jsonObj.events[0].type; 
//  
//  if(type == "follow"){
//    newFrends();
//    return;
//  }
//  
//  messageData = [];
//  userStatusIndex = userSheetDataTrans[0].indexOf(userId);
//  userStatus = userSheetData[userStatusIndex][1]; //userのStatusを取得
//  userIdIndex = remindSheetDataTrans[0].lastIndexOf(userId);
//  
//  if(type=="postback"){
//    postBack(jsonObj.events[0]); //postBack用の処理。日時選択アクションとか。
//  }else{
//    selectMode(); //挙動選択
//  }
//  
//  if(!messageData[0]){//何もメッセージが入ってない時 ←つまりエラー時。
//    pushText("こんにちは。");
//    setUserStatus("start");
//  }
//  return post_reply();//botによる返信、messageDataを参照する。
//}
//
////postBack時用
//function postBack(e){
//  data = e.postback.data;
//  switch(data){
//    case "planDate":
//    case "remindDate":
//      datetime = e.postback.params.datetime;
//      datetimeJp = getDatetimeJp(datetime);
//      
//      break;
//    case "listDate":
//      //    case "editDate":
//    case "deleteDate":
//      datetime = e.postback.params.date;
//      datetimeJp = getDatetimeJp(datetime);
//      break;
//    case "oneHoursAgo":
//      datetime = new Date(remindSheetData[userIdIndex][1]);
//      var dt = datetime;
//      dt.setHours(dt.getHours()-1);
//      datetimeJp = dt.getMonth()+1+"月"+dt.getDate()+"日 "+dt.getHours()+"時"+dt.getMinutes()+"分";
//      
//      break;
//  }
//  selectMode();
//}
//
////挙動選択
//function selectMode(){
//  if(type != "postback"){
//    message = jsonObj.events[0].message.text; //メッセージの取り出し
//  }
//  switch(userStatus){
//    case "start":
//      switch(message){
//        case "予定の追加":
//          pushText("予定の内容を入力してください。");
//          setUserStatus("add1");
//          break;
//          
//          //        case "予定の編集":
//          //          selectTimeText = "いつの予定を編集するのだ？";
//          //          pushQRSelectDate("editDate");
//          //          setUserStatus("edit1");
//          //          break;
//          
//        case "予定一覧":
//          selectTimeText = "いつの予定を表示するのだ？";
//          pushQRSelectDate("listDate");
//          setUserStatus("list1");
//          break;
//          
//        case "予定の削除":
//          selectTimeText = "いつの予定を削除しますか？";
//          pushQRSelectDate("deleteDate");
//          setUserStatus("delete1");
//          break;
//          
//        default:
//          pushText("メニューから操作を選んでください");
//          pushQRMenu();
//          break;
//      }
//      break;
//    case "add1":
//      addContents1();
//      setUserStatus("add2");
//      selectTimeText = "予定の日時を選択してください。";
//      pushQRSelectTime("planDate");
//      //日時選択アクションから入力されてるか判定(type == "postback")してadd2に設定させずもう一度表示とかしてもいいかも）
//      break;
//      
//    case "add2":
//      if(type == "postback"){
//        addContents2();
//        setUserStatus("add3");
//        pushText("予定の時間は "+datetimeJp + " ですね。");
//        selectTimeText = "通知日時を選択してください。";
//        pushQRSelectTimeRemind("remindDate");//pushQRSelectTimeと比較すると、予定の1時間前に通知とかが選べる
//      }else{
//        selectTimeText = "メニューから予定の日時を選択してください。";
//        pushQRSelectTime("planDate");
//      }
//      break;
//      
//    case "add3":
//      if(type == "postback"){
//        addContents3();
//        pushText("通知の時間は "+datetimeJp + " ですね。");
//        pushText("予定の追加に成功しました。");
//        setUserStatus("start");
//      }else{
//        selectTimeText = "メニューから通知の日時を選択してください。";
//        pushQRSelectTime("remindDate");
//      }
//      break;
//      
//    case "list1":
//      if(type == "postback"){
//        pushText(datetimeJp+"以降の予定を最大10件表示します");
//        list1();
//        setUserStatus("start");
//      }else{
//        selectTimeText = "メニューから検索する日付を選択してください。";
//        pushQRSelectDate("listDate");
//      }
//      break;
//      
//      //    case "edit1":
//      //      pushText(datetimeJp+"以降の予定を最大10件表示します");
//      //      edit1();
//      //      setUserStatus("edit2");
//      //      pushText("予定の番号を入力してください。");
//      //      break;
//      //      
//      //    case "edit2":
//      //      edit2(message);
//      //      break;
//      
//    case "delete1":
//      if(type=="postback"){
//        pushText(datetimeJp+"以降の予定を最大10件表示します");
//        delete1();
//        setUserStatus("delete2");
//        pushText("削除したい予定の番号を入力してください。");
//      }else{
//        selectTimeText = "メニューから検索する日付を選択してください。";
//        pushQRSelectDate("deleteDate");
//      }
//      break;
//      
//    case "delete2":
//      delete2(message);
//      break; 
//  }
//}
//
////messageDataの操作
////messageDataにテキストメッセージを追加
//function pushText(text){
//  var message = {
//    "type":"text",
//    "text":text,
//  };
//  messageData.push(message);  
//}
//
//function pushQRMenu(){
//  messageData.push({
//    "type":"text",
//    "text":"何を行うか選択してね",
//    "quickReply":{
//      "items":[
//        {
//          "type":"action",
//          "action":{
//            "type":"message",
//            "label":"追加",
//            "text":"予定の追加",
//          }
//        },
//        //        {
//        //          "type":"action",
//        //          "action":{
//        //            "type":"message",
//        //            "label":"編集",
//        //            "text":"予定の編集",
//        //          }
//        //        },
//        {
//          "type":"action",
//          "action":{
//            "type":"message",
//            "label":"一覧",
//            "text":"予定一覧",
//          }
//        },{
//          "type":"action",
//          "action":{
//            "type":"message",
//            "label":"削除",
//            "text":"予定の削除",
//          }
//        }
//      ]
//    }
//  });
//}
//
//
//function pushQRSelectTime(data){
//  messageData.push({
//    "type":"text",
//    "text":selectTimeText,
//    "quickReply":{
//      "items":[
//        {
//          "type":"action",
//          "action":{
//            "type":"datetimepicker",
//            "label":"時間選択",
//            "data":data,
//            "mode":"datetime",
//            //            "initial":"2017-12-25t00:00",
//            //            "min":"2018-09-24t23:59",   //設定できる最小を設定したかったけどうまく動かず。line側のバグ？
//          }
//        }
//      ]      
//    }
//  });
//}
//
//function pushQRSelectTimeRemind(data){
//  var oneHoursAgo= new Date(datetime);
//  oneHoursAgo.setHours(oneHoursAgo.getHours()-1);
//  messageData.push({
//    "type":"text",
//    "text":selectTimeText,
//    "quickReply":{
//      "items":[
//        {
//          "type":"action",
//          "action":{
//            "type":"datetimepicker",
//            "label":"時間選択",
//            "data":data,
//            "mode":"datetime",
//          }
//        },{
//          "type":"action",
//          "action":{
//            "type":"postback",
//            "label":"予定の1時間前",
//            "data": "oneHoursAgo",
//            "displayText":"予定の1時間前",
//          }
//        }
//      ]      
//    }
//  });
//}
//
//function pushQRSelectDate(data){
//  messageData.push({
//    "type":"text",
//    "text":selectTimeText,
//    "quickReply":{
//      "items":[
//        {
//          "type":"action",
//          "action":{
//            "type":"datetimepicker",
//            "label":"時間選択",
//            "data":data,
//            "mode":"date",
//          }
//        }
//      ]      
//    }
//  });
//}
//
////ここからスプレッドシート関連の操作
////userStatusの更新
//function setUserStatus(text){
//  userStatus = text;
//  userSheet.getRange(userStatusIndex+1,2).setValue(text); 
//  
//}
//
//function addContents1(){ //userIdと内容の追加
//  var remindNomber = remindSheetData[remindSheetData.length-1][4] +1;
//  var one_line = [userId,"","",message,remindNomber];
//  remindSheet.appendRow(one_line);
//}
//
//function addContents2(){ //予定日時の追加
//  remindSheet.getRange(userIdIndex+1,2).setValue(datetime);
//}
//
//function addContents3(){//通知日時の設定
//  remindSheet.getRange(userIdIndex+1,3).setValue(datetime);
//  setTrigger(datetime);
//  
//}
//
//function list1(){
//  serchPlan();
//}
//
////function edit1(){
////  serchPlan();
////}
//
////function edit2(no){
////  var remindIndex =  selectPlan(no);
////  pushText(remindIndex);
////  pushText("未作成。戻ります。");
////  setUserStatus("start");
////}
//
//function delete1(){
//  serchPlan();
//}
//
//function delete2(no){
//  var serchSheet = spreadsheet.getSheetByName("serch");//E列を検索に使う
//  var serchSheetData = serchSheet.getSheetValues(1, 1, 10, 5);
//  var serchSheetDataTrans = _.zip.apply(_,serchSheetData);
//  var noIndex = serchSheetData[no-1][4];
//  
//  remindSheet.getRange(noIndex,1,1,4).clear();
//  pushText("削除成功！");
//  setUserStatus("start");
//  
//}
//
//function selectPlan(no){ //選択用。
//  var sortArr = remindSheetData.sort(function(a,b){return(a[2] - b[2]);});
//  var count = 0;
//  for(var i=0;i<sortArr.length;i++){
//    if(sortArr[i][2] >= datetime){
//      count++;
//      if(count == no){
//        return i;
//      }
//    }
//  }
//  return no;
//}
//
//function serchPlan(){ //予定の日時で、datetimeに近い順に10件まで表示する。
//  var sortArr = remindSheetData.sort(function(a,b){return(a[1] - b[1]);});
//  var count = 0;
//  var text = "";
//  var serchArr = [];
//  
//  sortArr.some(function (row){ 
//    if(row[1] >= datetime && row[0] == userId){
//      var datetimeJp = getDatetimeJp(row[1]);
//      count++;
//      text += count+". " +datetimeJp+" に "+row[3] + "\n";
//      serchArr.push(row);
//    }
//    if(count >= 10){
//      return true;
//    }
//  });
//  text += "\n以上が予定されております。";
//  pushText(text);
//  var serchSheet = spreadsheet.getSheetByName("serch");//検索結果保存用
//  serchSheet.clear();
//  serchSheet.getRange(1,1,serchArr.length,serchArr[0].length).setValues(serchArr);
//  
//}
//
//function newFrends(){
//  var userIdIndex = userSheetDataTrans[0].indexOf(userId);
//  if(userIdIndex == -1){
//    userSheet.appendRow([userId,"start"]);
//  }else{
//    userSheetData[userIdIndex][0];
//    userSheet.getRange(userIdIndex+1,2).setValue("start");
//  }
//  
//  pushText("やぁ、俺はDandy Lamaさ。<ここにチュートリアル>");
//  pushQRMenu();
//  post_reply();
//}
//
//function getDatetimeJp(datetime){
//  dt = new Date(datetime);
//  datetimeJp = dt.getMonth()+1+"月"+dt.getDate()+"日 "+dt.getHours()+"時"+dt.getMinutes()+"分";
//  return datetimeJp;
//}
//function getDateJp(datetime){
//  dt = new Date(datetime);
//  datetimeJp = dt.getMonth()+1+"月"+dt.getDate()+"日";
//  return datetimeJp;
//}
//
////ここからHTTP通信関連
////返信を飛ばす
//function post_reply(){
//  var headers = {
//    "Content-Type" : "application/json; charset=UTF-8",
//    'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
//  };
//  var postData = {
//    "replyToken":replyToken,
//    "messages" :messageData
//  };
//  var options = {
//    "method" : "post",
//    "headers" : headers,
//    "payload" : JSON.stringify(postData)
//  };
//  UrlFetchApp.fetch(url, options);    
//}
//
//
////Trigger関連
//
//function setTrigger(elements) { //登録した瞬間に呼び出す　引数はdatetime
//  var remindTime = new Date(elements); //C列（通知日時）をDate型で取得
//  ScriptApp.newTrigger("doRemind").timeBased().at(remindTime).create();
//}
//
//function doRemind() {
//  var now = new Date();
//  
//  //  deleteTrigger(now);　日時分指定なので消さなくても問題はない（増えすぎるとバグりそうだけど）
//  messageData = [];
//  var headers2;
//  var postData2;
//  var options2;
//  
//  
//  now.setSeconds(0);
//  now.setMilliseconds(0);
//  var nY = now.getYear();
//  var nD = now.getDate();
//  var nH = now.getHours();
//  var nM = now.getMinutes();
//  for(var i=0;i<remindLastRow;i++){
//    var remindDatetime = new Date(remindSheetData[i][2]);
//    
//    var rY = remindDatetime.getYear();
//    var rD = remindDatetime.getDate();
//    var rH = remindDatetime.getHours();
//    var rM = remindDatetime.getMinutes();
//    
//    Logger.log(nH+":"+rH+","+nM+":"+rM);
//    
//    if(nY == rY && nD == rD && nH == rH && nM == rM){
//      Logger.log("success!!:469");
//      //remindsheet[i][0]をuserIdに代入
//      var userId = remindSheetData[i][0];
//      //textはremindsheet[i][1],remindsheet[i][3]を表示させる　例）8月25日　「ハッカソン」の予定です
//      var planDate = new Date(remindSheetData[i][1]);
//      var text = (planDate.getMonth()+1) + "月" + planDate.getDate() + "日 " + planDate.getHours() +"時"+ planDate.getMinutes()+"分\n「" + remindSheetData[i][3] + "」の予定です";
//      
//      pushText(text);
//      
//      to = userId;
//      
//      headers2 = { 
//        "Content-Type" : "application/json; charset=UTF-8",
//        'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
//      };
//      
//      postData2 = { 
//        "to" : userId,
//        "messages" : 
//        messageData
//        
//      };
//      options2 = { 
//        "method" : "post",
//        "headers" : headers2,
//        "payload" : JSON.stringify(postData2)
//      };
//      var line_endpoint2 = "https://api.line.me/v2/bot/message/push";
//      UrlFetchApp.fetch(line_endpoint2, options2);
//    }
//  }
//  return;
//}
//
//
//// その日のトリガーを削除する関数(消さないと残る)
//function deleteTrigger(now) {
//  
//  var triggers = ScriptApp.getProjectTriggers();
//  for(var i=0; i < triggers.length; i++) {
//    var triggerCLOCK = triggers[i];
//    
//    if (triggers[i].getHandlerFunction() == "doRemind" ){
//      ScriptApp.deleteTrigger(triggers[i]);
//    }
//  }
//}
