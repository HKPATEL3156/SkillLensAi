const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Activity = require("../models/Activity");
const router = express.Router();

const multer = require("multer");

// Get current user profile
router.get("/profile", async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Error fetching profile" });
  }
});
const path = require("path");
const auth = require("../middleware/auth.middleware");


// --- PUBLIC ROUTES (no auth required) ---

// Enhanced Signup Route (with username, dob, qualification, etc.)
router.post("/signup", async (req, res) => {
  const { name, email, password, username, dob, qualification, phone, address, gender, bio } = req.body;
  try {
    // Check if email or username already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: "Email or username already exists" });
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      username,
      dob,
      qualification,
      phone,
      address,
      gender,
      bio,
    });
    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("Error during user registration:", err);
    res.status(500).json({ error: "Error creating user" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ error: "Error logging in" });
  }
});

// --- PROTECTED ROUTES (require auth) ---
router.use(auth);

// Multer storage for profile photo (req.user is now available)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../uploads/profile-photos"));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, req.user.id + "_" + Date.now() + ext);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed!"));
    }
    cb(null, true);
  },
});

// Get user activity log
router.get("/activity/me", async (req, res) => {
  try {
    const userId = req.user.id;
    const activities = await Activity.find({ userId }).sort({ createdAt: -1 }).limit(20);
    res.json(activities);
  } catch (err) {
    res.status(500).json({ error: "Error fetching activity log" });
  }
});

// Change Password
router.post("/change-password", async (req, res) => {
  try {
    const userId = req.user.id;
    const { old, new: newPassword } = req.body;
    if (!old || !newPassword) return res.status(400).json({ error: "Both old and new password are required" });
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    const isMatch = await bcrypt.compare(old, user.password);
    if (!isMatch) return res.status(401).json({ error: "Old password is incorrect" });
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error changing password" });
  }
});

// Enhanced Signup Route
// Enhanced Signup Route (with username, dob, qualification, etc.)
router.post("/signup", async (req, res) => {
  const { name, email, password, username, dob, qualification, phone, address, gender, bio } = req.body;
  try {
    // Check if email or username already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: "Email or username already exists" });
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      username,
      dob,
      qualification,
      phone,
      address,
      gender,
      bio,
    });
    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("Error during user registration:", err);
    res.status(500).json({ error: "Error creating user" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ error: "Error logging in" });
  }
});

// Dashboard Route
router.get("/dashboard", async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user ID is extracted from JWT middleware
    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json({
      message: "Dashboard data fetched successfully",
      user,
    });
  } catch (err) {
    res.status(500).json({ error: "Error fetching dashboard data" });
  }
});

// Profile Update Route (all fields except email, username)
router.put("/profile", async (req, res) => {
  const { name, password, dob, qualification, phone, address, gender, bio } = req.body;
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Email and username cannot be changed
    const updatedData = {
      name,
      dob,
      qualification,
      phone,
      address,
      gender,
      bio,
    };
    if (password) {
      updatedData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true });
    // Log activity
    await Activity.create({
      userId,
      type: "profile_update",
      message: `Profile updated`,
    });
    res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: "Error updating profile" });
  }
});

// Profile Photo Upload (single, correct implementation)
router.post("/profile/photo", upload.single("profilePhoto"), async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    user.profilePhoto = `/uploads/profile-photos/${req.file.filename}`;
    await user.save();
    // Log activity
    await Activity.create({
      userId,
      type: "profile_photo_upload",
      message: `Profile photo updated`,
    });
    res.status(200).json({ message: "Profile photo updated", profilePhoto: user.profilePhoto });
  } catch (err) {
    res.status(500).json({ error: "Error uploading profile photo" });
  }
});

module.exports = router;