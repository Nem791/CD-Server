const severStore = require("../../severStore");
const updateVideo = require("../updates/updateVideo");

const roomCreateHandler = (socket) => {
  const socketId = socket.id;

  const userId = socket.handshake.auth.user._id;

  const roomDetails = severStore.addNewActiveRoom(userId, socketId);

  // 1. Gửi thông tin room tới ng tạo phòng

  socket.emit("room-create", {
    roomDetails,
  });

  // 2. Gửi thông tin room tới những ng khác
  updateVideo.updateRooms();
};

module.exports = roomCreateHandler;
