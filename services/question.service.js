const Test = require("../models/testModel");

exports.QuestionService = {
  createQuestion: async function (data) {
    const { questionMulty, testId, type, questionEssay } = data;

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
    return newQuestionList;
  },
};
