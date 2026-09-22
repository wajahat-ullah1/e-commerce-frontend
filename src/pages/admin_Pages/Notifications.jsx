import { useState, useEffect } from "react";
import {
  Bell,
  ShoppingCart,
  AlertTriangle,
  Star,
  Users,
  Check,
  CheckCheck,
  Trash2,
} from "lucide-react";
import { Card, Button } from "../../components/admin_Ui/Ui";
import { notificationService } from "../../services/notificationService";
import { useApp } from "../../context/useApp";
import { useFetch } from "../../hooks/useFetch";
// import { notifications as initialNotifs } from "../../data/mockData";
import "./Notifications.css";

const iconMap = {
  order: <ShoppingCart />,
  stock: <AlertTriangle />,
  review: <Star />,
  customer: <Users />,
};

const colorMap = {
  order: "notification-icon-indigo",
  stock: "notification-icon-amber",
  review: "notification-icon-yellow",
  customer: "notification-icon-emerald",
};

export default function Notifications() {
  const { showToast, refreshUnreadCount } = useApp();

  const {
    data: notifs,
    loading,
    error,
    refetch,
  } = useFetch(() => notificationService.list(), []);
  const [markingAll, setMarkingAll] = useState(false);

  useEffect(() => {
    if (error) showToast("error", error);
  }, [error]);

  const markRead = async (id) => {
    try {
      await notificationService.markRead(id);
      refetch();
      refreshUnreadCount();
    } catch (err) {
      showToast("error", err.message);
    }
  };

  const markAll = async () => {
    const unreadIds = (notifs || []).filter((n) => !n.isRead).map((n) => n.id);
    if (unreadIds.length === 0) return;
    setMarkingAll(true);
    try {
      await Promise.all(
        unreadIds.map((id) => notificationService.markRead(id)),
      );
      refetch();
      refreshUnreadCount();
      showToast("success", "All notifications marked as read.");
    } catch (err) {
      showToast("error", err.message);
    } finally {
      setMarkingAll(false);
    }
  };

  const unread = (notifs || []).filter((n) => !n.isRead).length;

  console.log("sample notif:", notifs?.[0]);

  const handleDelete = async (id) => {
    try {
      await notificationService.remove(id);
      refetch();
      refreshUnreadCount();
    } catch (err) {
      showToast("error", err.message);
    }
  };

  const handleClearAll = async () => {
    try {
      await notificationService.clearAll();
      refetch();
      refreshUnreadCount();
      showToast("success", "All notifications cleared.");
    } catch (err) {
      showToast("error", err.message);
    }
  };

  if (loading)
    return <div className="notifications-page">Loading notifications…</div>;
  return (
    <div className="notifications-page">
      <div className="notifications-page-header">
        <div>
          <h1 className="notifications-title">Notifications</h1>

          <p className="notifications-subtitle">
            {unread > 0 ? `${unread} unread` : "All caught up"}
          </p>
        </div>

        {unread > 0 && (
          <Button variant="secondary" size="sm" onClick={markAll}>
            <CheckCheck className="notifications-button-icon" />
            Mark all as read
          </Button>
        )}
        {(notifs || []).length > 0 && (
          <Button variant="secondary" size="sm" onClick={handleClearAll}>
            Clear all
          </Button>
        )}
      </div>

      <Card className="notifications-card">
        {notifs.length === 0 ? (
          <div className="notifications-empty">
            <div className="notifications-empty-icon">
              <Bell />
            </div>

            <p className="notifications-empty-title">No notifications</p>
          </div>
        ) : (
          notifs.map((n) => (
            <div
              key={n.id}
              className={`notification-item ${
                !n.isRead ? "notification-unread" : "notification-read"
              }`}
            >
              <div
                className={`notification-type-icon ${
                  colorMap[n.type] || "notification-icon-default"
                }`}
              >
                {iconMap[n.type] || <Bell />}
              </div>

              <div className="notification-content">
                <div className="notification-main">
                  <div className="notification-text">
                    <p
                      className={`notification-title-text ${
                        !n.isRead
                          ? "notification-title-unread"
                          : "notification-title-read"
                      }`}
                    >
                      {n.title}
                    </p>

                    <p className="notification-message">{n.message}</p>

                    <p className="notification-time">{n.time}</p>
                  </div>

                  {!n.isRead && (
                    <div className="notification-read-actions">
                      <div className="notification-unread-dot" />

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
                        onClick={() => handleDelete(n.id)}
                        className="notification-delete-button"
                        aria-label="Delete notification"
                      >
                        <Trash2 />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </Card>
    </div>
  );
}
