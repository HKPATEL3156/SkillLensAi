const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, unique: true },
  dob: { type: Date },
  qualification: { type: String },
  phone: { type: String },
  address: { type: String },
  profilePhoto: { type: String },
  gender: { type: String },
  bio: { type: String },
  createdAt: { type: Date, default: Date.now },
  // Link to career profile (one-to-one)
  career: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Career",
  },
});

module.exports = mongoose.model("User", userSchema);
