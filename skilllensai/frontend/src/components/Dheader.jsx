import React, { useState } from "react";
import { Link } from "react-router-dom";

const Dheader = ({ toggleSidebar }) => {
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const toggleAccountMenu = () => setIsAccountMenuOpen(!isAccountMenuOpen);
  const toggleNotification = () => setIsNotificationOpen(!isNotificationOpen);
  const toggleSettings = () => setIsSettingsOpen(!isSettingsOpen);

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
            {/* Icon Container */}
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-xl shadow-lg">
              <i className="fas fa-brain text-white text-xl"></i>
            </div>

            {/* Brand Name */}
            <span className="text-white text-3xl font-extrabold tracking-wide">
              SkillLens <span className="text-yellow-400">AI</span>
            </span>
          </div>
        </Link>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-6 relative">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={toggleNotification}
            className="text-white focus:outline-none hover:text-yellow-300"
          >
            🔔
          </button>
          {isNotificationOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-black shadow-lg rounded-md">
              <p className="p-2">No new notifications</p>
            </div>
          )}
        </div>

        {/* Settings */}
        <div className="relative">
          <button
            onClick={toggleSettings}
            className="text-white focus:outline-none hover:text-yellow-300"
          >
            ⚙️
          </button>
          {isSettingsOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-black shadow-lg rounded-md">
              <Link to="/dashboard/settings" className="block p-2 hover:bg-gray-200">
                Settings
              </Link>
            </div>
          )}
        </div>

        {/* Account Menu */}
        <div className="relative">
          <button
            onClick={toggleAccountMenu}
            className="flex items-center space-x-2 focus:outline-none hover:text-yellow-300"
          >
            <img
              src="https://via.placeholder.com/32"
              alt="Profile"
              className="w-8 h-8 rounded-full"
            />
            <span className="hidden md:block">John Doe</span>
          </button>
          {isAccountMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-black shadow-lg rounded-md">
              <Link to="/dashboard/profile" className="block p-2 hover:bg-gray-200">
                My Profile
              </Link>
              <button className="block w-full text-left p-2 hover:bg-gray-200">
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