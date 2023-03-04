const express = require("express");
const answerHistoryController = require("../controllers/answerHistoryController");

const router = express.Router();

router.post("/", answerHistoryController.createAnswerHistory);
router.post("/get-result", answerHistoryController.getAnswerHistory);

module.exports = router;
