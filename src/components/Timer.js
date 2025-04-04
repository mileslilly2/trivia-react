import React, { useState, useEffect } from "react";
import "../styles/Timer.css";


const Timer = ({ duration = 30, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, onTimeUp]);

  return (
    <div className="timer-box">
      <p className="timer-text">⏳ {timeLeft}s</p>
    </div>
  );
};

export default Timer;
