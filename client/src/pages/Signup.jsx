import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/signup", form);
      navigate("/login");
    } catch {
      alert("Signup failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-200 flex items-center justify-center p-4">
      <div className="bg-white/40 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl w-full max-w-md p-8">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-400 via-blue-400 to-gray-400 bg-clip-text text-transparent">
            pastel<span className="text-gray-600">pix</span>
          </h1>
          <p className="text-gray-600 mt-2">Join our creative community</p>
        </div>

        <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center">Create Account</h2>
        
        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <div className="relative">
            <input 
              className="w-full p-4 pl-12 rounded-2xl border border-white/50 bg-white/60 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300 text-gray-700 placeholder-gray-500"
              placeholder="Full name"
              value={form.name} 
              onChange={e => setForm({ ...form, name: e.target.value })} 
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>

          <div className="relative">
            <input 
              className="w-full p-4 pl-12 rounded-2xl border border-white/50 bg-white/60 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300 text-gray-700 placeholder-gray-500"
              placeholder="Email address" 
              value={form.email} 
              onChange={e => setForm({ ...form, email: e.target.value })} 
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
            </div>
          </div>

          <div className="relative">
            <input 
              type="password" 
              className="w-full p-4 pl-12 rounded-2xl border border-white/50 bg-white/60 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300 text-gray-700 placeholder-gray-500"
              placeholder="Password" 
              value={form.password} 
              onChange={e => setForm({ ...form, password: e.target.value })} 
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>

          <button className="w-full p-4 bg-gradient-to-r from-blue-400 to-blue-900 text-white rounded-2xl hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 font-semibold">
            Create Account
          </button>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-4 text-gray-500 text-sm">or sign up with</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        
        <div className="flex flex-col gap-3">
          <button
            onClick={() => window.location.href = "http://localhost:5000/api/auth/google"}
            className="w-full p-3 bg-white border border-gray-300 rounded-2xl flex items-center justify-center gap-3 hover:scale-105 transition-all duration-300 shadow-md hover:shadow-gray-300 font-medium text-gray-700"
          >
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" alt="google" className="w-5 h-5"/>
            Google
          </button>

          <button
            onClick={() => window.location.href = "http://localhost:5000/api/auth/github"}
            className="w-full p-3 bg-gray-900 text-white rounded-2xl flex items-center justify-center gap-3 hover:scale-105 transition-all duration-300 shadow-md hover:shadow-gray-800 font-medium"
          >
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" alt="github" className="w-5 h-5"/>
            GitHub
          </button>

          <button
            onClick={() => window.location.href = "http://localhost:5000/api/auth/facebook"}
            className="w-full p-3 bg-blue-600 text-white rounded-2xl flex items-center justify-center gap-3 hover:scale-105 transition-all duration-300 shadow-md hover:shadow-blue-500 font-medium"
          >
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/facebook/facebook-original.svg" alt="fb" className="w-5 h-5"/>
            Facebook
          </button>
        </div>

        <p className="text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}