import Layout from "../components/Layout"
import { Link } from "react-router-dom"

const Landing = () => {
  return (
    <Layout isLanding={true}>

      <section className="text-center py-32 bg-gradient-to-b from-blue-100 to-white">

        <h1 className="text-6xl font-extrabold mb-6">
          Unlock Your <span className="text-blue-600">Career Potential</span>
        </h1>

        <p className="text-gray-600 max-w-2xl mx-auto mb-8">
          AI powered platform to analyze skills, evaluate performance and guide your future career path.
        </p>

        <div className="flex justify-center gap-6">
          <Link to="/register">
            <button className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-green-500 transition">
              Get Started Free
            </button>
          </Link>

          <Link to="/login">
            <button className="border border-blue-600 text-blue-600 px-8 py-4 rounded-lg hover:bg-blue-600 hover:text-white transition">
              Sign In
            </button>
          </Link>
        </div>

      </section>

    </Layout>
  )
}

export default Landing
