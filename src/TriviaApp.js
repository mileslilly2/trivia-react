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
  const [playerName, setPlayerName] = useState("");
  const [nameEntered, setNameEntered] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0].id);
  const [selectedDifficulty, setSelectedDifficulty] = useState(DIFFICULTIES[0]);
  const [questionsPerRound, setQuestionsPerRound] = useState(5);
  const [totalRounds, setTotalRounds] = useState(1);

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [question, setQuestion] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [shuffledAnswers, setShuffledAnswers] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [showNext, setShowNext] = useState(false);

  const [score, setScore] = useState(0);
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
      setScore(0);
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
    if (selected === correctAnswer) {
      setFeedback("✅ Correct!");
      setScore((prev) => prev + 1);
    } else {
      setFeedback(`❌ Wrong! Correct: ${correctAnswer}`);
    }
    setShowNext(true);
  };

  const nextQuestion = () => {
    const next = currentIndex + 1;
    setCurrentIndex(next);
    if (next < questions.length) {
      loadQuestion(questions, next);
    } else {
      if (currentRound < totalRounds) {
        setCurrentRound((r) => r + 1);
        fetchQuestions();
      } else {
        setGameOver(true);
        resetToken(); // token reset at end of game
      }
    }
  };

  const startGame = () => {
    setScore(0);
    setCurrentRound(1);
    setGameOver(false);
    fetchQuestions();
  };

  const handleNameSubmit = () => {
    if (playerName.trim()) {
      setNameEntered(true);
    }
  };

  return (
    <div className="trivia-container">
      <h1 className="title">Kahoot-Style Trivia</h1>

      {/* Name entry */}
      {!nameEntered && (
        <div className="name-entry">
          <input
            type="text"
            placeholder="Enter your name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
          />
          <button onClick={handleNameSubmit}>Continue</button>
        </div>
      )}

      {/* Game Setup */}
      {nameEntered && !question && !gameOver && (
        <div className="settings">
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          <select value={selectedDifficulty} onChange={(e) => setSelectedDifficulty(e.target.value)}>
            {DIFFICULTIES.map((diff) => (
              <option key={diff} value={diff}>{diff}</option>
            ))}
          </select>

          <select value={questionsPerRound} onChange={(e) => setQuestionsPerRound(Number(e.target.value))}>
            {[3, 5, 10, 15].map((n) => (
              <option key={n} value={n}>{n} Questions</option>
            ))}
          </select>

          <select value={totalRounds} onChange={(e) => setTotalRounds(Number(e.target.value))}>
            {[1, 2, 3, 5].map((r) => (
              <option key={r} value={r}>{r} Rounds</option>
            ))}
          </select>

          <button className="start-btn" onClick={startGame}>Start Game</button>
        </div>
      )}

      {/* Active Question */}
      {question && !gameOver && (
        <div className="question-box">
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

      {/* Final Scoreboard */}
      {gameOver && (
        <div className="scoreboard">
          <h2>🎉 Game Over!</h2>
          <p>Player: <strong>{playerName}</strong></p>
          <p>Rounds Completed: {totalRounds}</p>
          <p>Final Score: {score} / {totalRounds * questionsPerRound}</p>
          <button onClick={() => setGameOver(false)}>Play Again</button>
        </div>
      )}

      {/* Score display */}
      {!gameOver && nameEntered && (
        <div className="score-box">
          Round {currentRound}/{totalRounds} | Score: {score}
        </div>
      )}
    </div>
  );
}
