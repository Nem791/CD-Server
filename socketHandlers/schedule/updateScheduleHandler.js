const Schedule = require("../../models/scheduleModel");

const updateScheduleHandler = async (socket, data) => {
  const { calendarEvent, selectedEventId } = data;

  try {
    const userId = socket.handshake.auth.user._id;
    const schedule = await Schedule.findByIdAndUpdate(
      selectedEventId,
      calendarEvent
    );

    const scheduleOfUser = await Schedule.find({
      createdBy: schedule.createdBy,
    });

    socket.to(userId).emit("sendScheduleToClient", scheduleOfUser);
  } catch (err) {}
};

module.exports = updateScheduleHandler;
