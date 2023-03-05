const express = require("express");
const scheduleController = require("../controllers/scheduleController");

const scheduleRouter = express.Router();

scheduleRouter.route("/").post(scheduleController.createSchedule);

scheduleRouter
  .route("/getScheduleOfUser/:userId")
  .get(scheduleController.getAllSchedule);

scheduleRouter
  .route("/:id")
  .get(scheduleController.getSchedule)
  .patch(scheduleController.updateSchedule)
  .delete(scheduleController.deleteSchedule);

module.exports = { scheduleRouter };
