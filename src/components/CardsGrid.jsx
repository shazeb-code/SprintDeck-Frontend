const CARDS = [0, 1, 2, 3, 5, 8, 13, 21];

function CardsGrid({ selectedCard, onSelect, disabled }) {
  return (
    <div className="flex flex-wrap justify-center gap-3 mt-6">
      {CARDS.map((card) => {
        const isSelected = selectedCard === card;

        return (
          <button
            key={card}
            onClick={() => !disabled && onSelect(card)}
            disabled={disabled}
            className={`w-14 h-20 rounded border font-bold text-lg
              ${
                isSelected
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white hover:bg-gray-100"
              } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {card}
          </button>
        );
      })}
    </div>
  );
}

export default CardsGrid;
