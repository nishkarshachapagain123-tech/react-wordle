
const keyboardRows = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"]
];

function Keyboard({ onKeyPress, keyStatuses }) {
  return (
    <div className="keyboard">
      {keyboardRows.map((row, rowIndex) => (
        <div className="keyboard-row" key={rowIndex}>
          {row.map((key) => {
            const status = keyStatuses[key] || "";

            return (
              <button
                key={key}
                className={[
                  "key",
                  key.length > 1 ? "wide-key" : "",
                  status
                ].filter(Boolean).join(" ")}
                onClick={() => onKeyPress(key)}
                aria-label={
                  key === "BACKSPACE" ? "Backspace" : key
                }
              >
                {key === "BACKSPACE" ? "⌫" : key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default Keyboard;
