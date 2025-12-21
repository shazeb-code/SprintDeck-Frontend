import CardsGrid from "./CardsGrid";

function TablePlaceholder({ room, selfId, onCardSelect, onReveal, onResetRound }) {
  if (!room) {
    return (
      <div className="bg-white rounded shadow p-6 text-center text-gray-400">
        Waiting for players...
      </div>
    );
  }

  const currentPlayer = room.players.find((p) => p.socketId === selfId);
  const isHost = currentPlayer?.role === "host";
  const isSpectator = currentPlayer?.role === "spectator";

  return (
    <div className="bg-white rounded shadow p-6 flex flex-col gap-6">
      {/* 1️⃣ Cards Grid (only if not revealed) */}
      {!room.revealed && (
        <CardsGrid
          selectedCard={currentPlayer?.selectedCard}
          onSelect={onCardSelect}
          disabled={isSpectator}
        />
      )}

      {/* 2️⃣ Vote distribution / result (show to all) */}
      {room.revealed && (
        <div className="text-center p-4 bg-gray-50 rounded shadow">
          <p className="text-lg font-semibold mb-2">Vote Results</p>
          <div className="flex justify-center gap-4 flex-wrap">
            {Object.entries(room.votes || {}).map(([card, count]) => (
              <div
                key={card}
                className={`p-3 rounded shadow w-20 ${
                  room.mostVotedCards?.includes(card) ? "bg-green-500 text-white" : "bg-white"
                }`}
              >
                <p className="text-xl font-bold">{card}</p>
                <p className="text-sm">Votes: {count}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3️⃣ Host-only buttons */}
      {isHost && (
        <div className="flex gap-3 justify-center">
          {!room.revealed && (
            <button
              onClick={onReveal}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Reveal Cards
            </button>
          )}
          <button
            onClick={onResetRound}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            Reset Round
          </button>
        </div>
      )}
    </div>
  );
}

export default TablePlaceholder;
