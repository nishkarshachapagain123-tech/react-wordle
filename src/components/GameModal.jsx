
function GameModal({ gameStatus, solutionWord, onRestart }) {
  if (gameStatus === "IN_PROGRESS") {
    return null;
  }

  const won = gameStatus === "WON";

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{won ? "Congratulations! 🎉" : "Game Over!"}</h2>

        <p>
          {won
            ? "You guessed the correct word!"
            : "You have used all 6 attempts."}
        </p>

        <p className="answer">
          The correct word was: <strong>{solutionWord}</strong>
        </p>

        <button className="restart-button" onClick={onRestart}>
          Play Again
        </button>
      </div>
    </div>
  );
}

export default GameModal;
