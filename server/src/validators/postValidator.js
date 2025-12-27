const { body } = require("express-validator");

exports.createPostValidator = [
  body("contentText")
    .trim()
    .notEmpty()
    .withMessage("Post content is required")
    .isLength({ max: 1000 })
    .withMessage("Post content must be under 1000 characters"),

  body("media").optional().isArray().withMessage("Media must be an array"),

  body("media.*.type")
    .optional()
    .isIn(["image", "video"])
    .withMessage("Media type must be image or video"),

  body("media.*.url")
    .optional()
    .isURL()
    .withMessage("Media url must be a valid URL"),
];
