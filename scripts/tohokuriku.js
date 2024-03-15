const holidayJp = require('@holiday-jp/holiday_jp');

module.exports = function(robot) {

  //受信したメッセージを定義
  let lastMessageText = '';
  let lastMessageTime = 0;

  //組織IDと何某ルームIDの定義
  const organizationRoomsMap = {
    '_94963722_822083584' : ['_95069676_-914358272'],
  };

  //公休日かどうかの判定
  function isWeekendOrHoliday(){

    //現在の日付を取得
    const currentDate = new Date();

    //土日かどうかをチェック（日0 土6）
    if (currentDate.getDay() === 0 || currentDate.getDay === 6){
      return true;
    }

    //祝日かどうかをチェック
    const holidays = holidayJp.between(currentDate,currentDate);
    return holidays.length > 0;
  }

  //連投フラグ
  let isProcessing = false;


  //メッセージが受信された時の処理
  robot.hear(/.*/, function(msg){


    //受信したメッセージ情報の保存
    lastMessageText = msg.message.text;
    lastMessageTime = new Date().getTime();

    //受信したメッセージの組織IDを取得
    messageDomain = msg.message.rooms[msg.message.room].domain.id;
    console.log(messageDomain);

    //公休日かつ組織IDが一致する場合の処理
    if(isWeekendOrHoliday() && organizationRoomsMap.hasOwnProperty(messageDomain) && !isProcessing){
      //連投フラグを設定
      isProcessing = true;
      setTimeout(function(){
        //タスクアップ先
        const rooms = organizationRoomsMap[messageDomain];
        //何某ルーム以外を定義
        const filteredRooms = rooms.filter(roomId => roomId !== msg.message.room);
        //何某ルーム以外には返信処理
        filteredRooms.forEach(room =>{
          msg.reply('さん\nいつも大変お世話になっております。\n本日公休日となりますので、\n翌営業日に担当よりご連絡致します。');
          robot.send({room: room},{
            title: lastMessageText,
            closing_type: 0
          });
        });
      //処理が完了したらフラグを解除
      isProcessing = false;
      }, 2 * 60 * 1000); //処理時間を設定
    }
  });
}