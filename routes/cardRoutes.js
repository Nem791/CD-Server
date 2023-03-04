const express = require("express");
const cardController = require("./../controllers/cardController");

const router = express.Router({ mergeParams: true });

router.route("/getAllCard").get(cardController.getAllCardInASet);

router
  .route("/")
  .get(cardController.getAllCards)
  .post(cardController.createCard);

router
  .route("/:id")
  .get(cardController.getCard)
  .patch(cardController.updateCard)
  .delete(cardController.deleteCard);

module.exports = router;
