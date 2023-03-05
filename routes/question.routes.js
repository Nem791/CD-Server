const express = require("express");
const questionController = require("../controllers/questionController");

const questionRoutes = express.Router();

questionRoutes.route("/").post(questionController.createQuestion);

module.exports = { questionRoutes };
