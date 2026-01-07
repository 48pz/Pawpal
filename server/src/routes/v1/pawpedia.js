const express = require("express");
const router = express.Router();

const {
  listArticles,
  getArticleBySlug,
  getCategories,
} = require("../../controllers/pawpediaController");

router.get("/", listArticles);
router.get("/meta/categories", getCategories);
router.get("/:slug", getArticleBySlug);

module.exports = router;
