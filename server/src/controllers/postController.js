const Post = require("../models/Post");
const Notification = require("../models/Notification");
const Like = require("../models/Like");
const { uploadImgToFirebase } = require("../utils/firebaseStorage");
const logger = require("../utils/logger");

exports.getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;
    const userId = req.user.userId;
    //limit+1 for hasMore
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit + 1)
      .populate("author", "username avatarUrl")
      .populate("dogs", "name");

    const hasMore = posts.length > limit;
    if (hasMore) {
      posts.pop();
    }

    const postsWithLikeState = await Promise.all(
      posts.map(async (post) => {
        const liked = await Like.exists({
          user: userId,
          post: post._id,
        });

        return {
          ...post.toObject(),
          isLiked: !!liked,
        };
      })
    );
    res.json({
      posts: postsWithLikeState,
      hasMore,
    });
  } catch (err) {
    logger.error("Get posts failed", { error: err.message });
    return res.status(500).json({ message: "Failed to load posts" });
  }
};

exports.createPost = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { contentText } = req.body;
    let dogs = [];
    if (req.body.dogs) {
      dogs = JSON.parse(req.body.dogs);
    }

    const files = req.files || [];
    let hasVideo = false;
    let imageCount = 0;

    for (const file of files) {
      if (file.mimetype.startsWith("video/")) {
        hasVideo = true;
      }

      if (file.mimetype.startsWith("image/")) {
        imageCount++;
      }
    }

    if (hasVideo && imageCount > 0) {
      return res.status(400).json({
        message: "Cannot upload images and video together",
      });
    }

    if (imageCount > 6) {
      return res.status(400).json({
        message: "Maximum 6 images allowed",
      });
    }

    const media = [];
    for (const file of files) {
      const type = file.mimetype.startsWith("image/") ? "image" : "video";

      const { url } = await uploadImgToFirebase({
        file,
        folder: `posts/${userId}`,
        filenamePrefix: `${Date.now()}_`,
      });
      media.push({ type, url });
    }

    const post = await Post.create({
      author: userId,
      contentText,
      dogs,
      media,
    });

    res.status(201).json(post);
  } catch (err) {
    logger.error("Create post failed", { error: err.message });
    res.status(400).json({ error: err.message });
  }
};

exports.likePost = async (req, res) => {
  try {
    const userId = req.user.userId;
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const existingLike = await Like.findOne({ user: userId, post: postId });
    if (existingLike) {
      return res.status(400).json({ message: "Already liked" });
    }

    await Like.create({ user: userId, post: postId });

    post.likesCount += 1;
    await post.save();

    if (!post.author.equals(userId)) {
      await Notification.create({
        recipient: post.author,
        sender: userId,
        type: "like",
        post: post._id,
      });
    }
    res.json({ likesCount: post.likesCount });
  } catch (err) {
    logger.error("likePost Error:", { error: err.message });
    res.status(400).json({ error: err.message });
  }
};

exports.unlikePost = async (req, res) => {
  try {
    const userId = req.user.userId;
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const like = await Like.findOne({
      user: userId,
      post: postId,
    });

    if (!like) {
      return res.status(400).json({ message: "Not liked yet" });
    }

    await like.deleteOne();

    post.likesCount = Math.max(0, post.likesCount - 1);
    await post.save();

    res.json({ likesCount: post.likesCount });
  } catch (err) {
    console.error("unlikePost Error:", err);
    res.status(500).json({ message: "Unlike failed" });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Not allowed to delete this post" });
    }

    await post.deleteOne();

    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("Delete post error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
