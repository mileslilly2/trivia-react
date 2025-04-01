import React from "react";

export default function QuestionCard({ question, submitAnswer, feedback, showNext, nextQuestion }) {
  return (
    <div className="question-box">
      <h2
        dangerouslySetInnerHTML={{ __html: question.question }}
        className="question-text"
      />
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
  );
}
