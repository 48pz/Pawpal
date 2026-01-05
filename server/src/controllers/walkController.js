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
      participants: [userId],
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
