import { useEffect, useState } from "react";
import { sendMessage as apiSendMessage } from "../api/messages";
import { useSocket } from "../context/SocketContext";

export default function useMessages(activeConversation) {
  const { sendMessage: socketSend, incomingMessage } = useSocket();

  const [messages, setMessages] = useState([]);
  const [sending, setSending] = useState(false);

  // -------------------------------------
  // When conversation changes → clear & set messages
  // (Parent should load messages and pass into this hook)
  // -------------------------------------
  useEffect(() => {
    if (!activeConversation) return;
    setMessages([]); // clear old
  }, [activeConversation]);

  // -------------------------------------
  // Receive new incoming messages
  // -------------------------------------
  useEffect(() => {
    if (!incomingMessage) return;
    if (!activeConversation) return;

    // Only update if message is for current chat
    if (incomingMessage.conversationId === activeConversation.id) {
      setMessages((prev) => [...prev, incomingMessage]);
    }
  }, [incomingMessage, activeConversation]);

  // -------------------------------------
  // Send message (local + API + socket)
  // -------------------------------------
  const sendMessage = async (text, senderId) => {
    if (!activeConversation) return;

    const tempMessage = {
      id: "temp-" + Date.now(),
      conversationId: activeConversation.id,
      senderId,
      content: text,
      createdAt: new Date().toISOString(),
      pending: true,
    };

    // Optimistic update
    setMessages((prev) => [...prev, tempMessage]);

    try {
      setSending(true);

      // Send message via API
      const res = await apiSendMessage({
        conversationId: activeConversation.id,
        content: text,
      });

      const serverMessage = res.data;

      // Replace tempMessage with serverMessage
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempMessage.id ? serverMessage : msg
        )
      );

      // Send to WebSocket
      socketSend(serverMessage);
    } catch (err) {
      console.log("❌ Error sending message:", err);

      // Mark message failed
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempMessage.id
            ? { ...msg, pending: false, failed: true }
            : msg
        )
      );
    } finally {
      setSending(false);
    }
  };

  return {
    messages,
    setMessages,
    sending,
    sendMessage,
  };
}
