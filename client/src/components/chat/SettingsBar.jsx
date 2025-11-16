import React, { useState, useEffect } from 'react';
import styles from './SettingsBar.module.css';

const SettingsBar = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState({
    // Notifications
    notifications: true,
    messageSounds: true,
    notificationSound: 'chime',
    vibration: true,
    
    // Privacy
    readReceipts: true,
    typingIndicators: true,
    onlineStatus: true,
    lastSeen: true,
    
    // Appearance
    darkMode: true,
    fontSize: 'medium',
    messageBubbleStyle: 'rounded',
    theme: 'black-white',
    
    // Media & Files
    autoDownload: false,
    imageQuality: 'standard',
    saveToCameraRoll: false,
    
    // Chat
    enterToSend: true,
    emojiKeyboard: true,
    textPreview: true
  });

  const [audio] = useState(new Audio()); // For notification sounds

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('chatSettings');
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      setSettings(parsedSettings);
      applySettings(parsedSettings);
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('chatSettings', JSON.stringify(settings));
    applySettings(settings);
  }, [settings]);

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    
    // Play test sound for sound settings
    if (key === 'messageSounds' && value) {
      playTestSound();
    }
  };

  const applySettings = (newSettings) => {
    // Apply theme settings
    const root = document.documentElement;
    
    if (newSettings.darkMode) {
      root.style.setProperty('--bg-primary', '#0a0a0a');
      root.style.setProperty('--bg-secondary', '#111111');
      root.style.setProperty('--bg-tertiary', '#1a1a1a');
      root.style.setProperty('--bg-card', '#1f1f1f');
      root.style.setProperty('--text-primary', '#ffffff');
      root.style.setProperty('--text-secondary', '#b3b3b3');
    } else {
      root.style.setProperty('--bg-primary', '#ffffff');
      root.style.setProperty('--bg-secondary', '#f8f9fa');
      root.style.setProperty('--bg-tertiary', '#e9ecef');
      root.style.setProperty('--bg-card', '#ffffff');
      root.style.setProperty('--text-primary', '#000000');
      root.style.setProperty('--text-secondary', '#6c757d');
    }

    // Apply font size
    const fontSizeMap = {
      small: '14px',
      medium: '16px',
      large: '18px'
    };
    root.style.setProperty('--base-font-size', fontSizeMap[newSettings.fontSize] || '16px');

    // Apply message bubble style
    const bubbleRadiusMap = {
      rounded: '18px',
      square: '8px',
      'rounded-small': '12px'
    };
    root.style.setProperty('--bubble-radius', bubbleRadiusMap[newSettings.messageBubbleStyle] || '18px');
  };

  const playTestSound = () => {
    if (settings.notificationSound === 'chime') {
      audio.src = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==";
    } else if (settings.notificationSound === 'ding') {
      // Simple beep sound
      const context = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(context.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gainNode.gain.value = 0.1;
      
      oscillator.start();
      setTimeout(() => {
        oscillator.stop();
      }, 100);
    }
    
    if (settings.vibration && 'vibrate' in navigator) {
      navigator.vibrate(200);
    }
  };

  const testNotification = () => {
    if (!('Notification' in window)) {
      alert('This browser does not support notifications');
      return;
    }

    if (Notification.permission === 'granted') {
      new Notification('ChatApp Test', {
        body: 'This is a test notification',
        icon: '/vite.svg',
        tag: 'test-notification'
      });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification('ChatApp Test', {
            body: 'This is a test notification',
            icon: '/vite.svg'
          });
        }
      });
    }
  };

  const clearAllChats = () => {
    if (window.confirm('Are you sure you want to clear all chats? This action cannot be undone.')) {
      localStorage.removeItem('chatMessages');
      localStorage.removeItem('chatConversations');
      window.location.reload();
    }
  };

  const exportChatData = () => {
    const chatData = {
      settings: settings,
      conversations: JSON.parse(localStorage.getItem('chatConversations') || '[]'),
      messages: JSON.parse(localStorage.getItem('chatMessages') || '[]'),
      exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(chatData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `chatapp-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const resetSettings = () => {
    if (window.confirm('Are you sure you want to reset all settings to default?')) {
      const defaultSettings = {
        notifications: true,
        messageSounds: true,
        notificationSound: 'chime',
        vibration: true,
        readReceipts: true,
        typingIndicators: true,
        onlineStatus: true,
        lastSeen: true,
        darkMode: true,
        fontSize: 'medium',
        messageBubbleStyle: 'rounded',
        theme: 'black-white',
        autoDownload: false,
        imageQuality: 'standard',
        saveToCameraRoll: false,
        enterToSend: true,
        emojiKeyboard: true,
        textPreview: true
      };
      
      setSettings(defaultSettings);
      localStorage.setItem('chatSettings', JSON.stringify(defaultSettings));
      applySettings(defaultSettings);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.settingsOverlay} onClick={handleBackdropClick}>
      <div className={styles.settingsPanel} onClick={(e) => e.stopPropagation()}>
        <div className={styles.settingsHeader}>
          <h2>Settings</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.settingsContent}>
          {/* Notifications Section */}
          <div className={styles.settingsSection}>
            <h3>Notifications</h3>
            
            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <span className={styles.settingLabel}>Push Notifications</span>
                <span className={styles.settingDescription}>Receive message notifications</span>
              </div>
              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  checked={settings.notifications}
                  onChange={(e) => updateSetting('notifications', e.target.checked)}
                />
                <span className={styles.slider}></span>
              </label>
            </div>

            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <span className={styles.settingLabel}>Message Sounds</span>
                <span className={styles.settingDescription}>Play sound for new messages</span>
              </div>
              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  checked={settings.messageSounds}
                  onChange={(e) => updateSetting('messageSounds', e.target.checked)}
                />
                <span className={styles.slider}></span>
              </label>
            </div>

            {settings.messageSounds && (
              <div className={styles.settingItem}>
                <div className={styles.settingInfo}>
                  <span className={styles.settingLabel}>Notification Sound</span>
                </div>
                <select 
                  className={styles.select}
                  value={settings.notificationSound}
                  onChange={(e) => updateSetting('notificationSound', e.target.value)}
                >
                  <option value="chime">Chime</option>
                  <option value="ding">Ding</option>
                  <option value="none">None</option>
                </select>
              </div>
            )}

            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <span className={styles.settingLabel}>Vibration</span>
                <span className={styles.settingDescription}>Vibrate on new messages</span>
              </div>
              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  checked={settings.vibration}
                  onChange={(e) => updateSetting('vibration', e.target.checked)}
                />
                <span className={styles.slider}></span>
              </label>
            </div>

            <button className={styles.testButton} onClick={testNotification}>
              Test Notification
            </button>
          </div>

          {/* Privacy Section */}
          <div className={styles.settingsSection}>
            <h3>Privacy</h3>
            
            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <span className={styles.settingLabel}>Read Receipts</span>
                <span className={styles.settingDescription}>Show when messages are read</span>
              </div>
              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  checked={settings.readReceipts}
                  onChange={(e) => updateSetting('readReceipts', e.target.checked)}
                />
                <span className={styles.slider}></span>
              </label>
            </div>

            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <span className={styles.settingLabel}>Typing Indicators</span>
                <span className={styles.settingDescription}>Show when others are typing</span>
              </div>
              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  checked={settings.typingIndicators}
                  onChange={(e) => updateSetting('typingIndicators', e.target.checked)}
                />
                <span className={styles.slider}></span>
              </label>
            </div>

            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <span className={styles.settingLabel}>Online Status</span>
                <span className={styles.settingDescription}>Show when you're online</span>
              </div>
              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  checked={settings.onlineStatus}
                  onChange={(e) => updateSetting('onlineStatus', e.target.checked)}
                />
                <span className={styles.slider}></span>
              </label>
            </div>

            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <span className={styles.settingLabel}>Last Seen</span>
                <span className={styles.settingDescription}>Show when you were last active</span>
              </div>
              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  checked={settings.lastSeen}
                  onChange={(e) => updateSetting('lastSeen', e.target.checked)}
                />
                <span className={styles.slider}></span>
              </label>
            </div>
          </div>

          {/* Appearance Section */}
          <div className={styles.settingsSection}>
            <h3>Appearance</h3>
            
            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <span className={styles.settingLabel}>Dark Mode</span>
                <span className={styles.settingDescription}>Black and white theme</span>
              </div>
              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  checked={settings.darkMode}
                  onChange={(e) => updateSetting('darkMode', e.target.checked)}
                />
                <span className={styles.slider}></span>
              </label>
            </div>

            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <span className={styles.settingLabel}>Font Size</span>
              </div>
              <select 
                className={styles.select}
                value={settings.fontSize}
                onChange={(e) => updateSetting('fontSize', e.target.value)}
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>

            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <span className={styles.settingLabel}>Message Style</span>
              </div>
              <select 
                className={styles.select}
                value={settings.messageBubbleStyle}
                onChange={(e) => updateSetting('messageBubbleStyle', e.target.value)}
              >
                <option value="rounded">Rounded</option>
                <option value="rounded-small">Rounded Small</option>
                <option value="square">Square</option>
              </select>
            </div>
          </div>

          {/* Chat Section */}
          <div className={styles.settingsSection}>
            <h3>Chat</h3>
            
            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <span className={styles.settingLabel}>Enter to Send</span>
                <span className={styles.settingDescription}>Press Enter to send messages</span>
              </div>
              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  checked={settings.enterToSend}
                  onChange={(e) => updateSetting('enterToSend', e.target.checked)}
                />
                <span className={styles.slider}></span>
              </label>
            </div>

            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <span className={styles.settingLabel}>Emoji Keyboard</span>
                <span className={styles.settingDescription}>Show emoji picker</span>
              </div>
              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  checked={settings.emojiKeyboard}
                  onChange={(e) => updateSetting('emojiKeyboard', e.target.checked)}
                />
                <span className={styles.slider}></span>
              </label>
            </div>

            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <span className={styles.settingLabel}>Text Preview</span>
                <span className={styles.settingDescription}>Show text formatting preview</span>
              </div>
              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  checked={settings.textPreview}
                  onChange={(e) => updateSetting('textPreview', e.target.checked)}
                />
                <span className={styles.slider}></span>
              </label>
            </div>
          </div>

          {/* Media Section */}
          <div className={styles.settingsSection}>
            <h3>Media & Files</h3>
            
            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <span className={styles.settingLabel}>Auto-download</span>
                <span className={styles.settingDescription}>Automatically download media</span>
              </div>
              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  checked={settings.autoDownload}
                  onChange={(e) => updateSetting('autoDownload', e.target.checked)}
                />
                <span className={styles.slider}></span>
              </label>
            </div>

            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <span className={styles.settingLabel}>Image Quality</span>
              </div>
              <select 
                className={styles.select}
                value={settings.imageQuality}
                onChange={(e) => updateSetting('imageQuality', e.target.value)}
              >
                <option value="low">Low</option>
                <option value="standard">Standard</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <span className={styles.settingLabel}>Save to Camera Roll</span>
                <span className={styles.settingDescription}>Save images to device</span>
              </div>
              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  checked={settings.saveToCameraRoll}
                  onChange={(e) => updateSetting('saveToCameraRoll', e.target.checked)}
                />
                <span className={styles.slider}></span>
              </label>
            </div>
          </div>

          {/* Actions Section */}
          <div className={styles.settingsSection}>
            <h3>Data & Storage</h3>
            
            <button className={styles.actionButton} onClick={exportChatData}>
              Export Chat Data
            </button>
            
            <button className={styles.actionButton} onClick={resetSettings}>
              Reset to Default
            </button>
            
            <button className={styles.dangerButton} onClick={clearAllChats}>
              Clear All Chats
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsBar;