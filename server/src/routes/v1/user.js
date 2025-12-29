const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/auth");
const userController = require("../../controllers/userController");
const upload = require("../../utils/uploadImg");
const {
  updateBioValidator,
  changePasswordValidator,
} = require("../../validators/userValidator");
const validate = require("../../middlewares/validate");

router.put(
  "/me",
  auth,
  updateBioValidator,
  validate,
  upload.single("avatar"),
  userController.updateMe
);
router.get("/me", auth, userController.getMe);

router.put(
  "/change-password",
  auth,
  changePasswordValidator,
  validate,
  userController.changePassword
);
module.exports = router;
