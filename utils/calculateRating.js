const Question = require("../models/questionModel");

async function calculateRating(question) {
  const originalQuestion = await Question.findById(String(question.question));
  let rating = 5;
  if (originalQuestion.answer !== question.answer) {
    rating = rating - 3;
  }
  console.log("question.time: ", question.time);
  if (question.time > 2) {
    rating--;
  }
  if (question.time > 4) {
    rating--;
  }

  if (rating < 0) {
    rating = 0;
  }

  return rating;
}

module.exports = calculateRating;
