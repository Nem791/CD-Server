const express = require("express");
const testController = require("../controllers/testController");

const testRouter = express.Router();

testRouter.route("/").post(testController.createTest);
testRouter.route("/").get(testController.test);

testRouter.route("/:id").get(testController.getTest);

module.exports = { testRouter };
