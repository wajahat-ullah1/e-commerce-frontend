import { useParams, Link, useNavigate } from 'react-router-dom';
import { orders } from '../../data/orders';
import {
  OrderStatusBadge,
  PaymentStatusBadge,
} from '../../components/customer_Ui/Badge';
import Breadcrumb from '../../components/customer_Ui/Breadcrumb';
import './OrderDetail.css';

const STATUS_ORDER = [
  'Pending',
  'Processing',
  'Shipped',
  'In Transit',
  'Delivered',
];

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const order = orders.find((o) => o.id === id);

  if (!order) {
    return (
      <div className="order-not-found">
        <div className="order-not-found-icon">😕</div>

        <h2>Order not found</h2>

        <Link to="/account/orders">
          Back to Orders
        </Link>
      </div>
    );
  }

  const isCancelled = order.status === 'Cancelled';
  const isReturned = order.status === 'Returned';

  const currentIdx = STATUS_ORDER.indexOf(order.status);

  const formattedOrderDate = new Date(
    order.date
  ).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const cancelledDate = order.timeline.find(
    (t) => t.status === 'Cancelled'
  )?.date;

  return (
    <div className="order-detail-page">

      {/* =========================================
          Order Header
          ========================================= */}
      <div className="order-detail-header">

        <Breadcrumb
          crumbs={[
            {
              label: 'My Orders',
              to: '/account/orders',
            },
            {
              label: `#${order.orderNumber}`,
            },
          ]}
        />

        <div className="order-title-row">
          <h1>
            Order #{order.orderNumber}
          </h1>

          <OrderStatusBadge
            status={order.status}
          />
        </div>

        <p className="order-date">
          {formattedOrderDate}
        </p>
      </div>


      {/* =========================================
          Order Timeline
          ========================================= */}
      {!isCancelled && !isReturned && (
        <div className="order-timeline-card">

          <h2>
            Order Timeline
          </h2>

          <div className="timeline">

            {/* Background Timeline Line */}
            <div className="timeline-line" />

            {/* Completed Timeline Line */}
            <div
              className="timeline-progress"
              style={{
                width: `${
                  Math.max(
                    0,
                    currentIdx /
                      (STATUS_ORDER.length - 1)
                  ) * 100
                }%`,
              }}
            />

            {STATUS_ORDER.map((status, i) => {
              const done = i <= currentIdx;
              const active = i === currentIdx;

              const timelineItem =
                order.timeline.find(
                  (t) => t.status === status
                );

              return (
                <div
                  key={status}
                  className="timeline-item"
                  style={{
                    width: `${
                      100 / STATUS_ORDER.length
                    }%`,
                  }}
                >

                  {/* Timeline Circle */}
                  <div
                    className={`timeline-circle ${
                      done
                        ? 'timeline-circle-done'
                        : 'timeline-circle-pending'
                    } ${
                      active
                        ? 'timeline-circle-active'
                        : ''
                    }`}
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

                  {/* Timeline Status */}
                  <p
                    className={`timeline-status ${
                      done
                        ? 'timeline-status-done'
                        : 'timeline-status-pending'
                    }`}
                  >
                    {status}
                  </p>

                  {/* Timeline Date */}
                  {timelineItem?.date && (
                    <p className="timeline-date">
                      {timelineItem.date}
                    </p>
                  )}

                </div>
              );
            })}

          </div>
        </div>
      )}


      {/* =========================================
          Cancelled Order Notice
          ========================================= */}
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
            <p className="cancelled-title">
              Order Cancelled
            </p>

            <p className="cancelled-description">
              This order was cancelled on{' '}
              {cancelledDate}.
            </p>
          </div>

        </div>
      )}


      {/* =========================================
          Main Content Grid
          ========================================= */}
      <div className="order-content-grid">

        {/* =======================================
            Order Items
            ======================================= */}
        <div className="order-items-card">

          <h2>
            Order Items
          </h2>

          <div className="order-items-list">

            {order.items.map((item) => (
              <div
                key={item.id}
                className="order-item"
              >

                <img
                  src={item.image}
                  alt={item.name}
                  className="order-item-image"
                />

                <div className="order-item-info">

                  <p className="order-item-name">
                    {item.name}
                  </p>

                  <p className="order-item-details">
                    Qty: {item.quantity} × $
                    {item.price.toFixed(2)}
                  </p>

                </div>

                <span className="order-item-total">
                  $
                  {(
                    item.price *
                    item.quantity
                  ).toFixed(2)}
                </span>

              </div>
            ))}

          </div>


          {/* Order Summary */}
          <div className="order-summary">

            <div className="order-summary-row">
              <span>Subtotal</span>

              <span>
                ${order.subtotal.toFixed(2)}
              </span>
            </div>

            <div className="order-summary-row">
              <span>Shipping</span>

              <span className="free-shipping">
                Free
              </span>
            </div>

            <div className="order-total-row">
              <span>Total</span>

              <span>
                ${order.total.toFixed(2)}
              </span>
            </div>

          </div>

        </div>


        {/* =======================================
            Right Side Information
            ======================================= */}
        <div className="order-info-column">

          {/* =====================================
              Shipping Information
              ===================================== */}
          <div className="info-card">

            <h3>
              Shipping Info
            </h3>

            <p className="shipping-name">
              {order.customer.name}
            </p>

            <p className="shipping-text">
              {order.customer.phone}
            </p>

            <p className="shipping-text shipping-address-first">
              {order.address.line1}
            </p>

            {order.address.line2 && (
              <p className="shipping-text">
                {order.address.line2}
              </p>
            )}

            <p className="shipping-text">
              {order.address.city},{' '}
              {order.address.state}{' '}
              {order.address.postalCode}
            </p>

            <p className="shipping-text">
              {order.address.country}
            </p>

          </div>


          {/* =====================================
              Payment Information
              ===================================== */}
          <div className="info-card">

            <h3>
              Payment
            </h3>

            <div className="payment-row">

              <span className="payment-method">
                {order.paymentMethod}
              </span>

              <PaymentStatusBadge
                status={order.paymentStatus}
              />

            </div>

          </div>


          {/* =====================================
              Invoice Information
              ===================================== */}
          <div className="info-card">

            <h3>
              Invoice
            </h3>

            <p className="invoice-number">
              {order.invoiceNumber}
            </p>

            <p className="invoice-date">
              {new Date(
                order.invoiceDate
              ).toLocaleDateString()}
            </p>

            <Link
              to={`/account/invoice/${order.id}`}
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

        </div>

      </div>

    </div>
  );
}