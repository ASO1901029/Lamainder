
function doPost(e) {
  jsonObj = JSON.parse(e.postData.contents); //POSTをJsonで受け取り
  replyToken = jsonObj.events[0].replyToken; //リプライトークンの取り出し
  userId = jsonObj.events[0].source.userId; //userIdの取り出し
  type = jsonObj.events[0].type;
  userIdIndex = remindSheetDataTrans[0].lastIndexOf(userId); //userIdが格納される行の取得 取得できない場合は-1

  if(type == "follow" || userIdIndex == -1){ //新しくフォローされた場合か、userIdが登録されていない場合
    newFrends();
    return;
  }

  userStatusIndex = userSheetDataTrans[0].indexOf(userId); //userStatusの格納される行番号の取得
  userStatus = userSheetData[userStatusIndex][1]; //userのStatusを取得

  if(type=="postback"){
    postBack(jsonObj.events[0]); //postBack用の処理。日時選択アクションとか。
  }else{
    selectMode(); //挙動選択
  }

  if(!messageData[0]){//何もメッセージが入ってない時 ←つまりエラー時。
    pushText("何かエラーが起きたようだね。申し訳ないがリセットするよ。");
    setUserStatus("start");
  }
  return post_reply();//botによる返信、messageDataを参照する。
}

//postBack時用
function postBack(e){
  data = e.postback.data;
  switch(data){
    case "planDate":
    case "remindDate":
      datetime = e.postback.params.datetime;
      datetimeJp = getDatetimeJp(datetime);

      break;
    case "listDate":
      //    case "editDate":
    case "deleteDate":
      datetime = e.postback.params.date;
      datetimeJp = getDatetimeJp(datetime);
      break;
    case "oneHoursAgo":
      datetime = new Date(remindSheetData[userIdIndex][1]);
      var dt = datetime;
      dt.setHours(dt.getHours()-1);
      datetimeJp = dt.getMonth()+1+"月"+dt.getDate()+"日 "+dt.getHours()+"時"+dt.getMinutes()+"分";
      break;
  }
  selectMode();
}
