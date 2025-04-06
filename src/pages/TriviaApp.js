import React, { useState, useEffect } from "react";
import RoleSelector from "./RoleSelector";
import PlayerJoinScreen from "./PlayerJoinScreen";
import WaitingRoom from "./WaitingRoom";
import QuestionCard from "../components/QuestionCard";
import GameOverScreen from "../components/GameOverScreen";
import Scoreboard from "../components/Scoreboard";
import useTriviaSocket from "../hooks/usesocket.js";
import TriviaSettings from "../components/TriviaSettings";
import "../styles/TriviaApp.css";

export default function TriviaApp() {
  const [name, setName] = useState("");
  const [joined, setJoined] = useState(false);
  const [players, setPlayers] = useState({});
  const [question, setQuestion] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [showNext, setShowNext] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [role, setRole] = useState(null);
  const [disableAnswers, setDisableAnswers] = useState(false);

  // 🧠 LocalStorage hydration
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

  // 🧠 Modularized socket handlers
  const socket = useTriviaSocket({
    setPlayers,
    setQuestion,
    setFeedback,
    setShowNext,
    setDisableAnswers,
    setGameOver,
  });
  // 🚀 Socket emitters (UI event handlers)
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

  const startGame = () => socket.emit("start-game");

  const nextQuestion = () => socket.emit("next-question");

  const handleTimeUp = () => {
    setFeedback("⏱ Time's up!");
    setShowNext(false);
    setDisableAnswers(true);
    setTimeout(() => nextQuestion(), 2000);
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
  <>
    <TriviaSettings />
    <WaitingRoom isHost={role === "host"} startGame={startGame} />
  </>
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
