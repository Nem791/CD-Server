const Set = require("../models/setModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.createSet = catchAsync(async (req, res) => {
  const newSets = await Set.create(req.body);

  res.status(201).json({
    status: "succes",
    data: {
      sets: newSets,
    },
  });
});

exports.getSetById = catchAsync(async (req, res, next) => {
  const sets = await Set.findById(req.params.setId);
  console.log(sets);

  if (!sets) {
    return next(new AppError("No document found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      sets,
    },
  });
});

exports.updateSet = catchAsync(async (req, res, next) => {
  const set = await Set.findByIdAndUpdate(req.params.setId, req.body, {
    new: true,
    // (trả về document mới nhất)
    runValidators: true,
    // (có chạy trình validate)
  });

  if (!set) {
    return next(new AppError("No document found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: set,
  });
});

exports.deleteSet = catchAsync(async (req, res, next) => {
  const set = await Set.findByIdAndDelele(req.params.setId);
  if (!set) {
    return next(new AppError("No document found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});
