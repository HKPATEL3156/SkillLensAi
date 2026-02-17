import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/dashboard", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUser(res.data.user);
      } catch (err) {
        console.error("Error fetching dashboard data", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="ml-64 flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8">
          Welcome Back, {user?.name || "User"} 👋
        </h1>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="font-semibold">My Results</h3>
            <p className="text-sm text-gray-500">View and analyze your results.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="font-semibold">My Resume</h3>
            <p className="text-sm text-gray-500">Upload and manage your resume.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="font-semibold">Student Career Coach</h3>
            <p className="text-sm text-gray-500">Get personalized career guidance.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="font-semibold">My Activity</h3>
            <p className="text-sm text-gray-500">Track your recent activities.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
