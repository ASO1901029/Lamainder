
//挙動選択
function selectMode(){
  if(type != "postback"){
    message = jsonObj.events[0].message.text; //メッセージの取り出し
  }
  switch(userStatus){
    case "start":
      switch(message){
        case "予定の追加":
          pushText("予定の内容を聞かせてくれるかい？");
          setUserStatus("add1");
          break;

          //        case "予定の編集":
          //          selectTimeText = "いつの予定を編集するのだ？";
          //          pushQRSelectDate("editDate");
          //          setUserStatus("edit1");
          //          break;

        case "予定一覧":
          selectTimeText = "わかった、では予定を見たい日付を選んでくれ。";
          pushQRSelectDate("listDate");
          setUserStatus("list1");
          break;

        case "予定の削除":
          selectTimeText = "ふむ、いつの予定を削除したいんだい？";
          pushQRSelectDate("deleteDate");
          setUserStatus("delete1");
          break;

        default:
          pushText("やぁ、どうも。");
          pushQRMenu();
          break;
      }
      break;
    case "add1":
      addContents1();
      setUserStatus("add2");
      selectTimeText = "なるほど、次は予定の時間を選んでおくれよ。";
      pushQRSelectTime("planDate");
      //日時選択アクションから入力されてるか判定(type == "postback")してadd2に設定させずもう一度表示とかしてもいいかも）
      break;

    case "add2":
      if(type == "postback"){
        addContents2();
        setUserStatus("add3");
        pushText("予定の時間は "+datetimeJp + " か。いいじゃないか。");
        selectTimeText = "では次は、通知したい時間を選んでくれるかい？";
        pushQRSelectTimeRemind("remindDate");//pushQRSelectTimeと比較すると、予定の1時間前に通知とかが選べる
      }else{
        selectTimeText = "やり直しだ、すまないが予定の時間を選んでくれ。";
        pushQRSelectTime("planDate");
      }
      break;

    case "add3":
      if(type == "postback"){
        addContents3();
        pushText("通知したい時間は "+datetimeJp + " か。君にぴったりだ。");
        pushText("よし、君の予定はちゃんと覚えたよ。");
        setUserStatus("start");
      }else{
        selectTimeText = "やり直しだ、すまないが通知したい時間を選んでくれ。";
        pushQRSelectTime("remindDate");
      }
      break;

    case "list1":
      if(type == "postback"){
        pushText(datetimeJp+"\n君の予定を最大10件まで表示するよ。");
        list1();
        setUserStatus("start");
      }else{
        selectTimeText = "おっと、予定を見たい日付を選んでくれ。";
        pushQRSelectDate("listDate");
      }
      break;

      //    case "edit1":
      //      pushText(datetimeJp+"以降の予定を最大10件表示します");
      //      edit1();
      //      setUserStatus("edit2");
      //      pushText("予定の番号を入力してください。");
      //      break;
      //
      //    case "edit2":
      //      edit2(message);
      //      break;

    case "delete1":
      if(type=="postback"){
        pushText(datetimeJp+"\n君が登録した予定を最大10件まで表示するよ。");
        delete1();
        setUserStatus("delete2");
        pushText("すまないが、この中から削除したいものの番号を入力してくれるかな？");
      }else{
        selectTimeText = "申し訳ないが、検索したい日付を選んでくれ。";
        pushQRSelectDate("deleteDate");
      }
      break;

    case "delete2":
      delete2(message);
      break;
  }
}

//messageDataの操作
//messageDataにテキストメッセージを追加
function pushText(text){
  var message = {
    "type":"text",
    "text":text,
  };
  messageData.push(message);
}

function pushQRMenu(){
  messageData.push({
    "type":"text",
    "text":"さぁ、君の予定を教えておくれよ。",
    "quickReply":{
      "items":[
        {
          "type":"action",
          "action":{
            "type":"message",
            "label":"追加",
            "text":"予定の追加",
          }
        },
        //        {
        //          "type":"action",
        //          "action":{
        //            "type":"message",
        //            "label":"編集",
        //            "text":"予定の編集",
        //          }
        //        },
        {
          "type":"action",
          "action":{
            "type":"message",
            "label":"一覧",
            "text":"予定一覧",
          }
        },{
          "type":"action",
          "action":{
            "type":"message",
            "label":"削除",
            "text":"予定の削除",
          }
        }
      ]
    }
  });
}


function pushQRSelectTime(data){
  messageData.push({
    "type":"text",
    "text":selectTimeText,
    "quickReply":{
      "items":[
        {
          "type":"action",
          "action":{
            "type":"datetimepicker",
            "label":"時間選択",
            "data":data,
            "mode":"datetime",
            //            "initial":"2017-12-25t00:00",
            //            "min":"2018-09-24t23:59",   //設定できる最小を設定したかったけどうまく動かず。line側のバグ？
          }
        }
      ]
    }
  });
}

function pushQRSelectTimeRemind(data){
  var oneHoursAgo= new Date(datetime);
  oneHoursAgo.setHours(oneHoursAgo.getHours()-1);
  messageData.push({
    "type":"text",
    "text":selectTimeText,
    "quickReply":{
      "items":[
        {
          "type":"action",
          "action":{
            "type":"datetimepicker",
            "label":"時間選択",
            "data":data,
            "mode":"datetime",
          }
        },{
          "type":"action",
          "action":{
            "type":"postback",
            "label":"予定の1時間前",
            "data": "oneHoursAgo",
            "displayText":"予定の1時間前",
          }
        }
      ]
    }
  });
}

function pushQRSelectDate(data){
  messageData.push({
    "type":"text",
    "text":selectTimeText,
    "quickReply":{
      "items":[
        {
          "type":"action",
          "action":{
            "type":"datetimepicker",
            "label":"時間選択",
            "data":data,
            "mode":"date",
          }
        }
      ]
    }
  });
}

//ここからスプレッドシート関連の操作
//userStatusの更新
function setUserStatus(text){
  userStatus = text;
  userSheet.getRange(userStatusIndex+1,2).setValue(text);

}

function addContents1(){ //userIdと内容の追加
  var remindNomber = remindSheetData[remindSheetData.length-1][4] +1;
  var one_line = [userId,"","",message,remindNomber];
  remindSheet.appendRow(one_line);
}

function addContents2(){ //予定日時の追加
  remindSheet.getRange(userIdIndex+1,2).setValue(datetime);
}

function addContents3(){//通知日時の設定
  remindSheet.getRange(userIdIndex+1,3).setValue(datetime);
  setTrigger(datetime);

}

function list1(){
  searchPlan();
}

//function edit1(){
//  searchPlan();
//}

//function edit2(no){
//  var remindIndex =  selectPlan(no);
//  pushText(remindIndex);
//  pushText("未作成。戻ります。");
//  setUserStatus("start");
//}

function delete1(){
  searchPlan();
}

function delete2(no){
  var searchSheet = spreadsheet.getSheetByName("search");//E列を検索に使う
  var searchSheetData = searchSheet.getSheetValues(1, 1, 10, 5);
  var searchSheetDataTrans = _.zip.apply(_,searchSheetData);
  var noIndex = searchSheetData[no-1][4];

  remindSheet.getRange(noIndex,1,1,4).clear();
  pushText("、、、よし。綺麗さっぱりに忘れたよ！");
  setUserStatus("start");

}

function selectPlan(no){ //選択用。
  var sortArr = remindSheetData.sort(function(a,b){return(a[2] - b[2]);});
  var count = 0;
  for(var i=0;i<sortArr.length;i++){
    if(sortArr[i][2] >= datetime){
      count++;
      if(count == no){
        return i;
      }
    }
  }
  return no;
}

function searchPlan(){ //予定の日時で、datetimeに近い順に10件まで表示する。
  var sortArr = remindSheetData.sort(function(a,b){return(a[1] - b[1]);});
  var count = 0;
  var text = "";
  var searchArr = [];

  sortArr.some(function (row){
    if(row[1] >= datetime && row[0] == userId){
      var datetimeJp = getDatetimeJp(row[1]);
      count++;
      text += count+". " +datetimeJp+" に "+row[3] + "\n";
      searchArr.push(row);
    }
    if(count >= 10){
      return true;
    }
  });
  if(count ==0){
    pushText("おっと、予定が何も登録されていないようだ。");
    return -1;
  }
  text += "\n以上が予定されているよ。";
  pushText(text);
  var searchSheet = spreadsheet.getSheetByName("search");//検索結果保存用
  searchSheet.clear();
  searchSheet.getRange(1,1,searchArr.length,searchArr[0].length).setValues(searchArr);

}

function newFrends(){
  var userIdIndex = userSheetDataTrans[0].indexOf(userId);
  if(userIdIndex == -1){
    userSheet.appendRow([userId,"start"]);
  }else{
    userSheetData[userIdIndex][0];
    userSheet.getRange(userIdIndex+1,2).setValue("start");
  }
    pushText("やぁ、僕はダンディ・ラマさ。君の教えてくれた予定を全て記憶できちゃう優れたラマなんだ。\n君の予定を覚えたり、消したり、その日の予定を一覧として教えることもできるよ。\nいつでも僕に声をかけてくれ");
  pushQRMenuFirst();
  post_reply();
}

function pushQRMenuFirst(){
  messageData.push({
    "type":"text",
    "text":"さぁ、君の予定を教えてくれないか？",
    "quickReply":{
      "items":[
        {
          "type":"action",
          "action":{
            "type":"message",
            "label":"予定を教える",
            "text":"予定の追加",
          }
        }
      ]
    }
  });
}

function getDatetimeJp(datetime){
  dt = new Date(datetime);
  datetimeJp = dt.getMonth()+1+"月"+dt.getDate()+"日 "+dt.getHours()+"時"+dt.getMinutes()+"分";
  return datetimeJp;
}
function getDateJp(datetime){
  dt = new Date(datetime);
  datetimeJp = dt.getMonth()+1+"月"+dt.getDate()+"日";
  return datetimeJp;
}

//ここからHTTP通信関連
//返信を飛ばす
function post_reply(){
  var headers = {
    "Content-Type" : "application/json; charset=UTF-8",
    'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
  };
  var postData = {
    "replyToken":replyToken,
    "messages" :messageData
  };
  var options = {
    "method" : "post",
    "headers" : headers,
    "payload" : JSON.stringify(postData)
  };
  UrlFetchApp.fetch(url, options);
}


//Trigger関連

function setTrigger(elements) { //登録した瞬間に呼び出す　引数はdatetime
  var remindTime = new Date(elements); //C列（通知日時）をDate型で取得
  ScriptApp.newTrigger("doRemind").timeBased().at(remindTime).create();
}

function doRemind() {
  var now = new Date();

  //  deleteTrigger(now);　日時分指定なので消さなくても問題はない（増えすぎるとバグりそうだけど）
  messageData = [];
  var headers2;
  var postData2;
  var options2;


  now.setSeconds(0);
  now.setMilliseconds(0);
  var nY = now.getYear();
  var nD = now.getDate();
  var nH = now.getHours();
  var nM = now.getMinutes();
  for(var i=0;i<remindLastRow;i++){
    var remindDatetime = new Date(remindSheetData[i][2]);

    var rY = remindDatetime.getYear();
    var rD = remindDatetime.getDate();
    var rH = remindDatetime.getHours();
    var rM = remindDatetime.getMinutes();

    Logger.log(nH+":"+rH+","+nM+":"+rM);

    if(nY == rY && nD == rD && nH == rH && nM == rM){
      Logger.log("success!!:469");
      //remindsheet[i][0]をuserIdに代入
      var userId = remindSheetData[i][0];
      //textはremindsheet[i][1],remindsheet[i][3]を表示させる　例）8月25日　「ハッカソン」の予定です
      var planDate = new Date(remindSheetData[i][1]);
      var text = (+planDate.getMonth()+1) + "月" + planDate.getDate() + "日 " + planDate.getHours() +"時"+ planDate.getMinutes()+"分\n「" + remindSheetData[i][3] + "」の予定があるぞ！";

      pushText(text);

      to = userId;

      headers2 = {
        "Content-Type" : "application/json; charset=UTF-8",
        'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
      };

      postData2 = {
        "to" : userId,
        "messages" :
        messageData

      };
      options2 = {
        "method" : "post",
        "headers" : headers2,
        "payload" : JSON.stringify(postData2)
      };
      var line_endpoint2 = "https://api.line.me/v2/bot/message/push";
      UrlFetchApp.fetch(line_endpoint2, options2);
    }
  }
  return;
}


// その日のトリガーを削除する関数(消さないと残る)
function deleteTrigger(now) {

  var triggers = ScriptApp.getProjectTriggers();
  for(var i=0; i < triggers.length; i++) {
    var triggerCLOCK = triggers[i];

    if (triggers[i].getHandlerFunction() == "doRemind" ){
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }
}
