import { Link } from "react-router-dom"

const Sidebar = () => {
  return (
    <div className="w-64 bg-white shadow-md fixed h-full p-6">

      <h2 className="text-2xl font-bold text-blue-600 mb-10">
        dashboard
      </h2>

      <div className="space-y-6 text-gray-700 font-medium">

        <Link to="/dashboard" className="block hover:text-blue-600 transition">
          home
        </Link>

        <Link to="#" className="block hover:text-blue-600 transition">
          resume analysis
        </Link>

        <Link to="#" className="block hover:text-blue-600 transition">
          result analysis
        </Link>

        <Link to="#" className="block hover:text-blue-600 transition">
          skill quiz
        </Link>

        <Link to="/" className="block text-red-500 hover:text-red-700 transition">
          logout
        </Link>

      </div>

    </div>
  )
}

export default Sidebar
