import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useApp } from "../../context/useApp";
import { orderService } from "../../services/orderService";
import {
  OrderStatusBadge,
  PaymentStatusBadge,
} from "../../components/customer_Ui/Badge";
import Breadcrumb from "../../components/customer_Ui/Breadcrumb";
import "./OrderDetail.css";

const STATUS_ORDER = [
  "Pending",
  "Processing",
  "Shipped",
  "In Transit",
  "Delivered",
];

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useApp();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    orderService
      .getMyOrder(id)
      .then((data) => {
        if (!cancelled) setOrder(data);
      })
      .catch(() => {
        if (!cancelled) setOrder(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleCancel = async () => {
    setCancelling(true);
    try {
      const updated = await orderService.cancelMyOrder(id);
      setOrder(updated);
      showToast("success", "Order cancelled.");
    } catch (err) {
      showToast("error", err.message || "Could not cancel this order.");
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return <div className="order-detail-page">Loading order…</div>;
  }

  if (!order) {
    return (
      <div className="order-not-found">
        <div className="order-not-found-icon">😕</div>
        <h2>Order not found</h2>
        <Link to="/account/orders">Back to Orders</Link>
      </div>
    );
  }

  const isCancelled = order.status === "Cancelled";
  const isReturned = order.status === "Returned";
  const canCancel = order.status === "Pending";

  const currentIdx = STATUS_ORDER.indexOf(order.status);

  const formattedOrderDate = new Date(order.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const cancelledDate = order.updatedAt
    ? new Date(order.updatedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div className="order-detail-page">
      <div className="order-detail-header">
        <div className="order-detail-header-card">
          <Breadcrumb
            crumbs={[
              { label: "My Orders", to: "/account/orders" },
              { label: `ORD-${order.orderNumber}` },
            ]}
          />
          <div className="order-title-row">
            <h1>Order ORD-{order.orderNumber}</h1>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="order-date">{formattedOrderDate}</p>
          {canCancel && (
            <button
              type="button"
              onClick={handleCancel}
              disabled={cancelling}
              className="order-cancel-btn"
            >
              {cancelling ? "Cancelling…" : "Cancel Order"}
            </button>
          )}
        </div>
      </div>

      {/* Order Timeline — tracks the current status only; the backend
          doesn't record a date for each past status, only for the order
          as a whole (updatedAt). */}
      {!isCancelled && !isReturned && (
        <div className="order-timeline-card">
          <h2>Order Timeline</h2>

          <div className="timeline">
            <div className="timeline-line" />
            <div
              className="timeline-progress"
              style={{
                width: `${Math.max(0, currentIdx / (STATUS_ORDER.length - 1)) * (100 - 100 / STATUS_ORDER.length)}%`,
              }}
            />

            {STATUS_ORDER.map((status, i) => {
              const done = i <= currentIdx;
              const active = i === currentIdx;

              return (
                <div
                  key={status}
                  className="timeline-item"
                  style={{ width: `${100 / STATUS_ORDER.length}%` }}
                >
                  <div
                    className={`timeline-circle ${
                      done ? "timeline-circle-done" : "timeline-circle-pending"
                    } ${active ? "timeline-circle-active" : ""}`}
                  >
                    {done ? (
                      <svg
                        className="timeline-check-icon"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      <div className="timeline-dot" />
                    )}
                  </div>

                  <p
                    className={`timeline-status ${done ? "timeline-status-done" : "timeline-status-pending"}`}
                  >
                    {status}
                  </p>

                  {active && (
                    <p className="timeline-date">
                      Last updated{" "}
                      {new Date(order.updatedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {isCancelled && (
        <div className="cancelled-notice">
          <svg
            className="cancelled-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>

          <div>
            <p className="cancelled-title">Order Cancelled</p>
            <p className="cancelled-description">
              This order was cancelled
              {cancelledDate ? ` on ${cancelledDate}` : ""}.
            </p>
          </div>
        </div>
      )}

      <div className="order-content-grid">
        <div className="order-items-card">
          <h2>Order Items</h2>

          <div className="order-items-list">
            {order.items.map((item) => (
              <div key={item.id} className="order-item">
                <img
                  src={item.image}
                  alt={item.name}
                  className="order-item-image"
                />

                <div className="order-item-info">
                  <p className="order-item-name">{item.name}</p>
                  <p className="order-item-details">
                    Qty: {item.quantity} × {item.price.toFixed(2)}
                  </p>
                </div>

                <span className="order-item-total">
                  {(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="order-summary">
            <div className="order-summary-row">
              <span>Subtotal</span>
              <span>{order.subtotal.toFixed(2)}</span>
            </div>

            <div className="order-summary-row">
              <span>Shipping</span>
              <span className="free-shipping">Free</span>
            </div>

            <div className="order-total-row">
              <span>Total</span>
              <span>{order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="order-info-column">
          <div className="info-card">
            <h3>Shipping Info</h3>
            <p className="shipping-name">{order.customer.name}</p>
            <p className="shipping-text">{order.customer.phone}</p>
            <p className="shipping-text shipping-address-first">
              {order.address.line1}
            </p>
            {order.address.line2 && (
              <p className="shipping-text">{order.address.line2}</p>
            )}
            <p className="shipping-text">
              {order.address.city}, {order.address.state}{" "}
              {order.address.postalCode}
            </p>
            <p className="shipping-text">{order.address.country}</p>
          </div>

          <div className="info-card">
            <h3>Payment</h3>
            <div className="payment-row">
              <span className="payment-method">{order.paymentMethod}</span>
              <PaymentStatusBadge status={order.paymentStatus} />
            </div>
          </div>

          {order.invoiceId && (
            <div className="info-card">
              <h3>Invoice</h3>
              <p className="invoice-number">{order.invoiceNumber}</p>
              <p className="invoice-date">
                {order.invoiceDate
                  ? new Date(order.invoiceDate).toLocaleDateString()
                  : ""}
              </p>

              <Link
                to={`/account/invoice/${order.invoiceId}`}
                className="download-invoice-btn"
              >
                <svg
                  className="download-invoice-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a2 2 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Download Invoice
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
