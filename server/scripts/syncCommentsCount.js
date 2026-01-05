const mongoose = require("mongoose");
require("dotenv").config();

const Post = require("../src/models/Post");
const Comment = require("../src/models/Comment");

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Mongo connected");

 
  const stats = await Comment.aggregate([
    { $group: { _id: "$post", count: { $sum: 1 } } },
  ]);


  await Post.updateMany({}, { $set: { commentsCount: 0 } });


  let updated = 0;
  for (const s of stats) {
    await Post.updateOne(
      { _id: s._id },
      { $set: { commentsCount: s.count } }
    );
    updated++;
  }

  console.log("Updated posts:", updated);
  await mongoose.disconnect();
  console.log("Done");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
