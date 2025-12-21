import { useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../socket/socket";

function CreateGame() {
  const [gameName, setGameName] = useState("");
  const [playerName, setPlayerName] = useState("");
  const navigate = useNavigate();

  const handleCreateGame = () => {
    if (!gameName || !playerName) return alert("Enter both game name and player name");

    socket.emit(
      "create-game",
      { gameName, playerName },
      (response) => {
        if (response.success) {
          const roomId = response.roomId;

          // Save to localStorage
          localStorage.setItem("gameId", roomId);
          localStorage.setItem("playerName", playerName);
          localStorage.setItem("role", "host");

          navigate(`/game-room/${roomId}`);
        }
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Create Game
        </h2>

        <input
          type="text"
          placeholder="Game Name"
          className="w-full border p-2 rounded mb-3"
          value={gameName}
          onChange={(e) => setGameName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Your Name"
          className="w-full border p-2 rounded mb-4"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
        />

        <button
          onClick={handleCreateGame}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Create Game
        </button>
      </div>
    </div>
  );
}

export default CreateGame;
