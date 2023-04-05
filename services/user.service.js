const { Types } = require("mongoose");
const Set = require("../models/setModel");
const User = require("../models/userModel");

exports.UserService = {
  getProfileInfo: async function (userId) {
    const data = await User.aggregate()
      .match({
        _id: new Types.ObjectId(userId),
      })
      .lookup({
        from: "leaderboards",
        localField: "_id",
        foreignField: "user",
        as: "tests",
      })
      .unwind({
        path: "$tests",
        preserveNullAndEmptyArrays: true,
      })
      .group({
        _id: "$_id",
        averageScore: {
          $avg: "$tests.recentScore",
        },
        numberOfTests: {
          $sum: 1,
        },
        doc: {
          $first: "$$ROOT",
        },
      })
      .lookup({
        from: "sets",
        localField: "doc._id",
        foreignField: "createdBy",
        as: "studySets",
      });
    return data;
  },
  updateLearningStreak: async (userId) => {
    const user = await User.findById(userId);
    const streaks = user.streaks;
    let maxStreak = user.maxStreak;
    const today = new Date();
    const updateOptions = { new: true, upsert: true };
    let increaseValue = 1;

    if (streaks.length !== 0) {
      const givenDate = new Date(streaks.at(-1));
      const isPreviousDay =
        givenDate.getDate() === today.getDate() - 1 &&
        givenDate.getMonth() === today.getMonth() &&
        givenDate.getFullYear() === today.getFullYear();

      const isToday =
        givenDate.getDate() === today.getDate() &&
        givenDate.getMonth() === today.getMonth() &&
        givenDate.getFullYear() === today.getFullYear();

      if (isPreviousDay) {
        maxStreak = maxStreak === streaks.length ? maxStreak + 1 : maxStreak;
        const date = today.toLocaleDateString();
        console.log("date: ", date);
        const user = await User.findByIdAndUpdate(
          userId,
          { $set: { maxStreak }, $addToSet: { streaks: date } },
          updateOptions
        );
        return user;
      } else if (isToday) {
        return user;
      } else {
        increaseValue = 0;
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $inc: { maxStreak: increaseValue },
        $set: { streaks: [today.toLocaleDateString()] },
      },
      updateOptions
    );
    return updatedUser;
  },
};
