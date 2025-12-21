import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const handleStartGame = () => {
    navigate("/create-game");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-white p-8 rounded-lg shadow-md text-center w-full max-w-md">
        <h1 className="text-3xl font-bold mb-4">
          Planning Poker
        </h1>

        <p className="text-gray-600 mb-6">
          Simple planning poker game for teams
        </p>

        <button
          onClick={handleStartGame}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Start Game
        </button>
      </div>
    </div>
  );
}

export default Home;
