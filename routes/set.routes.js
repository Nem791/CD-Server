const express = require("express");

const setController = require("../controllers/setController");
const { cardRouter } = require("./card.routes");

const setRouter = express.Router({ mergeParams: true });

setRouter.route("/").post(setController.createSet);

setRouter
  .route("/:setId")
  .get(setController.getSetById)
  .patch(setController.updateSet)
  .delete(setController.deleteSet);

setRouter.use(
  "/:setId",
  (req, res, next) => {
    req.setId = req.params.setId;
    next();
  },
  cardRouter
);

module.exports = { setRouter };
