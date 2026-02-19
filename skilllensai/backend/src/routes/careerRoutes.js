const Activity = require("../models/Activity");

const express = require("express");
const router = express.Router();
const Career = require("../models/Career");
const auth = require("../middleware/auth.middleware");
const upload = require("../utils/Upload");
const path = require("path");
const fs = require("fs");

// All routes below require authentication
router.use(auth);

// Get current user's career profile
router.get("/me", async (req, res) => {
  try {
    const data = await Career.findOne({ userId: req.user.id });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching career data", error: err.message });
  }
});

// Create or update current user's career profile
router.post("/me", async (req, res) => {
  try {
    const update = {
      ...req.body,
      userId: req.user.id,
    };
    const data = await Career.findOneAndUpdate(
      { userId: req.user.id },
      update,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Error saving career data", error: err.message });
  }
});


// Helper: Only allow PDF, 5MB
const pdfUpload = upload.single("file");

// POST /api/career/upload-resume
router.post("/upload-resume", (req, res) => {
  pdfUpload(req, res, async function (err) {
    if (err) {
      return res.status(400).json({ message: err.message || "Upload error" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    if (req.file.mimetype !== "application/pdf") {
      return res.status(400).json({ message: "Only PDF files allowed" });
    }
    try {
      const resumeUrl = req.file.path.replace(/\\/g, "/");
      const data = await Career.findOneAndUpdate(
        { userId: req.user.id },
        { resumeUrl },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
      res.json({ message: "Resume uploaded successfully", resumeUrl: data.resumeUrl });
      // Log activity
      await Activity.create({
        userId: req.user.id,
        type: "resume_upload",
        message: `Resume uploaded`,
      });
      res.json({ message: "Resume uploaded successfully", resumeUrl: data.resumeUrl });
    } catch (err) {
      res.status(500).json({ message: "Error saving resume", error: err.message });
    }
  });
});

// POST /api/career/upload-result
router.post("/upload-result", (req, res) => {
  pdfUpload(req, res, async function (err) {
    if (err) {
      return res.status(400).json({ message: err.message || "Upload error" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    if (req.file.mimetype !== "application/pdf") {
      return res.status(400).json({ message: "Only PDF files allowed" });
    }
    try {
      const resultUrl = req.file.path.replace(/\\/g, "/");
      const data = await Career.findOneAndUpdate(
        { userId: req.user.id },
        { resultUrl },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
      res.json({ message: "Result uploaded successfully", resultUrl: data.resultUrl });
      // Log activity
      await Activity.create({
        userId: req.user.id,
        type: "result_upload",
        message: `Result uploaded`,
      });
      res.json({ message: "Result uploaded successfully", resultUrl: data.resultUrl });
    } catch (err) {
      res.status(500).json({ message: "Error saving result", error: err.message });
    }
  });
});

// GET /api/career/download-resume
router.get("/download-resume", async (req, res) => {
  try {
    const data = await Career.findOne({ userId: req.user.id }, "resumeUrl");
    if (!data || !data.resumeUrl) {
      return res.status(404).json({ message: "No resume found for the user" });
    }
    const filePath = path.join(__dirname, "../../", data.resumeUrl);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Resume file not found" });
    }
    res.download(filePath, path.basename(filePath));
  } catch (err) {
    res.status(500).json({ message: "Error downloading resume", error: err.message });
  }
});

// GET /api/career/download-result
router.get("/download-result", async (req, res) => {
  try {
    const data = await Career.findOne({ userId: req.user.id }, "resultUrl");
    if (!data || !data.resultUrl) {
      return res.status(404).json({ message: "No result found for the user" });
    }
    const filePath = path.join(__dirname, "../../", data.resultUrl);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Result file not found" });
    }
    res.download(filePath, path.basename(filePath));
  } catch (err) {
    res.status(500).json({ message: "Error downloading result", error: err.message });
  }
});

module.exports = router;
