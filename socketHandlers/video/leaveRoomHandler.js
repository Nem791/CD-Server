const severStore = require("../../severStore");
const updateVideo = require("../updates/updateVideo");

const leaveRoomHandler = (socket, data) => {
  const { roomId } = data;

  const activeRoom = severStore.getActiveRoom(roomId);

  if (activeRoom) {
    severStore.leaveActiveRoom(roomId, socket.id);

    // Khi ng dùng rời khỏi phòng ta muốn ktra xem phòng còn tồn tại k
    // vì nếu a ta là ng cuối cùng rời khỏi phòng thì phòng ko còn
    // ta ko phải tbao cho ng dùng khác

    const updatedActiveRoom = severStore.getActiveRoom(roomId);

    if (updatedActiveRoom) {
      updatedActiveRoom.participants?.forEach((participant) => {
        socket.to(participant.socketId).emit("room-participant-left", {
          connUserSocketId: socket.id,
        });
      });
    }
    updateVideo.updateRooms();
  }
};

module.exports = leaveRoomHandler;
