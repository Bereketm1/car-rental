import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import api from '../api';
import StatusBadge from './StatusBadge';
import { formatDateTime } from '../utils/format';

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleOutsideClick(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  async function fetchNotifications() {
    try {
      const response = await api.get('/notifications');
      setNotifications(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    }
  }

  async function markAsRead(id) {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((current) => current.map((item) => (item.id === id ? { ...item, isRead: true } : item)));
    } catch (error) {
      console.error('Failed to mark notification as read', error);
    }
  }

  async function markAllAsRead() {
    const unread = notifications.filter((item) => !item.isRead);
    await Promise.all(unread.map((item) => api.put(`/notifications/${item.id}/read`).catch(() => null)));
    setNotifications((current) => current.map((item) => ({ ...item, isRead: true })));
  }

  const unreadCount = useMemo(() => notifications.filter((item) => !item.isRead).length, [notifications]);

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      <button className="notification-trigger" type="button" onClick={() => setIsOpen((current) => !current)} aria-label="Toggle notifications">
        <Bell size={18} strokeWidth={2.2} />
        {unreadCount ? <span className="status-badge compact tone-danger" style={{ position: 'absolute', top: '-6px', right: '-8px' }}>{unreadCount}</span> : null}
      </button>

      {isOpen ? (
        <div className="notification-dropdown card" style={{ position: 'absolute', top: '54px', right: 0, zIndex: 40 }}>
          <div className="card-header" style={{ marginBottom: 0, padding: '18px 18px 12px' }}>
            <div>
              <div className="card-title">Notifications</div>
              <div className="card-subtitle">Operational alerts, customer activity, and partner updates.</div>
            </div>
            {unreadCount ? (
              <button className="btn btn-ghost btn-sm" type="button" onClick={markAllAsRead}>
                <CheckCheck size={14} strokeWidth={2.2} /> Mark all read
              </button>
            ) : null}
          </div>
          <div className="list-stack" style={{ padding: '0 18px 18px' }}>
            {notifications.length ? (
              notifications.map((notification) => (
                <button
                  key={notification.id}
                  type="button"
                  className="list-row"
                  style={{ textAlign: 'left', cursor: 'pointer' }}
                  onClick={() => !notification.isRead && markAsRead(notification.id)}
                >
                  <div className="list-row-head">
                    <div>
                      <div className="list-row-title">{notification.title}</div>
                      <div className="list-row-meta">{notification.message}</div>
                    </div>
                    <StatusBadge value={notification.isRead ? 'completed' : 'new'} compact />
                  </div>
                  <div className="list-row-meta">{formatDateTime(notification.createdAt)}</div>
                </button>
              ))
            ) : (
              <div className="empty-state" style={{ minHeight: '180px' }}>
                <h3>No notifications</h3>
                <p>The workflow queue is quiet right now.</p>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

