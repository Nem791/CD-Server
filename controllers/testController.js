const Test = require("../models/testModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.createTest = catchAsync(async (req, res) => {
  const newTests = await Test.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      tests: newTests,
    },
  });
});

exports.getTest = catchAsync(async (req, res, next) => {
  const test = await Test.findById(req.params.id);

  if (!test) {
    return next(new AppError("No test found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      test,
    },
  });
});
