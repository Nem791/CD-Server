const express = require("express");
const testController = require("../controllers/testController");

const router = express.Router();

router.route("/").post(testController.createTest);

router.route("/:id").get(testController.getTest);

module.exports = router;
