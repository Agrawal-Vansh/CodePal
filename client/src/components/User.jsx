import React from "react";
import Avatar from "react-avatar";

function User({ username }) {
  // Safety guard
  if (!username || typeof username !== "string") return null;

  const cleanName = username.trim();

  return (
    <div
      className="flex items-center gap-2 m-2"
      role="listitem"
      aria-label={`User ${cleanName}`}
    >
      <Avatar
        name={cleanName}
        size={44}
        round
        maxInitials={2}
      />
      <span className="truncate">{cleanName}</span>
    </div>
  );
}

export default User;
