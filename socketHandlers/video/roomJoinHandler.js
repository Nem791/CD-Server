const severStore = require("../../severStore");
const updateVideo = require("../updates/updateVideo");

const roomJoinHandler = (socket, data) => {
  const { roomId } = data;

  const participantDetails = {
    userId: socket.handshake.auth.user._id,
    socketId: socket.id,
  };

  const roomDetails = severStore.getActiveRoom(roomId);
  severStore.joinActiveRoom(roomId, participantDetails);

  // 1. Thông báo cho các ng dùng khác prepare for a connection
  roomDetails.participants.forEach((participant) => {
    if (participant.socketId !== participantDetails.socketId) {
      socket.to(participant.socketId).emit("conn-prepare", {
        connUserSocketId: participantDetails.socketId,
      });
    }
  });
  updateVideo.updateRooms();
};

module.exports = roomJoinHandler;
