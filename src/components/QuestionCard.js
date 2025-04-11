import React from "react";
import Timer from "./Timer"; // adjust path if needed

export default function QuestionCard({
  question,
  submitAnswer,
  feedback,
  showNext,
  nextQuestion,
  onTimeUp // 👈 add this prop
}) {
  return (
    <div className="question-box">
      {/* ⏳ Add Timer */}
      <Timer
        key={question.question} // forces reset per new question
        duration={30}           // or any duration you want
        onTimeUp={onTimeUp}     // callback to handle timeout
      />

      <h2
        dangerouslySetInnerHTML={{ __html: question.question }}
        className="question-text"
      />
      {question?.answers?.length > 0 && (
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
    )}

      <p>{feedback}</p>
      {/*showNext && <button onClick={nextQuestion}>Next Question</button>*/}
    </div>
  );
}
