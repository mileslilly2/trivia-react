// src/hooks/useTriviaSocket.js
import { useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("https://trivia-server-uxu3.onrender.com", {
  transports: ["websocket"],
});

export default function useSocket({
  setPlayers,
  setQuestion,
  setQuestions,
  setFeedback,
  setShowNext,
  setDisableAnswers,
  setGameOver,
  setCurrentRound,
  setCurrentQuestionIndex,
}) {
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

    socket.on("questions", (questions) => {
      setQuestions(questions);
      if (setCurrentQuestionIndex) setCurrentQuestionIndex(0); // FIXED
      setQuestion(questions[0]);
    });

    socket.on("next-round", () => {
      if (setCurrentRound) setCurrentRound((prev) => prev + 1); // FIXED
      if (setCurrentQuestionIndex) setCurrentQuestionIndex(0); // FIXED
    });

    socket.on("game-over", (finalScores) => {
      setPlayers(finalScores);
      setGameOver(true);
      localStorage.removeItem("question");
    });

    socket.on("reset-game", () => {
      setGameOver(false);
      setFeedback("");
      setShowNext(false);
      if (setCurrentRound) setCurrentRound(1); // FIXED
      if (setCurrentQuestionIndex) setCurrentQuestionIndex(0); // FIXED
      setQuestion(null);
      if (setQuestions) setQuestions([]); // FIXED
    });

    return () => {
      socket.off("players-updated");
      socket.off("new-question");
      socket.off("questions");
      socket.off("next-round");
      socket.off("game-over");
      socket.off("reset-game");
    };
  }, [
    setPlayers,
    setQuestion,
    setQuestions,
    setFeedback,
    setShowNext,
    setDisableAnswers,
    setGameOver,
    setCurrentRound,
    setCurrentQuestionIndex,
  ]);

  return socket;
}
