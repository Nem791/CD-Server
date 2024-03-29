const express = require("express");

const setController = require("../controllers/setController");
const useController = require("../controllers/userController");
const { cardRouter } = require("./card.routes");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const setRouter = express.Router({ mergeParams: true });

setRouter.route("/").post(setController.createSet);

setRouter.route("/approve/:setId").patch(setController.approveSet);

setRouter.route("/get-all-sets").get(setController.getAllSets);
setRouter.route("/get-all-approved-sets").get(setController.getAllApprovedSets);
setRouter.route("/get-all-sets/:userId").get(setController.getSets);

setRouter.route("/profile/info/:userId").get(useController.getProfileData);

setRouter
  .route("/:setId")
  .get(setController.getSetById)
  .patch(upload.single("filename"), setController.updateSet)
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
