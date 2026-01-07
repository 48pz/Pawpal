const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pawpediaArticleSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxLength: 120 },
    slug: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },

    category: {
      type: String,
      enum: ["breeds", "health", "training", "nutrition", "guides"],
      required: true,
      index: true,
    },

    coverImageUrl: { type: String, trim: true, default: "" },

    summary: { type: String, trim: true, maxLength: 280, default: "" },

    contentBlocks: [
      {
        type: {
          type: String,
          enum: ["heading", "paragraph", "bullets", "warning", "note"],
          required: true,
        },
        text: { type: String, default: "" },
        items: { type: [String], default: [] }, // for bullets
      },
    ],

    tags: { type: [String], default: [], index: true },
    relatedBreeds: { type: [String], default: [] },

    isPublished: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PawpediaArticle", pawpediaArticleSchema);
