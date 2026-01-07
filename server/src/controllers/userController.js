const User = require("../models/User");
const logger = require("../utils/logger");
const { uploadImgToFirebase } = require("../utils/firebaseStorage");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select("_id username email avatarUrl bio")
      .populate("dogs");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
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
