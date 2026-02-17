import Layout from "../components/Layout"
import { Link } from "react-router-dom"

const Landing = () => {
  return (
    <Layout isLanding={true}>

      {/* HERO SECTION */}
      <section className="text-center py-32 bg-gradient-to-b from-blue-100 to-white">

        <h1 className="text-6xl font-extrabold mb-6">
          Unlock Your <span className="text-blue-600">Career Potential</span>
        </h1>

        <p className="text-gray-600 max-w-2xl mx-auto mb-8">
          AI powered platform to analyze skills, evaluate performance and guide your future career path.
        </p>

        <div className="flex justify-center gap-6">
          <Link to="/register">
            <button className="bg-yellow-400 text-blue-900 px-8 py-4 rounded-lg hover:bg-yellow-500 transition duration-300 shadow-lg">
              Get Started Free
            </button>
          </Link>

          <Link to="/login">
            <button className="border border-blue-600 text-blue-600 px-8 py-4 rounded-lg hover:bg-blue-600 hover:text-white transition duration-300">
              Sign In
            </button>
          </Link>
        </div>

      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-20 bg-gray-100">
        <h2 className="text-4xl font-bold text-center text-blue-600 mb-8">Powerful Features</h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "AI Resume Analysis",
              desc: "Extract technical and soft skills automatically using intelligent parsing."
            },
            {
              title: "Academic Performance Insights",
              desc: "Identify strengths, weaknesses, and improvement areas from results."
            },
            {
              title: "Personalized Career Suggestions",
              desc: "Get AI-based career recommendations aligned with your profile."
            },
            {
              title: "Skill Assessment Quizzes",
              desc: "Evaluate your knowledge with adaptive and structured quizzes."
            },
            {
              title: "Progress Analytics Dashboard",
              desc: "Track your performance journey with detailed visual insights."
            },
            {
              title: "Future Skill Roadmap",
              desc: "Receive a structured learning path toward your dream career."
            }
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition duration-300"
            >
              <h3 className="text-xl font-semibold mb-4 text-blue-600">
                {item.title}
              </h3>
              <p className="text-gray-600">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-20 bg-white">
        <h2 className="text-4xl font-bold text-center text-blue-600 mb-8">How It Works</h2>
        <div className="max-w-6xl mx-auto text-center">
          <div className="p-8 rounded-2xl hover:bg-blue-50 transition">
            <div className="text-5xl font-bold text-blue-600 mb-6">01</div>
            <h3 className="text-xl font-semibold mb-4">Create Your Profile</h3>
            <p className="text-gray-600">
              Register and securely build your academic and skill profile.
            </p>
          </div>

          <div className="p-8 rounded-2xl hover:bg-blue-50 transition">
            <div className="text-5xl font-bold text-blue-600 mb-6">02</div>
            <h3 className="text-xl font-semibold mb-4">Upload & Analyze</h3>
            <p className="text-gray-600">
              Upload resume and results for intelligent AI-driven evaluation.
            </p>
          </div>

          <div className="p-8 rounded-2xl hover:bg-blue-50 transition">
            <div className="text-5xl font-bold text-blue-600 mb-6">03</div>
            <h3 className="text-xl font-semibold mb-4">Get Smart Insights</h3>
            <p className="text-gray-600">
              Receive personalized recommendations and growth roadmap.
            </p>
          </div>
        </div>
      </section>

      {/* REVIEWS SECTION */}
      <section id="reviews" className="py-20 bg-gray-100">
        <h2 className="text-4xl font-bold text-center text-blue-600 mb-8">Reviews</h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="p-6 border rounded-lg shadow-md hover:shadow-lg transition duration-300">
            <p className="text-gray-700">"This platform helped me land my dream job!"</p>
            <p className="mt-4 font-bold">- Rohan Sharma, B.Tech CSE</p>
          </div>
          <div className="p-6 border rounded-lg shadow-md hover:shadow-lg transition duration-300">
            <p className="text-gray-700">"The skill assessment quizzes are top-notch!"</p>
            <p className="mt-4 font-bold">- Priya Patel, B.Sc IT</p>
          </div>
          <div className="p-6 border rounded-lg shadow-md hover:shadow-lg transition duration-300">
            <p className="text-gray-700">"I feel more confident about my career now."</p>
            <p className="mt-4 font-bold">- Ankit Verma, MBA</p>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="py-20 bg-white">
        <h2 className="text-4xl font-bold text-center text-blue-600 mb-8">About Us</h2>
        <div className="max-w-4xl mx-auto text-center">
          <p>SkillLens AI is dedicated to empowering students by providing personalized career recommendations based on their skills and academic performance. Our mission is to bridge the gap between education and employment by leveraging the power of AI.</p>
        </div>
      </section>

    </Layout>
  )
}

export default Landing
