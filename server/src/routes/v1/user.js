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
router.get("/me", auth, userController.getMe);
router.put(
  "/me",
  auth,
  updateBioValidator,
  validate,
  upload.single("avatar"),
  userController.updateMe
);

router.put(
  "/change-password",
  auth,
  changePasswordValidator,
  validate,
  userController.changePassword
);
router.get("/:id/hover", auth, userController.getUserHover);
router.post("/:id/follow", auth, userController.followUser);
router.post("/:id/unfollow", auth, userController.unfollowUser);

router.get("/:id/followers", auth, userController.getFollowers);
router.get("/:id/followings", auth, userController.getFollowings);

module.exports = router;
