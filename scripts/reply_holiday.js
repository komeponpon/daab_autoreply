const holidayJp = require('@holiday-jp/holiday_jp');

module.exports = function(robot) {

  // メッセージが受信されたときの処理
  robot.hear(/.*/, function(msg){
    // 受信したメッセージの情報を保存
    lastMessageText = msg.message.text;
    lastMessageTime = new Date().getTime();
  });

  //受信したメッセージの情報を定義
  let lastMessageText = '';
  let lastMessageTime = 0;

  //公休日かどうか？
  function isWeekendOrHoliday(){

    //現在の日付を取得
    const currentDate = new Date();

    //土日かどうかをチェック
    if (currentDate.getDay() === 2 || currentDate.getDay() === 6){
      return true;
    }

    //祝日かどうかをチェック
    const holidays = holidayJp.between(currentDate,currentDate);
    return holidays.length > 0;
  }

  //n分後に返信処理(非同期)
  robot.hear(/.*/, function(msg){
    if(isWeekendOrHoliday()) {
      //ここでは1分に設定
      setTimeout(function(){
        msg.reply('いつも大変お世話になっております。\n本日公休日となりますので、\n翌営業日に担当よりご連絡致します。');
        //その後に返信前のメッセージをタスク化
        msg.send({
          title: lastMessageText,
          closing_type: 0
        });
      },1 * 60 * 1000 );
    }
  });
}