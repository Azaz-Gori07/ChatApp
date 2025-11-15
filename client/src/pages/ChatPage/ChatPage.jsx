import React from "react";
import "./ChatPage.css";

import MainLayout from "../../layouts/MainLayout";
import ConversationItem from "../../components/ConversationItem/ConversationItem";
import ChatBubble from "../../components/ChatBubble/ChatBubble";
import MessageInput from "../../components/MessageInput/MessageInput";
import useConversations from "../../hooks/useConversations";
import { useAuth } from "../../context/AuthContext";  


const ChatPage = () => {
  const { user } = useAuth();
  const {
    conversations,
    activeConversation,
    messages,
    selectConversation
  } = useConversations();

  return (
    <MainLayout
      sidebar={
        <div className="sidebar-list">
          <h3 className="sidebar-title">Chats</h3>

          {conversations.map((conv) => (
            <ConversationItem
              key={conv.id}
              name={conv.name}
              avatar={conv.avatar}
              lastMessage={conv.lastMessage}
              time={conv.time}
              isActive={activeConversation?.id === conv.id}
              onClick={() => selectConversation(conv)}
            />
          ))}
        </div>
      }
      chat={
        <div className="chat-window">
          {!activeConversation ? (
            <div className="chat-empty">Select a conversation to start chatting</div>
          ) : (
            <>
              <div className="chat-header">
                <h4>{activeConversation.name}</h4>
              </div>

              <div className="chat-messages">
                {messages.map((msg) => (
                  <ChatBubble
                    key={msg.id}
                    message={msg.content}
                    time={msg.createdAt}
                    isMine={msg.senderId === user?.id}
                  />
                ))}
              </div>

              <MessageInput
                onSend={(text) =>
                  console.log("send", text) // will integrate socket later
                }
              />
            </>
          )}
        </div>
      }
    />
  );
};

export default ChatPage;
