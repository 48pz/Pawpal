const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/auth");
const postController = require("../../controllers/postController");
const validate = require("../../middlewares/validate");
const { createPostValidator } = require("../../validators/postValidator");
const uploadImg = require("../../utils/uploadImg");
router.get("/", auth, postController.getPosts);
router.post(
  "/",
  auth,
  uploadImg.array("media", 6),
  createPostValidator,
  validate,
  postController.createPost
);

router.post("/:id/like", auth, postController.likePost);
router.delete("/:id/like", auth, postController.unlikePost);

module.exports = router;
