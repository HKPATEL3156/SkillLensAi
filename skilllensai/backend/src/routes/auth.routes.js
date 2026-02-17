const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Enhanced Signup Route
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
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

// Profile Update Route
router.put("/profile", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userId = req.user.id; // Assuming user ID is extracted from JWT middleware
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

    const updatedData = {
      name,
      email,
      ...(hashedPassword && { password: hashedPassword }),
    };

    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true });
    res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: "Error updating profile" });
  }
});

module.exports = router;