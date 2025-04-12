import React, { useState } from "react";
import Timer from "./Timer";

export default function QuestionCard({
  question,
  submitAnswer,
  feedback,
  showNext,
  nextQuestion,
  onTimeUp,
}) {
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const handleClick = (answer) => {
    if (selectedAnswer) return; // prevent double clicks
    setSelectedAnswer(answer);
    submitAnswer(answer);
  };

  return (
    <div className="question-box">
      <Timer
        key={question.question}
        duration={30}
        onTimeUp={onTimeUp}
      />

      <h2
        dangerouslySetInnerHTML={{ __html: question.question }}
        className="question-text"
      />

      {question?.answers?.length > 0 && (
        <div className="answer-grid">
          {question.answers.map((answer, i) => {
            const isSelected = selectedAnswer === answer;
            const isCorrect = answer === question.correct_answer;
            const isWrong = isSelected && !isCorrect;

            return (
              <button
                key={i}
                className={`answer-btn btn-${i % 4} ${
                  isCorrect && selectedAnswer ? "correct-answer" : ""
                } ${isWrong ? "wrong-answer" : ""}`}
                onClick={() => handleClick(answer)}
                dangerouslySetInnerHTML={{ __html: answer }}
                disabled={!!selectedAnswer}
              />
            );
          })}
        </div>
      )}

      <p>{feedback}</p>
    </div>
  );
}
