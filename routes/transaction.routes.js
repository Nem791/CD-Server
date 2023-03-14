const express = require("express");
const transactionController = require("../controllers/transactionController");

const transactionRouter = express.Router();

transactionRouter.route("/").post(transactionController.createTransaction);

// req.body
// {
//     "unit_amount": 500,
//     "name": "GGG"
// }
module.exports = { transactionRouter };
