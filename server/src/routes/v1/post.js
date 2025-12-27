const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/auth");
const postController = require("../../controllers/postController");
const validate = require("../../middlewares/validate");
const { createPostValidator } = require("../../validators/postValidator");
router.get("/", auth, postController.getPosts);
router.post(
  "/",
  auth,
  createPostValidator,
  validate,
  postController.createPost
);
module.exports = router;
