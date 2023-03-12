const express = require("express");
const webhookController = require("../controllers/webhookController");

const webhookRouter = express.Router();

webhookRouter.route("/review-test").post(webhookController.emitReviewTestId);

module.exports = { webhookRouter };
