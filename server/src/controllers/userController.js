const User = require("../models/User");
const logger = require("../utils/logger");
const { uploadImgToFirebase } = require("../utils/firebaseStorage");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select("_id username email avatarUrl bio followers followings")
      .populate("dogs", "name avatarUrl");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        avatarUrl: user.avatarUrl,
        bio: user.bio,
        dogs: user.dogs,
        followersCount: user.followers?.length || 0,
        followingsCount: user.followings?.length || 0,
      },
    });
  } catch (err) {
    logger.error("GetMe error", { error: err.message });
    res.status(500).json({ message: "GetME failed" });
  }
};

exports.updateMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.body.bio !== undefined) {
      user.bio = req.body.bio;
    }

    if (req.file) {
      const { url } = await uploadImgToFirebase({
        file: req.file,
        folder: "avatars",
        filenamePrefix: `${user._id}-`,
      });

      user.avatarUrl = url;
    }

    await user.save();

    res.json({
      message: "Profile updated",
      user: {
        id: user._id,
        username: user.username,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (err) {
    logger.error("Update profile error", { error: err.message });
    res.status(500).json({ message: "Update profile failed" });
  }
};

exports.changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.userId;
  const user = await User.findById(userId).select("+passwordHash");

  if (!user) {
    res.status(404);
    throw new Error("User not found ");
  }

  const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!isMatch) {
    return res.status(400).json({
      code: "PASSWORD_MISMATCH",
      message: "Current password is incorrect",
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      code: "INVALID_NEW_PASSWORD",
      message: "New password must be at least 6 characters long",
    });
  }

  const isSame = await bcrypt.compare(newPassword, user.passwordHash);
  if (isSame) {
    return res.status(400).json({
      code: "SAME_AS_OLD_PASSWORD",
      message: "New password must be different from the current password",
    });
  }

  //hash new pwd

  user.passwordHash = await bcrypt.hash(newPassword, 10);

  await user.save();
  res.status(200).json({
    message: "Password updated successfully",
  });
});

exports.followUser = async (req, res) => {
  try {
    const me = req.user.userId;
    const target = req.params.id;

    if (me === target) {
      return res.status(400).json({ message: "Cannot follow yourself" });
    }

    await User.findByIdAndUpdate(me, {
      $addToSet: { followings: target },
    });

    await User.findByIdAndUpdate(target, {
      $addToSet: { followers: me },
    });

    res.json({ success: true });
  } catch (err) {
    logger.error("Follow User error", { error: err.message });
    res.status(500).json({ message: "Follow User error" });
  }
};

exports.unfollowUser = async (req, res) => {
  try {
    const me = req.user.userId;
    const target = req.params.id;

    await User.findByIdAndUpdate(me, {
      $pull: { followings: target },
    });

    await User.findByIdAndUpdate(target, {
      $pull: { followers: me },
    });

    res.json({ success: true });
  } catch (err) {
    logger.error("Unfollow user error", { error: err.message });
    res.status(500).json({ message: "Unfollow user error" });
  }
};

exports.getUserHover = async (req, res) => {
  try {
    const target = await User.findById(req.params.id)
      .populate("dogs", "name")
      .select("username avatarUrl dogs followers followings");

    if (!target) {
      return res.status(404).json({ message: "User not found" });
    }

    const isFollowing = target.followers.some(
      (id) => id.toString() === req.user.userId
    );

    res.json({
      user: {
        _id: target._id,
        username: target.username,
        avatarUrl: target.avatarUrl,
        dogs: target.dogs,
        followersCount: target.followers.length,
        followingsCount: target.followings.length,
        isFollowing,
      },
    });
  } catch (err) {
    logger.error("GetUserHover error", { error: err.message });
    res.status(500).json({ message: "GetUserHover error" });
  }
};

exports.getFollowers = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate(
      "followers",
      "username avatarUrl"
    );

    res.json({ users: user.followers });
  } catch (err) {
    logger.error("GetFollowers error", { error: err.message });
    res.status(500).json({ message: "GetFollowers error" });
  }
};

exports.getFollowings = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate(
      "followings",
      "username avatarUrl"
    );

    res.json({ users: user.followings });
  } catch (err) {
    logger.error("GetFollowings error", { error: err.message });
    res.status(500).json({ message: "GetFollowings error" });
  }
};
