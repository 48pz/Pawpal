const logger = require("../utils/logger");
const Dog = require("../models/Dog");
const User = require("../models/User");
const { uploadImgToFirebase } = require("../utils/firebaseStorage");

exports.getMyDogs = async (req, res) => {
  try {
    const dogs = await Dog.find({
      owner: req.user.userId,
    });

    res.json({ dogs });
  } catch (err) {
    console.error("GetMyDogs error", err);
    res.status(500).json({ message: "GetMyDogs failed" });
  }
};

/* -------------------- Create Dog -------------------- */
exports.createDog = async (req, res) => {
  try {
    let avatarUrl = null;

    if (req.file) {
      const { url } = await uploadImgToFirebase({
        file: req.file,
        folder: "dogs/avatars",
        filenamePrefix: `${req.user.userId}_`,
      });
      avatarUrl = url;
    }

    const dog = await Dog.create({
      owner: req.user.userId,
      name: req.body.name,
      breed: req.body.breed,
      age: req.body.age,
      avatarUrl,
    });

    // ⭐ 关键：同步更新 users.dogs
    await User.findByIdAndUpdate(
      req.user.userId,
      { $addToSet: { dogs: dog._id } }, // addToSet 防重复
      { new: true }
    );

    res.status(201).json({ dog });
  } catch (err) {
    logger.error("CreateDog failed", { error: err.message });
    res.status(500).json({ message: "CreateDog failed" });
  }
};

exports.updateDog = async (req, res) => {
  try {
    const { id } = req.params;

    const dog = await Dog.findOne({
      _id: id,
      owner: req.user.userId,
    });

    if (!dog) {
      return res.status(404).json({ message: "Dog not found" });
    }

    dog.name = req.body.name;
    dog.breed = req.body.breed;
    dog.age = req.body.age;

    if (req.file) {
      const { url } = await uploadImgToFirebase({
        file: req.file,
        folder: "dogs/avatars",
        filenamePrefix: `${dog._id}_`,
      });
      dog.avatarUrl = url;
    }

    await dog.save();
    res.json({ dog });
  } catch (err) {
    logger.error("UpdateDog failed", { error: err.message });
    res.status(500).json({ message: "UpdateDog failed" });
  }
};

exports.deleteDog = async (req, res) => {
  try {
    const dog = await Dog.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.userId,
    });

    if (!dog) {
      return res.status(404).json({ message: "Dog not found" });
    }

    await User.findByIdAndUpdate(req.user.userId, { $pull: { dogs: dog._id } });

    return res.status(204).end();
  } catch (err) {
    logger.error("DeleteDog failed", { error: err.message });
    res.status(500).json({ message: "DeleteDog failed" });
  }
};
