const UserTestHistory = require("../models/userTestHistoryModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.createAnswerHistory = catchAsync(async (req, res) => {
  const newTestHistory = await UserTestHistory.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      testHistory: newTestHistory,
    },
  });
});

exports.getAnswerHistory = catchAsync(async (req, res, next) => {
  const { testId } = req.body;
  const testHistory = await UserTestHistory.findOne({ testId });

  if (!testHistory) {
    return next(new AppError("No history found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      testHistory,
    },
  });
});
