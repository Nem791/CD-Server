const severStore = require("../../severStore");

const updateRooms = (toSpecifiedSocketId = null) => {
  const io = severStore.getSocketServerInstance();
  // 1. Lấy list các phòng video call đang hoạt động
  const activeRooms = severStore.getActiveRooms();

  if (toSpecifiedSocketId) {
    io.to(toSpecifiedSocketId).emit("active-rooms", {
      activeRooms,
    });
  } else {
    io.emit("active-rooms", {
      activeRooms,
    });
  }
  // Nếu chỉ định toSpecifiedSocketId sẽ chỉ gửi danh sách phòng
  // cho ng đc chỉ định còn ko sẽ gửi danh sách tới tất cả mọi ng
};

module.exports = {
  updateRooms,
};
