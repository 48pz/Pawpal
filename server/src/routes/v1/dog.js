const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/auth");
const uploadImg = require("../../utils/uploadImg");
const dogController = require("../../controllers/dogController");

router.get("/", auth, dogController.getMyDogs);
router.post("/", auth, uploadImg.single("avatar"), dogController.createDog);
router.put("/:id", auth, uploadImg.single("avatar"), dogController.updateDog);
router.delete("/:id", auth, dogController.deleteDog);
module.exports = router;
