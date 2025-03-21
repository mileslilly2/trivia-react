import React, { useState, useEffect } from "react";
import "./TriviaApp.css";

const CATEGORIES = [
  { id: 9, name: "General Knowledge" },
  { id: 10, name: "Books" },
  { id: 11, name: "Film" },
  { id: 12, name: "Music" },
  { id: 21, name: "Sports" },
  { id: 23, name: "History" },
  { id: 27, name: "Animals" },
];

const DIFFICULTIES = ["easy", "medium", "hard"];

export default function TriviaApp() {
  const [token, setToken] = useState("");

  // Multiplayer state
  const [players, setPlayers] = useState([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [nameInput, setNameInput] = useState("");
  const [gameStarted, setGameStarted] = useState(false);

  // Game settings
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0].id);
  const [selectedDifficulty, setSelectedDifficulty] = useState(DIFFICULTIES[0]);
  const [questionsPerRound, setQuestionsPerRound] = useState(5);
  const [totalRounds, setTotalRounds] = useState(1);

  // Question state
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [question, setQuestion] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [shuffledAnswers, setShuffledAnswers] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [showNext, setShowNext] = useState(false);

  const [currentRound, setCurrentRound] = useState(1);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    getToken();
  }, []);

  const getToken = async () => {
    const res = await fetch("https://opentdb.com/api_token.php?command=request");
    const data = await res.json();
    setToken(data.token);
  };

  const resetToken = async () => {
    if (!token) return;
    await fetch(`https://opentdb.com/api_token.php?command=reset&token=${token}`);
  };

  const fetchQuestions = async () => {
    if (!token) return;

    const url = `https://opentdb.com/api.php?amount=${questionsPerRound}&type=multiple&category=${selectedCategory}&difficulty=${selectedDifficulty}&token=${token}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.response_code === 0) {
      setQuestions(data.results);
      setCurrentIndex(0);
      loadQuestion(data.results, 0);
    } else if (data.response_code === 4) {
      alert("All available questions have been used. Resetting token...");
      await resetToken();
      setCurrentRound(1);
      setPlayers(players.map((p) => ({ ...p, score: 0 })));
    }
  };

  const loadQuestion = (questionsArray, index) => {
    const current = questionsArray[index];
    if (!current) return;

    setQuestion(current.question);
    setCorrectAnswer(current.correct_answer);
    const allAnswers = [...current.incorrect_answers, current.correct_answer];
    setShuffledAnswers(allAnswers.sort(() => Math.random() - 0.5));
    setFeedback("");
    setShowNext(false);
  };

  const checkAnswer = (selected) => {
    let newPlayers = [...players];

    if (selected === correctAnswer) {
      setFeedback(`✅ Correct!`);
      newPlayers[currentPlayerIndex].score += 1;
    } else {
      setFeedback(`❌ Wrong! Correct: ${correctAnswer}`);
    }

    setPlayers(newPlayers);
    setShowNext(true);
  };

  const nextQuestion = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < questions.length) {
      setCurrentIndex(nextIndex);
      loadQuestion(questions, nextIndex);
      setCurrentPlayerIndex((prev) => (prev + 1) % players.length);
    } else {
      if (currentRound < totalRounds) {
        setCurrentRound(currentRound + 1);
        fetchQuestions();
      } else {
        setGameOver(true);
        resetToken();
      }
    }
  };

  const addPlayer = () => {
    if (nameInput.trim()) {
      setPlayers([...players, { name: nameInput.trim(), score: 0 }]);
      setNameInput("");
    }
  };

  const startGame = () => {
    if (players.length < 2) {
      alert("You need at least two players to start.");
      return;
    }
    setGameStarted(true);
    setCurrentPlayerIndex(0);
    fetchQuestions();
  };

  return (
    <div className="trivia-container">
      <h1 className="title">Multiplayer Trivia</h1>

      {!gameStarted && (
        <div className="name-entry">
          <input
            type="text"
            placeholder="Enter player name"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
          />
          <button onClick={addPlayer}>Add Player</button>

          <h3>Players:</h3>
          <ul>
            {players.map((p, i) => (
              <li key={i}>{p.name}</li>
            ))}
          </ul>

          <button className="start-btn" onClick={startGame}>Start Game</button>
        </div>
      )}

      {gameStarted && question && !gameOver && (
        <div className="question-box">
          <h2>{players[currentPlayerIndex].name}'s Turn</h2>
          <h2 dangerouslySetInnerHTML={{ __html: question }} className="question-text" />
          <div className="answer-grid">
            {shuffledAnswers.map((answer, i) => (
              <button
                key={i}
                className={`answer-btn btn-${i % 4}`}
                onClick={() => checkAnswer(answer)}
                dangerouslySetInnerHTML={{ __html: answer }}
              />
            ))}
          </div>

          {feedback && <p className="feedback">{feedback}</p>}
          {showNext && <button className="next-btn" onClick={nextQuestion}>Next</button>}
        </div>
      )}

      {gameOver && (
        <div className="scoreboard">
          <h2>🎉 Game Over!</h2>
          <h3>Final Scores:</h3>
          <ul>
            {players.map((p, i) => (
              <li key={i}>
                {p.name}: <strong>{p.score}</strong> points
              </li>
            ))}
          </ul>
          <button onClick={() => window.location.reload()}>Play Again</button>
        </div>
      )}
    </div>
  );
}
