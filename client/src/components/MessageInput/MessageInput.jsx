import React, { useState } from "react";
import "./MessageInput.css";

const MessageInput = ({ onSend = () => {} }) => {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;

    onSend(text.trim());
    setText("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="message-input-container">
      {/* Future: attachment button */}
      {/* <button className="msg-attach">+</button> */}

      <textarea
        className="msg-area"
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyPress}
        rows={1}
      />

      <button
        className={`msg-send ${text.trim() ? "active" : ""}`}
        onClick={handleSend}
      >
        ➤
      </button>
    </div>
  );
};

export default MessageInput;
