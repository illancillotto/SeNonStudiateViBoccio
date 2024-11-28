import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import '../styles/Notifications.css';

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(process.env.REACT_APP_SOCKET_URL, {
      auth: {
        token: localStorage.getItem('token')
      }
    });

    newSocket.on('notification', (notification) => {
      setNotifications(prev => [notification, ...prev]);
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  const markAsRead = async (notificationId) => {
    try {
      await axios.post(`/api/notifications/${notificationId}/read`);
      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <div className="notifications-container">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`notification-item ${notification.read ? 'read' : 'unread'}`}
          onClick={() => markAsRead(notification.id)}
        >
          <div className="notification-header">
            <span className="notification-type">{notification.type}</span>
            <span className="notification-time">
              {new Date(notification.timestamp).toLocaleTimeString()}
            </span>
          </div>
          <div className="notification-content">
            {notification.message}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Notifications;