const express = require("express");
const scheduleController = require("../controllers/scheduleController");

const router = express.Router();

router.route("/").post(scheduleController.createSchedule);

router
  .route("/getScheduleOfUser/:userId")
  .get(scheduleController.getAllSchedule);

router
  .route("/:id")
  .get(scheduleController.getSchedule)
  .patch(scheduleController.updateSchedule)
  .delete(scheduleController.deleteSchedule);

module.exports = router;
