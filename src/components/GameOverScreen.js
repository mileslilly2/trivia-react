import React from "react";

export default function GameOverScreen({ players }) {
  return (
    <div className="scoreboard">
      <h2>🎉 Game Over!</h2>
      <h3>Final Scores:</h3>
      <ul>
        {Object.values(players).map((p, i) => (
          <li key={i}>
            {p.name}: <strong>{p.score}</strong> points
          </li>
        ))}
      </ul>
      <button onClick={() => window.location.reload()}>Play Again</button>
    </div>
  );
}
