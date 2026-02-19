import React, { useEffect, useState } from "react";
import api from "../services/api";

const SkillLensCoach = () => {

  const [skills, setSkills] = useState([]); // extracted skills
  const [selected, setSelected] = useState([]); // selected skills
  const [loading, setLoading] = useState(false); // loading state

  // fetch extracted skills from backend
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await api.get("/career/skills");
        setSkills(res.data.skills || []);
      } catch (err) {
        console.log("error fetching skills");
      }
    };

    fetchSkills();
  }, []);

  // toggle checkbox
  const toggleSkill = (skill) => {
    if (selected.includes(skill)) {
      setSelected(selected.filter((s) => s !== skill));
    } else {
      setSelected([...selected, skill]);
    }
  };

  // save selected skills
  const saveSkills = async () => {
    try {
      setLoading(true);

      await api.post("/career/select-skills", {
        selectedSkills: selected,
      });

      alert("skills saved successfully");

    } catch (err) {
      alert("error saving skills");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">

      <h1 className="text-3xl font-bold mb-6">
        SkillLens AI Coach
      </h1>

      <p className="mb-8 text-gray-600">
        Select the skills you want to use for your job role evaluation.
      </p>

      {skills.length === 0 ? (
        <p className="text-red-500">
          No extracted skills found. Please upload resume first.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {skills.map((skill, index) => (
              <label
                key={index}
                className="flex items-center gap-2 border p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(skill)}
                  onChange={() => toggleSkill(skill)}
                />
                <span className="text-sm font-medium">
                  {skill}
                </span>
              </label>
            ))}
          </div>

          <button
            onClick={saveSkills}
            disabled={loading || selected.length === 0}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? "Saving..." : "Submit My Job Role Skills"}
          </button>
        </>
      )}

    </div>
  );
};

export default SkillLensCoach;
