const mongoose = require("mongoose");

const careerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    resumeUrl: {
      type: String,
    },

    careerGoal: String,

    skills: [String],

    jobPreferences: {
      preferredRole: String,
      preferredLocation: String,
      expectedSalary: String,
    },

    workExperience: [
      {
        company: String,
        role: String,
        duration: String,
        description: String,
      },
    ],

    education: [
      {
        institution: String,
        degree: String,
        year: String,
      },
    ],

    certifications: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Career", careerSchema);
