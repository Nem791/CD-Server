const express = require("express");
const useController = require("./../controllers/userController");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.post("/signUpWithGoogle", authController.signUpWithGoogle);
// Route ktra xem ng dùng đã đăng nhập chưa
// (dành cho Front end)

router.get("/isLogin", authController.onAuthStateChanged);

router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

router.use(authController.protect);

router.get("/getAllSetOfUser/:userId", useController.getAllSetOfUser);

router.patch("/updateMyPassword", authController.updatePassword);

router.get("/me", useController.getMe, useController.getUser);
router.patch("/updateMe", useController.updateMe);
router.delete("/deleteMe", useController.deleteMe);

router.use(authController.restrictTo("admin"));

router.route("/").get(useController.getAllUsers).post(useController.createUser);

router
  .route("/:id")
  .get(useController.getUser)
  .patch(useController.updateUser)
  .delete(useController.deleteUser);

module.exports = router;
