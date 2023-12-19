const holidayJp = require('@holiday-jp/holiday_jp');

// 週末や祝日にメッセージに応答するモジュール
module.exports = function(robot) {
  robot.hear(/.*/, function(msg) {
    // メッセージが週末や祝日に受信されているか確認
    if (isWeekendOrHoliday()) {
      msg.reply('いつも大変お世話になっております。\n本日公休日となりますので、\n翌営業日に担当よりご連絡致します。');
    }
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
    if (holidays.length > 0) {
      return true;
    }

    return false;
  }
};

// メッセージを受信してから2分後に自動応答するモジュール
let lastMessageTime = 0;
let lastMessageText = '';

module.exports = function(robot) {
  robot.hear(/.*/, function(msg) {
    const currentTime = new Date().getTime();

    // 最後に受け取ったメッセージの情報を更新
    lastMessageText = msg.message.text;
    lastMessageTime = currentTime;

    // 2分経過しているかを確認
    if (currentTime - lastMessageTime > 120000) {
      // 2分後に自動メッセージを送信
      setTimeout(function() {
        msg.send('いつも大変お世話になっております。\n本日公休日となりますので、\n翌営業日に担当よりご連絡致します。');
      }, 120000);
    }
  });

  // タスクのタイトルとして最後のメッセージのテキストを送信
  robot.respond(/.*/, function(res) {
    res.send({
      title: `${lastMessageText}`,
      closing_type: 1
    });

    // closing_type: 1のタスクに対するHubotの応答を行わないようにする
    robot.listeners.splice(robot.listeners.findIndex(listener => listener.toString() === 'function (msg) {') + 1, 0);
  });
};
