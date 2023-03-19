const { Types } = require("mongoose");
const conversationsModel = require("../../models/conversationsModel");
const FriendInvitation = require("../../models/friendInvitationModel");
const User = require("../../models/userModel");
const severStore = require("../../severStore");

const responseInviteHandler = async (socket, data) => {
  const io = severStore.getSocketServerInstance();

  // data = {
  //   accept: true,
  //   _id: inviteId,
  //   senderId: userId,
  //   receiverId: invitedUsers[0],
  // }

  try {
    const { accept, _id: invitationId, senderId, receiverId } = data;
    const invitation = await FriendInvitation.findById(String(invitationId));

    if (invitation) {
      if (accept) {
        console.log("accept");
        const newConversation = await conversationsModel.create({
          participants: [
            new Types.ObjectId(senderId),
            new Types.ObjectId(receiverId),
          ],
        });

        const activeConnections = severStore.getOnlineUsers();

        const room = [];

        activeConnections.forEach((element) => {
          const index = room.findIndex(
            (item) => item.userId === element.userId
          );
          if (index === -1) {
            room.push(element);
          }
        });

        for (const user of room) {
          io.to(user.socketId).emit("initiate-game", {});
        }
      } else {
        const senderSocketIds = severStore.getActiveConnections(
          String(senderId)
        )[0];
        const receiver = await User.findById(String(receiverId));

        // for (const senderSocketId of senderSocketIds) {
        io.to(senderSocketIds).emit("notify-reject-invite", {
          receiverName: receiver.name,
        });
        // }
      }

      return;
    }

    console.log("else invitation");
    const sender = await User.findById(String(senderId));
    io.to(socket.id).emit("invitation-expired", {
      senderName: sender.name,
    });

    // return io.to(toSpecifiedSocketId).emit("direct-chat-history", {
    //   messages: conversation.messages,
    //   participants: conversation.participants,
    // });
  } catch (err) {
    console.log(err);
  }
};

module.exports = responseInviteHandler;
