const express = require("express");
const router = express.Router();

const authRoutes = require("./v1/auth");
const postRoutes = require("./v1/post");
const userRoutes = require("./v1/user");

// v1 - auth
router.use("/v1/auth", authRoutes);

// v1 - posts
router.use("/v1/posts", postRoutes);

//v1 - user
router.use("/v1/user", userRoutes);

module.exports = router;
