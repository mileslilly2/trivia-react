// src/hooks/useTriviaSocket.js
import { useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("https://trivia-server-uxu3.onrender.com", {
  transports: ["websocket"],
});

export default function useTriviaSocket({
  setPlayers,
  setQuestion,
  setFeedback,
  setShowNext,
  setDisableAnswers,
  setGameOver,
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

    socket.on("game-over", (finalScores) => {
      setPlayers(finalScores);
      setGameOver(true);
      localStorage.removeItem("question");
    });

    return () => {
      socket.off("players-updated");
      socket.off("new-question");
      socket.off("game-over");
    };
  }, [setPlayers, setQuestion, setFeedback, setShowNext, setDisableAnswers, setGameOver]);

  return socket;
}
