require("dotenv").config();

const TelegramBot = require("node-telegram-bot-api");

const {
  findRoomByUserId,
  addLog,
  getNicName,
} = require("./lib/rooms");

const RoomController = require("./controllers/Room");

const SettingsController = require("./controllers/Settings.js");

const res = require("express/lib/response");

const User = require("./models/User");
const { getScenario, setScenario } = require("./lib/scenario");

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

bot.onText(/\/room/, (msg) => {
  try {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "Выберете команду", {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "List",
              callback_data: "r:list",
            },
          ],
          [
            {
              text: "Exit",
              callback_data: "r:exit",
            },
            {
              text: "Info",
              callback_data: "r:info",
            },
          ],
        ],
      },
    });
  } catch (error) {
    console.log(error);
  }
});

bot.on("message", (msg) => {
  try {
    const chatId = msg.chat.id;
    const scenario = getScenario(chatId);
    if (scenario) {
      const [controller, command] = scenario.split(":");
      if (controller === "set") {
        SettingsController[command](bot, chatId, msg.text);
      }
      setScenario(chatId, null);
      return;
    }

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

const scenarioMessages = {
  "s:set:name": "Введите имя.",
  "s:set:description": "Введите описание.",
};

bot.onText(/\/set/, async (msg) => {
  try {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "Выберете комнаду", {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Name",
              callback_data: "s:set:name",
            },
            {
              text: "Description",
              callback_data: "s:set:description",
            },
          ],
        ],
      },
    });
  } catch (e) {
    console.log(e);
  }
});

bot.onText(/\/set (.+)/, async (msg, match) => {
  try {
    const chatId = msg.chat.id;
    const [command] = match[1].split(" ");
    if (!command) {
      switch (command) {
        case "name": {
          const [, name] = match[1].split(" ");
          await SettingsController.name(bot, chatId, name);
          break;
        }
        case "description": {
          const [, ...arrDescription] = match[1].split(" ");
          const description = arrDescription.join(" ");
          await SettingsController.description(bot, chatId, description);
          break;
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
});

bot.onText(/\/info/, async (msg) => {
  const chatId = msg.chat.id;
  if (!findRoomByUserId(chatId)) {
    bot.sendMessage(chatId, "В данный момент вы не в комнате.");
  }
  bot.sendMessage(
    chatId,
    "В боте можно использовать следущие команды \n /set name <ваше имя> - задайте ваше имя.\n /room list - для просмотра информации по доступным комнатам и колличестве пользователей в них. \n /room choise <номер комнаты> - для перехода в выбранную комнату. \n /room exit - для выхода из комнаты. \n /room info - для получения информации о конате и пользователе."
  );
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
  bot.sendMessage(
    chatId,
    "Это бот для общения на различные темы с разными пользователями в тематических комнатах. Для просмотра доступных команд, пожалуйста введите /info"
  );
});

bot.on("callback_query", (msg) => {
  const data = msg.data;
  const chatId = msg.message.chat.id;
  const [controller, command, params] = data.split(":");

  switch (controller) {
    case "r": {
      RoomController[command](bot, chatId, params);
      break;
    }
    case "s": {
      setScenario(chatId, `${command}:${params}`);
      bot.sendMessage(chatId, scenarioMessages[data]);
    }
  }
});

module.exports = { bot };
