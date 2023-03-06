const express = require("express");
const { answerHistoryRouter } = require("./answerHistory.routes");
const { cardRouter } = require("./card.routes");
const { friendRouter } = require("./friendInvitation.routes");
const { questionRoutes } = require("./question.routes");
const { reviewRouter } = require("./review.routes");
const { scheduleRouter } = require("./schedule.routes");
const { setRouter } = require("./set.routes");
const { testRouter } = require("./test.routes");
const { userRouter } = require("./user.routes");

const indexRoutes = express.Router();

indexRoutes.use("/cards", cardRouter);
indexRoutes.use("/users", userRouter);
indexRoutes.use("/reviews", reviewRouter);
indexRoutes.use("/sets", setRouter);
indexRoutes.use("/questions", questionRoutes);
indexRoutes.use("/test", testRouter);

indexRoutes.use("/friend-invitation", friendRouter);

indexRoutes.use("/schedule", scheduleRouter);

indexRoutes.use("/answer-history", answerHistoryRouter);

module.exports = indexRoutes;
