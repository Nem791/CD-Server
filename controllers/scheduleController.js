const catchAsync = require("../utils/catchAsync");
const Schedule = require("../models/scheduleModel");
const AppError = require("../utils/appError");

exports.createSchedule = catchAsync(async (req, res) => {
  const newSchedule = await Schedule.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      schedule: newSchedule,
    },
  });
});

exports.getAllSchedule = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const schedules = await Schedule.find({ createdBy: userId });

  res.status(200).json({
    status: "success",
    results: schedules.length,
    data: {
      schedules,
    },
  });
});

exports.getSchedule = catchAsync(async (req, res, next) => {
  const schedule = await Schedule.findById(req.params.id);

  if (!schedule) {
    return next(new AppError("No document found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      schedule,
    },
  });
});

exports.updateSchedule = catchAsync(async (req, res, next) => {
  const schedule = await Schedule.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    // (để nó sẽ trả về document mới nhất)
    runValidators: true,
    // (có chạy trình validate)
  });

  if (!schedule) {
    return next(new AppError("No schedule found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      schedule,
    },
  });
});

exports.deleteSchedule = catchAsync(async (req, res, next) => {
  const schedule = await Schedule.findByIdAndDelete(req.params.id);
  if (!schedule) {
    return next(new AppError("No booking found with that ID", 404));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});
