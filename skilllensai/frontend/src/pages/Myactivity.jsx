
import React, { useEffect, useState } from "react";
import axios from "axios";

const MyActivity = () => {
  const [career, setCareer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchCareer();
  }, []);

  const fetchCareer = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("/api/career/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCareer(res.data);
    } catch (err) {
      setError("Failed to fetch activity");
    }
    setLoading(false);
  };

  function formatDate(dateStr) {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleString();
  }

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="max-w-xl mx-auto p-4 bg-white rounded shadow mt-8">
      <h1 className="text-2xl font-bold mb-4">My Activity</h1>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <div className="mb-4">
        <div className="font-semibold">Resume Upload Date:</div>
        <div>{career?.resumeUrl ? formatDate(career.updatedAt) : "Not uploaded yet"}</div>
      </div>
      <div className="mb-4">
        <div className="font-semibold">Result Upload Date:</div>
        <div>{career?.resultUrl ? formatDate(career.updatedAt) : "Not uploaded yet"}</div>
      </div>
      <div className="mb-4">
        <div className="font-semibold">Profile Created:</div>
        <div>{formatDate(career?.createdAt)}</div>
      </div>
      <div className="mb-4">
        <div className="font-semibold">Other Activity (future):</div>
        <div className="text-gray-500">Find job, ML results, etc. (coming soon)</div>
      </div>
    </div>
  );
};

export default MyActivity;