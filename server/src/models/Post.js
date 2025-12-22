const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    dogs: [
      {
        type: Schema.Types.ObjectId,
        ref: "Dog",
      },
    ],

    contentText: { type: String, required: true, trim: true, maxLength: 1000 },
    images:[ { type: String }],
    videoUrl: { type: String },
    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Post", postSchema);
