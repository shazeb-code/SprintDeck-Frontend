import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import socket from "../socket/socket";

import PlayersList from "../components/PlayersList";
import TablePlaceholder from "../components/TablePlaceholder";

function GameRoom() {
  const { gameId } = useParams();
  const [room, setRoom] = useState(null);
  const [selfId, setSelfId] = useState(null);

  // 🔑 Rejoin + persist logic (FIX)
  useEffect(() => {
    // save gameId so refresh pe mile
    if (gameId) {
      localStorage.setItem("gameId", gameId);
    }

    const storedGameId = localStorage.getItem("gameId");
    const storedPlayerName = localStorage.getItem("playerName");
    const storedRole = localStorage.getItem("role");

    // socket connect hone ke baad hi rejoin bhejo
    const tryRejoin = () => {
      setSelfId(socket.id);

      if (storedGameId && storedPlayerName) {
        socket.emit("rejoin-game", {
          gameId: storedGameId,
          playerName: storedPlayerName,
          role: storedRole || "player",
        });
      }
    };

    if (socket.connected) {
      tryRejoin();
    } else {
      socket.on("connect", tryRejoin);
    }

    // Listen to room updates
    socket.on("room-update", (updatedRoom) => {
      setRoom(updatedRoom);
    });

    // Host notification
    socket.on("host-assigned", ({ message }) => {
      console.log(message);
    });

    return () => {
      socket.off("connect", tryRejoin);
      socket.off("room-update");
      socket.off("host-assigned");
    };
  }, [gameId]);

  const handleCardSelect = (card) => {
    socket.emit("select-card", { roomId: gameId, card });
  };

  const handleReveal = () => {
    socket.emit("reveal-cards", { roomId: gameId });
  };

  const handleResetRound = () => {
    socket.emit("reset-round", { roomId: gameId });
  };

  const inviteLink = `${window.location.origin}/join-game?roomId=${gameId}`;
  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
    alert("Invite link copied");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 relative pb-40">
  {/* HEADER */}
  <div className="flex justify-between items-center mb-6">
    <h1 className="text-2xl font-bold">Game Room: {gameId}</h1>
    <button
      onClick={copyInviteLink}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    >
      Invite
    </button>
  </div>

  {/* Players cards on top */}
  <PlayersList
    players={room?.players || []}
    revealed={room?.revealed}
  />

  {/* Table / card selection at bottom */}
  <div className="fixed bottom-0 left-0 w-full">
    <TablePlaceholder
      room={room}
      selfId={selfId}
      onCardSelect={handleCardSelect}
      onReveal={handleReveal}
      onResetRound={handleResetRound}
    />
  </div>
</div>

  );
}

export default GameRoom;
