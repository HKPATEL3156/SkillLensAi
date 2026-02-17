import Sidebar from "../components/Sidebar"

const Dashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">

      <Sidebar />

      <div className="ml-64 flex-1 p-8">

        <h1 className="text-3xl font-bold mb-8">
          Welcome Back 👋
        </h1>

        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="font-semibold">Upload Resume</h3>
            <p className="text-sm text-gray-500">Extract skills using AI</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="font-semibold">Upload Results</h3>
            <p className="text-sm text-gray-500">Analyze academic performance</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="font-semibold">Take Skill Quiz</h3>
            <p className="text-sm text-gray-500">Evaluate your knowledge</p>
          </div>

        </div>

      </div>

    </div>
  )
}

export default Dashboard
