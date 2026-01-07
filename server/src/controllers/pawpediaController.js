const PawpediaArticle = require("../models/PawpediaArticle");

const clampInt = (v, min, max, fallback) => {
  const n = parseInt(v, 10);
  if (Number.isNaN(n)) return fallback;
  return Math.max(min, Math.min(max, n));
};


exports.listArticles = async (req, res) => {
  try {
    const { category, q } = req.query;
    const page = clampInt(req.query.page, 1, 9999, 1);
    const limit = clampInt(req.query.limit, 1, 50, 10);
    const skip = (page - 1) * limit;

    const filter = { isPublished: true };

    if (category) filter.category = category;

    if (q && q.trim()) {
      const kw = q.trim();
      filter.$or = [
        { title: { $regex: kw, $options: "i" } },
        { summary: { $regex: kw, $options: "i" } },
        { tags: { $in: [new RegExp(kw, "i")] } },
        { relatedBreeds: { $in: [new RegExp(kw, "i")] } },
      ];
    }

    const items = await PawpediaArticle.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit + 1)
      .select("title slug category coverImageUrl summary tags createdAt");

    const hasMore = items.length > limit;
    if (hasMore) items.pop();

    res.json({ articles: items, page, limit, hasMore });
  } catch (err) {
    console.error("Pawpedia list error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getArticleBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const article = await PawpediaArticle.findOne({ slug, isPublished: true });

    if (!article) return res.status(404).json({ message: "Article not found" });

    res.json({ article });
  } catch (err) {
    console.error("Pawpedia detail error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getCategories = async (req, res) => {
  res.json({
    categories: [
      { key: "breeds", label: "Breeds" },
      { key: "health", label: "Health & Care" },
      { key: "training", label: "Training & Behavior" },
      { key: "nutrition", label: "Nutrition & Feeding" },
      { key: "guides", label: "Guides" },
    ],
  });
};
