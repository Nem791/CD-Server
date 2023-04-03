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
};