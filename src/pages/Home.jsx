import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Home() {
  const navigate = useNavigate();

  const handleStartGame = () => {
    navigate("/create-game");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 via-purple-900 to-gray-900 p-4">
      <Navbar/  >
      {/* Main content container */}
      <div className="w-full max-w-md bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl shadow-purple-500/20 border border-gray-700/50 p-8 text-center transform transition-all duration-500 hover:scale-105">


        {/* Heading */}
        <h1 className="text-4xl font-extrabold mb-4 bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          SprintDeck
        </h1>

        {/* Subtle description text */}
        <p className="text-gray-400 mb-8 text-lg">
          A simple and elegant planning poker game for agile teams.
        </p>

        {/* Button */}
        <button
          onClick={handleStartGame}
          className="w-full bg-linear-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-purple-500/50 transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl hover:from-blue-400 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 cursor-pointer"
        >
          Start New Game
        </button>
      </div>
    </div>
  );
}

export default Home;


import React from 'react';

  