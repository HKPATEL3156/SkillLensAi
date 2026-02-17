import { Link } from "react-router-dom"
import logo from "../assets/logo.png"

const Navbar = ({ isLanding }) => {
  return (
    <nav className="fixed top-0 w-full bg-white shadow-md z-50">

      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src={logo} alt="logo" className="h-10" />
        </Link>

        {/* Menu */}
        <div className="hidden md:flex items-center gap-8 text-gray-700 font-medium">

          {isLanding && (
            <>
              <a href="#features" className="hover:text-blue-600 transition">Features</a>
              <a href="#how" className="hover:text-blue-600 transition">How It Works</a>
              <a href="#reviews" className="hover:text-blue-600 transition">Reviews</a>
              <a href="#about" className="hover:text-blue-600 transition">About Us</a>
            </>
          )}

          <Link to="/login" className="hover:text-blue-600 transition">
            Login
          </Link>

          <Link to="/register">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-green-500 transition shadow-md">
              Get Started Free
            </button>
          </Link>

        </div>
      </div>
    </nav>
  )
}

export default Navbar
