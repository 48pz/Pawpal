const logger = require("../utils/logger");
const Dog = require("../models/Dog");
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

    res.status(201).json({ dog });
  } catch (err) {
    logger.error("CreateDog failed", { error: err.message });
    res.status(500).json({ message: "CreateDog failed" });
  }
};

exports.updateDog = async (req, res) => {
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
    console.log("👉 Firebase avatar url:", url);
    dog.avatarUrl = url;
  }

  await dog.save();
  console.log("👉 After save avatarUrl:", dog.avatarUrl);
  res.json({ dog });
};

exports.deleteDog = async (req, res) => {
  await Dog.deleteOne({
    _id: req.params.id,
    owner: req.user.userId,
  });

  return res.status(204).end();
};
