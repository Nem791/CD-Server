const Conversation = require("../models/conversationsModel");
const chatUpdate = require("./updates/updateChat");

const directChatHistoryHandler = async (socket, data) => {
  try {
    const { _id: userId } = socket.handshake.auth.user;
    const { participants } = data;
    chatUpdate.updateChatHistory(participants, socket.id);
  } catch (err) {
    console.log(err);
  }
};

module.exports = directChatHistoryHandler;
