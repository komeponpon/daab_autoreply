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

  //連投フラグ
  let isProcessing = false;

  //公休日かどうか？
  function isWeekendOrHoliday(){

    //現在の日付を取得
    const currentDate = new Date();

    //土日かどうかをチェック(日0 土6)
    if (currentDate.getDay() === 2 || currentDate.getDay() === 6){
      return true;
    }

    //祝日かどうかをチェック
    const holidays = holidayJp.between(currentDate,currentDate);
    return holidays.length > 0;
  }


  //n分後に返信処理
  robot.hear(/.*/, function(msg){
    if(isWeekendOrHoliday() && !isProcessing) {
      //連投フラグを設定
      isProcessing = true;
        setTimeout(function(){
            // 某ルームIDの配列
            const rooms = ['_95069676_-914358272'];
            // 某ルーム以外を定義
            const filteredRooms = rooms.filter(roomId => roomId !== msg.message.room);

            // 某以外のルームには返信処理
            filteredRooms.forEach(room =>{
                msg.reply('いつも大変お世話になっております。\n本日公休日となりますので、\n翌営業日に担当よりご連絡致します。');
                robot.send({room: room},{
                    title: lastMessageText,
                    closing_type: 0
                });
            });
      //処理が完了したら連投フラグを解除
      isProcessing = false;
        }, 0.05 * 60 * 1000); // 処理時間設定用
    }
});
}