const scenarios = {};

const setScenario = (chatId, scenario) => {
  scenarios[chatId] = scenario;
};

const getScenario = (chatId) => {
  return scenarios[chatId];
};

module.exports = {
  setScenario,
  getScenario,
};
