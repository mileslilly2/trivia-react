import React from "react";

export default function PlayerJoinScreen({ name, setName, joinGame }) {
  return (
    <div className="name-entry">
      <h2>Enter your name to join</h2>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={joinGame}>Join Game</button>
    </div>
  );
}
