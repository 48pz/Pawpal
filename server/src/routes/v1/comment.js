const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/auth");
const commentController = require("../../controllers/commentController");

router.post("/", auth, commentController.createComment);

router.get("/", commentController.getCommentsByPost);

module.exports = router;
