const {
  formatRooms,
  getRooms,
  addUser,
  userExit,
  findRoomByUserId,
  showLogs,
  addLog,
  settingName,
  findUserNicName,
  banUser,
  getNicName,
  formatRoomButtoms,
  getInfoButtons,
  checkBan,
} = require("../lib/rooms");

const list = (bot, chatId) => {
  try {
    bot.sendMessage(chatId, "Выберите комнату", formatRoomButtoms(getRooms()));
  } catch (error) {
    console.log(error);
  }
};

const choise = async (bot, chatId, [roomId]) => {
  // console.log(checkBan(chatId));
  if (checkBan(chatId) === 1) {
    bot.sendMessage(chatId, `Вы забанены.`);
    return;
  }
  const success = await addUser(chatId, +roomId);
  if (!success) {
    return bot.sendMessage(chatId, "Вы уже в комнате!");
  }
  const room = findRoomByUserId(chatId);
  bot.sendMessage(
    chatId,
    `Вы вошли в комнату ${room.subject}, под именем ${getNicName(chatId)}`,
    getInfoButtons()
  );
  await addLog(room.id, `Пользователь ${getNicName(chatId)} вошел в комнату.`);
};

const exit = (bot, chatId) => {
  const room = findRoomByUserId(chatId);
  if (!room) {
    bot.sendMessage(chatId, "Вы не в комнате!");
  } else if (userExit(chatId, room.id)) {
    bot.sendMessage(chatId, `Вы вышли из комнаты ${room.subject}`);
    addLog(room.id, `Пользователь ${chatId} вышел из комнаты.`);
  } else {
    bot.sendMessage(chatId, "Что-то пошло не так.");
  }
};

const history = async (bot, chatId, [count]) => {
  const room = findRoomByUserId(chatId);
  if (!room) {
    bot.sendMessage(chatId, "Вы не в комнате!");
  } else {
    const messages = await showLogs(room.id, count);
    bot.sendMessage(
      chatId,
      `Список сообщений:\n ${messages
        .map((log) => {
          return `${getNicName(log.user_id)}: ${log.message}`;
        })
        .join("\n")}`
    );
  }
};

module.exports = {
  list,
  choise,
  exit,
  history,
};
