

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import defaultAvatar from "../assets/default-avatar.svg";


const MyProfile = () => {
  const [activities, setActivities] = useState([]);
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editProfile, setEditProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [resumeFile, setResumeFile] = useState(null);
  const [resultFile, setResultFile] = useState(null);
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState("");
  const [resumeSuccess, setResumeSuccess] = useState("");
  const [resultSuccess, setResultSuccess] = useState("");
  const [photoSuccess, setPhotoSuccess] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const token = localStorage.getItem("token");
  const photoInputRef = useRef();


  useEffect(() => {
    fetchProfile();
    fetchActivities();
    // eslint-disable-next-line
  }, []);

  const fetchActivities = async () => {
    try {
      const res = await axios.get("/api/activity/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setActivities(res.data || []);
    } catch {
      setActivities([]);
    }
  };
      {/* Activity Log */}
      <div className="mb-6">
        <h2 className="font-semibold text-lg mb-2">Recent Activity</h2>
        <div className="bg-white rounded-xl shadow p-4 max-h-48 overflow-y-auto">
          {activities.length === 0 ? (
            <div className="text-gray-500">No recent activity.</div>
          ) : (
            <ul className="space-y-2">
              {activities.map((a, i) => (
                <li key={a._id || i} className="text-sm text-gray-700 flex justify-between items-center">
                  <span>{a.message}</span>
                  <span className="text-gray-400 text-xs ml-2">{new Date(a.createdAt).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

  const fetchProfile = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data?.user || {});
    } catch (err) {
      setError("Failed to fetch profile");
    }
    setLoading(false);
  };

  const handleEdit = () => {
    setEditProfile({ ...profile });
    setEditMode(true);
    setSuccess("");
    setError("");
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    try {
      await axios.put("/api/auth/profile", editProfile, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Profile updated");
      setEditMode(false);
      fetchProfile();
    } catch {
      setError("Failed to update profile");
    }
  };

  const handleEditCancel = () => {
    setEditMode(false);
    setEditProfile({});
    setError("");
    setSuccess("");
  };

  const handleUpload = async (type) => {
    setError("");
    if (type === "resume") setResumeSuccess("");
    if (type === "result") setResultSuccess("");
    const file = type === "resume" ? resumeFile : resultFile;
    if (!file) return setError("Please select a PDF file");
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.post(`/api/career/upload-${type}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      fetchProfile();
      if (type === "resume") {
        setResumeFile(null);
        setResumeSuccess(res.data.message || "Resume uploaded successfully!");
        setTimeout(() => setResumeSuccess(""), 3000);
      }
      if (type === "result") {
        setResultFile(null);
        setResultSuccess(res.data.message || "Result uploaded successfully!");
        setTimeout(() => setResultSuccess(""), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || `Failed to upload ${type}`);
    }
  };

  const handleProfilePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhotoFile(file);
      setProfilePhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleProfilePhotoUpload = async (e) => {
    e.preventDefault();
    setError(""); setPhotoSuccess("");
    if (!profilePhotoFile) return setError("Please select a photo");
    const formData = new FormData();
    formData.append("profilePhoto", profilePhotoFile);
    try {
      const res = await axios.post("/api/auth/profile/photo", formData, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
      });
      setPhotoSuccess(res.data.message || "Profile photo updated!");
      setProfilePhotoFile(null);
      setProfilePhotoPreview("");
      fetchProfile();
      setTimeout(() => setPhotoSuccess(""), 3000);
    } catch {
      setError("Failed to upload photo");
    }
  };

  const handleDownload = async (type) => {
    try {
      const res = await fetch(`/api/career/download-${type}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Download failed");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = (type === "resume" ? career.resumeUrl : career.resultUrl)?.split("/").pop() || `${type}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      setError(`Failed to download ${type}`);
    }
  };


  if (loading) return <div className="p-4">Loading...</div>;


  return (
    <div className="max-w-2xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl shadow-xl mt-10">
      <h1 className="text-3xl font-extrabold mb-6 text-blue-800 flex items-center justify-between">
        My Profile
        {!editMode && (
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 text-base"
            onClick={handleEdit}
          >
            Edit
          </button>
        )}
      </h1>
      {error && <div className="text-red-600 mb-2 font-semibold">{error}</div>}
      {success && <div className="text-green-600 mb-2 font-semibold">{success}</div>}

      {/* Profile Photo and Basic Info */}

      {/* Profile Photo and Basic Info */}
      <div className="flex items-center gap-8 mb-8">
        <div className="relative">
          <img
            src={profilePhotoPreview || profile?.profilePhoto || defaultAvatar}
            alt="Profile"
            className="w-28 h-28 rounded-full border-4 border-blue-400 shadow-lg object-cover bg-white"
          />
          <button
            className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 shadow-lg hover:bg-blue-700"
            onClick={() => photoInputRef.current.click()}
            title="Change Photo"
            type="button"
          >
            <i className="fas fa-camera"></i>
          </button>
          <input
            type="file"
            accept="image/*"
            ref={photoInputRef}
            className="hidden"
            onChange={handleProfilePhotoChange}
          />
          <form onSubmit={handleProfilePhotoUpload} className="flex flex-col gap-2 mt-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
              disabled={!profilePhotoFile}
            >
              Upload Photo
            </button>
            {photoSuccess && <span className="text-green-600 font-semibold text-sm mt-1">{photoSuccess}</span>}
          </form>
        </div>
        <div>
          <div className="text-2xl font-bold text-blue-900 mb-1">{profile?.name || "-"}</div>
          <div className="text-gray-700 mb-1">@{profile?.username || "-"}</div>
          <div className="text-gray-600">{profile?.email || "-"}</div>
        </div>
      </div>

      {/* Editable Profile Fields */}
      {editMode ? (
        <form onSubmit={handleEditSave} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-xl shadow mb-8">
          <div>
            <label className="block font-semibold mb-1">Name</label>
            <input className="border p-2 rounded w-full" type="text" name="name" value={editProfile.name || ""} onChange={handleEditChange} required />
          </div>
          <div>
            <label className="block font-semibold mb-1">Date of Birth</label>
            <input className="border p-2 rounded w-full" type="date" name="dob" value={editProfile.dob || ""} onChange={handleEditChange} />
          </div>
          <div>
            <label className="block font-semibold mb-1">Qualification</label>
            <input className="border p-2 rounded w-full" type="text" name="qualification" value={editProfile.qualification || ""} onChange={handleEditChange} />
          </div>
          <div>
            <label className="block font-semibold mb-1">Phone</label>
            <input className="border p-2 rounded w-full" type="text" name="phone" value={editProfile.phone || ""} onChange={handleEditChange} />
          </div>
          <div>
            <label className="block font-semibold mb-1">Gender</label>
            <select className="border p-2 rounded w-full" name="gender" value={editProfile.gender || ""} onChange={handleEditChange}>
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block font-semibold mb-1">Address</label>
            <input className="border p-2 rounded w-full" type="text" name="address" value={editProfile.address || ""} onChange={handleEditChange} />
          </div>
          <div className="md:col-span-2">
            <label className="block font-semibold mb-1">Bio</label>
            <textarea className="border p-2 rounded w-full" rows={3} name="bio" value={editProfile.bio || ""} onChange={handleEditChange} />
          </div>
          <div className="md:col-span-2 flex justify-end gap-4">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700" type="submit">Save</button>
            <button className="bg-gray-400 text-white px-6 py-2 rounded-lg shadow hover:bg-gray-500" type="button" onClick={handleEditCancel}>Cancel</button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-xl shadow mb-8">
          <div>
            <span className="font-semibold">Date of Birth:</span> {profile?.dob ? profile.dob.substring(0, 10) : "-"}
          </div>
          <div>
            <span className="font-semibold">Qualification:</span> {profile?.qualification || "-"}
          </div>
          <div>
            <span className="font-semibold">Phone:</span> {profile?.phone || "-"}
          </div>
          <div>
            <span className="font-semibold">Gender:</span> {profile?.gender || "-"}
          </div>
          <div className="md:col-span-2">
            <span className="font-semibold">Address:</span> {profile?.address || "-"}
          </div>
          <div className="md:col-span-2">
            <span className="font-semibold">Bio:</span> {profile?.bio || "-"}
          </div>
        </div>
      )}

      {/* Resume Section */}

      <div className="mb-6">
        <h2 className="font-semibold text-lg mb-1">My Resume</h2>
        {profile?.resumeUrl ? (
          <div className="flex items-center gap-4">
            <span>{profile.resumeUrl.split("/").pop()}</span>
            <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={() => handleDownload("resume")}>Download</button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <span className="text-gray-500">Not uploaded yet</span>
            <input type="file" accept="application/pdf" onChange={e => setResumeFile(e.target.files[0])} className="ml-4" />
            <button className="bg-green-600 text-white px-3 py-1 rounded ml-2" onClick={() => handleUpload("resume")}>Upload</button>
            {resumeSuccess && <span className="text-green-600 font-semibold text-sm ml-2">{resumeSuccess}</span>}
          </div>
        )}
      </div>

      {/* Result Section */}

      <div className="mb-6">
        <h2 className="font-semibold text-lg mb-1">My Result</h2>
        {profile?.resultUrl ? (
          <div className="flex items-center gap-4">
            <span>{profile.resultUrl.split("/").pop()}</span>
            <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={() => handleDownload("result")}>Download</button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <span className="text-gray-500">Not uploaded yet</span>
            <input type="file" accept="application/pdf" onChange={e => setResultFile(e.target.files[0])} className="ml-4" />
            <button className="bg-green-600 text-white px-3 py-1 rounded ml-2" onClick={() => handleUpload("result")}>Upload</button>
            {resultSuccess && <span className="text-green-600 font-semibold text-sm ml-2">{resultSuccess}</span>}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProfile;