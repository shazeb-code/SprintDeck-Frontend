import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import socket from "../socket/socket";

import PlayersList from "../components/PlayersList";
import TablePlaceholder from "../components/TablePlaceholder";

function GameRoom() {
  const { gameId } = useParams();
  const [room, setRoom] = useState(null);
  const [selfId, setSelfId] = useState(null);
  const [inviteCopied, setInviteCopied] = useState(false); 

  // Rejoin + persist logic
  useEffect(() => {
    // save gameId so refresh pe mile
    if (gameId) {
      localStorage.setItem("gameId", gameId);
    }

    const storedGameId = localStorage.getItem("gameId");
    const storedPlayerName = localStorage.getItem("playerName");
    const storedRole = localStorage.getItem("role");

    // rejoin after socket connection
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

    // Handle host assignment (debugging/logging purpose)
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
    setInviteCopied(true);
    setTimeout(() => setInviteCopied(false), 2000); // Revert after 2 seconds
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:py-2 md:px-3">
      <div className="max-w-7xl mx-auto space-y-2 pb-5">
        
        {/* HEADER CARD */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-700/50 py-2 px-5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {room?.gameName}
            </h1>
            <p className="text-gray-400 font-mono text-sm">ID: {gameId}</p>
          </div>
          <button
            onClick={copyInviteLink}
            className="flex items-center gap-2 bg-linear-to-r from-blue-500 to-purple-600 text-white font-semibold py-2 px-5 rounded-lg shadow-lg shadow-purple-500/30 transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
          >
            {/* Icon changes based on state */}
            {inviteCopied ? (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                Invite Players
              </>
            )}
          </button>
        </div>

        {/* PLAYERS LIST CARD */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-700/50">
          <PlayersList
            players={room?.players || []}
            revealed={room?.revealed}
          />
        </div>
      </div>

      {/* FIXED BOTTOM CONTAINER FOR TABLE/ACTION AREA */}
      <div className="w-full bg-gray-900/80 backdrop-blur-md border-t border-gray-700 py-2 px-3 fixed bottom-0 left-0 right-0">
        <div className="max-w-7xl mx-auto">
          <TablePlaceholder
            room={room}
            selfId={selfId}
            onCardSelect={handleCardSelect}
            onReveal={handleReveal}
            onResetRound={handleResetRound}
          />
        </div>
      </div>
    </div>
  );
}

export default GameRoom;