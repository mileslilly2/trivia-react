import React from "react";

export default function WaitingRoom({ isHost, startGame }) {
  return (
    <div className="waiting-room">
      <p>Waiting for host to start the game...</p>
      {isHost && <button onClick={startGame}>Start Game (Host)</button>}
    </div>
  );
}
