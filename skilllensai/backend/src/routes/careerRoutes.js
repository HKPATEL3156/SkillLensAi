const express = require("express");
const router = express.Router();
const upload = require("../src/utils/upload");
const {
  saveCareer,
  getCareer,
} = require("../controllers/careerController");

const authMiddleware = require("../middleware/auth");

router.post(
  "/save",
  authMiddleware,
  upload.single("resume"),
  saveCareer
);

router.get("/get", authMiddleware, getCareer);

module.exports = router;
