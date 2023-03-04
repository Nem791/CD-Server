const serverStore = require("../severStore");
const leaveRoomHandler = require("./video/leaveRoomHandler");

const disconnectHandler = (socket) => {
  // 1. Xóa phòng khi ng dùng tắt trình duyệt
  const activeRooms = serverStore.getActiveRooms();
  activeRooms.forEach((activeRoom) => {
    const userInRoom = activeRoom.participants.some(
      (participant) => participant.socketId === socket.id
    );

    if (userInRoom) {
      leaveRoomHandler(socket, { roomId: activeRoom.roomId });
    }
  });
  serverStore.removeConnectedUser(socket.id);
};
module.exports = disconnectHandler;
