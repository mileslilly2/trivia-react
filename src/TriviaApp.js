// src/TriviaApp.js
import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import "./TriviaApp.css";

// Connect to your Render Socket.IO backend
const socket = io("https://trivia-socket-server.onrender.com", {
  transports: ["websocket"],
});

export default function TriviaApp() {
  const [name, setName] = useState("");
  const [joined, setJoined] = useState(false);
  const [players, setPlayers] = useState({});
  const [question, setQuestion] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [showNext, setShowNext] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  // 🔌 Setup socket listeners on mount
  useEffect(() => {
    socket.on("players-updated", (updatedPlayers) => {
      console.log("Updated players:", updatedPlayers);
      setPlayers(updatedPlayers);
    });

    socket.on("new-question", (q) => {
      setQuestion(q);
      setFeedback("");
      setShowNext(false);
    });

    socket.on("game-over", (finalScores) => {
      setPlayers(finalScores);
      setGameOver(true);
    });

    return () => {
      socket.off("players-updated");
      socket.off("new-question");
      socket.off("game-over");
    };
  }, []);

  const joinGame = () => {
    if (!name.trim()) return;
    socket.emit("player-joined", name.trim());
    setJoined(true);
  };

  const submitAnswer = (selected) => {
    socket.emit("submit-answer", selected);
    setFeedback(`✅ Answer submitted: ${selected}`);
    setShowNext(true);
  };

  const startGame = () => {
    socket.emit("start-game");
  };

  const nextQuestion = () => {
    socket.emit("next-question");
  };

  return (
    <div className="trivia-container">
      <h1 className="title">🎉 Kahoot-Style Trivia</h1>

      {!joined && (
        <div className="name-entry">
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button onClick={joinGame}>Join Game</button>
        </div>
      )}

      {joined && !question && !gameOver && (
        <div>
          <p>Waiting for host to start the game...</p>
          <button onClick={startGame}>Start Game (Host)</button>
        </div>
      )}

      {joined && question && !gameOver && (
        <div className="question-box">
          <h2 dangerouslySetInnerHTML={{ __html: question.question }} className="question-text" />
          <div className="answer-grid">
            {question.answers.map((answer, i) => (
              <button
                key={i}
                className={`answer-btn btn-${i % 4}`}
                onClick={() => submitAnswer(answer)}
                dangerouslySetInnerHTML={{ __html: answer }}
              />
            ))}
          </div>
          <p>{feedback}</p>
          {showNext && <button onClick={nextQuestion}>Next Question</button>}
        </div>
      )}

      {gameOver && (
        <div className="scoreboard">
          <h2>🎉 Game Over!</h2>
          <h3>Final Scores:</h3>
          <ul>
            {Object.values(players).map((p, i) => (
              <li key={i}>
                {p.name}: <strong>{p.score}</strong> points
              </li>
            ))}
          </ul>
          <button onClick={() => window.location.reload()}>Play Again</button>
        </div>
      )}

      <div className="score-box">
        <h3>Players:</h3>
        <ul>
          {Object.values(players).map((p, i) => (
            <li key={i}>
              {p.name}: {p.score}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
