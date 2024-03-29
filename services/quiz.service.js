const { Types } = require("mongoose");
const Question = require("../models/questionModel");
const QuizModel = require("../models/quizModel");
const Test = require("../models/testModel");
const { getBagOfWords, cosineSimilarity } = require("../utils/recommend");
const { CardService } = require("./card.service");
const { QuestionService } = require("./question.service");
const { SetService } = require("./set.service");

exports.QuizService = {
  createQuiz: async function (data) {
    const quiz = await QuizModel.create(data);
    return quiz;
  },

  createQuizBySetId: async function (setId) {
    try {
      setId = new Types.ObjectId(setId);

      const quizExist = await QuizModel.findOne({ setId });
      console.log("quizExist: ", quizExist);
      if (quizExist) {
        return quizExist;
      }
      const cards = await CardService.getAllCards({ setId });
      const optionList = cards.map((card) => {
        return card.meaningUsers;
      });

      const quizId = new Types.ObjectId();
      const questions = cards.map((card) => {
        const optionsSet = new Set([card.meaningUsers]);
        for (let index = 0; index < optionList.length; index++) {
          const element = optionList[index];
          optionsSet.add(element);
        }
        while (optionsSet.size > 4) {
          optionsSet.delete(mySet.values().next().value); // Remove the first value in the set
        }
        const options = Array.from(optionsSet);

        return {
          quiz: quizId,
          answer: card.meaningUsers,
          question: `What is the meaning of ${card.word}?`,
          options,
          type: "multiple-choice",
        };
      });

      const quizQuestions = await QuestionService.createQuizQuestion(questions);

      const set = await SetService.getSetById(String(setId));
      const quiz = await this.createQuiz({
        _id: quizId,
        title: set.name,
        tags: ["Study Set"],
        description: set.description,
        user: set.createdBy,
        img: set.image,
        setId: set._id,
      });
      return quiz;
    } catch (error) {
      console.log(error);
    }
  },

  getAllQuizzes: async function () {
    const quizzes = await QuizModel.aggregate()
      .lookup({
        from: "sets",
        localField: "setId",
        foreignField: "_id",
        as: "setId",
      })
      .match({
        $or: [
          { "setId.approved": true },
          {
            setId: {
              $size: 0,
            },
          },
        ],
      });
    return quizzes;
  },

  getQuizById: async function (id) {
    const quiz = await Question.aggregate()
      .match({
        quiz: new Types.ObjectId(id),
      })
      .lookup({
        from: "quizzes",
        localField: "quiz",
        foreignField: "_id",
        as: "quiz",
      })
      .limit(7);
    return quiz;
  },

  recommendQuizzes: async function (quizId) {
    // Get the bag-of-words vectors for the user's quizzes
    const currentQuizId = new Types.ObjectId(quizId);

    const QuizData = await QuizModel.find({ _id: { $ne: currentQuizId } });

    const userQuizzes = QuizData.filter(
      (item) => item._id !== currentQuizId
    ).map((item) =>
      getBagOfWords(item.title + " " + item.description + " " + item.tags[0])
    );

    // Get the bag-of-words vector for the current quiz
    const currentQuiz = await QuizModel.findById(String(currentQuizId));
    const currentVector = getBagOfWords(
      currentQuiz.title +
        " " +
        currentQuiz.description +
        " " +
        currentQuiz.tags[0]
    );

    // Calculate the similarity between the current quiz and the user's quizzes
    const similarities = {};
    for (let i = 0; i < userQuizzes.length; i++) {
      const similarity = cosineSimilarity(currentVector, userQuizzes[i]);
      similarities[i] = similarity;
    }

    // Sort the user quizzes by similarity score
    const similarQuizzes = Object.keys(similarities).sort(
      (a, b) => similarities[b] - similarities[a]
    );

    // Get the quizzes that the similar quizzes are based on
    const recommendedQuizzes = [];
    for (const quizIndex of similarQuizzes) {
      const quiz = QuizData[quizIndex];
      // if (
      //   quiz._id !== currentQuizId &&
      //   !recommendedQuizzes.includes(quiz._id)
      // ) {
      recommendedQuizzes.push(quiz);
      // }
      if (recommendedQuizzes.length >= 5) {
        break;
      }
    }

    return recommendedQuizzes;
  },
};
