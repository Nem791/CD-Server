const Message = require("../models/messageModel");
const Conversation = require("../models/conversationsModel");
const chatUpdates = require("./updates/updateChat");

const directMessageHandler = async (socket, data) => {
  try {
    const { _id: userId } = socket.handshake.auth.user;

    const { roomChatId, content, participants } = data;

    // 1. Tạo message mới
    const message = await Message.create({
      content: content,
      author: userId,
      data: new Date(),
      type: "DIRECT",
    });

    // 2. Kiểm tra xem đã tồn tại conversations nào giữa hai ng dùng chưa
    // (nếu không tạo conversations mới)
    const conversation = await Conversation.findOneAndUpdate(
      {
        // participants: { $all: [userId, receiverUserId] },
        _id: roomChatId,
      },
      {
        $set: {
          participants,
        },
        $push: {
          messages: message._id,
        },
        $inc: {
          [`score.${userId}`]: content.length,
        },
      },
      { new: true, upsert: true }
    );

    for (const userScore in conversation.score) {
      if (conversation.score.hasOwnProperty(userScore)) {
        console.log(`${userScore}: ${population[key]}`);
      }
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = directMessageHandler;
