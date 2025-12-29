const Post = require("../models/Post");
const logger = require("../utils/logger");

exports.getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    //limit+1 for hasMore
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit + 1)
      .populate("author", "username avatarUrl");

    const hasMore = posts.length > limit;
    if (hasMore) {
      posts.pop();
    }

    res.json({
      posts,
      hasMore,
    });
  } catch (err) {
    logger.error("Get posts failed", { error: err.message });
    return res.status(500).json({ message: "Failed to load posts" });
  }
};

exports.createPost = async (req, res) => {
  try {
    const { contentText, dogs, media } = req.body;

    const post = await Post.create({
      author: req.user.userId,
      contentText,
      dogs: dogs || [],
      media: media || [],
    });

    res.status(201).json(post);
  } catch (err) {
    logger.error("Create post failed", { error: err.message });
    res.status(400).json({ error: err.message });
  }
};
