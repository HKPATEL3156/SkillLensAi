const axios = require("axios"); // for ml api call

const express = require("express"); // import express
const router = express.Router(); // create router
const Career = require("../models/Career"); // import career model
const Activity = require("../models/Activity"); // import activity model
const auth = require("../middleware/auth.middleware"); // auth middleware
const { resumeUpload } = require("../utils/Upload"); // multer config
const path = require("path"); // path module
const fs = require("fs"); // file system

// all routes require auth
router.use(auth);

// -----------------------------
// GET current user career data
// -----------------------------
router.get("/me", async (req, res) => {
  try {
    const data = await Career.findOne({ userId: req.user.id });
    res.json(data);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching career data",
      error: err.message,
    });
  }
});

// -----------------------------
// CREATE or UPDATE career data
// -----------------------------
router.post("/me", async (req, res) => {
  try {
    const update = {
      ...req.body,
      userId: req.user.id,
    };

    const data = await Career.findOneAndUpdate(
      { userId: req.user.id },
      update,
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );

    res.json(data);
  } catch (err) {
    res.status(500).json({
      message: "Error saving career data",
      error: err.message,
    });
  }
});

// multer single file
const pdfUpload = resumeUpload.single("file");

// -----------------------------
// UPLOAD RESUME (with ML integration and robust error handling)
// -----------------------------
router.post("/upload-resume", (req, res, next) => {
  pdfUpload(req, res, async function (err) {
    if (err) {
      return res.status(400).json({ error: err.message || "Upload error" });
    }
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    if (req.file.mimetype !== "application/pdf") {
      return res.status(400).json({ error: "Only PDF files allowed" });
    }
    try {
      // normalize path
      const resumeUrl = req.file.path.replace(/\\/g, "/");
      // call ml service
      let extractedSkills = [];
      try {
        const mlResponse = await axios.post(
          "http://localhost:8000/extract-skills",
          { filepath: resumeUrl },
        );
        extractedSkills = mlResponse.data.skills || [];
      } catch (mlError) {
        return res
          .status(502)
          .json({ error: "ML service error", details: mlError.message });
      }
      // save resume + skills
      const data = await Career.findOneAndUpdate(
        { userId: req.user.id },
        { resumeUrl, extractedSkills },
        { new: true, upsert: true, setDefaultsOnInsert: true },
      );
      // log activity
      await Activity.create({
        userId: req.user.id,
        type: "resume_upload",
        message: "Resume uploaded and skills extracted",
      });
      res.json({
        message: "Resume uploaded successfully",
        resumeUrl: data.resumeUrl,
        skills: extractedSkills,
      });
    } catch (err) {
      next(err);
    }
  });
});

// -----------------------------
// UPLOAD RESULT
// -----------------------------
router.post("/upload-result", (req, res) => {
  pdfUpload(req, res, async function (err) {
    if (err) {
      return res.status(400).json({
        message: err.message || "Upload error",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    if (req.file.mimetype !== "application/pdf") {
      return res.status(400).json({
        message: "Only PDF files allowed",
      });
    }

    try {
      const resultUrl = req.file.path.replace(/\\/g, "/");

      const data = await Career.findOneAndUpdate(
        { userId: req.user.id },
        { resultUrl },
        { new: true, upsert: true, setDefaultsOnInsert: true },
      );

      // log activity
      await Activity.create({
        userId: req.user.id,
        type: "result_upload",
        message: "Result uploaded",
      });

      res.json({
        message: "Result uploaded successfully",
        resultUrl: data.resultUrl,
      });
    } catch (err) {
      res.status(500).json({
        message: "Error saving result",
        error: err.message,
      });
    }
  });
});

// -----------------------------
// DOWNLOAD RESUME
// -----------------------------
router.get("/download-resume", async (req, res) => {
  try {
    const data = await Career.findOne({ userId: req.user.id }, "resumeUrl");

    if (!data || !data.resumeUrl) {
      return res.status(404).json({
        message: "No resume found for the user",
      });
    }

    const filePath = path.join(__dirname, "../../", data.resumeUrl);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        message: "Resume file not found",
      });
    }

    res.download(filePath, path.basename(filePath));
  } catch (err) {
    res.status(500).json({
      message: "Error downloading resume",
      error: err.message,
    });
  }
});

// -----------------------------
// DOWNLOAD RESULT
// -----------------------------
router.get("/download-result", async (req, res) => {
  try {
    const data = await Career.findOne({ userId: req.user.id }, "resultUrl");

    if (!data || !data.resultUrl) {
      return res.status(404).json({
        message: "No result found for the user",
      });
    }

    const filePath = path.join(__dirname, "../../", data.resultUrl);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        message: "Result file not found",
      });
    }

    res.download(filePath, path.basename(filePath));
  } catch (err) {
    res.status(500).json({
      message: "Error downloading result",
      error: err.message,
    });
  }
});

// -----------------------------
// GET EXTRACTED SKILLS
// -----------------------------
router.get("/skills", async (req, res) => {
  try {
    const data = await Career.findOne(
      { userId: req.user.id },
      "extractedSkills",
    );

    if (!data) {
      return res.status(404).json({
        message: "Career profile not found",
      });
    }

    res.json({
      skills: data.extractedSkills || [],
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching skills",
      error: err.message,
    });
  }
});

// -----------------------------
// SAVE SELECTED SKILLS
// -----------------------------
router.post("/select-skills", async (req, res) => {
  try {
    const { selectedSkills } = req.body;

    const data = await Career.findOneAndUpdate(
      { userId: req.user.id },
      { selectedSkills },
      { new: true },
    );

    res.json({
      message: "Selected skills saved",
      selectedSkills: data.selectedSkills,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error saving selected skills",
      error: err.message,
    });
  }
});

module.exports = router;
