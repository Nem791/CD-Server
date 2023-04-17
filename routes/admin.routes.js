const express = require("express");
const userController = require("../controllers/userController");

const adminRouter = express.Router();

adminRouter.route("/users").get(userController.getAllUsers);
adminRouter
  .route("/users/promote-user/:userId")
  .patch(userController.promoteUser);
adminRouter
  .route("/users/upgrade-user/:userId")
  .patch(userController.upgradeUser);

module.exports = { adminRouter };
