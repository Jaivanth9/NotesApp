import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth";

const Home = () => {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-gradient-to-br from-purple-600 to-blue-700 text-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-5 bg-black/20 backdrop-blur-md">
        <h1 className="text-2xl font-bold">NotesApp</h1>

        <div className="relative">
          <button
            className="w-10 h-10 rounded-full bg-white text-purple-600 font-bold flex items-center justify-center"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {user?.name ? user.name.charAt(0).toUpperCase() : "?"}
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-lg">
              <p className="px-4 py-2 font-medium border-b">
                {user?.name || "Guest"}
              </p>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center flex-1 text-center px-6">
        <h2 className="text-5xl font-extrabold mb-4">
          Welcome, {user?.name || "Guest"} 👋
        </h2>
        <p className="text-lg mb-10 max-w-2xl">
          Keep track of your thoughts, tasks, and ideas with your personal notes.
        </p>

        <div className="flex space-x-6">
          <button
            onClick={() => navigate("/notes")}
            className="px-8 py-4 bg-white text-purple-600 rounded-xl font-semibold shadow-lg hover:bg-gray-200 transition"
          >
            ✍ Go to Notes
          </button>

          <button
            onClick={() => alert('🚀 Upcoming Feature: Reminders')}
            className="px-8 py-4 border border-white rounded-xl font-semibold hover:bg-white hover:text-purple-600 transition"
          >
            ⏰ Reminders
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center p-4 bg-black/20 backdrop-blur-md text-sm">
        © {new Date().getFullYear()} NotesApp. Designed and Developed By Jaivanth Koppula.
      </footer>
    </div>
  );
};

export default Home;
