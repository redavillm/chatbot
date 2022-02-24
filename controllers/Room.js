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
} = require("../lib/rooms");

const list = (bot, chatId) => {
  bot.sendMessage(chatId, formatRooms(getRooms()));
};

const choise = (bot, chatId, [roomId]) => {
  addUser(chatId, +roomId);
  const room = findRoomByUserId(chatId);
  bot.sendMessage(chatId, `Вы вошли в комнату ${room.subject}!!!`);
  addLog(room.id, `Пользователь ${findUserNicName(chatId)} вошел в комнату!`);
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

const history = (bot, chatId, [count]) => {
  const room = findRoomByUserId(chatId);
  if (!room) {
    bot.sendMessage(chatId, "Вы не в комнате!");
  } else {
    bot.sendMessage(
      chatId,
      `Список сообщений:\n ${showLogs(room.id, count)
        .map((log) => {
          return `${log.name}: ${log.message}`;
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