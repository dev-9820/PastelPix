import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import axios from "axios";

const UNSPLASH_ACCESS_KEY = "jPpxVf-IPYGFYlflPH3Nfg3uWTmy3pSCCSmdYS0ZLfo";

export default function Home() {
  const [term, setTerm] = useState("");
  const [images, setImages] = useState([]);
  const [topSearches, setTopSearches] = useState([]);
  const [history, setHistory] = useState([]);
  const [selectedImages, setSelectedImages] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem("token");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      setIsScrolled(scrollTop > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fetchImages = async (searchTerm) => {
    if (!searchTerm.trim()) return;
    
    setIsLoading(true);
    try {
      const res = await axios.get(`https://api.unsplash.com/search/photos`, {
        params: { query: searchTerm, per_page: 20 },
        headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` },
      });
      setImages(res.data.results);
      setSelectedImages(new Set()); // Reset selection on new search
      await api.post("/search", { term: searchTerm });
      loadTopSearches();
      loadHistory();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadTopSearches = async () => {
    const res = await api.get("/top-searches");
    setTopSearches(res.data);
  };

  const loadHistory = async () => {
    const res = await api.get("/history");
    setHistory(res.data.searches);
  };

  const toggleImageSelection = (imageId) => {
    const newSelected = new Set(selectedImages);
    if (newSelected.has(imageId)) {
      newSelected.delete(imageId);
    } else {
      newSelected.add(imageId);
    }
    setSelectedImages(newSelected);
  };

  const clearSelection = () => {
    setSelectedImages(new Set());
  };

  useEffect(() => {
    loadTopSearches();
    loadHistory();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-200 ">
      <Navbar />
      
      {selectedImages.size > 0 && (
        <div className="fixed top-32 right-20 z-50 bg-white/40 backdrop-blur-lg rounded-2xl p-4 shadow-lg border border-white/20">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500">{selectedImages.size}</div>
            <div className="text-sm text-gray-600">selected</div>
            <button
              onClick={clearSelection}
              className="mt-2 px-3 py-1 text-xs bg-blue-200 text-black rounded-full hover:bg-blue-300 transition-all duration-500"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col items-center px-4">
        <div className="text-center mt-8 mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-400 via-blue-400 to-gray-400 bg-clip-text text-transparent mb-4">
            Discover Beautiful Images
          </h1>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl">
            Search through millions of high-quality photos. Select your favorites and create amazing collections.
          </p>
          
          <div className="relative w-full max-w-2xl mx-auto">
            <input
              className="w-full p-4 pl-12 rounded-2xl border border-white/30 bg-white/60 backdrop-blur-md shadow-xl focus:outline-none focus:ring-4 focus:ring-purple-200 text-gray-700 placeholder-gray-500 transition-all duration-300"
              placeholder="Search for beautiful images..."
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchImages(term)}
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button
              onClick={() => fetchImages(term)}
              disabled={isLoading}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-blue-400 to-blue-900 text-white rounded-xl hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 disabled:opacity-50"
            >
              {isLoading ? "..." : "Search"}
            </button>
          </div>
        </div>

        <div className="w-full max-w-6xl mb-12">
          <h3 className="text-xl font-semibold text-gray-700 mb-4 text-center">Popular Searches</h3>
          <div className="flex gap-3 flex-wrap justify-center">
            {topSearches.map((s, i) => (
              <button
                key={i}
                onClick={() => fetchImages(s.term)}
                className="px-4 py-2 bg-white/60 backdrop-blur-md rounded-full cursor-pointer hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-gray-200 border border-white/30 font-medium text-gray-700"
              >
                {s.term} <span className="text-blue-500 font-semibold">({s.count})</span>
              </button>
            ))}
          </div>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center my-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        )}

        {images.length > 0 && (
          <div className="w-full max-w-7xl px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {images.map((img) => (
                <div
                  key={img.id}
                  className="relative group cursor-pointer transform hover:scale-105 transition-all duration-500"
                  onClick={() => toggleImageSelection(img.id)}
                >
                  <div className={`relative rounded-2xl overflow-hidden shadow-2xl ${
                    selectedImages.has(img.id) ? 'ring-4 ring-blue-500 ring-opacity-80' : ''
                  }`}>
                    <img
                      src={img.urls.regular}
                      alt={img.alt_description}
                      className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    

                    <div className="absolute top-3 right-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                        selectedImages.has(img.id) 
                          ? 'bg-blue-500 border-blue-200' 
                          : 'bg-white/90 border-white/80 group-hover:bg-white'
                      }`}>
                        {selectedImages.has(img.id) && (
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>

                   
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <p className="text-sm font-semibold truncate">
                        {img.alt_description || "Beautiful image"}
                      </p>
                      <p className="text-xs opacity-90">by {img.user.name}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

       
        {!isLoading && images.length === 0 && term && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">😢</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No images found</h3>
            <p className="text-gray-500">Try searching for something else</p>
          </div>
        )}

        
        <div className="w-full max-w-4xl my-16">
          <div className="bg-white/40 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-white/30">
            <h3 className="text-2xl font-bold text-gray-700 mb-6 text-center">Your Recent Searches</h3>
            <div className="flex flex-wrap gap-3 justify-center">
              {history.slice(-8).reverse().map((item, i) => (
                <button
                  key={i}
                  onClick={() => fetchImages(item)}
                  className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full cursor-pointer hover:scale-105 transition-all duration-300 shadow-md hover:shadow-purple-200 border border-purple-100 font-medium text-gray-700"
                >
                  {item}
                </button>
              ))}
            </div>
            {history.length === 0 && (
              <p className="text-center text-gray-500 py-4">Your search history will appear here</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}