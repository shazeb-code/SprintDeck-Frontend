import { useEffect } from "react";
import socket from "../socket/socket";

function PlayersList({ players, revealed }) {
  const emojiList = ["👍", "👎", "😂", "🔥", "🤯"];

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

    // sender ko bhi animation dikhe
    const targetCard = document.querySelector(
      `[data-player-id="${targetPlayerId}"]`
    );
    flyEmoji(emoji, targetCard);
  };

  return (
    <div className="bg-white rounded shadow p-4 mb-6">
      <div className="flex flex-wrap justify-center gap-6">
        {players.map((player, index) => {
          const hasSelected =
            player.selectedCard !== null &&
            player.selectedCard !== undefined;

          return (
            <div
              key={index}
              className="flex flex-col items-center relative group"
            >
              {/* CARD */}
              <div
                data-player-id={player.socketId}
                className={`w-24 h-32 rounded-lg flex items-center justify-center text-3xl font-bold transition-all
                ${
                  revealed
                    ? "bg-white border-2 border-gray-700"
                    : hasSelected
                    ? "bg-green-100 border-2 border-green-500 shadow-lg scale-105"
                    : "bg-gray-100 border border-gray-300"
                }`}
              >
                {revealed ? (
                  player.selectedCard ?? "-"
                ) : hasSelected ? (
                  ""
                ) : (
                  "🤔"
                )}
              </div>

              {/* 👇 EMOJI PICKER */}
              <div
                className="absolute -bottom-10 opacity-0 group-hover:opacity-100
                           transition-opacity duration-200
                           bg-white shadow-md rounded-full px-3 py-1 flex gap-2"
              >
                {emojiList.map((emoji, i) => (
                  <span
                    key={i}
                    onClick={() => sendEmoji(emoji, player.socketId)}
                    className="cursor-pointer hover:scale-125 transition-transform"
                  >
                    {emoji}
                  </span>
                ))}
              </div>

              {/* NAME */}
              <div className="mt-2 text-center">
                <p className="text-sm font-medium">{player.name}</p>

                {player.isHost && (
                  <span className="text-xs text-blue-600 font-semibold">
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
