import Layout from "../components/Layout"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const Login = () => {
  const nav = useNavigate()
  const [data, setData] = useState({ email:"", password:"" })

  const handle = async (e) => {
    e.preventDefault()
    const res = await axios.post("http://localhost:5000/api/auth/login", data)
    localStorage.setItem("token", res.data.token)
    nav("/dashboard")
  }

  return (
    <Layout>
      <div className="flex justify-center items-center py-20">
        <form onSubmit={handle} className="bg-white shadow-lg p-8 rounded-lg w-96 space-y-4">

          <h2 className="text-2xl font-bold text-blue-600 text-center">login</h2>

          <input type="email" placeholder="email"
            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
            onChange={e=>setData({...data,email:e.target.value})}
          />

          <input type="password" placeholder="password"
            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
            onChange={e=>setData({...data,password:e.target.value})}
          />

          <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-green-500 transition">
            login
          </button>

        </form>
      </div>
    </Layout>
  )
}

export default Login
