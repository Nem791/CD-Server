const Conversation = require("../models/conversationsModel");
const chatUpdate = require("./updates/updateChat");

const directChatHistoryHandler = async (socket, data) => {
  try {
    const { _id: userId } = socket.handshake.auth.user;
    const { roomId, participants } = data;

    const conversation = await Conversation.findOne({
      _id: roomId,
    });

    if (conversation) {
      chatUpdate.updateChatHistory(
        conversation._id.toString(),
        participants,
        socket.id
      );
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = directChatHistoryHandler;
