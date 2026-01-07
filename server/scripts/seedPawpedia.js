require("dotenv").config({
  path: require("path").resolve(__dirname, "../../.env"),
});

const mongoose = require("mongoose");
const PawpediaArticle = require("../src/models/PawpediaArticle");

const data = [
  {
    title: "Puppy Toilet Training Basics",
    slug: "puppy-toilet-training-basics",
    category: "training",
    summary:
      "A simple, practical guide to help your puppy learn toilet habits faster.",
    tags: ["puppy", "training", "toilet"],
    contentBlocks: [
      { type: "heading", text: "Quick Facts" },
      {
        type: "bullets",
        items: [
          "Use a consistent schedule",
          "Reward immediately",
          "Expect accidents early on",
        ],
      },
      { type: "heading", text: "Key Steps" },
      {
        type: "bullets",
        items: [
          "Take your puppy out after meals and naps",
          "Use the same spot",
          "Keep training short and calm",
        ],
      },
      {
        type: "warning",
        text: "If your puppy suddenly regresses, consider a vet check for UTIs.",
      },
    ],
  },
  {
    title: "Foods Dogs Should Never Eat",
    slug: "toxic-foods-for-dogs",
    category: "nutrition",
    summary:
      "A quick list of common toxic foods and what to do if your dog eats them.",
    tags: ["nutrition", "safety"],
    contentBlocks: [
      { type: "heading", text: "Common Toxic Foods" },
      {
        type: "bullets",
        items: [
          "Chocolate",
          "Grapes/raisins",
          "Onions/garlic",
          "Xylitol",
          "Alcohol",
        ],
      },
      {
        type: "note",
        text: "If ingestion is recent, contact your vet or emergency clinic immediately.",
      },
    ],
  },
];

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await PawpediaArticle.deleteMany({});
  await PawpediaArticle.insertMany(data);
  console.log("Seeded Pawpedia articles.");
  process.exit(0);
})();
