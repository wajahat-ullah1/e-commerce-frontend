import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { orders, notifications } from '../../data/orders';
import { OrderStatusBadge } from '../../components/customer_Ui/Badge';
import './Dashboard.css';

export default function Dashboard() {
  const { wishlist } = useApp();
  const recentOrders = orders.slice(0, 3);
  const recentNotifications = notifications.filter((n) => !n.read).slice(0, 3);

  const stats = [
    {
      label: 'Total Orders',
      value: orders.length,
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
      color: 'stat-indigo',
    },
    {
      label: 'Pending',
      value: orders.filter((o) => ['Pending', 'Processing'].includes(o.status)).length,
      icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
      color: 'stat-amber',
    },
    {
      label: 'Delivered',
      value: orders.filter((o) => o.status === 'Delivered').length,
      icon: 'M5 13l4 4L19 7',
      color: 'stat-emerald',
    },
    {
      label: 'Wishlist',
      value: wishlist.length,
      icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
      color: 'stat-red',
    },
  ];

  return (
    <div className="dashboard-page">
      <div className="dashboard-intro">
        <h1 className="dashboard-title">Overview</h1>
        <p className="dashboard-welcome">Welcome back, Alex 👋</p>
      </div>

      <div className="dashboard-stats">
        {stats.map((stat) => (
          <div key={stat.label} className="dashboard-stat-card">
            <div className={`dashboard-stat-icon ${stat.color}`}>
              <svg className="dashboard-stat-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
              </svg>
            </div>
            <p className="dashboard-stat-value">{stat.value}</p>
            <p className="dashboard-stat-label">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="dashboard-section-card">
        <div className="dashboard-section-header">
          <h2 className="dashboard-section-title">Recent Orders</h2>
          <Link to="/account/orders" className="dashboard-view-link">View all</Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="dashboard-empty">No orders yet</div>
        ) : (
          <div className="dashboard-order-list">
            {recentOrders.map((order) => (
              <div key={order.id} className="dashboard-order">
                <img
                  src={order.items[0].image}
                  alt=""
                  className="dashboard-order-image"
                />

                <div className="dashboard-order-info">
                  <p className="dashboard-order-number">#{order.orderNumber}</p>
                  <p className="dashboard-order-meta">
                    {new Date(order.date).toLocaleDateString()} · {order.items.length} item{order.items.length > 1 ? 's' : ''}
                  </p>
                </div>

                <div className="dashboard-order-total">
                  <OrderStatusBadge status={order.status} />
                  <p className="dashboard-price">${order.total.toFixed(2)}</p>
                </div>

                <Link
                  to={`/account/orders/${order.id}`}
                  className="dashboard-order-link"
                  aria-label={`View order ${order.orderNumber}`}
                >
                  <svg className="dashboard-arrow-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {recentNotifications.length > 0 && (
        <div className="dashboard-section-card">
          <div className="dashboard-section-header">
            <h2 className="dashboard-section-title">Unread Notifications</h2>
            <Link to="/account/notifications" className="dashboard-view-link">View all</Link>
          </div>

          <div className="dashboard-notification-list">
            {recentNotifications.map((notification) => (
              <div key={notification.id} className="dashboard-notification">
                <div className="dashboard-notification-icon">
                  <svg className="dashboard-notification-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                </div>

                <div className="dashboard-notification-content">
                  <p className="dashboard-notification-title">{notification.title}</p>
                  <p className="dashboard-notification-message">{notification.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
