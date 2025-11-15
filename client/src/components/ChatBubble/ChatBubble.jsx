import React from "react";
import "./ChatBubble.css";
import Avatar from "../Avatar/Avatar";

const ChatBubble = ({
  message = "",
  time = "",
  isMine = false,
  showAvatar = false,
  avatarSrc = "",
  senderName = "",
}) => {
  return (
    <div className={`bubble-row ${isMine ? "mine" : "theirs"}`}>
      {!isMine && showAvatar && (
        <Avatar src={avatarSrc} name={senderName} size={32} />
      )}

      <div className={`chat-bubble ${isMine ? "mine-bubble" : "their-bubble"}`}>
        <p className="bubble-text">{message}</p>
        <span className="bubble-time">{time}</span>
      </div>
    </div>
  );
};

export default ChatBubble;
