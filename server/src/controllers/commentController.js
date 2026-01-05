const Comment = require("../models/Comment");
const Post = require("../models/Post");
const Notification = require("../models/Notification");
const logger = require("../utils/logger");


exports.createComment = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { postId, content, parentCommentId, replyToUserId } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Content is required" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }


    const comment = await Comment.create({
      post: postId,
      author: userId,
      content,
      parentComment: parentCommentId || null,
      replyToUser: replyToUserId || null,
    });

    await Post.findByIdAndUpdate(postId, {
      $inc: { commentsCount: 1 },
    });

    try {
      if (parentCommentId && replyToUserId) {
        if (replyToUserId.toString() !== userId.toString()) {
          await Notification.create({
            recipient: replyToUserId,
            sender: userId,
            type: "reply",
            post: postId,
          });
        }
      } else {
        if (post.author.toString() !== userId.toString()) {
          await Notification.create({
            recipient: post.author,
            sender: userId,
            type: "comment",
            post: postId,
          });
        }
      }
    } catch (notifyErr) {
      logger.error("Notification failed:", notifyErr.message);
    }

    const populatedComment = await Comment.findById(comment._id)
      .populate("author", "username")
      .populate("replyToUser", "username");

    res.status(201).json(populatedComment);
  } catch (err) {
    logger.error("createComment error:", { error: err.message });
    res.status(500).json({ message: "Create comment failed" });
  }
};

exports.getCommentsByPost = async (req, res) => {
  try {
    const { postId, page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    const comments = await Comment.find({ post: postId })
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(Number(limit))
      .populate("author", "username")
      .populate("replyToUser", "username")
      .lean();

    const total = await Comment.countDocuments({ post: postId });

    res.json({
      comments,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    logger.error("Get comments failed:", { error: err.message });
    res.status(500).json({ message: "Get comments failed" });
  }
};
