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
        fieldOfStudy: String,
        startYear: Number,
        endYear: Number,
      },
    ],

    certifications: [
      {
        name: String,
        issuingOrganization: String,
        issueDate: Date,
        expirationDate: Date,
        credentialId: String,
        credentialUrl: String,
      },
    ],

    projects: [
      {
        title: String,
        description: String,
        technologies: [String],
        link: String,
      },
    ],

    achievements: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Career", careerSchema);
