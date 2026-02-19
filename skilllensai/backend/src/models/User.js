const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true, unique: true }, // set-once
  dob: { type: Date },
  qualification: { type: String },
  phone: { type: String },
  address: { type: String },
  profilePhoto: { type: String }, // URL or filename
  gender: { type: String },
  bio: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);