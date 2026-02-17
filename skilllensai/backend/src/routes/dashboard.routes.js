const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Middleware to authenticate user
const authenticate = require("../middleware/auth.middleware");

// Dashboard Route
router.get("/", authenticate, async (req, res) => {
  try {
    const userId = req.user.id; // Extracted from JWT middleware
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
router.put("/profile", authenticate, async (req, res) => {
  const { name, email, phone, address, education, birthdate, cgpa, skills, links, password } = req.body;

  try {
    const userId = req.user.id;
    const updateData = { name, email, phone, address, education, birthdate, cgpa, skills, links };

    if (password) {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(password)) {
        return res.status(400).json({ error: "Password must be strong." });
      }
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    res.status(500).json({ error: "Error updating profile" });
  }
});

module.exports = router;