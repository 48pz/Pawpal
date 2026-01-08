const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    logger.error("jwt failed", { error: err.message });
    return res.status(401).json({ message: "Invalid token" });
  }
};
