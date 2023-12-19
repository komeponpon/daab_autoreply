const holidayJp = require('@holiday-jp/holiday_jp');

module.exports = function(robot) {
  // メッセージが週末や祝日に受信された場合の処理
  robot.hear(/.*/, function(msg) {
    // メッセージが週末や祝日に受信されているか確認
    if (isWeekendOrHoliday()) {
      msg.reply('いつも大変お世話になっております。\n本日公休日となりますので、\n翌営業日に担当よりご連絡致します。');
    }

    // 最後のメッセージの情報を更新
    lastMessageText = msg.message.text;
    lastMessageTime = new Date().getTime();

    // タスクが完了していない場合の処理
    if (!taskCompleted) {
      msg.send({
        title: lastMessageText,
        closing_type: 1
      });
      // 完了を管理
      taskCompleted = true;
    }

    // 2分後に自動メッセージを送信
    setTimeout(function() {
      if (new Date().getTime() - lastMessageTime > 120000 && !taskCompleted) {
        msg.send('いつも大変お世話になっております。\n本日公休日となりますので、\n翌営業日に担当よりご連絡致します。');
      }
    }, 120000);
  });

  function isWeekendOrHoliday() {
    // 現在の日付を取得
    const currentDate = new Date();

    // 土日かどうかをチェック
    if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
      return true;
    }

    // 祝日かどうかをチェック
    const holidays = holidayJp.between(currentDate, currentDate);
    return holidays.length > 0;
  }

  // 最後のメッセージの情報を保持する変数
  let lastMessageTime = 0;
  let lastMessageText = '';

  // タスクの完了状態を管理する変数
  let taskCompleted = false;
};
