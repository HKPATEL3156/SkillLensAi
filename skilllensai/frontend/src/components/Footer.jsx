import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react"
import logo from "../assets/logo.png"

const Footer = () => {
  return (
    <footer className="bg-blue-700 text-white mt-20">

      <div className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-4 gap-10">

        {/* Column 1 */}
        <div>
          <img src={logo} alt="logo" className="h-10 mb-4" />
          <p className="text-sm text-blue-200">
            Intelligent Student Skill and Career Recommendation Portal.
          </p>

          <div className="flex gap-4 mt-4">
            <Facebook size={20} className="hover:text-green-400 cursor-pointer"/>
            <Instagram size={20} className="hover:text-pink-400 cursor-pointer"/>
            <Linkedin size={20} className="hover:text-blue-300 cursor-pointer"/>
            <Twitter size={20} className="hover:text-purple-300 cursor-pointer"/>
          </div>
        </div>

        {/* Column 2 */}
        <div>
          <h3 className="font-semibold mb-4">Quick Links</h3>
          <p className="text-sm hover:text-green-400 cursor-pointer">Home</p>
          <p className="text-sm hover:text-green-400 cursor-pointer">About</p>
          <p className="text-sm hover:text-green-400 cursor-pointer">Features</p>
          <p className="text-sm hover:text-green-400 cursor-pointer">Contact</p>
        </div>

        {/* Column 3 */}
        <div>
          <h3 className="font-semibold mb-4">Contact</h3>
          <p className="text-sm text-blue-200">Email: support@skilllens.ai</p>
          <p className="text-sm text-blue-200">Phone: +91 98765 43210</p>
          <p className="text-sm text-blue-200">Location: Gujarat, India</p>
        </div>

        {/* Column 4 */}
        <div>
          <h3 className="font-semibold mb-4">Legal</h3>
          <p className="text-sm hover:text-green-400 cursor-pointer">Privacy Policy</p>
          <p className="text-sm hover:text-green-400 cursor-pointer">Terms & Conditions</p>
        </div>

      </div>

      <div className="text-center text-sm bg-blue-800 py-4">
        © 2026 SkillLens AI. All rights reserved.
      </div>

    </footer>
  )
}

export default Footer
