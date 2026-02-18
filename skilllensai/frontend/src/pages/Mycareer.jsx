import React, { useState, useEffect } from "react";
import axios from "axios";

const MyCareer = () => {
  const [form, setForm] = useState({
    careerGoal: "",
    preferredRole: "",
    preferredLocation: "",
    expectedSalary: "",
    skills: [],
    certifications: [],
  });

  const [resume, setResume] = useState(null);
  const [skillInput, setSkillInput] = useState("");

  useEffect(() => {
    fetchCareer();
  }, []);

  const fetchCareer = async () => {
    const res = await axios.get("/api/career/get");
    if (res.data) {
      setForm(res.data);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addSkill = () => {
    if (skillInput.trim()) {
      setForm({ ...form, skills: [...form.skills, skillInput] });
      setSkillInput("");
    }
  };

  const handleFileChange = (e) => {
    setResume(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    Object.keys(form).forEach((key) => {
      data.append(key, form[key]);
    });

    if (resume) {
      data.append("resume", resume);
    }

    await axios.post("/api/career/save", data);
    alert("Career profile updated");
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">

      <h1 className="text-3xl font-bold mb-6">
        My Career Profile
      </h1>

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
          <label className="block font-medium mb-2">
            Upload Resume (PDF)
          </label>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Save Career Profile
        </button>
      </form>
    </div>
  );
};

export default MyCareer;
