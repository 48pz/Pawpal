const mongoose = require("mongoose");
const Walk = require("../models/Walk");

exports.createWalk = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { time, dogs, location, maxParticipants } = req.body;

    if (!time) return res.status(400).json({ message: "time is required" });

    const parsedTime = new Date(time);
    if (Number.isNaN(parsedTime.getTime())) {
      return res.status(400).json({ message: "time is invalid" });
    }
    if (parsedTime.getTime() < Date.now()) {
      return res.status(400).json({ message: "time must be in the future" });
    }

    if (!location || typeof location !== "object") {
      return res.status(400).json({ message: "location is required" });
    }

    const { name, lat, lng } = location;

    if (!name || !String(name).trim()) {
      return res.status(400).json({ message: "location.name is required" });
    }
    if (typeof lat !== "number" || typeof lng !== "number") {
      return res
        .status(400)
        .json({ message: "location.lat/lng must be numbers" });
    }

    if (dogs !== undefined && !Array.isArray(dogs)) {
      return res.status(400).json({ message: "dogs must be an array" });
    }

    // ---- validate maxParticipants ----
    let maxP = 5;
    if (maxParticipants !== undefined) {
      const mp = Number(maxParticipants);
      if (!Number.isFinite(mp) || mp < 1 || mp > 50) {
        return res
          .status(400)
          .json({ message: "maxParticipants must be 1-50" });
      }
      maxP = mp;
    }

    const walk = await Walk.create({
      host: userId,
      dogs: dogs || [],
      location: {
        name: String(name).trim(),
        lat,
        lng,
      },
      time: parsedTime,
      participants: [],
      maxParticipants: maxP,
      status: "open",
    });

    const populated = await Walk.findById(walk._id)
      .populate("host", "username avatar avatarUrl")
      .populate("dogs", "name avatarUrl")
      .populate("participants", "username avatar avatarUrl");

    return res.status(201).json({ walk: populated });
  } catch (err) {
    console.error("Create walk error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getWalks = async (req, res) => {
  try {
    const now = new Date();

    const walks = await Walk.find({
      time: { $gte: now },
      status: { $ne: "cancelled" },
    })
      .sort({ time: 1 })
      .populate("host", "username avatar avatarUrl")
      .populate("dogs", "name avatarUrl")
      .populate("participants", "username avatar avatarUrl");

    res.json({ walks });
  } catch (err) {
    console.error("Get walks error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.joinWalk = async (req, res) => {
  try {
    const walkId = req.params.id;
    const dogIds = req.body.dogs;

    if (!Array.isArray(dogIds) || dogIds.length === 0) {
      return res.status(400).json({
        message: "Please select at least one dog to join the walk",
      });
    }

    const walk = await Walk.findById(walkId);
    if (!walk) {
      return res.status(404).json({ message: "Walk not found" });
    }

    const userId = new mongoose.Types.ObjectId(req.user.userId);
    const dogObjectIds = dogIds.map((id) => new mongoose.Types.ObjectId(id));

    const alreadyJoined = walk.participants.some(
      (p) => p.user && p.user.toString() === userId.toString()
    );

    if (alreadyJoined) {
      return res.status(400).json({ message: "Already joined this walk" });
    }

    walk.participants.push({
      user: userId,
      dogs: dogObjectIds,
    });

    await walk.save();

    res.json({ message: "Joined walk successfully" });
  } catch (err) {
    console.error("Join walk error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
exports.leaveWalk = async (req, res) => {
  try {
    const userId = req.user.userId;
    const walkId = req.params.id;

    const walk = await Walk.findById(walkId);
    if (!walk) {
      return res.status(404).json({ message: "Walk not found" });
    }


    if (walk.host.toString() === userId) {
      return res.status(400).json({ message: "Host cannot leave the walk" });
    }

    const isParticipant = walk.participants.some(
      (p) => p.user && p.user.toString() === userId
    );

    if (!isParticipant) {
      return res.status(400).json({ message: "You are not part of this walk" });
    }

    walk.participants = walk.participants.filter(
      (p) => p.user.toString() !== userId
    );

    if (
      walk.status === "closed" &&
      walk.participants.length < walk.maxParticipants
    ) {
      walk.status = "open";
    }

    await walk.save();

    res.json({ message: "Left walk successfully" });
  } catch (err) {
    console.error("Leave walk error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getWalkById = async (req, res) => {
  const walk = await Walk.findById(req.params.id)
    .populate("host", "username avatarUrl")
    .populate("dogs", "name")
    .populate("participants.user", "username avatarUrl")
    .populate("participants.dogs", "name");
  if (!walk) {
    return res.status(404).json({ message: "Walk not found" });
  }

  res.json({ walk });
};
