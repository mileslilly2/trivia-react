import React from "react";

export default function Scoreboard({ players }) {
  return (
    <div className="score-box">
      <h3>Players:</h3>
      <ul>
        {Object.values(players).map((p, i) => (
          <li key={i}>
            {p.name}: {p.score}
          </li>
        ))}
      </ul>
    </div>
  );
}
