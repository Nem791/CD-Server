const { TransactionService } = require("../services/transaction.service");
const { WebhookService } = require("../services/webhook.service");
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

exports.handlePostTransaction = catchAsync(async (req, res) => {
  const updateUser = await TransactionService.handlePostTransaction(req.body);

  res.json({
    status: "succes",
    data: {
      updateUser,
    },
  });
});
