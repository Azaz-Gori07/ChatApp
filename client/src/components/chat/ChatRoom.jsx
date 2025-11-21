import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { socketService } from '../../services/socket.js';
import { uploadImage } from '../../services/uploadService.js';
import { getInitials, formatTime } from '../../utils/helpers.js';
import { SOCKET_EVENTS, MESSAGE_TYPES } from '../../utils/constants.js';
import LoadingSpinner from '../common/LoadingSpinner.jsx';
import styles from './ChatRoom.module.css';

const ChatRoom = ({ conversation }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (conversation) {
      loadMessages();
      socketService.joinConversation(conversation._id);
      
      // Set up socket listeners
      socketService.on(SOCKET_EVENTS.NEW_MESSAGE, handleNewMessage);
      socketService.on(SOCKET_EVENTS.TYPING, handleTyping);
    }

    return () => {
      socketService.off(SOCKET_EVENTS.NEW_MESSAGE, handleNewMessage);
      socketService.off(SOCKET_EVENTS.TYPING, handleTyping);
    };
  }, [conversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingUsers]);

  const loadMessages = async () => {
    if (!conversation) return;
    
    setLoading(true);
    try {
      // Mock data for demonstration
      setTimeout(() => {
        setMessages([]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to load messages:', error);
      setLoading(false);
    }
  };

  const handleNewMessage = (message) => {
    if (message.conversationId === conversation._id) {
      setMessages(prev => [...prev, message]);
    }
  };

  const handleTyping = (data) => {
    if (data.conversationId === conversation._id && data.userId !== user._id) {
      setTypingUsers(prev => new Set(prev).add(data.userId));
      
      // Clear typing indicator after 3 seconds
      setTimeout(() => {
        setTypingUsers(prev => {
          const newSet = new Set(prev);
          newSet.delete(data.userId);
          return newSet;
        });
      }, 3000);
    }
  };

  const sendMessage = async (content, type = MESSAGE_TYPES.TEXT) => {
    if ((!content && type === MESSAGE_TYPES.TEXT) || !conversation) return;

    setSending(true);
    
    const messageData = {
      conversationId: conversation._id,
      senderId: user._id,
      content,
      type,
    };

    try {
      socketService.sendMessage(messageData);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      sendMessage(newMessage.trim());
    }
  };

  const handleImageUpload = async (file) => {
    try {
      setSending(true);
      const imageUrl = await uploadImage(file);
      sendMessage(imageUrl, MESSAGE_TYPES.IMAGE);
    } catch (error) {
      console.error('Image upload failed:', error);
    } finally {
      setSending(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getConversationName = () => {
    if (conversation.name) return conversation.name;
    if (conversation.users) {
      const otherUsers = conversation.users.filter(u => u._id !== user._id);
      return otherUsers.map(u => u.name).join(', ');
    }
    return 'Unknown';
  };

  const getOtherUserAvatar = () => {
    if (conversation.isGroup) return null;
    if (conversation.users) {
      const otherUser = conversation.users.find(u => u._id !== user._id);
      return otherUser?.avatar;
    }
    return null;
  };

  if (!conversation) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>💬</div>
        <h3>Select a conversation</h3>
        <p>Choose a conversation from the list to start messaging</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.conversationInfo}>
          <div className={styles.avatar}>
            {getOtherUserAvatar() ? (
              <img src={getOtherUserAvatar()} alt={getConversationName()} />
            ) : (
              <span>{getInitials(getConversationName())}</span>
            )}
          </div>
          <div className={styles.conversationDetails}>
            <div className={styles.conversationName}>{getConversationName()}</div>
            <div className={styles.conversationStatus}>
              {typingUsers.size > 0 ? 'typing...' : 'Online'}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.messagesContainer}>
        {loading ? (
          <div className={styles.loadingContainer}>
            <LoadingSpinner size="medium" />
          </div>
        ) : (
          <>
            <div className={styles.messages}>
              {messages.map((message) => (
                <div
                  key={message._id}
                  className={`${styles.message} ${
                    message.senderId === user._id ? styles.sent : styles.received
                  }`}
                >
                  <div className={styles.messageBubble}>
                    {message.type === MESSAGE_TYPES.IMAGE ? (
                      <img 
                        src={message.content} 
                        alt="Shared" 
                        className={styles.messageImage}
                        onClick={() => window.open(message.content, '_blank')}
                      />
                    ) : (
                      <div className={styles.messageText}>{message.content}</div>
                    )}
                    <div className={styles.messageTime}>
                      {formatTime(message.createdAt)}
                    </div>
                  </div>
                </div>
              ))}
              
              {typingUsers.size > 0 && (
                <div className={`${styles.message} ${styles.received}`}>
                  <div className={styles.messageBubble}>
                    <div className={styles.typingIndicator}>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </>
        )}
      </div>

      <form className={styles.inputContainer} onSubmit={handleSubmit}>
        <div className={styles.inputWrapper}>
          <button
            type="button"
            className={styles.attachButton}
            onClick={() => fileInputRef.current?.click()}
            disabled={sending}
          >
            📎
          </button>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            style={{ display: 'none' }}
          />
          
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className={styles.messageInput}
            disabled={sending}
            onFocus={() => {
              if (conversation) {
                socketService.typing({
                  conversationId: conversation._id,
                });
              }
            }}
          />
          
          <button
            type="submit"
            className={styles.sendButton}
            disabled={sending || !newMessage.trim()}
          >
            {sending ? <LoadingSpinner size="small" /> : '➤'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatRoom;