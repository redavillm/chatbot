const { settingName, settingDescription, getNicName } = require("../lib/rooms");

const name = async (bot, chatId, name) => {
  await settingName(name, chatId);
  bot.sendMessage(chatId, `Ваше новое имя ${getNicName(chatId)}`);
};

const description = async (bot, chatId, description) => {
  await settingDescription(description, chatId);
  bot.sendMessage(chatId, `Ваше описание:\n${description}`);
};

module.exports = {
  name,
  description,
};
