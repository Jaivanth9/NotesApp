import React from "react";
import { Link } from "react-router-dom";

const Welcome = () => {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white text-center px-6">
      <h1 className="text-5xl font-extrabold mb-6">Welcome to NotesApp</h1>
      <p className="text-lg mb-8 max-w-xl">
        Organize your thoughts, keep track of ideas, and manage notes efficiently with our simple and powerful note-taking app.
      </p>
      <div className="flex space-x-4">
        <Link
          to="/register"
          className="px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold shadow-md hover:bg-gray-200 transition"
        >
          Get Started
        </Link>
        <Link
          to="/login"
          className="px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold shadow-md hover:bg-gray-200 transition"
        >
          Login
        </Link>
      </div>
    </div>
  );
};

export default Welcome;
