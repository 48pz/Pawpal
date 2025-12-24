const isProd = process.env.NODE_ENV === "production";

const logger = {
  info(message, meta) {
    if (!isProd) {
      console.log(`[INFO] ${message}`, meta ?? "");
    }
  },

  warn(message, meta) {
    console.warn(`[WARN] ${message}`, meta ?? "");
  },

  error(message, error) {
    console.error(`[ERROR] ${message}`);
    if (!isProd && error) {
      console.error(error);
    }
  },
};

module.exports = logger;
