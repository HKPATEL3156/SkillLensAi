import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api, { getQuestions, startQuiz, submitQuiz, getQuizAttempts } from "../services/api";

const Step = ({ idx, title, open, onToggle, locked }) => (
  <div className="border rounded-md p-3 mb-3 bg-white">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${locked ? 'bg-gray-300' : 'bg-blue-600 text-white'}`}>{idx}</div>
        <div className="font-semibold">{title}</div>
      </div>
      <div className="flex items-center gap-3">
        {locked ? <span className="text-sm text-gray-400">Locked</span> : <button onClick={onToggle} className="text-lg">{open ? '−' : '+'}</button>}
      </div>
    </div>
    {open && !locked && <div className="mt-3 text-sm text-gray-700">{/** children rendered by parent */}</div>}
  </div>
);

const SkillLensCoach = () => {
  const [skills, setSkills] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openStep, setOpenStep] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [career, setCareer] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetch = async () => {
      try {
        const s = await api.get("/career/skills");
        setSkills(s.data.skills || []);
      } catch (e) {}
      try {
        const me = await api.get("/career/me");
        setCareer(me.data || null);
        if (me.data && Array.isArray(me.data.selectedSkills)) setSelected(me.data.selectedSkills || []);
      } catch (e) {}
      try {
        const res = await getQuizAttempts();
        setAttempts(res.data.attempts || []);
      } catch (e) {}
    };
    fetch();
  }, []);

  useEffect(() => {
    if (location.state && location.state.marks !== undefined) {
      alert(`Quiz completed: ${location.state.marks} marks`);
      // refresh attempts
      getQuizAttempts().then((r) => setAttempts(r.data.attempts || [])).catch(()=>{});
      // clear state
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const toggleSkill = (skill) => {
    if (selected.includes(skill)) setSelected(selected.filter((s) => s !== skill));
    else setSelected([...selected, skill]);
  };

  const saveSkills = async () => {
    try {
      setLoading(true);
      await api.post("/career/select-skills", { selectedSkills: selected });
      alert("Skills saved");
    } catch (e) {
      alert("Error saving skills");
    } finally {
      setLoading(false);
    }
  };

  const resetSkills = async () => {
    try {
      setSelected([]);
      await api.post("/career/select-skills", { selectedSkills: [] });
    } catch (e) {}
  };

  const handleStartQuiz = async () => {
    if (selected.length === 0) return alert("Select at least one skill first");
    try {
      const resp = await startQuiz({ skills: selected, quizName: "SkillLens Quiz" });
      const { attemptId } = resp.data;
      // Open exam in dedicated full-screen route that hides dashboard layout
      navigate(`/exam?attemptId=${attemptId}`);
    } catch (e) {
      alert("Failed to start quiz");
    }
  };

  // lock logic: step1 unlocked if skills extracted present; step2 unlocked if selectedSkills saved or selected non-empty; step3 unlocked if a submitted attempt exists; step4 unlocked if step3 and result report exists
  const step1Done = skills && skills.length > 0;
  const step2Done = attempts.some(a => a.status === 'submitted');
  const step3Done = step2Done; // simplified: result report depends on submitted quiz
  const step1Locked = false;
  const step2Locked = !step1Done || (selected.length===0 && !(career && career.selectedSkills && career.selectedSkills.length>0));
  const step3Locked = !step2Done;
  const step4Locked = !step3Done;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">SkillLens AI Coach</h1>
      <p className="mb-6 text-gray-600">Follow the steps to extract skills, take quiz, review results and get career recommendation.</p>

      {/* Steps */}
      <div className="mb-6">
        <div className="text-sm font-medium mb-2">Steps</div>
        <div>
          <Step idx={1} title="1. Extract Skills from Resume" open={openStep===1} onToggle={() => setOpenStep(openStep===1?null:1)} locked={step1Locked} />
          {openStep===1 && !step1Locked && (
            <div className="mb-4">
              {!step1Done ? (
                <div className="text-red-500">No extracted skills found. Please upload resume first.</div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {skills.map((skill,i)=> (
                    <label key={i} className="flex items-center gap-2 border p-2 rounded cursor-pointer">
                      <input type="checkbox" checked={selected.includes(skill)} onChange={()=>toggleSkill(skill)} />
                      <span className="text-sm">{skill}</span>
                    </label>
                  ))}
                </div>
              )}
              <div className="mt-3 flex gap-3">
                <button onClick={saveSkills} disabled={loading || selected.length===0} className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60">{loading? 'Saving...':'Save Skills'}</button>
                <button onClick={resetSkills} className="bg-gray-200 px-4 py-2 rounded">Reset</button>
              </div>
            </div>
          )}

          <Step idx={2} title="2. Take Skill Quiz" open={openStep===2} onToggle={() => setOpenStep(openStep===2?null:2)} locked={step2Locked} />
          {openStep===2 && !step2Locked && (
            <div className="mb-4">
              <div className="mb-3 text-sm text-gray-700">Selected skills: {selected.join(", ") || 'None'}</div>
              <div className="flex gap-3">
                <button onClick={handleStartQuiz} className="bg-green-600 text-white px-4 py-2 rounded">Start Quiz</button>
              </div>
            </div>
          )}

          <Step idx={3} title="3. Result Report" open={openStep===3} onToggle={() => setOpenStep(openStep===3?null:3)} locked={step3Locked} />
          {openStep===3 && !step3Locked && (
            <div className="mb-4">
              <div className="text-sm text-gray-700">Results combine academic scores and quiz marks. Use the "Submit Result Report" button to push final report.</div>
              <div className="mt-3">
                <button className="bg-indigo-600 text-white px-4 py-2 rounded">Submit Result Report</button>
              </div>
            </div>
          )}

          <Step idx={4} title="4. Career Recommendation" open={openStep===4} onToggle={() => setOpenStep(openStep===4?null:4)} locked={step4Locked} />
          {openStep===4 && !step4Locked && (
            <div className="mb-4">
              <div className="text-sm text-gray-700">Recommendations will be shown based on quiz marks and academic score.</div>
            </div>
          )}
        </div>
      </div>

      {/* Attempts Table */}
      <div className="mt-6 bg-white p-4 rounded shadow">
        <div className="flex items-center justify-between mb-3">
          <div className="text-lg font-semibold">Quiz Attempts</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-sm">
            <thead>
              <tr className="text-left bg-gray-100">
                <th className="p-2">No</th>
                <th className="p-2">Date</th>
                <th className="p-2">Skills</th>
                <th className="p-2">Quiz</th>
                <th className="p-2">Total</th>
                <th className="p-2">Obtained</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {attempts.length === 0 && (
                <tr><td colSpan={7} className="p-4 text-center text-gray-500">No quiz attempts yet</td></tr>
              )}
              {attempts.map((a, idx) => (
                <tr key={a._id} className="border-t">
                  <td className="p-2">{idx+1}</td>
                  <td className="p-2">{new Date(a.createdAt).toLocaleString()}</td>
                  <td className="p-2">{(a.skills||[]).join(", ")}</td>
                  <td className="p-2">{a.quizName}</td>
                  <td className="p-2">{a.totalMarks || 100}</td>
                  <td className="p-2">{a.obtainedMarks || 0}</td>
                  <td className="p-2">{a.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SkillLensCoach;
