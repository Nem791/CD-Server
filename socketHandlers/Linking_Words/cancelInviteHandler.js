const { Types } = require("mongoose");
const conversationsModel = require("../../models/conversationsModel");
const FriendInvitation = require("../../models/friendInvitationModel");
const severStore = require("../../severStore");

const cancelInviteHandler = async (socket, data) => {
  const io = severStore.getSocketServerInstance();
  try {
    const { inviteId } = data;

    const invitation = await FriendInvitation.findByIdAndDelete(
      String(inviteId)
    );

    // return io.to(toSpecifiedSocketId).emit("direct-chat-history", {
    //   messages: conversation.messages,
    //   participants: conversation.participants,
    // });
  } catch (err) {
    console.log(err);
  }
};

module.exports = cancelInviteHandler;
