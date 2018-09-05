function doPost(e) {
  jsonObj = JSON.parse(e.postData.contents); //POSTをJsonで受け取り
  replyToken = jsonObj.events[0].replyToken; //リプライトークンの取り出し
  userId = jsonObj.events[0].source.userId; //userIdの取り出し
  type = jsonObj.events[0].type;
  userIdIndex = remindSheetDataTrans[0].lastIndexOf(userId); //userIdが格納される行の取得 取得できない場合は-1

  if (type == "follow" || userIdIndex == -1) { //新しくフォローされた場合か、userIdが登録されていない場合
    newFrends();
    return;
  }

  userStatusIndex = userSheetDataTrans[0].indexOf(userId); //userStatusの格納される行番号の取得
  userStatus = userSheetData[userStatusIndex][1]; //userのStatusを取得

  if (type == "postback") {
    postBack(jsonObj.events[0]); //postBack用の処理。日時選択アクションとか。
  } else {
    selectMode(); //挙動選択
  }

  if (!messageData[0]) { //何もメッセージが入ってない時 ←つまりエラー時。
    pushText("何かエラーが起きたようだね。申し訳ないがリセットするよ。");
    setUserStatus("start");
  }
  return post_reply(); //botによる返信、messageDataを参照する。
}

//postBack時用
function postBack(e) {
  data = e.postback.data;
  switch (data) {
    case "planDate":
    case "remindDate":
      datetime = e.postback.params.datetime;
      datetimeJp = getDatetimeJp(datetime);

      break;
    case "listDate":
//  case "editDate":
    case "deleteDate":
      datetime = e.postback.params.date;
      datetimeJp = getDatetimeJp(datetime);
      break;
    case "oneHoursAgo":
      datetime = new Date(remindSheetData[userIdIndex][1]);
      var dt = datetime;
      dt.setHours(dt.getHours() - 1);
      datetimeJp = dt.getMonth() + 1 + "月" + dt.getDate() + "日 " + dt.getHours() + "時" + dt.getMinutes() + "分";
      break;
  }
  selectMode();
}

//挙動選択
function selectMode() {
  if (type != "postback") {
    message = jsonObj.events[0].message.text; //メッセージの取り出し
  }
  switch (userStatus) {
    case "start":
      switch (message) {
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
          pushText("やぁ、どうも。何のようかな？");
          pushQRMenu();
          break;
      }
      break;
    case "add1":
      addContents1();
      setUserStatus("add2");
      selectTimeText = "なるほど、次は予定の時間を選んでおくれよ。";
      pushQRSelectTime("planDate");
      break;

    case "add2":
      if (type == "postback") {
        addContents2();
        setUserStatus("add3");
        pushText("予定の時間は " + datetimeJp + " か。いいじゃないか。");
        selectTimeText = "では次は、通知したい時間を選んでくれるかい？";
        pushQRSelectTimeRemind("remindDate"); //pushQRSelectTimeと比較すると、予定の1時間前に通知とかが選べる
      } else { //手打ちで返信された場合。
        selectTimeText = "やり直しだ、すまないが予定の時間を選んでくれ。";
        pushQRSelectTime("planDate");
      }
      break;

    case "add3":
      if (type == "postback") {
        addContents3();
        pushText("通知したい時間は " + datetimeJp + " か。君にぴったりだ。");
        pushText("よし、君の予定はちゃんと覚えたよ。");
        setUserStatus("start");
      } else {
        selectTimeText = "やり直しだ、すまないが通知したい時間を選んでくれ。";
        pushQRSelectTime("remindDate");
      }
      break;

    case "list1":
      if (type == "postback") {
        pushText(datetimeJp + "\n君の予定を最大10件まで表示するよ。");
        list1();
        setUserStatus("start");
      } else {
        selectTimeText = "おっと、予定を見たい日付を選んでくれ。";
        pushQRSelectDate("listDate");
      }
      break;

      // EDITモードは操作性が悪いということで無し（一覧の次に編集を表示させる・・？
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
      if (type == "postback") {
        pushText(datetimeJp + "\n君が登録した予定を最大10件まで表示するよ。");
        delete1();
        setUserStatus("delete2");
        pushText("すまないが、この中から削除したいものの番号を入力してくれるかな？");
      } else {
        selectTimeText = "申し訳ないが、検索したい日付を選んでくれ。";
        pushQRSelectDate("deleteDate");
      }
      break;

    case "delete2":
      delete2(message);
      break;
  }
}
