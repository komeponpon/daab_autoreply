//Description
//土日祝日にメッセージが来た場合、自動応答するスクリプト

const holidayJp = require('@holiday-jp/holiday_jp');

module.exports = function(robot) {
  robot.hear(/.*/,function(msg){
    //メッセージが土日祝日に来ているか確認
    if(isWeekendOrHoliday()){
      msg.reply('いつも大変お世話になっております。本日公休日のため、週明けに担当よりご連絡致します。');
    }
  });

  function isWeekendOrHoliday(){
    //現在の日付を取得
    const currentDate = new Date();

    //土日祝日かの判定
    if(currentDate.getDay() === 0 || currentDate.getDay() === 6){
      return true;
    }

    //祝日
    const holidays = holidayJp.between(currentDate, currentDate);
    if (holidays.length > 0) {
      return true;
    }

    return false;
  }
};

// 最後のメッセージを受け取ってから2分後に自動返信
let lastMessageTime = 0;

module.exports = function(robot) {
  robot.hear(/.*/, function(msg) {
    const currentTime = new Date().getTime();

    //2分経過しているかを確認
    if (currentTime - lastMessageTime > 120000){
      lastMessageTime = currentTime;

      //2分後に自動メッセージを送信
      setTimeout(function(){
        msg.send('いつも大変お世話になっております。\n本日公休日となりますので、\n翌営業日に担当よりご連絡致します。');
      },120000);
    }
  });
};
