const Set = require("../models/setModel");
const { SetService } = require("../services/set.service");
const { WebhookService } = require("../services/webhook.service");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.emitReviewTestId = catchAsync(async (req, res) => {
  const reviewTest = await WebhookService.emitReviewTestId(
    req.body.reviewTestId
  );

  res.json({
    status: "succes",
    data: {
      reviewTest,
    },
  });
});
