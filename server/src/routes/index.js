const express = require("express");
const router = express.Router();

const authRoutes = require("./v1/auth");
const postRoutes = require("./v1/post");
const userRoutes = require("./v1/user");
const dogRoutes = require("./v1/dog");
const notificationRoutes = require("./v1/notification");
const commentRoutes = require("./v1/comment");
const walkRoutes = require("./v1/walk");
const pawpediaRoutes = require("./v1/pawpedia");

// v1 - auth
router.use("/v1/auth", authRoutes);

// v1 - posts
router.use("/v1/posts", postRoutes);

//v1 - user
router.use("/v1/user", userRoutes);

router.use("/v1/dog", dogRoutes);

router.use("/v1/notification", notificationRoutes);

router.use("/v1/comments", commentRoutes);
router.use("/v1/walks", walkRoutes);
router.use("/v1/pawpedia", pawpediaRoutes);

module.exports = router;
