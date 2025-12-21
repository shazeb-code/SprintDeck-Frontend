function PlayersList({ players, revealed }) {
  return (
    <div className="bg-white rounded shadow p-4">
      <h2 className="font-semibold mb-3">Players</h2>

      <ul className="space-y-2">
        {players.map((player, index) => (
          <li
            key={index}
            className="flex justify-between items-center border-b pb-1"
          >
            <span>
              {player.name}
              {player.isHost && (
                <span className="ml-2 text-xs text-blue-600">
                  HOST
                </span>
              )}
            </span>

            {revealed && (
              <span className="font-bold">
                {player.selectedCard ?? "-"}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PlayersList;
