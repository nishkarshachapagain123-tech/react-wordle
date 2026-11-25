
import { useState, useEffect, useCallback } from "react";

import GameBoard from "./components/GameBoard";
import Keyboard from "./components/Keyboard";
import GameModal from "./components/GameModal";

import { SOLUTION_WORDS, VALID_WORDS } from "./wordList";

const getRandomWord = () => {
  const randomIndex = Math.floor(
    Math.random() * SOLUTION_WORDS.length
  );

  return SOLUTION_WORDS[randomIndex];
};

// Evaluate each letter using Wordle rules.
function evaluateGuess(guess, solution) {
  const result = Array(5).fill("absent");
  const remainingLetters = solution.split("");

  // First pass: identify correct letters.
  for (let i = 0; i < 5; i++) {
    if (guess[i] === solution[i]) {
      result[i] = "correct";
      remainingLetters[i] = null;
    }
  }

  // Second pass: identify letters in the wrong position.
  for (let i = 0; i < 5; i++) {
    if (result[i] === "correct") {
      continue;
    }

    const letterIndex = remainingLetters.indexOf(guess[i]);

    if (letterIndex !== -1) {
      result[i] = "present";
      remainingLetters[letterIndex] = null;
    }
  }

  return result;
}

function App() {
  const [solutionWord, setSolutionWord] = useState(getRandomWord);
  const [currentGuess, setCurrentGuess] = useState("");
  const [pastGuesses, setPastGuesses] = useState([]);
  const [gameStatus, setGameStatus] = useState("IN_PROGRESS");
  const [message, setMessage] = useState("");

  // Create keyboard colors based on submitted guesses.
  const keyStatuses = {};

  const priority = {
    absent: 1,
    present: 2,
    correct: 3
  };

  pastGuesses.forEach((guess) => {
    guess.word.split("").forEach((letter, index) => {
      const newStatus = guess.result[index];
      const oldStatus = keyStatuses[letter];

      if (
        !oldStatus ||
        priority[newStatus] > priority[oldStatus]
      ) {
        keyStatuses[letter] = newStatus;
      }
    });
  });

  // Handle Enter, Backspace and alphabetical input.
  const handleKeyPress = useCallback((key) => {
    if (gameStatus !== "IN_PROGRESS") {
      return;
    }

    if (key === "ENTER") {
      if (currentGuess.length !== 5) {
        setMessage("Word must contain 5 letters!");
        return;
      }

      if (currentGuess.length !== 5) {
  setMessage("Enter exactly 5 letters!");
  return;
      }

      const result = evaluateGuess(
        currentGuess,
        solutionWord
      );

      const newGuess = {
        word: currentGuess,
        result: result
      };

      const updatedGuesses = [
        ...pastGuesses,
        newGuess
      ];

      setPastGuesses(updatedGuesses);
      setCurrentGuess("");
      setMessage("");

      if (currentGuess === solutionWord) {
        setGameStatus("WON");
      } else if (updatedGuesses.length === 6) {
        setGameStatus("LOST");
      }

      return;
    }

    if (key === "BACKSPACE") {
      setCurrentGuess((previous) => previous.slice(0, -1));
      setMessage("");
      return;
    }

    if (/^[A-Z]$/.test(key)) {
      setCurrentGuess((previous) => {
        if (previous.length >= 5) {
          return previous;
        }

        return previous + key;
      });

      setMessage("");
    }
  }, [gameStatus, currentGuess, pastGuesses, solutionWord]);

  // Listen to physical keyboard input.
  useEffect(() => {
    const handlePhysicalKeyboard = (event) => {
      if (event.ctrlKey || event.altKey || event.metaKey) {
        return;
      }

      if (event.key === "Enter") {
        event.preventDefault();
        handleKeyPress("ENTER");
      } else if (event.key === "Backspace") {
        event.preventDefault();
        handleKeyPress("BACKSPACE");
      } else if (/^[a-zA-Z]$/.test(event.key)) {
        handleKeyPress(event.key.toUpperCase());
      }
    };

    window.addEventListener(
      "keydown",
      handlePhysicalKeyboard
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handlePhysicalKeyboard
      );
    };
  }, [handleKeyPress]);

  // Start a new game.
  const restartGame = () => {
    let newWord = getRandomWord();

    if (SOLUTION_WORDS.length > 1) {
      while (newWord === solutionWord) {
        newWord = getRandomWord();
      }
    }

    setSolutionWord(newWord);
    setCurrentGuess("");
    setPastGuesses([]);
    setGameStatus("IN_PROGRESS");
    setMessage("");
  };

  return (
    <div className="app">
      <header className="header">
        <h1>WORDLE</h1>

        <p className="subtitle">
          Guess the hidden five-letter word!
        </p>

        <button
          className="new-game-button"
          onClick={restartGame}
        >
          New Game
        </button>
      </header>

      <main className="game-container">
        <div className="instructions">
          <p>
            You have <strong>6 attempts</strong> to guess
            the correct word.
          </p>
        </div>

        <div className="message" aria-live="polite">
          {message}
        </div>

        <GameBoard
          pastGuesses={pastGuesses}
          currentGuess={currentGuess}
        />

        <Keyboard
          onKeyPress={handleKeyPress}
          keyStatuses={keyStatuses}
        />

        <div className="legend">
          <div>
            <span className="legend-box correct"></span>
            Correct position
          </div>

          <div>
            <span className="legend-box present"></span>
            Wrong position
          </div>

          <div>
            <span className="legend-box absent"></span>
            Not in word
          </div>
        </div>
      </main>

      <footer className="footer">
        <p>React Wordle Clone | Built with React and Vite</p>
      </footer>

      <GameModal
        gameStatus={gameStatus}
        solutionWord={solutionWord}
        onRestart={restartGame}
      />
    </div>
  );
}

export default App;
