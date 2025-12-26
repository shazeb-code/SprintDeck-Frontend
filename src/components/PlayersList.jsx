import { useEffect } from "react";
import socket from "../socket/socket";

function PlayersList({ players, revealed }) {
  const emojiList = ["🥚", "🌹", "⚡", "🪃", "🪨" ];

  /* ===============================
     FLYING EMOJI ANIMATION
  =============================== */
  const flyEmoji = (emoji, targetEl) => {
    if (!targetEl) return;

    const emojiEl = document.createElement("div");
    emojiEl.innerText = emoji;

    emojiEl.style.position = "fixed";
    emojiEl.style.fontSize = "28px";
    emojiEl.style.zIndex = "9999";
    emojiEl.style.pointerEvents = "none";
    emojiEl.style.willChange = "transform, top, left, opacity";

    // random start position
    const startX = Math.random() * window.innerWidth;
    const startY = Math.random() * window.innerHeight;

    emojiEl.style.left = `${startX}px`;
    emojiEl.style.top = `${startY}px`;

    document.body.appendChild(emojiEl);

    const rect = targetEl.getBoundingClientRect();

    // 🎯 HIT ON BORDER (random side)
    const side = Math.floor(Math.random() * 4);
    let targetX, targetY;

    switch (side) {
      case 0: // top
        targetX = rect.left + rect.width / 2;
        targetY = rect.top;
        break;
      case 1: // right
        targetX = rect.right;
        targetY = rect.top + rect.height / 2;
        break;
      case 2: // bottom
        targetX = rect.left + rect.width / 2;
        targetY = rect.bottom;
        break;
      default: // left
        targetX = rect.left;
        targetY = rect.top + rect.height / 2;
    }

    // ✈️ FLY
    requestAnimationFrame(() => {
      emojiEl.style.transition =
        "left 0.75s cubic-bezier(.2,.8,.2,1), top 0.75s cubic-bezier(.2,.8,.2,1)";
      emojiEl.style.left = `${targetX}px`;
      emojiEl.style.top = `${targetY}px`;
    });

    // 💥 HIT + SHAKE
    setTimeout(() => {
      // emoji squash
      emojiEl.style.transition = "transform 0.12s ease";
      emojiEl.style.transform = "scale(1.6)";

      // real vibration (left-right)
      targetEl.animate(
        [
          { transform: "translateX(0)" },
          { transform: "translateX(-5px)" },
          { transform: "translateX(5px)" },
          { transform: "translateX(-3px)" },
          { transform: "translateX(3px)" },
          { transform: "translateX(0)" },
        ],
        {
          duration: 200,
          easing: "ease-in-out",
        }
      );
    }, 300);

    // 🧱 STICK MOMENT
    setTimeout(() => {
      emojiEl.style.transform = "scale(1.2)";
    }, 900);

    // 🌫 FADE OUT
    setTimeout(() => {
      emojiEl.style.transition = "opacity 0.4s ease-out";
      emojiEl.style.opacity = "0";
    }, 1200);

    // ❌ CLEANUP
    setTimeout(() => {
      emojiEl.remove();
    }, 1700);
  };

  /* ===============================
     RECEIVE EMOJI (FROM SOCKET)
  =============================== */
  useEffect(() => {
    socket.on("emoji-received", ({ toUserId, emoji }) => {
      const targetCard = document.querySelector(
        `[data-player-id="${toUserId}"]`
      );
      flyEmoji(emoji, targetCard);
    });

    return () => {
      socket.off("emoji-received");
    };
  }, []);

  /* ===============================
     SEND EMOJI
  =============================== */
  const sendEmoji = (emoji, targetPlayerId) => {
    socket.emit("send-emoji", {
      roomId: localStorage.getItem("gameId"),
      fromUserId: socket.id,
      toUserId: targetPlayerId,
      emoji,
    });

    const targetCard = document.querySelector(
      `[data-player-id="${targetPlayerId}"]`
    );
    flyEmoji(emoji, targetCard);
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-700/50 p-6">
      <div className="flex flex-wrap justify-center gap-6">
        {players.map((player, index) => {
          const hasSelected =
            player.selectedCard !== null && player.selectedCard !== undefined;

          return (
            <div
              key={index}
              className="flex flex-col items-center relative group"
            >
              {/* PLAYER CARD */}
              <div
                data-player-id={player.socketId}
                className={`
                  w-18 h-25 rounded-xl flex items-center justify-center text-2xl font-bold transition-all duration-300 border-2
                  ${
                    revealed
                      ? "bg-gray-700 text-white border-gray-600"
                      : hasSelected
                      ? "bg-linear-to-br from-blue-900/50 to-purple-900/50 border-blue-500 shadow-lg shadow-blue-500/30 scale-105"
                      : "bg-gray-700/30 border-gray-600"
                  }
                `}
              >
                {revealed ? (
                  <span className="bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-extrabold">
                    {player.selectedCard ?? "-"}
                  </span>
                ) : hasSelected ? (
                  <svg
                    className="w-7 h-7 text-blue-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : player.role === "spectator" ? (
                  "👁️"
                ) : (
                  "🤔"
                )}
              </div>

              {/* EMOJI PICKER */}
              <div
                className="absolute -bottom-2 z-10 opacity-0 group-hover:opacity-100
                           transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto
                           bg-gray-900 shadow-xl rounded-full px-3 py-2 flex gap-2 border border-gray-700"
              >
                {emojiList.map((emoji, i) => (
                  <span
                    key={i}
                    onClick={() => sendEmoji(emoji, player.socketId)}
                    className="cursor-pointer hover:scale-125 transition-transform duration-200 text-base"
                  >
                    {emoji}
                  </span>
                ))}
              </div>

              {/* PLAYER NAME & ROLE */}
              <div className="mt-3 text-center">
                <p className="text-sm font-semibold text-gray-200">
                  {player.name}
                </p>

                {player.isHost && (
                  <span className="text-xs text-purple-400 font-bold">
                    HOST
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PlayersList;
