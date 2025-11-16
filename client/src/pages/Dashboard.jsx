import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { socketService } from '../services/socket';
import ConversationsList from '../components/chat/ConversationsList';
import ChatRoom from '../components/chat/ChatRoom';
import UsersList from '../components/chat/UsersList';
import ProfileModal from '../components/chat/ProfileModal';
import SettingsBar from '../components/chat/SettingsBar';
import api from '../services/api';
import { API_ENDPOINTS } from '../utils/constants';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const { user, accessToken, logout } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState({
    left: true,
    right: true
  });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  useEffect(() => {
    if (accessToken) {
      socketService.connect(accessToken);
      loadConversations();
    }

    return () => {
      socketService.disconnect();
    };
  }, [accessToken]);

  const loadConversations = async () => {
    try {
      const response = await api.get(API_ENDPOINTS.CONVERSATIONS.BASE);
      setConversations(response.data);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    }
  };

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    if (isMobile) {
      setSidebarOpen(prev => ({ ...prev, left: false }));
    }
  };

  const handleNewConversation = (conversation) => {
    setConversations(prev => [conversation, ...prev]);
    setSelectedConversation(conversation);
    if (isMobile) {
      setSidebarOpen(prev => ({ ...prev, left: false }));
    }
  };

  const handleUserSelect = async (user) => {
    try {
      const response = await api.post(API_ENDPOINTS.CONVERSATIONS.BASE, {
        receiverId: user._id
      });
      
      const existingConv = conversations.find(c => c._id === response.data._id);
      if (!existingConv) {
        setConversations(prev => [response.data, ...prev]);
      }
      setSelectedConversation(response.data);
      
      if (isMobile) {
        setSidebarOpen(prev => ({ ...prev, right: false }));
      }
    } catch (error) {
      console.error('Failed to create conversation:', error);
    }
  };

  // Fixed toggle function
  const toggleSidebar = (side) => {
    setSidebarOpen(prev => ({
      ...prev,
      [side]: !prev[side]
    }));
  };

  const handleOverlayClick = (side) => {
    if (isMobile) {
      setSidebarOpen(prev => ({ ...prev, [side]: false }));
    }
  };

  const handleChatAreaClick = () => {
    if (isMobile) {
      setSidebarOpen({ left: false, right: false });
    }
  };

  // Mobile-optimized header layout
  const renderMobileHeader = () => (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <button 
          className={styles.sidebarToggle}
          onClick={() => toggleSidebar('left')}
          aria-label="Toggle conversations"
        >
          ☰
        </button>
        <h1 className={styles.logo}>ChatApp</h1>
      </div>
      
      <div className={styles.headerRight}>
        <button 
          className={styles.settingsButton}
          onClick={() => setShowSettings(true)}
          title="Settings"
          aria-label="Open settings"
        >
          ⚙️
        </button>
        
        <button 
          className={styles.profileButton}
          onClick={() => setShowProfileModal(true)}
          aria-label="Open profile"
          title={user?.name}
        >
          <div className={styles.avatar}>
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} />
            ) : (
              <span>{user?.name?.charAt(0).toUpperCase()}</span>
            )}
          </div>
        </button>
        
        <button 
          className={styles.sidebarToggle}
          onClick={() => toggleSidebar('right')}
          aria-label="Toggle contacts"
        >
          👥
        </button>
      </div>
    </header>
  );

  // Desktop header layout
  const renderDesktopHeader = () => (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <button 
          className={styles.sidebarToggle}
          onClick={() => toggleSidebar('left')}
          aria-label={sidebarOpen.left ? "Hide conversations" : "Show conversations"}
        >
          {sidebarOpen.left ? '📁' : '📂'}
        </button>
        <h1 className={styles.logo}>ChatApp</h1>
      </div>
      
      <div className={styles.headerCenter}>
        <div className={styles.welcome}>
          Welcome back, <strong>{user?.name}</strong>!
        </div>
      </div>
      
      <div className={styles.headerRight}>
        <button 
          className={styles.settingsButton}
          onClick={() => setShowSettings(true)}
          title="Settings"
          aria-label="Open settings"
        >
          ⚙️
        </button>
        
        <button 
          className={styles.profileButton}
          onClick={() => setShowProfileModal(true)}
          aria-label="Open profile"
        >
          <div className={styles.avatar}>
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} />
            ) : (
              <span>{user?.name?.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <span className={styles.userName}>{user?.name}</span>
        </button>
        
        <button 
          className={styles.logoutButton}
          onClick={logout}
          aria-label="Logout"
        >
          Logout
        </button>
        
        <button 
          className={styles.sidebarToggle}
          onClick={() => toggleSidebar('right')}
          aria-label={sidebarOpen.right ? "Hide contacts" : "Show contacts"}
        >
          {sidebarOpen.right ? '👥' : '👤'}
        </button>
      </div>
    </header>
  );

  return (
    <div className={styles.dashboard}>
      {isMobile ? renderMobileHeader() : renderDesktopHeader()}

      <div className={styles.mainContent}>
        {/* Left Sidebar */}
        <div 
          className={`${styles.sidebarLeft} ${sidebarOpen.left ? styles.open : ''}`}
          style={!isMobile && !sidebarOpen.left ? { display: 'none' } : {}}
        >
          {isMobile && sidebarOpen.left && (
            <div 
              className={styles.sidebarOverlay}
              onClick={() => handleOverlayClick('left')}
            />
          )}
          <ConversationsList
            conversations={conversations}
            selectedConversation={selectedConversation}
            onSelectConversation={handleSelectConversation}
            onNewConversation={handleNewConversation}
          />
        </div>

        {/* Chat Area */}
        <div 
          className={styles.chatArea} 
          onClick={handleChatAreaClick}
        >
          <ChatRoom conversation={selectedConversation} />
        </div>

        {/* Right Sidebar */}
        <div 
          className={`${styles.sidebarRight} ${sidebarOpen.right ? styles.open : ''}`}
          style={!isMobile && !sidebarOpen.right ? { display: 'none' } : {}}
        >
          {isMobile && sidebarOpen.right && (
            <div 
              className={styles.sidebarOverlay}
              onClick={() => handleOverlayClick('right')}
            />
          )}
          <UsersList
            onUserSelect={handleUserSelect}
            currentConversation={selectedConversation}
          />
        </div>
      </div>

      {/* Modals */}
      {showProfileModal && (
        <ProfileModal onClose={() => setShowProfileModal(false)} />
      )}

      {showSettings && (
        <SettingsBar 
          isOpen={showSettings} 
          onClose={() => setShowSettings(false)} 
        />
      )}
    </div>
  );
};

export default Dashboard;