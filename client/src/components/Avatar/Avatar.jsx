import React from "react";
import "./Avatar.css";

const Avatar = ({ src, name = "", size = 40, isOnline = false }) => {
  // If no image → show initials fallback
  const getInitials = () => {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  return (
    <div
      className="avatar-container"
      style={{ width: size, height: size }}
    >
      {src ? (
        <img
          src={src}
          alt={name}
          className="avatar-img"
          style={{ width: size, height: size }}
        />
      ) : (
        <div
          className="avatar-fallback"
          style={{ width: size, height: size, fontSize: size * 0.35 }}
        >
          {getInitials()}
        </div>
      )}

      {isOnline && <span className="avatar-status"></span>}
    </div>
  );
};

export default Avatar;
