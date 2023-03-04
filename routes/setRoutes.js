const express = require("express");

const setController = require("../controllers/setController");
const cardRoutes = require("./cardRoutes");

const router = express.Router({ mergeParams: true });

router.route("/").post(setController.createSet);

router
  .route("/:setId")
  .get(setController.getSetById)
  .patch(setController.updateSet)
  .delete(setController.deleteSet);

router.use(
  "/:setId",
  (req, res, next) => {
    req.setId = req.params.setId;
    next();
  },
  cardRoutes
);

module.exports = router;
