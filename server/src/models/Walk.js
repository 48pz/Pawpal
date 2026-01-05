const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const walkSchema = new Schema(
  {
    host: {
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

    location: {
      name: { type: String, trim: true, required: true },
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },

    time: { type: Date, required: true, index: true },

    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    maxParticipants: { type: Number, default: 5, min: 1, max: 50 },

    status: {
      type: String,
      enum: ["open", "closed", "cancelled"],
      default: "open",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Walk", walkSchema);
