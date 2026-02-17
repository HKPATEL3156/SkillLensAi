import Layout from "../components/Layout"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const Register = () => {
  const nav = useNavigate()

  const [data, setData] = useState({
    name: "",
    email: "",
    password: ""
  })

  const handle = async (e) => {
    e.preventDefault()

    await axios.post("http://localhost:5000/api/auth/register", data)

    nav("/login")
  }

  return (
    <Layout>
      <div className="flex justify-center items-center py-20 bg-gradient-to-r from-blue-50 to-blue-100">

        <form
          onSubmit={handle}
          className="bg-white shadow-xl p-10 rounded-xl w-96 space-y-5 hover:shadow-2xl transition"
        >

          <h2 className="text-3xl font-bold text-blue-600 text-center">
            create account
          </h2>

          <input
            type="text"
            placeholder="full name"
            className="w-full border p-3 rounded focus:ring-2 focus:ring-blue-500"
            onChange={e => setData({ ...data, name: e.target.value })}
          />

          <input
            type="email"
            placeholder="email"
            className="w-full border p-3 rounded focus:ring-2 focus:ring-blue-500"
            onChange={e => setData({ ...data, email: e.target.value })}
          />

          <input
            type="password"
            placeholder="password"
            className="w-full border p-3 rounded focus:ring-2 focus:ring-blue-500"
            onChange={e => setData({ ...data, password: e.target.value })}
          />

          <button
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-green-500 transition font-semibold"
          >
            sign up
          </button>

          <p className="text-sm text-center">
            already have account?
            <span
              onClick={() => nav("/login")}
              className="text-blue-600 cursor-pointer hover:text-purple-600 ml-1"
            >
              login
            </span>
          </p>

        </form>

      </div>
    </Layout>
  )
}

export default Register
