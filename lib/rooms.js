const banlist = [];

const banUser = (id) => {
    banlist.push(id);
}

const rooms = [
    { id: 1, subject: 'scince', users: [], logs: [] },
    { id: 2, subject: 'history', users: [], logs: [] },
    { id: 3, subject: 'it', users: [], logs: [] },
]

const nicNames = {};

const addUser = (userId, roomId) => {
    rooms
        .find(item => item.id === roomId)
        .users.push(userId);
}

const getRooms = () => {
    return rooms;
}

const formatRooms = (arr) => {
    return arr
        .map(item => `Комната ${item.id}: тема "${item.subject}", колличество участников ${item.users.length}`)
        .join("\n");
}

// const findUserOld = (userId, userRoom) => {
//     rooms.map(mapItem => mapItem.users
//         .find(findeItem => (findeItem === userId) ? userRoom = mapItem.id : userRoom = 0));
//     return userRoom;
// }

const findRoomByUserId = (userId) => {
    let resRoom = null;
    for (let room of rooms) {
        if (room.users.includes(userId)) {
            resRoom = room;
            break;
        }
    }
    return resRoom;
}

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
    const room = rooms.find(item => item.id === roomId);
    if (!room) { return false };
    const index = room.users.indexOf(userId);
    if (index === -1) { return false };
    room.users.splice(index, 1);
    return true;
}

const addLog = (roomId, message, userId = 'system') => {
    const room = rooms.find(item => item.id === roomId);
    if (userId === 'system') {
        room.logs.push({ name: userId, message });
    } else {
        room.logs.push({ name: findUserNicName(userId), message });
    }
}

const showLogs = (roomId, count = 5) => {
    const room = rooms.find(item => item.id === roomId);
    return room.logs.slice(-count);
}

const settingName = (name, id) => {
    nicNames[id] = name;
}

const showNicName = (id) => {
    console.log(nicNames);
}

const findUserNicName = (id) => {
    return nicNames[id] || 'anonymous';
}

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
    banUser
}