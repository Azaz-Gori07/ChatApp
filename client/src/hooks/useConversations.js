import { useEffect, useState } from "react";
import {
  getConversations,
  getConversationMessages,
} from "../api/conversations";
import { useSocket } from "../context/SocketContext";

export default function useConversations() {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);

  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const { incomingMessage } = useSocket();

  // --------------------------------------------------
  // Load conversations on first render
  // --------------------------------------------------
  useEffect(() => {
    const load = async () => {
      try {
        setLoadingConversations(true);
        const res = await getConversations();
        setConversations(res.data);
      } catch (err) {
        console.log("❌ Error loading conversations:", err);
      } finally {
        setLoadingConversations(false);
      }
    };

    load();
  }, []);

  // --------------------------------------------------
  // Load messages when active conversation changes
  // --------------------------------------------------
  const loadMessages = async (conversationId) => {
    try {
      setLoadingMessages(true);
      const res = await getConversationMessages(conversationId);
      setMessages(res.data);
    } catch (err) {
      console.log("❌ Error loading messages:", err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const selectConversation = (conversation) => {
    setActiveConversation(conversation);
    loadMessages(conversation.id);
  };

  // --------------------------------------------------
  // Handle incoming messages from socket
  // --------------------------------------------------
  useEffect(() => {
    if (!incomingMessage) return;

    const msg = incomingMessage;

    // Update messages if it's for currently open chat
    if (activeConversation && msg.conversationId === activeConversation.id) {
      setMessages((prev) => [...prev, msg]);
    }

    // Update lastMessage preview
    setConversations((prev) =>
      prev.map((c) =>
        c.id === msg.conversationId
          ? { ...c, lastMessage: msg.content }
          : c
      )
    );
  }, [incomingMessage, activeConversation]);

  return {
    conversations,
    activeConversation,
    messages,
    loadingConversations,
    loadingMessages,
    selectConversation,
    setMessages,
  };
}
