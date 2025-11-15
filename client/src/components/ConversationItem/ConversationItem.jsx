import React from "react";
import "./ConversationItem.css";
import Avatar from "../Avatar/Avatar";

const ConversationItem = ({
  name = "",
  avatar = "",
  lastMessage = "",
  time = "",
  unreadCount = 0,
  isActive = false,
  onClick = () => {}
}) => {
  return (
    <div
      className={`conversation-item ${isActive ? "active" : ""}`}
      onClick={onClick}
    >
      <Avatar src={avatar} name={name} size={45} />

      <div className="conversation-info">
        <div className="conversation-top">
          <span className="conversation-name">{name}</span>
          <span className="conversation-time">{time}</span>
        </div>

        <div className="conversation-bottom">
          <span className="conversation-last">{lastMessage}</span>

          {unreadCount > 0 && (
            <span className="conversation-unread">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationItem;
