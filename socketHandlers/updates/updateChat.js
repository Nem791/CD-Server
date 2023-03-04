const Conversation = require("../../models/conversationsModel");
const severStore = require("../../severStore");

// Lưu lại lịch sử các tin nhắn cũ
const updateChatHistory = async (
  conversationId,
  toSpecifiedSocketId = null
  // => Để chỉ gửi lịch sử tin nhắn tới ng dùng dùng cụ thể
) => {
  const conversation = await Conversation.findById(conversationId).populate({
    path: "messages",
    model: "Message",
    populate: {
      path: "author",
      model: "User",
      select: "name _id avatarUrl",
    },
  });

  // console.log("conversation", conversation);

  if (conversation) {
    const io = severStore.getSocketServerInstance();

    // 1. Gửi lịch sử tin nhắn đến 1 ng dùng đc chỉ định
    // (trg trường hợp 1 ng dùng bất kỳ yêu cầu xem lịch sử trò chuyện)
    if (toSpecifiedSocketId) {
      // (phát sự kiện xem lại lịch sử tin nhắn)
      return io.to(toSpecifiedSocketId).emit("direct-chat-history", {
        messages: conversation.messages,
        participants: conversation.participants,
      });
    }

    // Kiểm tra xem ng dùng của conversations có đg online k
    // (Nếu có gửi họ lịch sử tin nhắn)

    conversation.participants.forEach((userId) => {
      const activeConnections = severStore.getActiveConnections(
        userId.toString()
      );

      activeConnections.forEach((socketId) => {
        io.to(socketId).emit("direct-chat-history", {
          messages: conversation.messages,
          participants: conversation.participants,
        });
      });
    });
  }
};

module.exports = { updateChatHistory };
