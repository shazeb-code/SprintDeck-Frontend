import { useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../socket/socket";

function CreateGame() {
  const [gameName, setGameName] = useState("");
  const [playerName, setPlayerName] = useState("");
  const navigate = useNavigate();

  const handleCreateGame = () => {
    if (!gameName || !playerName)
      return alert("Enter both game name and player name");

    socket.emit("create-game", { gameName, playerName }, (response) => {
      if (response.success) {
        const roomId = response.roomId;

        // Save to localStorage
        localStorage.setItem("gameId", roomId);
        localStorage.setItem("playerName", playerName);
        localStorage.setItem("role", "host");

        navigate(`/game-room/${roomId}`);
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 via-purple-900 to-gray-900 p-4">
      {/* card container */}
      <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-2xl shadow-purple-500/20 border border-gray-700 p-8 text-center">
        {/* Heading with gradient text */}
        <h2 className="text-3xl font-extrabold mb-8 bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Create New Game
        </h2>

        {/* Form container */}
        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            handleCreateGame();
          }}
        >
          {/* Game Name */}
          <div className="text-left">
            <label
              htmlFor="gameName"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Game Name
            </label>
            <input
              id="gameName"
              type="text"
              placeholder="e.g., Sprint 23 Planning"
              className="w-full bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent block p-3 transition-all duration-200"
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
            />
          </div>

          {/* Player Name */}
          <div className="text-left">
            <label
              htmlFor="playerName"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Your Name
            </label>
            <input
              id="playerName"
              type="text"
              placeholder="e.g., Jane Doe"
              className="w-full bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent block p-3 transition-all duration-200"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-linear-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-purple-500/50 transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl hover:from-blue-400 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 cursor-pointer"
          >
            Create & Join Game
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateGame;
