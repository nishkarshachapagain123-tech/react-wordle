
import Row from "./Row";

function GameBoard({ pastGuesses, currentGuess }) {
  return (
    <div className="game-board">
      {Array.from({ length: 6 }, (_, index) => {
        const submittedGuess = pastGuesses[index];

        const isCurrentRow =
          index === pastGuesses.length;

        return (
          <Row
            key={index}
            guess={
              submittedGuess
                ? submittedGuess.word
                : isCurrentRow
                ? currentGuess
                : ""
            }
            result={submittedGuess?.result || []}
            isCurrent={isCurrentRow}
          />
        );
      })}
    </div>
  );
}

export default GameBoard;
