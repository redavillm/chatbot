const messages = [];

const addMessage = (chatId, text, sender) => {
    messages.push({
        chatId,
        text,
        sender
    })
}

const getMessages = (chatId) => {    
    return messages.filter(message => +chatId === message.chatId);
}

const getChats = () => {
    const chats = {};
    for(let message of messages){
        chats[message.chatId]=true;
    }
    return Object.keys(chats);
}

module.exports = {
    addMessage,
    getMessages,
    getChats
}