import { useState } from "react";
import {
  Bell,
  ShoppingCart,
  AlertTriangle,
  Star,
  Users,
  Check,
  CheckCheck,
} from "lucide-react";
import { Card, Button } from "../../components/admin_Ui/Ui";
import { notifications as initialNotifs } from "../../data/mockData";
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

export default function Notifications({
  onMarkAllRead,
  showToast,
}) {
  const [notifs, setNotifs] = useState(initialNotifs);

  const markRead = (id) => {
    setNotifs((ns) =>
      ns.map((n) =>
        n.id === id
          ? { ...n, read: true }
          : n
      )
    );
  };

  const markAll = () => {
    setNotifs((ns) =>
      ns.map((n) => ({
        ...n,
        read: true,
      }))
    );

    onMarkAllRead();

    showToast(
      "All notifications marked as read.",
      "success"
    );
  };

  const unread = notifs.filter(
    (n) => !n.read
  ).length;

  return (
    <div className="notifications-page">
      <div className="notifications-page-header">
        <div>
          <h1 className="notifications-title">
            Notifications
          </h1>

          <p className="notifications-subtitle">
            {unread > 0
              ? `${unread} unread`
              : "All caught up"}
          </p>
        </div>

        {unread > 0 && (
          <Button
            variant="secondary"
            size="sm"
            onClick={markAll}
          >
            <CheckCheck className="notifications-button-icon" />
            Mark all as read
          </Button>
        )}
      </div>

      <Card className="notifications-card">
        {notifs.length === 0 ? (
          <div className="notifications-empty">
            <div className="notifications-empty-icon">
              <Bell />
            </div>

            <p className="notifications-empty-title">
              No notifications
            </p>
          </div>
        ) : (
          notifs.map((n) => (
            <div
              key={n.id}
              className={`notification-item ${
                !n.read
                  ? "notification-unread"
                  : "notification-read"
              }`}
            >
              <div
                className={`notification-type-icon ${
                  colorMap[n.type] ||
                  "notification-icon-default"
                }`}
              >
                {iconMap[n.type] || <Bell />}
              </div>

              <div className="notification-content">
                <div className="notification-main">
                  <div className="notification-text">
                    <p
                      className={`notification-title-text ${
                        !n.read
                          ? "notification-title-unread"
                          : "notification-title-read"
                      }`}
                    >
                      {n.title}
                    </p>

                    <p className="notification-message">
                      {n.message}
                    </p>

                    <p className="notification-time">
                      {n.time}
                    </p>
                  </div>

                  {!n.read && (
                    <div className="notification-read-actions">
                      <div className="notification-unread-dot" />

                      <button
                        type="button"
                        onClick={() =>
                          markRead(n.id)
                        }
                        className="notification-read-button"
                      >
                        <Check />
                        Read
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
