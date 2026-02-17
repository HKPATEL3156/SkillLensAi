const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Import routes
const authRoutes = require("./src/routes/auth.routes");

// filepath: f:\devx\projectdev\sgp\skilllensai\backend\server.js
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1); // Exit process with failure
  }
};

// Routes
app.use("/api/auth", authRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  await connectDB(); // Connect to the database when the server starts
});