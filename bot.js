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
  banUser,
  unBanUser,
  checkBan,
  getNicName,
} = require("./lib/rooms");

const RoomController = require("./controllers/Room");

const res = require("express/lib/response");

const User = require("./models/User");

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
  } catch (error) {
    console.log(error);
  }
});

bot.on("message", (msg) => {
  try {
    const chatId = msg.chat.id;
    const room = findRoomByUserId(chatId);
    if (msg.text.indexOf("/") !== 0) {
      for (let user of room.users) {
        if (user !== chatId) {
          bot.sendMessage(user, `${getNicName(chatId)}: ${msg.text}`);
        }
      }
      addLog(room.id, msg.text, chatId);
    }
  } catch (error) {
    console.log(error);
  }
});

bot.onText(/\/set (.+)/, async (msg, match) => {
  try {
    const chatId = msg.chat.id;
    const [command] = match[1].split(" ");

    switch (command) {
      case "name": {
        const [, name] = match[1].split(" ");
        await settingName(name, chatId);
        bot.sendMessage(chatId, `Ваш никнэйм ${findUserNicName(chatId)}`);
        break;
      }
    }
    // showNicName(chatId);
  } catch (error) {
    console.log(error);
  }
});

bot.onText(/\/start/, async (msg, match) => {
  const chatId = msg.chat.id;
  const user = await User.findOne({ chat_id: chatId });
  if (!user) {
    const createdUser = new User({
      chat_id: chatId,
      name: "anonymous",
    });
    await createdUser.save();
  }
  bot.sendMessage(chatId, "Справка по боту");
});

bot.on("callback_query", (msg) => {
  const data = msg.data;
  const chatId = msg.message.chat.id;
  const [controller, command, params] = data.split(":");
  if (controller === "r") {
    if (RoomController[command]) {
      RoomController[command](bot, chatId, params);
    }
  }
});

module.exports = { bot };
