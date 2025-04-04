import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import RoleSelector from "./RoleSelector";
import PlayerJoinScreen from "./PlayerJoinScreen";
import WaitingRoom from "./WaitingRoom";
import QuestionCard from "../components/QuestionCard";
import GameOverScreen from "../components/GameOverScreen";
import Scoreboard from "../components/Scoreboard";

import "../styles/TriviaApp.css";

const socket = io("https://trivia-server-uxu3.onrender.com", {
  transports: ["websocket"],
});

export default function TriviaApp() {
  console.log("TriviaApp rendered");

  const [name, setName] = useState("");
  const [joined, setJoined] = useState(false);
  const [players, setPlayers] = useState({});
  const [question, setQuestion] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [showNext, setShowNext] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [role, setRole] = useState(null);
  const [disableAnswers, setDisableAnswers] = useState(false);

  // 🧠 Load saved state on initial mount
  useEffect(() => {
    const savedRole = localStorage.getItem("role");
    const savedJoined = localStorage.getItem("joined") === "true";
    const savedName = localStorage.getItem("name");
    const savedQuestion = localStorage.getItem("question");

    if (savedRole) setRole(savedRole);
    if (savedJoined) setJoined(true);
    if (savedName) setName(savedName);
    if (savedQuestion) setQuestion(JSON.parse(savedQuestion));
  }, []);

  // 💾 Save to localStorage when values change
  useEffect(() => {
    if (role) localStorage.setItem("role", role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem("joined", joined);
  }, [joined]);

  useEffect(() => {
    localStorage.setItem("name", name);
  }, [name]);

  useEffect(() => {
    if (question) {
      localStorage.setItem("question", JSON.stringify(question));
    }
  }, [question]);

  useEffect(() => {
    socket.on("players-updated", (updatedPlayers) => {
      setPlayers(updatedPlayers);
    });

    socket.on("new-question", (q) => {
      setQuestion(q);
      setFeedback("");
      setShowNext(false);
      setDisableAnswers(false);
    });

    socket.on("game-over", (finalScores) => {
      setPlayers(finalScores);
      setGameOver(true);
      localStorage.removeItem("question"); // Clear saved question at game end
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
    setShowNext(false);
    setDisableAnswers(true);
  };

  const startGame = () => {
    socket.emit("start-game");
  };

  const nextQuestion = () => {
    socket.emit("next-question");
  };

  const handleTimeUp = () => {
    setFeedback("⏱ Time's up!");
    setShowNext(false);
    setDisableAnswers(true);

    setTimeout(() => {
      nextQuestion();
    }, 2000);
  };

  return (
    <div className="trivia-container">
      <h1 className="title">🎉 Kahoot-Style Trivia</h1>

      {!role && <RoleSelector role={role} setRole={setRole} />}

      {role === "player" && !joined && (
        <PlayerJoinScreen
          name={name}
          setName={setName}
          joinGame={joinGame}
        />
      )}

      {role === "host" && !question && !gameOver && (
        <WaitingRoom isHost={role === "host"} startGame={startGame} />
      )}

      {joined && question && !gameOver && (
        <QuestionCard
          question={question}
          submitAnswer={submitAnswer}
          feedback={feedback}
          showNext={false}
          nextQuestion={null}
          onTimeUp={handleTimeUp}
          disableAnswers={disableAnswers}
        />
      )}

      {gameOver && <GameOverScreen players={players} />}
      <Scoreboard players={players} />
    </div>
  );
}
