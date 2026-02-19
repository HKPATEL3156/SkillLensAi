import React, { useState, useEffect } from "react";
import { getCareer, updateCareer, uploadResume, downloadResume } from "../services/api";

const MyCareer = () => {
  const [form, setForm] = useState({
    careerGoal: "",
    preferredRole: "",
    preferredLocation: "",
    expectedSalary: "",
    skills: [],
    certifications: [],
    workExperience: [
      { company: "", role: "", duration: "", description: "" },
    ],
    education: [
      { institution: "", degree: "", fieldOfStudy: "", startYear: "", endYear: "" },
    ],
    projects: [
      { title: "", description: "", technologies: [], link: "" },
    ],
    achievements: [],
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeName, setResumeName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [skillInput, setSkillInput] = useState("");

  useEffect(() => {
    fetchCareer();
  }, []);

  const fetchCareer = async () => {
    setError("");
    try {
        const res = await getCareer();
        if (res.data) {
          setForm({
            ...form,
            ...res.data,
            education: Array.isArray(res.data.education) && res.data.education.length > 0 ? res.data.education : [{ institution: "", degree: "", fieldOfStudy: "", startYear: "", endYear: "" }],
            workExperience: Array.isArray(res.data.workExperience) && res.data.workExperience.length > 0 ? res.data.workExperience : [{ company: "", role: "", duration: "", description: "" }],
            skills: Array.isArray(res.data.skills) ? res.data.skills : [],
            projects: Array.isArray(res.data.projects) && res.data.projects.length > 0 ? res.data.projects : [{ title: "", description: "", technologies: [], link: "" }],
            achievements: Array.isArray(res.data.achievements) ? res.data.achievements : [],
          });
          setResumeName(res.data.resumeUrl ? res.data.resumeUrl.split("/").pop() : "");
        }
      } catch {
        setError("Failed to fetch career info");
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
      setError(""); setSuccess("");
      try {
        await updateCareer(form);
        setSuccess("Career profile updated successfully");
        fetchCareer();
      } catch {
        setError("Failed to update career profile");
      }
    };

    const handleResumeUpload = async () => {
      setError(""); setSuccess("");
      if (!resumeFile) return setError("Please select a PDF file");
      try {
        await uploadResume(resumeFile);
        setSuccess("Resume uploaded successfully");
        setResumeFile(null);
        fetchCareer();
      } catch (err) {
        setError(err.response?.data?.message || "Failed to upload resume");
      }
    };

    const handleResumeDownload = async () => {
      setError("");
      try {
        const res = await downloadResume();
        const blob = new Blob([res.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = resumeName || "resume.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch {
        setError("Failed to download resume");
      }
    };

    const addSkill = () => {
      if (skillInput.trim()) {
        setForm({ ...form, skills: [...form.skills, skillInput.trim()] });
        setSkillInput("");
      }
    };

    return (
      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">My Career Profile</h1>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        {success && <div className="text-green-600 mb-2">{success}</div>}

        {/* Resume Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Uploaded Resume</h2>
          {resumeName ? (
            <div className="flex items-center gap-4">
              <span>{resumeName}</span>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg" onClick={handleResumeDownload}>Download Resume</button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <span className="text-gray-500">No resume uploaded yet.</span>
              <input type="file" accept="application/pdf" onChange={e => setResumeFile(e.target.files[0])} />
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg" onClick={handleResumeUpload}>Upload Resume</button>
            </div>
          )}
        </div>

        {/* Prevent blank page: Only render form if form is defined */}
        {form && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Career Goal */}
            <div>
              <label className="block font-medium mb-2">Career Goal</label>
              <textarea name="careerGoal" value={form.careerGoal} onChange={handleChange} className="w-full border p-3 rounded-lg" />
            </div>
            {/* Job Preferences */}
            <div className="grid grid-cols-3 gap-4">
              <input type="text" name="preferredRole" placeholder="Preferred Role" value={form.preferredRole} onChange={handleChange} className="border p-3 rounded-lg" />
              <input type="text" name="preferredLocation" placeholder="Preferred Location" value={form.preferredLocation} onChange={handleChange} className="border p-3 rounded-lg" />
              <input type="text" name="expectedSalary" placeholder="Expected Salary" value={form.expectedSalary} onChange={handleChange} className="border p-3 rounded-lg" />
            </div>
            {/* Skills */}
            <div>
              <label className="block font-medium mb-2">Skills</label>
              <div className="flex gap-2 mb-2">
                <input type="text" value={skillInput} onChange={e => setSkillInput(e.target.value)} className="border p-2 rounded-lg w-full" />
                <button type="button" onClick={addSkill} className="bg-blue-600 text-white px-4 rounded-lg">Add</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {form.skills.map((skill, index) => (
                  <span key={index} className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">{skill}</span>
                ))}
              </div>
            </div>
            {/* Work Experience */}
            <div>
              <label className="block font-medium mb-2">Work Experience</label>
              {(Array.isArray(form.workExperience) ? form.workExperience : []).map((exp, index) => (
                <div key={index} className="space-y-2">
                  <input type="text" placeholder="Company" value={exp.company} onChange={e => handleNestedChange(index, "company", e.target.value, "workExperience")} className="border p-3 rounded-lg w-full" />
                  <input type="text" placeholder="Role" value={exp.role} onChange={e => handleNestedChange(index, "role", e.target.value, "workExperience")} className="border p-3 rounded-lg w-full" />
                  <input type="text" placeholder="Duration" value={exp.duration} onChange={e => handleNestedChange(index, "duration", e.target.value, "workExperience")} className="border p-3 rounded-lg w-full" />
                  <textarea placeholder="Description" value={exp.description} onChange={e => handleNestedChange(index, "description", e.target.value, "workExperience")} className="border p-3 rounded-lg w-full" />
                </div>
              ))}
              <button type="button" onClick={() => addNestedField("workExperience", { company: "", role: "", duration: "", description: "" })} className="bg-blue-600 text-white px-4 py-2 rounded-lg mt-2">Add Work Experience</button>
            </div>
            {/* Add similar sections for education, certifications, projects, and achievements */}
            <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">Save Career Profile</button>
          </form>
        )}
      </div>
    );
  };

  export default MyCareer;
