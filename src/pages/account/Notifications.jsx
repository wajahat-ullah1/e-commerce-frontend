import { useEffect, useState } from "react";
import { CheckCheck, Check, Trash2 } from "lucide-react";
import { useApp } from "../../context/useApp";
import { Button } from "../../components/admin_Ui/Ui";
import { notificationService } from "../../services/notificationService";
import "./Notifications.css";

const typeIcons = {
  order:
    "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
  promo:
    "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z",
};

export default function Notifications() {
  const { refreshUnreadCount, showToast } = useApp();
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    notificationService
      .list()
      .then((list) => {
        if (!cancelled) setNotifs(list);
      })
      .catch(() => {
        if (!cancelled) setNotifs([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const markRead = async (id) => {
    setNotifs((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
    try {
      await notificationService.markRead(id);
      refreshUnreadCount();
    } catch (err) {
      showToast("error", err.message || "Could not mark that as read.");
    }
  };

  const markAllRead = async () => {
    const unreadIds = notifs.filter((n) => !n.isRead).map((n) => n.id);
    setNotifs((prev) => prev.map((n) => ({ ...n, isRead: true })));
    try {
      await Promise.all(
        unreadIds.map((id) => notificationService.markRead(id)),
      );
      refreshUnreadCount();
    } catch (err) {
      showToast("error", err.message || "Could not mark all as read.");
    }
  };

  const deleteNotif = async (id) => {
    setNotifs((prev) => prev.filter((n) => n.id !== id));
    try {
      await notificationService.remove(id);
      refreshUnreadCount();
    } catch (err) {
      showToast("error", err.message || "Could not delete that notification.");
    }
  };

  const clearAll = async () => {
    setNotifs([]);
    try {
      await notificationService.clearAll();
      refreshUnreadCount();
    } catch (err) {
      showToast("error", err.message || "Could not clear notifications.");
    }
  };

  const unreadCount = notifs.filter((n) => !n.isRead).length;

  if (loading) {
    return <div className="notifications-page">Loading notifications…</div>;
  }

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <div className="notifications-heading">
          <h1>Notifications</h1>
          {unreadCount > 0 && (
            <p className="unread-count">{unreadCount} unread</p>
          )}
        </div>
        <div className="notifications-header-actions">
          {unreadCount > 0 && (
            <Button variant="secondary" size="sm" onClick={markAllRead}>
              <CheckCheck className="notifications-button-icon" />
              Mark all as read
            </Button>
          )}
          {notifs.length > 0 && (
            <Button variant="secondary" size="sm" onClick={clearAll}>
              Clear all
            </Button>
          )}
        </div>
      </div>

      {notifs.length === 0 ? (
        <div className="notifications-empty">
          <div className="empty-icon">🔔</div>
          <h3>No notifications yet</h3>
          <p>You'll see order updates and promotions here.</p>
        </div>
      ) : (
        <div className="notifications-list">
          {notifs.map((n) => (
            <div
              key={n.id}
              className={`notification-card ${!n.isRead ? "notification-unread" : "notification-read"}`}
            >
              <div
                className={`notification-icon-wrapper ${!n.isRead ? "notification-icon-unread" : "notification-icon-read"}`}
              >
                <svg
                  className={`notification-icon ${!n.isRead ? "notification-icon-active" : "notification-icon-inactive"}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d={typeIcons[n.type] || typeIcons.order}
                  />
                </svg>
              </div>

              <div className="notification-content">
                <div className="notification-title-row">
                  <p
                    className={`notification-title ${!n.isRead ? "notification-title-unread" : "notification-title-read"}`}
                  >
                    {n.title}
                  </p>
                  {!n.isRead && <div className="unread-dot" />}
                </div>

                <p className="notification-message">{n.message}</p>

                <div className="notification-footer">
                  <p className="notification-date">
                    {new Date(n.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>

                  {!n.isRead && (
                    <div className="notification-read-actions">
                      <button
                        type="button"
                        onClick={() => markRead(n.id)}
                        className="notification-read-button"
                      >
                        <Check />
                        Read
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteNotif(n.id)}
                        className="notification-delete-button"
                      >
                        <Trash2 />
                      </button>
                    </div>
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
