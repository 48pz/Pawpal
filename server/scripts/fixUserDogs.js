require("dotenv").config({
  path: require("path").resolve(__dirname, "../../.env"),
});

const mongoose = require("mongoose");
const User = require("../src/models/User");
const Dog = require("../src/models/Dog");

async function fixUserDogs() {
  try {
    console.log("MONGO_URI:", process.env.MONGO_URI);

    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    const dogs = await Dog.find();

    for (const dog of dogs) {
      if (dog.owner) {
        await User.findByIdAndUpdate(dog.owner, {
          $addToSet: { dogs: dog._id },
        });
      }
    }

    console.log("✅ User.dogs backfilled");
  } catch (err) {
    console.error("❌ FixUserDogs error:", err);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 MongoDB disconnected");
    process.exit(0);
  }
}

fixUserDogs();
