const express = require("express");
const router = express.Router();
const multer = require("multer");
const mongoose = require("mongoose");
const Career = require("../models/Career");

// storage config for resume
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });



router.post("/save", async (req, res) => {
  try {
    const {
      userId,
      careerGoal,
      skills,
      jobPreferences,
      workExperience,
      education,
      certifications,
      projects,
      achievements,
    } = req.body;

    const data = await Career.findOneAndUpdate(
      { userId },
      {
        careerGoal,
        skills,
        jobPreferences,
        workExperience,
        education,
        certifications,
        projects,
        achievements,
      },
      { returnDocument: "after", upsert: true }
    );

    res.json(data);
  } catch (err) {
    console.error("Error saving career data:", err);
    res.status(500).json({ message: "Error saving career data", error: err.message });
  }
});


router.get("/get", async (req, res) => {
  try {
    const userId = req.query.userId;

    const data = await Career.findOne({ userId });

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "error fetching career data" });
  }
});

router.post("/resume/upload", upload.single("resume"), async (req, res) => {
  try {
    const userId = req.body.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const resumeUrl = req.file.path;

    console.log("Request body:", req.body);
    console.log("Uploaded file:", req.file);
    console.log("User ID:", userId);
    console.log("File Path:", req.file ? req.file.path : "No file uploaded");
    console.log("Resume URL to be saved:", resumeUrl);

    const data = await Career.findOneAndUpdate(
      { userId },
      { resumeUrl },
      { returnDocument: "after", upsert: true }
    );

    console.log("Resume URL to be saved in database:", resumeUrl);
    console.log("Database update result:", data);

    res.json({ message: "Resume uploaded successfully", resumeUrl });
  } catch (err) {
    res.status(500).json({ message: "Error uploading resume", error: err.message });
  }
});

// Add a route to fetch the uploaded resume
router.get("/resume", async (req, res) => {
  try {
    const userId = req.query.userId;

    if (!userId) {
      console.error("User ID is missing in the request");
      return res.status(400).json({ message: "User ID is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    console.log("Fetching resume for user ID:", userId);

    const data = await Career.findOne({ userId }, "resumeUrl");

    if (!data) {
      console.error("No user found with the given ID:", userId);
      return res.status(404).json({ message: "No user found with the given ID" });
    }

    if (!data.resumeUrl) {
      console.error("No resume found for user ID:", userId);
      return res.status(404).json({ message: "No resume found for the given user ID" });
    }

    console.log("Resume found for user ID:", userId, "Resume URL:", data.resumeUrl);
    res.json({ resumeUrl: data.resumeUrl });
  } catch (err) {
    console.error("Error fetching resume:", err);
    res.status(500).json({ message: "Error fetching resume", error: err.message });
  }
});

module.exports = router;
