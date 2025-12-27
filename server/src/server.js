const mongoose = require("mongoose");
require("dotenv").config();

const app = require("./app");
const logger = require("./utils/logger");


const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    logger.info("MangoDB connected");
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    logger.error("MongoDB connection failed", err);
  });
