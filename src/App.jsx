import { Routes, Route } from "react-router-dom";
import "./App.css"

// Pages
import Home from "./pages/Home";
import CreateGame from "./pages/CreateGame";
import JoinGame from "./pages/JoinGame";
import GameRoom from "./pages/GameRoom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/create-game" element={<CreateGame />} />
      <Route path="/join-game" element={<JoinGame />} />
      <Route path="/game-room/:gameId" element={<GameRoom />} />
    </Routes>
  );
}

export default App;
