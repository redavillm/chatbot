const Room = require("../models/Room");
const Message = require("../models/Message");
const User = require("../models/User");

const banlist = [];

const banUser = (userId) => {
  let index = -1;
  for (let user of banlist) {
    if (user === userId) {
      index = banlist.indexOf(user);
      console.log(index);
      break;
    }
  }
  if (index === -1) {
    banlist.push(userId);
  }
  console.log(banlist);
};

const unBanUser = (userId) => {
  for (let user of banlist) {
    if (user === userId) {
      banlist.splice(banlist.indexOf(user), 1);
      console.log(banlist);
      break;
    }
  }
};

const checkBan = (userId) => {
  let checkPoint = 0;
  for (let user of banlist) {
    if (user === userId) {
      checkPoint = 1;
      break;
    }
  }
  return checkPoint;
};

let rooms = [];
const nicNames = {};
const descriptions = {};

const loadNicNames = async () => {
  const users = await User.find();
  for (let user of users) {
    nicNames[user.chat_id] = user.name;
  }
};

const loadRooms = async () => {
  rooms = await Room.find();
};

loadRooms();
loadNicNames();

// const rooms = [
//   { id: 1, subject: "scince", users: [], logs: [] },
//   { id: 2, subject: "history", users: [], logs: [] },
//   { id: 3, subject: "it", users: [], logs: [] },
// ];

const addUser = (userId, roomId) => {
  const room = rooms.find((item) => item.id === roomId);
  if (room.users.indexOf(userId) !== -1) {
    return false;
  }
  room.users.push(userId);
  room.save();
  return true;
};

const getRooms = () => {
  return rooms;
};

const formatRooms = (arr) => {
  return arr
    .map(
      (item) =>
        `Комната ${item.id}: тема "${item.subject}", колличество участников ${item.users.length}`
    )
    .join("\n");
};

const formatRoomButtoms = (arr) => {
  const roomList = [];

  for (let i = 0; i < arr.length; i += 2) {
    const innerList = [];
    innerList.push({
      text: `${arr[i].subject} 😀 ${arr[i].users.length}`,
      callback_data: `r:choise:${arr[i].id}`,
    });
    if (arr[i + 1]) {
      innerList.push({
        text: `${arr[i + 1].subject} 😀 ${arr[i + 1].users.length}`,
        callback_data: `r:choise:${arr[i + 1].id}`,
      });
    }
    roomList.push(innerList);
  }
  return { reply_markup: { inline_keyboard: roomList } };
};

const formatUsersButtons = (arr) => {
  const usersList = [];

  for (let i = 0; i < arr.length; i += 2) {
    const innerList = [];
    innerList.push({
      text: `${getNicName(arr[i])} 😀`,
      callback_data: `r:user:${arr[i]}`,
    });
    if (arr[i + 1]) {
      innerList.push({
        text: `${getNicName(arr[i + 1])} 😀`,
        callback_data: `r:user:${arr[i + 1]}`,
      });
    }
    usersList.push(innerList);
  }
  return { reply_markup: { inline_keyboard: usersList } };
};

const getInfoButtons = () => {
  const infoList = {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "History",
            callback_data: "r:history:5",
          },
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
        [
          {
            text: "Users",
            callback_data: "r:users",
          },
        ],
      ],
    },
  };
  return infoList;
};

const findRoomByUserId = (userId) => {
  let resRoom = null;
  for (let room of rooms) {
    if (room.users.includes(userId)) {
      resRoom = room;
      break;
    }
  }
  return resRoom;
};

// const userExitOld = (userId, userRoom) => {
//     if (findUserOld(userId, userRoom) !== 0) {
//         rooms
//             .map(mapItem => mapItem.users
//                 .find(findeItem => findeItem === userId ? mapItem.users.splice(mapItem.users.indexOf(findeItem), 1) : NaN));
//     } else {
//         return userRoom = 0;
//     }
// }

const userExit = (userId, roomId) => {
  const room = rooms.find((item) => item.id === roomId);
  if (!room) {
    return false;
  }
  const index = room.users.indexOf(userId);
  if (index === -1) {
    return false;
  }
  room.users.splice(index, 1);
  room.save();
  return true;
};

const addLog = async (roomId, message, userId = "system") => {
  const messageModel = new Message({
    user_is: userId === "system" ? 1 : userId,
    room_id: roomId,
    message: message,
  });
  await messageModel.save();
};

const showLogs = async (roomId, count = 5) => {
  const room = rooms.find((item) => item.id === roomId);
  const messages = await Message.find({ room_id: roomId })
    .limit(count)
    .sort({ _id: -1 });
  return messages.sort((a, b) => a.createdAt - b.createdAt);
};

const settingName = async (name, id) => {
  nicNames[id] = name;
  const user = await User.findOneAndUpdate({ chat_id: id }, { name: name });
};

const getNicName = (id) => {
  return nicNames[id] || "noname";
};

const findUserNicName = (id) => {
  return nicNames[id] || "anonymous";
};

const showNicName = (id) => {
  console.log(nicNames);
};

const settingDescription = async (string, id) => {
  descriptions[id] = string;
  const user = await User.findOneAndUpdate(
    { chat_id: id },
    { description: string }
  );
};

const getDescription = (id) => {
  return descriptions[id] || "Нет описания.";
};

module.exports = {
  getRooms,
  formatRooms,
  addUser,
  findRoomByUserId,
  userExit,
  addLog,
  showLogs,
  settingName,
  showNicName,
  findUserNicName,
  banUser,
  unBanUser,
  checkBan,
  getNicName,
  formatRoomButtoms,
  getInfoButtons,
  formatUsersButtons,
  settingDescription,
  getDescription,
};
