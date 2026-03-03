const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const QuizAttempt = require("../models/QuizAttempt");
const Activity = require("../models/Activity");

// all quiz routes require auth
router.use(auth);

// GET questions (reads backend/data/questions.json)
// GET questions
// If attemptId is provided, return the questionSet stored for that attempt.
// Otherwise, read master file and return a randomized set (not persisted).
router.get("/questions", async (req, res) => {
  try {
    const { attemptId } = req.query;
    if (attemptId) {
      const attempt = await QuizAttempt.findById(attemptId).lean();
      if (!attempt) return res.status(404).json({ error: "Attempt not found" });
      return res.json({ questions: attempt.questionSet || [] });
    }

    const file = path.join(__dirname, "../../data/questionpaper.json");
    if (!fs.existsSync(file)) return res.json({ questions: [] });
    const raw = fs.readFileSync(file, "utf8");
    const data = JSON.parse(raw);
    let questions = Array.isArray(data) ? data : data.questions || [];
    // return randomized copy
    questions = shuffleArray(questions)
      .slice(0, 25)
      .map((q) => {
        // preserve option order as given in the master file (do NOT shuffle options)
        if (q.options && typeof q.options === "object") {
          const newOptions = {};
          for (const [k, v] of Object.entries(q.options)) newOptions[k] = v;
          return { ...q, options: newOptions };
        }
        return q;
      });
    res.json({ questions });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to load questions", details: err.message });
  }
});

// POST start quiz -> create attempt
router.post("/start", async (req, res) => {
  try {
    const { skills = [], quizName = "Skill Quiz" } = req.body;
    // load master questions and create randomized set for this attempt
    const file = path.join(__dirname, "../../data/questionpaper.json");
    let questions = [];
    if (fs.existsSync(file)) {
      const raw = fs.readFileSync(file, "utf8");
      const data = JSON.parse(raw);
      questions = Array.isArray(data) ? data : data.questions || [];
    }
    const questionSet = shuffleArray(questions)
      .slice(0, 25)
      .map((q) => {
        // preserve option order (do NOT shuffle options)
        if (q.options && typeof q.options === "object") {
          const newOptions = {};
          for (const [k, v] of Object.entries(q.options)) newOptions[k] = v;
          return { ...q, options: newOptions };
        }
        return q;
      });

    const attempt = await QuizAttempt.create({
      userId: req.user.id,
      skills,
      quizName,
      status: "started",
      questionSet,
    });
    await Activity.create({
      userId: req.user.id,
      type: "quiz_start",
      message: `Started quiz ${quizName}`,
    }).catch(() => {});
    res.json({ attemptId: attempt._id, startedAt: attempt.startedAt });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to start quiz", details: err.message });
  }
});

// POST save checkpoint (autosave)
router.post("/save", async (req, res) => {
  try {
    const { attemptId, checkpoint = {} } = req.body;
    if (!attemptId)
      return res.status(400).json({ error: "attemptId required" });
    const attempt = await QuizAttempt.findOneAndUpdate(
      { _id: attemptId, userId: req.user.id },
      { $set: { checkpoint } },
      { returnDocument: "after" },
    );
    if (!attempt) return res.status(404).json({ error: "Attempt not found" });
    res.json({ message: "Checkpoint saved" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to save checkpoint", details: err.message });
  }
});

// POST submit quiz -> save results or cancelled
router.post("/submit", async (req, res) => {
  try {
    const {
      attemptId,
      obtainedMarks = 0,
      totalMarks = 0,
      status = "submitted",
      answersSummary = {},
    } = req.body;
    if (!attemptId)
      return res.status(400).json({ error: "attemptId required" });
    const update = {
      obtainedMarks,
      totalMarks,
      status,
      answersSummary,
      submittedAt: status === "submitted" ? new Date() : undefined,
    };
    const attempt = await QuizAttempt.findOneAndUpdate(
      { _id: attemptId, userId: req.user.id },
      update,
      { returnDocument: "after" },
    );
    if (!attempt) return res.status(404).json({ error: "Attempt not found" });
    await Activity.create({
      userId: req.user.id,
      type: status === "submitted" ? "quiz_submit" : "quiz_cancel",
      message: `Quiz ${status}`,
    }).catch(() => {});
    res.json({ message: "Quiz saved", attempt });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to submit quiz", details: err.message });
  }
});

// GET attempts list for user
router.get("/attempts", async (req, res) => {
  try {
    const attempts = await QuizAttempt.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .lean();
    res.json({ attempts });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch attempts", details: err.message });
  }
});

module.exports = router;

// utility: Fisher-Yates shuffle
function shuffleArray(arr) {
  const a = Array.isArray(arr) ? arr.slice() : [];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
