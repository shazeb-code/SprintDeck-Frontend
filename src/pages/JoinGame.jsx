import { useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../socket/socket";

function JoinGame() {
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(window.location.search);
  const roomId = searchParams.get("roomId") || "";

  const [playerName, setPlayerName] = useState("");
  const [isSpectator, setIsSpectator] = useState(false);
  const [error, setError] = useState(""); 

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    setError(""); // Clear previous errors

    if (!playerName) {
      setError("Please enter your name to join.");
      return;
    }

    socket.emit(
      "join-game",
      { roomId, playerName, role: isSpectator ? "spectator" : "player" },
      (res) => {
        if (res.success) {
          // Save to localStorage
          localStorage.setItem("gameId", roomId);
          localStorage.setItem("playerName", playerName);
          localStorage.setItem("role", isSpectator ? "spectator" : "player");

          navigate(`/game-room/${roomId}`);
        } else {
          setError(
            res.message || "Failed to join the game. Please check the Room ID."
          );
        }
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 via-purple-900 to-gray-900 p-4">
      {/* card container */}
      <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-2xl shadow-purple-500/20 border border-gray-700 p-8 text-center">
        {/* Heading */}
        <h1 className="text-3xl font-extrabold mb-2 bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Join Game
        </h1>

        {/* Room ID display */}
        <p className="text-gray-500 font-mono text-sm mb-8">
          Room ID: {roomId || "Not provided"}
        </p>

        {/* Form container */}
        <form className="space-y-6" onSubmit={handleSubmit}>
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
              placeholder="e.g., John Smith"
              className="w-full bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent block p-3 transition-all duration-200"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              autoComplete="name"
            />
          </div>

          {/* Custom Styled Checkbox Group */}
          <div className="flex items-center">
            <label className="flex items-center cursor-pointer text-gray-300 select-none">
              <input
                type="checkbox"
                className="peer hidden"
                checked={isSpectator}
                onChange={(e) => setIsSpectator(e.target.checked)}
              />

              <div
                className="w-5 h-5 bg-gray-600 rounded-md
                    peer-checked:bg-linear-to-r
                    peer-checked:from-blue-500
                    peer-checked:to-purple-600
                    transition-all duration-200
                    flex items-center justify-center"
              >
                <svg
                  className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <span className="ml-3 text-sm">Join as Spectator</span>
            </label>
          </div>

          {/* Inline Error Message */}
          {error && (
            <p className="text-red-400 text-sm text-center bg-red-900/20 p-2 rounded-md border border-red-800/50">
              {error}
            </p>
          )}

          {/* Call-to-action button */}
          <button
            type="submit"
            className="w-full bg-linear-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-purple-500/50 transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl hover:from-blue-400 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 cursor-pointer"
          >
            Join Game Room
          </button>
        </form>
      </div>
    </div>
  );
}

export default JoinGame;
