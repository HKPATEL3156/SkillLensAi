
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import defaultAvatar from "../assets/default-avatar.svg";


const Dheader = ({ toggleSidebar }) => {
  const [openMenu, setOpenMenu] = useState(null);
  const [user, setUser] = useState({ name: "", profilePhoto: "" });
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line
  }, []);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data?.user || {};
      setUser({
        name: data.name || "",
        profilePhoto: data.profilePhoto || "",
      });
    } catch {
      setUser({ name: "", profilePhoto: "" });
    }
  };

  // close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-blue-600 text-white h-16 flex items-center justify-between px-6 shadow-md z-50">
      
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleSidebar}
          className="text-white text-2xl focus:outline-none"
        >
          ☰
        </button>

        <Link to="/dashboard" className="flex items-center">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-xl shadow-lg">
              <i className="fas fa-brain text-white text-xl"></i>
            </div>

            <span className="text-white text-3xl font-extrabold tracking-wide">
              SkillLens <span className="text-yellow-400">AI</span>
            </span>
          </div>
        </Link>
      </div>

      {/* Right Section */}
      <div ref={menuRef} className="flex items-center space-x-6 relative">

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => toggleMenu("notification")}
            className="text-white text-xl hover:text-yellow-300 transition duration-200"
          >
            🔔
          </button>

          {openMenu === "notification" && (
            <div className="absolute right-0 mt-3 w-56 bg-white text-black rounded-xl shadow-xl border py-3 px-4 animate-fadeIn">
              <p className="text-sm text-gray-600">
                No new notifications
              </p>
            </div>
          )}
        </div>

        {/* Settings */}
        <div className="relative">
          <button
            onClick={() => toggleMenu("settings")}
            className="text-white text-xl hover:text-yellow-300 transition duration-200"
          >
            ⚙️
          </button>

          {openMenu === "settings" && (
            <div className="absolute right-0 mt-3 w-48 bg-white text-black rounded-xl shadow-xl border py-2">
              <Link
                to="/dashboard/settings"
                className="block px-4 py-2 text-sm hover:bg-gray-100 transition duration-200"
              >
                Settings
              </Link>
            </div>
          )}
        </div>

        {/* Account Menu */}
        <div className="relative">
          <button
            onClick={() => toggleMenu("account")}
            className="flex items-center space-x-2 hover:text-yellow-300 transition duration-200"
          >
            <img
              src={user.profilePhoto || defaultAvatar}
              alt="Profile"
              className="w-9 h-9 rounded-full border-2 border-white object-cover bg-white"
            />
            <span className="hidden md:block font-medium">
              {user.name || "My Profile"}
            </span>
          </button>

          {openMenu === "account" && (
            <div className="absolute right-0 mt-3 w-52 bg-white text-black rounded-xl shadow-xl border py-2">
              <Link
                to="/dashboard/profile"
                className="block px-4 py-2 text-sm hover:bg-gray-100 transition duration-200"
              >
                My Profile
              </Link>

              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition duration-200"
              >
                Logout
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default Dheader;
