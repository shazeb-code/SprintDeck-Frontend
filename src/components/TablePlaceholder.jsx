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
    <div className="bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-700/50 py-3 flex justify-center items-center gap-3 transition-all duration-500">
      
      {/* Vote Results (shown after reveal) */}
      {room?.revealed && (
        <div className="text-center py-3 px-4 bg-gray-900/50 rounded-xl border border-gray-700/50 animate-fadeIn">
          <p className="text-xl font-extrabold text-white mb-1">Vote Results</p>
          <div className="flex justify-center gap-3 flex-wrap">
            {Object.entries(room.votes || {}).map(([card, count]) => {
              const isMostVoted = room.mostVotedCards?.includes(card);
              return (
                <div
                  key={card}
                  className={`p-3 rounded-lg shadow-md w-20 transition-all duration-300 hover:scale-105 ${
                    isMostVoted
                      ? "bg-linear-to-br from-blue-500 to-purple-600 text-white shadow-purple-500/50"
                      : "bg-gray-700/50 text-gray-200"
                  }`}
                >
                  <p className="text-xl font-bold">{card}</p>
                  <p className="text-xs mt-1 opacity-80">{count} vote{count > 1 ? 's' : ''}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Card Selection (shown before reveal) */}
      {!room?.revealed && (
        <div className="animate-fadeIn">
          <CardsGrid
            selectedCard={currentPlayer?.selectedCard}
            onSelect={onCardSelect}
            disabled={isSpectator}
          />
        </div>
      )}

      {/* Host-only Control Buttons */}
      {isHost && (
        <div className="flex gap-4 justify-center animate-fadeIn">
          {!room?.revealed && (
            <button
              onClick={onReveal}
              className="flex items-center gap-2 bg-linear-to-r from-green-500 to-teal-600 text-white font-semibold py-2 px-6 rounded-lg shadow-lg shadow-green-500/30 transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              Reveal Cards
            </button>
          )}
          <button
            onClick={onResetRound}
            className="flex items-center gap-2 bg-gray-700 text-gray-200 font-semibold py-2 px-6 rounded-lg border border-yellow-500/50 hover:bg-yellow-500 hover:text-gray-900 transform transition-all duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            Reset Round
          </button>
        </div>
      )}
    </div>
  );

}

export default TablePlaceholder;
