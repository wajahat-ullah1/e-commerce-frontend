import { useState } from 'react';
import { notifications as initialNotifications } from '../../data/orders';
import './Notifications.css';

const typeIcons = {
  order:
    'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',

  promo:
    'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z',
};

export default function Notifications() {
  const [notifs, setNotifs] = useState(initialNotifications);

  const markRead = (id) => {
    setNotifs((prev) =>
      prev.map((n) =>
        n.id === id
          ? { ...n, read: true }
          : n
      )
    );
  };

  const markAllRead = () => {
    setNotifs((prev) =>
      prev.map((n) => ({
        ...n,
        read: true,
      }))
    );
  };

  const unreadCount = notifs.filter(
    (n) => !n.read
  ).length;

  return (
    <div className="notifications-page">

      {/* Page Header */}
      <div className="notifications-header">

        <div className="notifications-heading">
          <h1>Notifications</h1>

          {unreadCount > 0 && (
            <p className="unread-count">
              {unreadCount} unread
            </p>
          )}
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllRead}
            className="mark-all-read-btn"
          >
            Mark all as read
          </button>
        )}

      </div>

      {/* Empty State */}
      {notifs.length === 0 ? (
        <div className="notifications-empty">

          <div className="empty-icon">
            🔔
          </div>

          <h3>
            No notifications yet
          </h3>

          <p>
            You'll see order updates and promotions here.
          </p>

        </div>
      ) : (

        /* Notifications List */
        <div className="notifications-list">

          {notifs.map((n) => (
            <div
              key={n.id}
              className={`notification-card ${
                !n.read
                  ? 'notification-unread'
                  : 'notification-read'
              }`}
            >

              {/* Notification Icon */}
              <div
                className={`notification-icon-wrapper ${
                  !n.read
                    ? 'notification-icon-unread'
                    : 'notification-icon-read'
                }`}
              >
                <svg
                  className={`notification-icon ${
                    !n.read
                      ? 'notification-icon-active'
                      : 'notification-icon-inactive'
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d={
                      typeIcons[n.type] ||
                      typeIcons.order
                    }
                  />
                </svg>
              </div>

              {/* Notification Content */}
              <div className="notification-content">

                <div className="notification-title-row">

                  <p
                    className={`notification-title ${
                      !n.read
                        ? 'notification-title-unread'
                        : 'notification-title-read'
                    }`}
                  >
                    {n.title}
                  </p>

                  {!n.read && (
                    <div className="unread-dot" />
                  )}

                </div>

                <p className="notification-message">
                  {n.message}
                </p>

                <div className="notification-footer">

                  <p className="notification-date">
                    {n.date}
                  </p>

                  {!n.read && (
                    <button
                      type="button"
                      onClick={() => markRead(n.id)}
                      className="mark-read-btn"
                    >
                      Mark read
                    </button>
                  )}

                </div>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}