import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { orderService } from "../../services/orderService";
import {
  OrderStatusBadge,
  PaymentStatusBadge,
} from "../../components/customer_Ui/Badge";
import "./Orders.css";

const FILTERS = [
  "All",
  "Pending",
  "Processing",
  "Shipped",
  "In Transit",
  "Delivered",
  "Cancelled",
  "Returned",
];

export default function Orders() {
  const [filter, setFilter] = useState("All");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    orderService
      .myOrders()
      .then((list) => {
        if (!cancelled) setOrders(list);
      })
      .catch(() => {
        if (!cancelled) setOrders([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered =
    filter === "All" ? orders : orders.filter((o) => o.status === filter);

  if (loading) {
    return <div className="orders-page">Loading your orders…</div>;
  }

  return (
    <div className="orders-page">
      <h1 className="orders-page-title">My Orders</h1>

      <div className="orders-filter-tabs">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`orders-filter-btn ${
              filter === f ? "orders-filter-active" : "orders-filter-inactive"
            }`}
          >
            {f}

            {f !== "All" && (
              <span
                className={`orders-filter-count ${
                  filter === f
                    ? "orders-filter-count-active"
                    : "orders-filter-count-inactive"
                }`}
              >
                ({orders.filter((o) => o.status === f).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="orders-empty-state">
          <div className="orders-empty-icon">📦</div>
          <h3>No orders found</h3>
          <p>No {filter.toLowerCase()} orders to display.</p>
          <Link to="/shop" className="orders-shopping-btn">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {filtered.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-card-header">
                <div className="order-card-number-section">
                  <p className="order-card-number">ORD-{order.orderNumber}</p>
                  <p className="order-card-date">
                    {new Date(order.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>

                <div className="order-statuses">
                  <OrderStatusBadge status={order.status} />
                  <PaymentStatusBadge status={order.paymentStatus} />
                </div>
              </div>

              <div className="order-item-images">
                {order.items.map((item) => (
                  <div key={item.id} className="order-item-image-wrapper">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="order-item-image"
                    />
                  </div>
                ))}
              </div>

              <div className="order-card-footer">
                <div className="order-summary-info">
                  <p className="order-items-count">
                    {order.items.length} item{order.items.length > 1 ? "s" : ""}{" "}
                    · {order.paymentMethod}
                  </p>
                  <p className="order-total">{order.total.toFixed(2)}</p>
                </div>

                <Link
                  to={`/account/orders/${order.id}`}
                  className="view-details-btn"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
