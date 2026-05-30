import React, { useState } from 'react';
import { 
  Bell, 
  Settings, 
  LogOut, 
  User
} from 'lucide-react';
import { useAuth } from '../services/auth';
import { useNotifications } from '../hooks';
import { useNavigate } from 'react-router-dom';
import CompanySelectionDropdown from './CompanySelectionDropdown';
import '../styles/components/Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { showSuccess, showError } = useNotifications();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notificationCount] = useState(3); // This would come from a notifications service

  const handleUserMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuClose = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      handleMenuClose();
      // Add a small delay to ensure state updates propagate
      setTimeout(() => {
        navigate('/login');
        showSuccess('Logged out successfully');
        
        // Fallback redirect if React Router doesn't work
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }, 100);
    } catch (error) {
      console.error('Logout failed:', error);
      showError('Logout failed');
    }
  };

  const handleProfileClick = () => {
    handleMenuClose();
    // Navigate to profile page
    navigate('/profile');
  };

  const handleSettingsClick = () => {
    handleMenuClose();
    // Navigate to settings page
    navigate('/settings');
  };

  const getUserInitial = () => {
    return user?.name?.charAt(0).toUpperCase() || 'U';
  };

  const getUserDisplayName = () => {
    return user?.name || 'User';
  };

  return (
    <nav className="navbar">
      <div className="navbar__toolbar">
        {/* Left Section - Skills Snapshot Logo and Company Selection */}
        <div className="navbar__left-section navbar__brand-animation">
          <div className="navbar__logo-container">
            <img 
              src="https://scontent-phx1-1.xx.fbcdn.net/v/t39.30808-6/386600476_701081228712929_5334494126465680921_n.png?_nc_cat=110&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=gMOTgwsHHfYQ7kNvwGjuNPy&_nc_oc=AdnFLGj9kf4GwwYu2TczrXkKfLHESY1rmEtZf443FVKhYWpKHr1BbkHXOgClZ2hbgShXbV2EtmPDI0VAFk6o1aO6&_nc_zt=23&_nc_ht=scontent-phx1-1.xx&_nc_gid=7dC5Hg6hRY5b4B83j2R87A&oh=00_AfQhiJR1FgMR2XyqzYCvYaVA1ettTBTpaUqGDI7B20BVhQ&oe=687D1B73" 
              alt="University of Phoenix" 
              className="navbar__logo"
            />
            <h1 className="navbar__brand-text">
              Skills Snapshot
            </h1>
          </div>
          <CompanySelectionDropdown compact={true} />
        </div>

        {/* Right Section - User Controls */}
        <div className="navbar__right-section">
          <button 
            className="navbar__icon-button"
            title="Notifications"
            aria-label="Notifications"
          >
            <Bell size={20} />
            {notificationCount > 0 && (
              <span className="navbar__badge">{notificationCount}</span>
            )}
          </button>

          <button 
            className="navbar__icon-button"
            title="Settings"
            aria-label="Settings"
            onClick={handleSettingsClick}
          >
            <Settings size={20} />
          </button>

          <div style={{ position: 'relative' }}>
            <button
              className="navbar__user-button"
              onClick={handleUserMenuToggle}
              aria-label="User menu"
              aria-expanded={isMenuOpen}
            >
              <div className="navbar__user-avatar">
                {getUserInitial()}
              </div>
              {getUserDisplayName()}
            </button>

            <div className={`navbar__user-menu ${isMenuOpen ? 'navbar__user-menu--open' : ''}`}>
              <button className="navbar__menu-item" onClick={handleProfileClick}>
                <User className="navbar__menu-icon" />
                Profile
              </button>
              <button className="navbar__menu-item" onClick={handleSettingsClick}>
                <Settings className="navbar__menu-icon" />
                Settings
              </button>
              <button className="navbar__menu-item navbar__menu-item--danger" onClick={handleLogout}>
                <LogOut className="navbar__menu-icon" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
