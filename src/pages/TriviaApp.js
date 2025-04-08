import React, { useState, useEffect } from "react";
import RoleSelector from "./RoleSelector";
import PlayerJoinScreen from "./PlayerJoinScreen";
import WaitingRoom from "./WaitingRoom";
import QuestionCard from "../components/QuestionCard";
import GameOverScreen from "../components/GameOverScreen";
import Scoreboard from "../components/Scoreboard";
import TriviaSettings from "../components/TriviaSettings";
import useTriviaSocket from "../hooks/useTrivaSocket.js";
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
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  

  const [currentRound, setCurrentRound] = useState(1);
  const [totalRounds, setTotalRounds] = useState(3); // default 3 rounds
  




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
    role,
    name,
    setPlayers,
    setQuestion,
    setFeedback,
    setShowNext,
    setGameOver,
    setDisableAnswers,
    setCurrentRound,
    setTotalRounds
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

  const startGame = () => {
    if (questions.length > 0) {
      setCurrentQuestionIndex(0);
      setQuestion(questions[0]);
      socket.emit("start-game");
    }
  };
  

  const nextQuestion = () => {
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < questions.length) {
      setCurrentQuestionIndex(nextIndex);
      setQuestion(questions[nextIndex]);
      setFeedback("");
      setShowNext(false);
      setDisableAnswers(false);
    } else {
      setGameOver(true);
    }
  };
  

  const handleTimeUp = () => {
    setFeedback("⏱ Time's up!");
    setShowNext(false);
    setDisableAnswers(true);
    setTimeout(() => nextQuestion(), 2000);
  };

  return (
    <div className="trivia-container">
      <h1 className="title">🎉 Kahoot-Style Trivia</h1>

      {<RoleSelector role={role} setRole={setRole} />}

      {role === "player" && !joined && (
        <PlayerJoinScreen
          name={name}
          setName={setName}
          joinGame={joinGame}
        />
      )}
      {role === "host" && !question && !gameOver && (
  <>
    <h2 className="host-title">Host Mode</h2>
    <p className="host-instructions">
      As the host, you can start the game and manage settings.
      <br></br>
      </p>
      <TriviaSettings setQuestions={setQuestions} />


    <WaitingRoom isHost={role === "host"} startGame={startGame} />
  </>
)}


      {joined && question && !gameOver && (
      <QuestionCard
      question={question}
      submitAnswer={submitAnswer}
      feedback={feedback}
      showNext={showNext}
      nextQuestion={nextQuestion}
      onTimeUp={handleTimeUp}
      disableAnswers={disableAnswers}
    />
    
      )}

      {gameOver && <GameOverScreen players={players} />}
      <Scoreboard players={players} />
    </div>
  );
}
