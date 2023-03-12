const express = require("express");
const transactionController = require("../controllers/transactionController");

const transactionRouter = express.Router();

transactionRouter.route("/").post(transactionController.createTransaction);

// req.body
// {
//     "data": [
//         {
//             "price_data": {
//                 "currency": "usd",
//                 "product_data": {
//                     "name": "NNN",
//                     "images": [
//                         "https://img.freepik.com/free-vector/stylish-business-pricing-table-template_1017-32006.jpg?w=2000"
//                     ]
//                 },
//                 "unit_amount": 22
//             },
//             "quantity": 2
//         }
//     ]
// }

module.exports = { transactionRouter };
