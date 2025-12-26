import React from 'react';
import { useNavigate } from "react-router-dom";
import socket from "../socket/socket"; 
import Logo from './Logo';

function Navbar() {
  const navigate = useNavigate();

  const handleStartNewGame = () => {
    // Disconnect from any existing room to prevent ghost connections
    socket.disconnect();
    
    // Navigate to the home screen (where the user can create a new game)
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Branding/Logo Section */}
          <Logo/>

          {/* Action Button Section */}
          <div>
            <button
              onClick={handleStartNewGame}
              className="flex items-center gap-2 bg-linear-to-r from-blue-500 to-purple-600 text-white font-semibold py-2 px-5 rounded-lg shadow-lg shadow-purple-500/30 transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Start New Game
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;