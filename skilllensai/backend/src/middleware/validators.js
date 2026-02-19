const { body } = require("express-validator");

exports.registerValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
  body("username").notEmpty().withMessage("Username is required"),
];

exports.loginValidation = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

exports.resumeUploadValidation = [
  // No body fields, but could add checks if needed
];
