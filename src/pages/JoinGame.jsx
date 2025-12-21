import { useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../socket/socket";

function JoinGame() {
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(window.location.search);
  const roomId = searchParams.get("roomId") || "";

  const [playerName, setPlayerName] = useState("");
  const [isSpectator, setIsSpectator] = useState(false);

  const handleJoin = () => {
    if (!playerName) return alert("Enter your name");

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
          alert(res.message);
        }
      }
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow w-80">
        <h1 className="text-xl font-bold mb-4">Join Game</h1>

        <input
          type="text"
          placeholder="Your Name"
          className="w-full mb-4 px-3 py-2 border rounded"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
        />

        <label className="flex items-center mb-4">
          <input
            type="checkbox"
            className="mr-2"
            checked={isSpectator}
            onChange={() => setIsSpectator(!isSpectator)}
          />
          Join as Spectator
        </label>

        <button
          onClick={handleJoin}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Join Game
        </button>
      </div>
    </div>
  );
}

export default JoinGame;
