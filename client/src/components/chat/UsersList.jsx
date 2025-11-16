import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { getInitials } from '../../utils/helpers.js';
import api from '../../services/api.js';
import { API_ENDPOINTS } from '../../utils/constants.js';
import LoadingSpinner from '../common/LoadingSpinner.jsx';
import styles from './UsersList.module.css';

const UsersList = ({ onUserSelect, currentConversation }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await api.get(API_ENDPOINTS.USERS.ALL);
      // Filter out current user
      const otherUsers = response.data.filter(user => user._id !== currentUser._id);
      setUsers(otherUsers);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const isUserInCurrentConversation = (user) => {
    if (!currentConversation || !currentConversation.users) return false;
    return currentConversation.users.some(u => u._id === user._id);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>Contacts</h2>
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
        <h2>Contacts</h2>
        <div className={styles.onlineCount}>
          {users.length} online
        </div>
      </div>

      <div className={styles.users}>
        {users.map(user => (
          <div
            key={user._id}
            className={`${styles.userItem} ${
              isUserInCurrentConversation(user) ? styles.inConversation : ''
            }`}
            onClick={() => onUserSelect(user)}
          >
            <div className={styles.avatar}>
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} />
              ) : (
                <span>{getInitials(user.name)}</span>
              )}
              <div className={styles.onlineIndicator}></div>
            </div>
            
            <div className={styles.userInfo}>
              <div className={styles.userName}>{user.name}</div>
              <div className={styles.userStatus}>Online</div>
            </div>
            
            {isUserInCurrentConversation(user) && (
              <div className={styles.inConversationBadge}>In chat</div>
            )}
          </div>
        ))}
        
        {users.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>👥</div>
            <p>No contacts available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersList;