import React from "react";

export default function RoleSelector({ role, setRole }) {
  return (
    <div className="role-selector">
      <h2>Select Role</h2>

      {/* If a role has been selected, just show a confirmation */}
      {role ? (
        <p>You selected: <strong>{role}</strong></p>
      ) : (
        <>
          <label>
            <input
              type="radio"
              value="host"
              checked={role === "host"}
              onChange={(e) => setRole(e.target.value)}
            />
            Host
          </label>
          <label>
            <input
              type="radio"
              value="player"
              checked={role === "player"}
              onChange={(e) => setRole(e.target.value)}
            />
            Player
          </label>
        </>
      )}
    </div>
  );
}
