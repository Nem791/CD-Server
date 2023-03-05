const answerHistoryController = require("../controllers/answerHistoryController");
const express = require("express");
const answerHistoryRouter = express.Router();

answerHistoryRouter
  .post("/api/v1/answer-history", answerHistoryController.createAnswerHistory)
  .post(
    "/api/v1/answer-history/get-result",
    answerHistoryController.getAnswerHistory
  );

module.exports = { answerHistoryRouter };
