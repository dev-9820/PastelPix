import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      setIsScrolled(scrollTop > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`sticky top-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? "mx-20 rounded-3xl" 
        : "mx-0 rounded-none"
    }`}>
      <div className={`flex justify-between items-center p-6 backdrop-blur-lg border border-white/20 transition-all duration-500 ${
        isScrolled 
          ? "rounded-3xl shadow-md bg-white/20" 
          : "rounded-none"
      }`}>
        <h1 
          className="text-2xl font-bold text-white cursor-pointer bg-gradient-to-r from-blue-200 to-blue-600 bg-clip-text text-transparent transition-all duration-300"
          onClick={() => navigate("/")}
        >
          pastel<span className="text-gray-500">pix</span>
        </h1>
        <button
          onClick={logout}
          className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-200 text-white rounded-2xl hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 font-semibold"
        >
          Logout
        </button>
      </div>
    </div>
  );
}