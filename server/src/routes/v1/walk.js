const express = require("express");
const router = express.Router();

const walkController = require("../../controllers/walkController");
const auth = require("../../middlewares/auth");

router.post("/", auth, walkController.createWalk);
router.get("/", auth, walkController.getWalks);
router.post("/:id/join", auth, walkController.joinWalk);
router.post("/:id/leave", auth, walkController.leaveWalk);
router.get("/:id", auth, walkController.getWalkById);

module.exports = router;
