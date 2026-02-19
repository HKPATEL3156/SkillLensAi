

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import defaultAvatar from "../assets/default-avatar.svg";


const Settings = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    username: "",
    dob: "",
    qualification: "",
    phone: "",
    address: "",
    gender: "",
    bio: "",
    profilePhoto: "",
  });
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState("");
  const [password, setPassword] = useState({ old: "", new: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const token = localStorage.getItem("token");
  const nav = useNavigate();
  const photoInputRef = useRef();


  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line
  }, []);

  const fetchProfile = async () => {
    setError("");
    try {
      const res = await axios.get("/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data?.user || {};
      setProfile({
        name: data.name || "",
        email: data.email || "",
        username: data.username || "",
        dob: data.dob ? data.dob.substring(0, 10) : "",
        qualification: data.qualification || "",
        phone: data.phone || "",
        address: data.address || "",
        gender: data.gender || "",
        bio: data.bio || "",
        profilePhoto: data.profilePhoto || "",
      });
      setProfilePhotoPreview(data.profilePhoto || "");
    } catch {
      setError("Failed to fetch profile");
    }
  };


  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    try {
      // Update profile fields except email/username
      await axios.put("/api/auth/profile", profile, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Profile updated");
      fetchProfile();
    } catch {
      setError("Failed to update profile");
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
    setError(""); setSuccess("");
    if (!profilePhotoFile) return setError("Please select a photo");
    const formData = new FormData();
    formData.append("profilePhoto", profilePhotoFile);
    try {
      const res = await axios.post("/api/auth/profile/photo", formData, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
      });
      setSuccess("Profile photo updated");
      setProfile({ ...profile, profilePhoto: res.data.profilePhoto });
      setProfilePhotoFile(null);
      fetchProfile();
    } catch {
      setError("Failed to upload photo");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    try {
      await axios.post("/api/auth/change-password", password, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Password changed");
      setPassword({ old: "", new: "" });
    } catch {
      setError("Failed to change password");
    }
  };

  const handleDelete = async () => {
    setError(""); setSuccess("");
    if (!window.confirm("Are you sure you want to delete your account?")) return;
    try {
      await axios.delete("/api/auth/delete-account", {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.removeItem("token");
      nav("/login");
    } catch {
      setError("Failed to delete account");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    nav("/login");
  };


  return (
    <div className="max-w-2xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl shadow-xl mt-10">
      <h1 className="text-3xl font-extrabold mb-6 text-blue-800">Settings</h1>
      {error && <div className="text-red-600 mb-2 font-semibold">{error}</div>}
      {success && <div className="text-green-600 mb-2 font-semibold">{success}</div>}

      {/* Profile Photo Section */}
      <div className="flex items-center gap-6 mb-8">
        <div className="relative">
          <img
            src={profilePhotoPreview || profile.profilePhoto || defaultAvatar}
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-blue-400 shadow-lg object-cover bg-white"
          />
          <button
            className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 shadow-lg hover:bg-blue-700"
            onClick={() => photoInputRef.current.click()}
            title="Change Photo"
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
        </div>
        <form onSubmit={handleProfilePhotoUpload} className="flex flex-col gap-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
            disabled={!profilePhotoFile}
          >
            Upload Photo
          </button>
        </form>
      </div>

      {/* Profile Info Form */}
      <form onSubmit={handleProfileUpdate} className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-xl shadow">
        <div>
          <label className="block font-semibold mb-1">Name</label>
          <input className="border p-2 rounded w-full" type="text" value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} required />
        </div>
        <div>
          <label className="block font-semibold mb-1">Email</label>
          <input className="border p-2 rounded w-full bg-gray-100" type="email" value={profile.email} disabled />
        </div>
        <div>
          <label className="block font-semibold mb-1">Username</label>
          <input className="border p-2 rounded w-full bg-gray-100" type="text" value={profile.username} disabled />
        </div>
        <div>
          <label className="block font-semibold mb-1">Date of Birth</label>
          <input className="border p-2 rounded w-full" type="date" value={profile.dob} onChange={e => setProfile({ ...profile, dob: e.target.value })} />
        </div>
        <div>
          <label className="block font-semibold mb-1">Qualification</label>
          <input className="border p-2 rounded w-full" type="text" value={profile.qualification} onChange={e => setProfile({ ...profile, qualification: e.target.value })} />
        </div>
        <div>
          <label className="block font-semibold mb-1">Phone</label>
          <input className="border p-2 rounded w-full" type="text" value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} />
        </div>
        <div>
          <label className="block font-semibold mb-1">Address</label>
          <input className="border p-2 rounded w-full" type="text" value={profile.address} onChange={e => setProfile({ ...profile, address: e.target.value })} />
        </div>
        <div>
          <label className="block font-semibold mb-1">Gender</label>
          <select className="border p-2 rounded w-full" value={profile.gender} onChange={e => setProfile({ ...profile, gender: e.target.value })}>
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block font-semibold mb-1">Bio</label>
          <textarea className="border p-2 rounded w-full" rows={3} value={profile.bio} onChange={e => setProfile({ ...profile, bio: e.target.value })} />
        </div>
        <div className="md:col-span-2 flex justify-end">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700" type="submit">Save Changes</button>
        </div>
      </form>

      {/* Password Change */}
      <form onSubmit={handlePasswordChange} className="mb-8 bg-white p-6 rounded-xl shadow grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block font-semibold mb-1">Old Password</label>
          <input className="border p-2 rounded w-full" type="password" placeholder="Old Password" value={password.old} onChange={e => setPassword({ ...password, old: e.target.value })} />
        </div>
        <div>
          <label className="block font-semibold mb-1">New Password</label>
          <input className="border p-2 rounded w-full" type="password" placeholder="New Password" value={password.new} onChange={e => setPassword({ ...password, new: e.target.value })} />
        </div>
        <div className="md:col-span-2 flex justify-end">
          <button className="bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700" type="submit">Change Password</button>
        </div>
      </form>

      {/* Delete Account */}
      <div className="mb-6 bg-white p-6 rounded-xl shadow flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="font-semibold mb-2 text-red-700">Delete Account</h2>
          <p className="text-gray-600 text-sm mb-2">This action is irreversible. All your data will be deleted.</p>
        </div>
        <button className="bg-red-600 text-white px-6 py-2 rounded-lg shadow hover:bg-red-700" onClick={handleDelete}>Delete Account</button>
      </div>

      <div className="flex justify-end">
        <button className="bg-gray-600 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-700" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Settings;