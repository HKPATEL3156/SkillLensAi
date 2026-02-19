const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

// load env variables
dotenv.config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// Ensure uploads/resumes and uploads/profile-photos directories exist
const fs = require("fs");
const resumesDir = path.join(__dirname, "uploads/resumes");
const profilePhotosDir = path.join(__dirname, "uploads/profile-photos");
if (!fs.existsSync(resumesDir)) {
  fs.mkdirSync(resumesDir, { recursive: true });
}
if (!fs.existsSync(profilePhotosDir)) {
  fs.mkdirSync(profilePhotosDir, { recursive: true });
}
// serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// import routes
const careerRoutes = require("./src/routes/careerRoutes");
const authRoutes = require("./src/routes/auth.routes");

// use routes
app.use("/api/career", careerRoutes);
app.use("/api/auth", authRoutes);

// connect to mongodb
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("mongodb connected successfully");
  } catch (error) {
    console.error("mongodb connection failed:", error.message);
    process.exit(1);
  }
};

// start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`server running on http://localhost:${PORT}`);
  await connectDB();
});
