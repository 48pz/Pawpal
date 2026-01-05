const express = require("express");
const router = express.Router();

const walkController = require("../../controllers/walkController");
const auth = require("../../middlewares/auth");

router.post("/", auth, walkController.createWalk);
router.get("/", auth, walkController.getWalks);
module.exports = router;
