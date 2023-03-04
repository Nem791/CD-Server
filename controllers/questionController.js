const catchAsync = require("../utils/catchAsync");

const Question = require("../models/questionModel");
const Test = require("../models/testModel");

exports.createQuestion = catchAsync(async (req, res) => {
  const { questionMulty, testId, type, questionEssay } = req.body;

  let newQuestionList;
  if (type === "essay") {
    newQuestionList = await Question.insertMany(questionEssay);
  }

  if (type === "multiple-choice") {
    newQuestionList = await Question.insertMany(questionMulty);
  }

  const test = await Test.findById(testId);
  test.questions = newQuestionList.map((q) => {
    return q._id;
  });
  console.log(test);
  await test.save();
  res.status(201).json({
    status: "success",
    data: {
      questions: newQuestionList,
    },
  });
});
