module.exports = (robot) => {
  robot.hear(/.*/, (res) => {
    //トークルームのIDを確認
    //res.send(`This room id is ${res.message.room}`);
  });
}