import React, { useState, useEffect } from 'react';
import { getInitials, formatTime, truncateText } from '../../utils/helpers.js';
import api from '../../services/api.js';
import { API_ENDPOINTS } from '../../utils/constants.js';
import LoadingSpinner from '../common/LoadingSpinner.jsx';
import styles from './ConversationsList.module.css';

const ConversationsList = ({ 
  conversations, 
  selectedConversation, 
  onSelectConversation, 
  onNewConversation 
}) => {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  useEffect(() => {
    if (conversations) {
      setLoading(false);
    }
  }, [conversations]);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    
    if (query.trim()) {
      try {
        const response = await api.get(API_ENDPOINTS.USERS.SEARCH, {
          params: { q: query }
        });
        setSearchResults(response.data);
        setShowSearchResults(true);
      } catch (error) {
        console.error('Search failed:', error);
      }
    } else {
      setShowSearchResults(false);
    }
  };

  const handleUserSelect = async (user) => {
    try {
      const response = await api.post(API_ENDPOINTS.CONVERSATIONS.BASE, {
        receiverId: user._id
      });
      
      onNewConversation(response.data);
      setShowSearchResults(false);
      setSearchQuery('');
    } catch (error) {
      console.error('Failed to create conversation:', error);
    }
  };

  const getConversationName = (conversation) => {
    if (conversation.name) return conversation.name;
    if (conversation.users && conversation.users.length > 0) {
      const otherUsers = conversation.users.filter(user => 
        user._id !== JSON.parse(localStorage.getItem('user'))?._id
      );
      return otherUsers.map(user => user.name).join(', ');
    }
    return 'Unknown';
  };

  const getConversationAvatar = (conversation) => {
    if (conversation.isGroup) {
      return null;
    }
    if (conversation.users && conversation.users.length > 0) {
      const otherUser = conversation.users.find(user => 
        user._id !== JSON.parse(localStorage.getItem('user'))?._id
      );
      return otherUser?.avatar;
    }
    return null;
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>Conversations</h2>
        </div>
        <div className={styles.loadingContainer}>
          <LoadingSpinner size="medium" />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Conversations</h2>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className={styles.searchInput}
          />
          {showSearchResults && (
            <div className={styles.searchResults}>
              {searchResults.map(user => (
                <div
                  key={user._id}
                  className={styles.searchResultItem}
                  onClick={() => handleUserSelect(user)}
                >
                  <div className={styles.avatar}>
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} />
                    ) : (
                      <span>{getInitials(user.name)}</span>
                    )}
                  </div>
                  <div className={styles.userInfo}>
                    <div className={styles.userName}>{user.name}</div>
                    <div className={styles.userEmail}>{user.email}</div>
                  </div>
                </div>
              ))}
              {searchResults.length === 0 && (
                <div className={styles.noResults}>No users found</div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className={styles.conversations}>
        {conversations?.map(conversation => (
          <div
            key={conversation._id}
            className={`${styles.conversationItem} ${
              selectedConversation?._id === conversation._id ? styles.active : ''
            }`}
            onClick={() => onSelectConversation(conversation)}
          >
            <div className={styles.avatar}>
              {getConversationAvatar(conversation) ? (
                <img 
                  src={getConversationAvatar(conversation)} 
                  alt={getConversationName(conversation)} 
                />
              ) : (
                <span>{getInitials(getConversationName(conversation))}</span>
              )}
            </div>
            
            <div className={styles.conversationInfo}>
              <div className={styles.conversationHeader}>
                <div className={styles.conversationName}>
                  {getConversationName(conversation)}
                </div>
                {conversation.lastMessage && (
                  <div className={styles.timestamp}>
                    {formatTime(conversation.updatedAt)}
                  </div>
                )}
              </div>
              
              <div className={styles.lastMessage}>
                {truncateText(conversation.lastMessage, 35)}
              </div>
              
              {conversation.unreadCount > 0 && (
                <div className={styles.unreadBadge}>
                  {conversation.unreadCount}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {(!conversations || conversations.length === 0) && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>💬</div>
            <p>No conversations yet</p>
            <span>Start a new conversation by searching for users above</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationsList;