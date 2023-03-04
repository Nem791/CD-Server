const Conversation = require("../models/conversationsModel");
const chatUpdate = require("./updates/updateChat");

const directChatHistoryHandler = async (socket, data) => {
  try {
    const { _id: userId } = socket.handshake.auth.user;
    const { roomId } = data;

    const conversation = await Conversation.findOne({
      _id: roomId,
    });

    if (conversation) {
      chatUpdate.updateChatHistory(conversation._id.toString(), socket.id);
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = directChatHistoryHandler;
