const express = require("express");
const authRoutes = require("./v1/auth");

const router = express.Router();

router.use("/v1/auth", authRoutes);

module.exports = router;
