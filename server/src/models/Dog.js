const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const dogSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxLength: 100 },
    breed: { type: String, trim: true },
    age: { type: Number, min: 0 },
    avataUrl: { type: String },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    bio: { type: String, default: "", maxLength: 300 },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Dog", dogSchema);
