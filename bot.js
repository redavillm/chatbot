require("dotenv").config();

const TelegramBot = require("node-telegram-bot-api");

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
  banUser
} = require("./lib/rooms");

const RoomController = require("./controllers/Room");

const token = process.env.TOKEN;

const bot = new TelegramBot(token, { polling: true });

// /room list- список комнат
// /room choise <id>- выбор комнаты
// /room exit - выход из комнаты
// /room history - список сообщений пользователей
// /settingsname <name> - выбрать имя
bot.onText(/\/room (.+)/, (msg, match) => {
  try {
    const chatId = msg.chat.id;
    // console.log(match[1]);
    const [command] = match[1].split(" ");

    if (RoomController[command]) {
      const params = match[1].split(" ");
      params.shift();
      RoomController[command](bot, chatId, params);
    }

    // switch (command) {
    // //   case "list":
    // //     bot.sendMessage(chatId, formatRooms(getRooms()));
    // //     break;
    // //   case "choise": {
    // //     const [, roomId] = match[1].split(" ");
    // //     addUser(chatId, +roomId);
    // //     const room = findRoomByUserId(chatId);
    // //     bot.sendMessage(chatId, `Вы вошли в комнату ${room.subject}`);
    // //     addLog(
    // //       room.id,
    // //       `Пользователь ${findUserNicName(chatId)} вошел в комнату.`
    // //     );
    // //     break;
    // //   }
    // //   case "exit": {
    // //     const room = findRoomByUserId(chatId);
    // //     if (!room) {
    // //       bot.sendMessage(chatId, "Вы не в комнате!");
    // //     } else if (userExit(chatId, room.id)) {
    // //       bot.sendMessage(chatId, `Вы вышли из комнаты ${room.subject}`);
    // //       addLog(room.id, `Пользователь ${chatId} вышел из комнаты.`);
    // //     } else {
    // //       bot.sendMessage(chatId, "Что-то пошло не так.");
    // //     }
    // //     break;
    // //   }
    // //   case "history": {
    // //     const [, count] = match[1].split(" ");
    // //     const room = findRoomByUserId(chatId);
    // //     if (!room) {
    // //       bot.sendMessage(chatId, "Вы не в комнате!");
    // //     } else {
    // //       bot.sendMessage(
    // //         chatId,
    // //         `Список сообщений:\n ${showLogs(room.id, count)
    // //           .map((log) => {
    // //             return `${log.name}: ${log.message}`;
    // //           })
    // //           .join("\n")}`
    // //       );
    // //     }
    // //     break;
    // //   }
    // }
  } catch (error) {
    console.log(error);
  }
});

bot.on("message", (msg) => {
  try {
    const chatId = msg.chat.id;
    const room = findRoomByUserId(chatId);
    // console.log(room);
    if (msg.text.indexOf("/") !== 0) {
      for (let user of room.users) {
        if (user !== chatId) {
          bot.sendMessage(user, msg.text);
        }
      }
      addLog(room.id, msg.text, chatId);
    }
  } catch (error) {
    console.log(error);
  }
});

bot.onText(/\/set (.+)/, (msg, match) => {
  try {
    const chatId = msg.chat.id;
    const [command] = match[1].split(" ");

    switch (command) {
      case "name": {
        const [, name] = match[1].split(" ");
        settingName(name, chatId);
        break;
      }
    }
    // showNicName(chatId);
  } catch (error) {
    console.log(error);
  }
});