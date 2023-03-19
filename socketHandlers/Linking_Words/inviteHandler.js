const { Types } = require("mongoose");
const conversationsModel = require("../../models/conversationsModel");
const FriendInvitation = require("../../models/friendInvitationModel");
const severStore = require("../../severStore");

const inviteLinkingWordsHandler = async (socket, data) => {
  const io = severStore.getSocketServerInstance();
  try {
    const { _id: userId } = socket.handshake.auth.user;
    const { roomId, inviteId } = data;
    const invitedUsers = [];

    const conversation = await conversationsModel.findOne({
      _id: roomId,
    });

    for (const user of conversation.participants) {
      if (String(user) !== userId) {
        invitedUsers.push(user);
      }
    }

    console.log("socket.id: ", inviteId);

    if (invitedUsers && invitedUsers[0]) {
      const invitation = await FriendInvitation.create({
        _id: inviteId,
        senderId: userId,
        receiverId: invitedUsers[0],
      });

      const activeConnections = severStore.getActiveConnections(
        String(invitedUsers[0])
      );

      const inviteStatus = {};

      if (activeConnections.length === 0) {
        inviteStatus.online = false;
      } else {
        inviteStatus.online = true;

        activeConnections.forEach((socketId) => {
          io.to(socketId).emit("receive-invite", invitation);
        });
      }
    }

    // return io.to(toSpecifiedSocketId).emit("direct-chat-history", {
    //   messages: conversation.messages,
    //   participants: conversation.participants,
    // });
  } catch (err) {
    console.log(err);
  }
};

module.exports = inviteLinkingWordsHandler;
