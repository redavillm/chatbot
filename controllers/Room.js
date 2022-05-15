const {
  getRooms,
  addUser,
  userExit,
  findRoomByUserId,
  showLogs,
  addLog,
  getNicName,
  formatRoomButtoms,
  getInfoButtons,
  checkBan,
  formatUsersButtons,
  getDescription,
} = require("../lib/rooms");

const list = (bot, chatId) => {
  try {
    bot.sendMessage(chatId, "Выберите комнату", formatRoomButtoms(getRooms()));
  } catch (error) {
    console.log(error);
  }
};

// const choise = async (bot, chatId, [roomId]) => {
//   console.log(checkBan(chatId));
//   if (checkBan(chatId) === 1) {
//     bot.sendMessage(chatId, `Вы забанены.`);
//     return;
//   }
//   const success = await addUser(chatId, +roomId);
//   if (!success) {
//     return bot.sendMessage(chatId, "Вы уже в комнате!");
//   }
//   const room = findRoomByUserId(chatId);
//   bot.sendMessage(
//     chatId,
//     `Вы вошли в комнату ${room.subject}, под именем ${getNicName(chatId)}`,
//     getInfoButtons()
//   );
//   await addLog(room.id, `Пользователь ${getNicName(chatId)} вошел в комнату.`);
// };

const choise = async (bot, chatId, [roomId]) => {
  if (checkBan(chatId) === 1) {
    bot.sendMessage(chatId, `Вы забанены.`);
    return;
  }
  const currentRoom = await findRoomByUserId(chatId);
  if (!!currentRoom) {
    if (currentRoom.id === +roomId) {
      return bot.sendMessage(chatId, "Вы уже в комнате!");
    } else {
      await exit(bot, chatId);
    }
  }
  await addUser(chatId, +roomId);
  const room = await findRoomByUserId(chatId);
  bot.sendMessage(
    chatId,
    `Вы вошли в комнату ${room.subject}, под именем ${getNicName(chatId)}`,
    getInfoButtons()
  );
  await addLog(room.id, `Пользователь ${getNicName(chatId)} вошел в комнату.`);
};

const exit = async (bot, chatId) => {
  const room = await findRoomByUserId(chatId);
  if (!room) {
    bot.sendMessage(chatId, "Вы не в комнате!");
  } else if (userExit(chatId, room.id)) {
    bot.sendMessage(chatId, `Вы вышли из комнаты ${room.subject}`);
    await addLog(
      room.id,
      `Пользователь ${getNicName(chatId)} вышел из комнаты.`
    );
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

const info = async (bot, chatId) => {
  const room = findRoomByUserId(chatId);
  // const usersByRoom = getUsersByRoom();
  const usersArr = room.users.filter((userId) => userId !== chatId);
  if (!room) {
    return bot.sendMessage(chatId, "Вы не в комнате!");
  }
  bot.sendMessage(chatId, `Вы находитесь в комнате: ${room.subject}`);
  bot.sendMessage(
    chatId,
    `Список пользователей: `,
    formatUsersButtons(usersArr)
  );
};

const users = async (bot, chatId) => {
  try {
    const room = findRoomByUserId(chatId);
    const usersArr = room.users.filter((userId) => userId !== chatId);
    bot.sendMessage(
      chatId,
      `Список пользователей: `,
      formatUsersButtons(usersArr)
    );
  } catch (error) {
    console.log(error);
  }
};

const user = async (bot, chatId, userId) => {
  bot.sendMessage(chatId, `${getDescription(userId)}`);
};

module.exports = {
  list,
  choise,
  exit,
  history,
  info,
  users,
  user,
};
