
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import '../styles/components/NotificationManager.css';

const NotificationManager = () => {
  const [notifications, setNotifications] = useState([]);

  // Listen for global notification events
  useEffect(() => {
    const handleNotification = (event) => {
      const notification = {
        id: Date.now(),
        type: event.detail.type || 'info',
        message: event.detail.message,
        duration: event.detail.duration || 5000,
      };
      
      setNotifications(prev => [...prev, notification]);
      
      // Auto-remove after duration
      setTimeout(() => {
        removeNotification(notification.id);
      }, notification.duration);
    };

    window.addEventListener('show-notification', handleNotification);
    
    return () => {
      window.removeEventListener('show-notification', handleNotification);
    };
  }, []);

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} />;
      case 'error':
        return <AlertCircle size={20} />;
      case 'warning':
        return <AlertTriangle size={20} />;
      default:
        return <Info size={20} />;
    }
  };

  return (
    <div className="notification-manager">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: -50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            className={`notification notification--${notification.type}`}
          >
            <div className="notification__icon">
              {getNotificationIcon(notification.type)}
            </div>
            <div className="notification__content">
              <p className="notification__message">{notification.message}</p>
            </div>
            <button
              onClick={() => removeNotification(notification.id)}
              className="notification__close"
              aria-label="Close notification"
            >
              <X size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default NotificationManager;