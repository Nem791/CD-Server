const Message = require("../models/messageModel");
const Conversation = require("../models/conversationsModel");
const chatUpdates = require("./updates/updateChat");
const severStore = require("../severStore");
const { Types } = require("mongoose");

const directMessageHandler = async (socket, data) => {
  try {
    const io = severStore.getSocketServerInstance();
    const { _id: userId } = socket.handshake.auth.user;

    let { roomChatId, content, participants } = data;

    participants = [participants[0]?._id, participants[1]?._id];
    console.log("participants: ", participants);

    for (let participant of participants) {
      participant = new Types.ObjectId(String(participant));
    }

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

    chatUpdates.updateChatHistory(participants);
    if (conversation.score[userId] >= 40) {
      for (let participant of participants) {
        const activeConnections = severStore.getActiveConnections(
          String(participant)
        );
        console.log("game-over");
        io.to(activeConnections[0]).emit("game-over", {
          winner: String(userId),
        });
      }
    } else {
      const player =
        String(userId) !== String(participants[0])
          ? String(participants[0])
          : String(participants[1]);

      for (const participant of participants) {
        const activeConnections = severStore.getActiveConnections(
          String(participant)
        );
        io.to(activeConnections[0]).emit("switch-turn", {
          player,
        });
      }
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = directMessageHandler;
