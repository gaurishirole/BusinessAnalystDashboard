import React, { useState } from 'react';
import '../../styles/Navbar.css';
import { Menu, Sun, Moon, Bell, Search, Settings } from 'lucide-react';
import useTheme from '../../hooks/useTheme';
import { useNotifications } from '../../context/NotificationContext';
import { useSearch } from '../../context/SearchContext';
import SearchBar from '../common/SearchBar';

export default function Navbar({ toggleSidebar, title = 'Dashboard' }) {
  const { theme, toggleTheme } = useTheme();
  const { notifications, unreadCount, markAllAsRead } = useNotifications();
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const { searchQuery, setSearchQuery } = useSearch();

  return (
    <header className="navbar glass-panel">
      <div className="navbar-left">
        <button className="menu-toggle-btn" onClick={toggleSidebar}>
          <Menu size={20} />
        </button>
        <h1 className="navbar-title">{title}</h1>
      </div>

      <div className="navbar-right">
        <div className="navbar-search-wrapper">
          <SearchBar 
            placeholder="Global search..." 
            value={searchQuery} 
            onChange={setSearchQuery} 
          />
        </div>

        <button className="nav-action-btn" onClick={toggleTheme} aria-label="Toggle Theme">
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="notif-dropdown-wrapper">
          <button
            className="nav-action-btn"
            onClick={() => {
              setShowNotifDropdown(!showNotifDropdown);
              if (!showNotifDropdown && unreadCount > 0) {
                markAllAsRead();
              }
            }}
            aria-label="Notifications"
          >
            <Bell size={20} />
            {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
          </button>

          {showNotifDropdown && (
            <div className="notif-dropdown glass-panel">
              <div className="notif-dropdown-header">
                <h4>Notifications</h4>
                <button onClick={markAllAsRead}>Mark all read</button>
              </div>
              <div className="notif-dropdown-list">
                {notifications.length === 0 ? (
                  <p className="no-notifs">No new notifications</p>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className={`notif-item ${!n.read ? 'notif-unread' : ''}`}>
                      <p className="notif-text">{n.text}</p>
                      <span className="notif-time">{n.time}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
