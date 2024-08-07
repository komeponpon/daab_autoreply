const holidayJp = require('@holiday-jp/holiday_jp');

module.exports = function(robot) {

  //受信したメッセージを定義
  let lastMessageText = '';
  let lastMessageTime = 0;

  //組織IDと何某ルームIDの定義
  const organizationRoomsMap = {
    '_94963938_-167772160' : ['_96396809_88080384'],
  };

  let isProcessing = false;

  //追加の休日を設定する配列
  const additionalHolidays = ['2024-08-13','2024-08-14','2024-08-15','2024-08-16','2024-12-30','2025-01-04','2024-01-05'];

  // 公休日かどうかの判定関数
  function isWeekendOrHoliday(){
    const currentDate = new Date();
    if (currentDate.getDay() === 0 || currentDate.getDay() === 6){
      return true;
    }
    const holidays = holidayJp.between(currentDate, currentDate);
    const isHoliday = holidays.length > 0;

    //追加の休日を判定
    const formattedDate = currentDate.toISOString().split('T')[0];
    const isAdditionalHoliday = additionalHolidays.includes(formattedDate);

    return isHoliday || isAdditionalHoliday
  }

  // メッセージ受信時の共通処理を関数化
  function handleReceivedMessage(msg, isFile = false) {
    let messageText;
    const senderName = msg.message.user.name;

    if (isFile) {
        // ここで、msg.jsonが文字列化されたJSONであるかどうかを確認します。
        let messageData;
        if (typeof msg.json === 'string') {
            // 文字列化されたJSONであれば、これを解析します。
            messageData = JSON.parse(msg.json);
        } else {
            // そうでなければ、既にオブジェクトであるとみなします。
            messageData = msg.json;
        }
        // 解析されたデータから"text"プロパティの値を使用します。
        messageText = messageData && messageData.text ? messageData.text : "";
    } else {
        // 通常のメッセージの場合、メッセージのテキストを直接使用
        messageText = msg.message.text;
    }

    // 送信者名とメッセージを結合
    lastMessageText = `${senderName}: ${messageText}`;
    lastMessageTime = new Date().getTime();

    const messageDomain = msg.message.rooms[msg.message.room].domain.id;

    if (isWeekendOrHoliday() && organizationRoomsMap.hasOwnProperty(messageDomain) && !isProcessing) {
      isProcessing = true;
      setTimeout(function() {
        const rooms = organizationRoomsMap[messageDomain];
        const filteredRooms = rooms.filter(roomId => roomId !== msg.message.room);
        filteredRooms.forEach(room => {
          msg.reply('さん\nいつも大変お世話になっております。\n本日公休日となりますので、\n翌営業日に担当よりご連絡致します。');
          robot.send({room: room}, {
            title: lastMessageText,
            closing_type: 0
          });
        });
        isProcessing = false;
      }, 2 * 60 * 1000);
    }
  }

  // テキストメッセージ受信時の処理
  robot.hear(/.*/, function(msg) {
    handleReceivedMessage(msg);
  });

  // ファイルが添付されたメッセージの受信時の処理
  robot.hear('file', function(msg) {
    handleReceivedMessage(msg, true);
  });

  robot.hear('files', function(msg) {
    msg.json.files.forEach(file => {
      handleReceivedMessage(msg, true);
    });
  });
}
