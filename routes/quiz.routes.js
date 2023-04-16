const express = require("express");
const quizController = require("../controllers/quizController");

const quizRouter = express.Router();

quizRouter
  .route("/")
  .get(quizController.getAllQuizzes)
  .post(quizController.createQuiz);

quizRouter.route("/create-quiz/:setId").post(quizController.createQuizBySetId);

quizRouter.route("/:id").get(quizController.getQuizById);

quizRouter.route("/recommend/:id").get(quizController.recommendQuizzes);

module.exports = { quizRouter };
