const Schedule = require("../../models/scheduleModel");

const createScheduleHandler = async (socket, data) => {
  try {
    const userId = socket.handshake.auth.user._id;

    const schedule = await Schedule.create(data);

    const scheduleOfUser = await Schedule.find({
      createdBy: schedule.createdBy,
    });

    socket.to(userId).emit("sendScheduleToClient", scheduleOfUser);
  } catch (err) {
    console.log(err);
  }
};

module.exports = createScheduleHandler;
