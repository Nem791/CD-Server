const Schedule = require("../../models/scheduleModel");

const deleteScheduleHandler = async (socket, data) => {
  try {
    const userId = socket.handshake.auth.user._id;
    const schedule = await Schedule.findByIdAndDelete(data);

    const scheduleOfUser = await Schedule.find({
      createdBy: schedule.createdBy,
    });

    socket.to(userId).emit("sendScheduleToClient", scheduleOfUser);
  } catch (err) {
    console.log(err);
  }
};

module.exports = deleteScheduleHandler;
