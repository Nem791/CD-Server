const mongoose = require("mongoose");

const reviewTestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A set must have a name."],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  createdAt: { type: Date, default: Date.now() },
  questions: [{ type: mongoose.Types.ObjectId }],
});

const ReviewTestModel = mongoose.model("ReviewTest", reviewTestSchema);
module.exports = ReviewTestModel;
