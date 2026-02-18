import React, { useState, useEffect } from "react";
import axios from "axios";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught in ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong. Please try again later.</h1>;
    }

    return this.props.children;
  }
}

const MyCareer = () => {
  const [form, setForm] = useState({
    careerGoal: "",
    preferredRole: "",
    preferredLocation: "",
    expectedSalary: "",
    skills: [],
    certifications: [],
    workExperience: [
      {
        company: "",
        role: "",
        duration: "",
        description: "",
      },
    ],
    education: [
      {
        institution: "",
        degree: "",
        fieldOfStudy: "",
        startYear: "",
        endYear: "",
      },
    ],
    projects: [
      {
        title: "",
        description: "",
        technologies: [],
        link: "",
      },
    ],
    achievements: [],
  });


  const [resume, setResume] = useState(null);
  const [skillInput, setSkillInput] = useState("");

  useEffect(() => {
    fetchCareer();
    fetchResume(); // Ensure resume is fetched on every visit
  }, []);

  const fetchCareer = async () => {
  try {
    const res = await axios.get("/api/career/get");

    if (res.data) {
      setForm({
        careerGoal: res.data.careerGoal || "",
        preferredRole: res.data.jobPreferences?.preferredRole || "",
        preferredLocation: res.data.jobPreferences?.preferredLocation || "",
        expectedSalary: res.data.jobPreferences?.expectedSalary || "",
        skills: res.data.skills || [],
        certifications: res.data.certifications || [],
        workExperience: res.data.workExperience || [],
        education: res.data.education || [],
        projects: res.data.projects || [],
        achievements: res.data.achievements || [],
      });
    }
  } catch (err) {
    console.log("error loading career data");
  }
};

const fetchResume = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/career/resume", {
        params: { userId: "63f1a2b3c4d5e6f7g8h9i0j1" }, // Replace with the actual MongoDB ObjectId of the user
      });

      if (res.data && res.data.resumeUrl) {
        console.log("Resume URL fetched:", res.data.resumeUrl);
        setResume(res.data.resumeUrl);
      } else {
        console.warn("No resume found for the user");
        setResume(null); // Clear resume if not found
      }
    } catch (err) {
      console.error("Error fetching resume:", err);
      setResume(null); // Handle error by clearing resume
    }
  };

  const handleResumeUpload = async () => {
    if (!resume) {
      alert("Please select a resume to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("userId", "63f1a2b3c4d5e6f7g8h9i0j1"); // Replace with the actual MongoDB ObjectId of the user

    console.log("Uploading resume with userId:", "63f1a2b3c4d5e6f7g8h9i0j1");
    console.log("File to upload:", resume);

    try {
      const res = await axios.post("http://localhost:5000/api/career/resume/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data && res.data.success) {
        alert("Resume uploaded successfully.");
        setResume(res.data.resumeUrl); // Update the resume URL
      } else {
        alert("Failed to upload resume.");
      }
    } catch (err) {
      console.error("Error uploading resume:", err);
      alert("An error occurred while uploading the resume.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleNestedChange = (index, field, value, key) => {
    const updatedArray = [...form[key]];
    updatedArray[index][field] = value;
    setForm({ ...form, [key]: updatedArray });
  };

  const addNestedField = (key, newField) => {
    setForm({ ...form, [key]: [...form[key], newField] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/career/save", form);
      alert("Career profile updated successfully");
    } catch (err) {
      console.error("Error saving career profile:", err);
      alert("Failed to update career profile");
    }
  };

  const addSkill = () => {
    if (skillInput.trim()) {
      setForm({ ...form, skills: [...form.skills, skillInput.trim()] });
      setSkillInput("");
    }
  };

  return (
    <ErrorBoundary>
      <div className="p-6 max-w-5xl mx-auto">

        <h1 className="text-3xl font-bold mb-6">
          My Career Profile
        </h1>

        {resume ? (
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">Uploaded Resume</h2>
            <a
              href={`http://localhost:5000/uploads/${resume}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              Download Resume
            </a>
          </div>
        ) : (
          <p className="text-gray-500">No resume uploaded yet.</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Career Goal */}
          <div>
            <label className="block font-medium mb-2">
              Career Goal
            </label>
            <textarea
              name="careerGoal"
              value={form.careerGoal}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
            />
          </div>

          {/* Job Preferences */}
          <div className="grid grid-cols-3 gap-4">
            <input
              type="text"
              name="preferredRole"
              placeholder="Preferred Role"
              value={form.preferredRole}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />

            <input
              type="text"
              name="preferredLocation"
              placeholder="Preferred Location"
              value={form.preferredLocation}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />

            <input
              type="text"
              name="expectedSalary"
              placeholder="Expected Salary"
              value={form.expectedSalary}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />
          </div>

          {/* Skills */}
          <div>
            <label className="block font-medium mb-2">
              Skills
            </label>

            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                className="border p-2 rounded-lg w-full"
              />
              <button
                type="button"
                onClick={addSkill}
                className="bg-blue-600 text-white px-4 rounded-lg"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {form.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Resume Upload */}
          <div>
            <label className="block font-medium mb-2">Upload Resume</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setResume(e.target.files[0])}
              className="border p-3 rounded-lg w-full"
            />
          </div>

          {/* Work Experience */}
          <div>
            <label className="block font-medium mb-2">
              Work Experience
            </label>
            {form.workExperience.map((exp, index) => (
              <div key={index} className="space-y-2">
                <input
                  type="text"
                  placeholder="Company"
                  value={exp.company}
                  onChange={(e) =>
                    handleNestedChange(index, "company", e.target.value, "workExperience")
                  }
                  className="border p-3 rounded-lg w-full"
                />
                <input
                  type="text"
                  placeholder="Role"
                  value={exp.role}
                  onChange={(e) =>
                    handleNestedChange(index, "role", e.target.value, "workExperience")
                  }
                  className="border p-3 rounded-lg w-full"
                />
                <input
                  type="text"
                  placeholder="Duration"
                  value={exp.duration}
                  onChange={(e) =>
                    handleNestedChange(index, "duration", e.target.value, "workExperience")
                  }
                  className="border p-3 rounded-lg w-full"
                />
                <textarea
                  placeholder="Description"
                  value={exp.description}
                  onChange={(e) =>
                    handleNestedChange(index, "description", e.target.value, "workExperience")
                  }
                  className="border p-3 rounded-lg w-full"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                addNestedField("workExperience", {
                  company: "",
                  role: "",
                  duration: "",
                  description: "",
                })
              }
              className="bg-blue-600 text-white px-4 py-2 rounded-lg mt-2"
            >
              Add Work Experience
            </button>
          </div>

          {/* Add similar sections for education, certifications, projects, and achievements */}

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Save Career Profile
          </button>
          <button
            type="button"
            onClick={handleResumeUpload}
            className="bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            Upload Resume
          </button>
        </form>
      </div>
    </ErrorBoundary>
  );
};

export default MyCareer;
