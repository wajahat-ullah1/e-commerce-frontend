import { useLocation, Link } from 'react-router-dom';
import './OrderConfirmation.css';

export default function OrderConfirmation() {
  const { state } = useLocation();

  const data = state || {
    orderNumber: '123456',
    customer: {
      name: 'Alex Johnson',
      phone: '+1 555 0123',
      email: 'alex@example.com',
    },
    address: {
      line1: '123 Maple Street',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94102',
      country: 'United States',
    },
    items: [],
    total: 0,
  };

  const orderSummary = [
    {
      label: 'Order Number',
      value: `#${data.orderNumber}`,
    },
    {
      label: 'Order Date',
      value: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
    },
    {
      label: 'Total Amount',
      value: `$${data.total?.toFixed(2) || '0.00'}`,
    },
    {
      label: 'Payment',
      value: 'Cash on Delivery',
    },
  ];

  return (
    <div className="order-confirmation-page">
      <div className="order-confirmation-container">

        {/* Success */}
        <div className="order-confirmation-success">
          <div className="order-confirmation-success-icon">
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1>Order Confirmed!</h1>

          <p>
            Thank you for your purchase. Your order is being
            processed.
          </p>

          {data.customer.email && (
            <p className="order-confirmation-email">
              A confirmation email has been sent to{' '}
              <strong>{data.customer.email}</strong>
            </p>
          )}
        </div>

        {/* Order Details Card */}
        <div className="order-confirmation-card">

          {/* Header */}
          <div className="order-confirmation-summary">
            {orderSummary.map(({ label, value }) => (
              <div
                key={label}
                className="order-confirmation-summary-item"
              >
                <p>{label}</p>
                <span>{value}</span>
              </div>
            ))}
          </div>

          {/* Items */}
          {data.items && data.items.length > 0 && (
            <div className="order-confirmation-items-section">
              <h3>Order Items</h3>

              <div className="order-confirmation-items">
                {data.items.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="order-confirmation-item"
                  >
                    <img
                      src={product.images[0]}
                      alt=""
                      className="order-confirmation-item-image"
                    />

                    <div className="order-confirmation-item-details">
                      <p>{product.name}</p>
                      <span>Qty: {quantity}</span>
                    </div>

                    <span className="order-confirmation-item-price">
                      ${(product.price * quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="order-confirmation-items-total">
                <span>Total</span>
                <span>
                  ${data.total?.toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {/* Customer & Address */}
          <div className="order-confirmation-info-grid">

            {/* Customer */}
            <div className="order-confirmation-info-section">
              <h3>Customer</h3>

              <p className="order-confirmation-customer-name">
                {data.customer?.name}
              </p>

              <p>{data.customer?.phone}</p>

              {data.customer?.email && (
                <p>{data.customer.email}</p>
              )}
            </div>

            {/* Shipping Address */}
            <div className="order-confirmation-info-section">
              <h3>Shipping Address</h3>

              {data.address && (
                <>
                  <p>{data.address.line1}</p>

                  {data.address.line2 && (
                    <p>{data.address.line2}</p>
                  )}

                  <p>
                    {data.address.city},{' '}
                    {data.address.state}{' '}
                    {data.address.postalCode}
                  </p>

                  <p>{data.address.country}</p>
                </>
              )}
            </div>
          </div>

          {/* Payment Info */}
          <div className="order-confirmation-payment-section">
            <div className="order-confirmation-payment-box">
              <svg
                className="order-confirmation-payment-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>

              <div>
                <p>Cash on Delivery</p>

                <span>
                  Payment of ${data.total?.toFixed(2)} will be
                  collected upon delivery.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="order-confirmation-actions">
          <Link
            to="/account/orders"
            className="order-confirmation-view-btn"
          >
            View Order
          </Link>

          <Link
            to="/shop"
            className="order-confirmation-shopping-btn"
          >
            Continue Shopping
          </Link>
        </div>

        {/* Estimated Delivery */}
        <div className="order-confirmation-delivery">
          <p>
            Estimated delivery:{' '}
            <span>3-5 business days</span>
          </p>
        </div>
      </div>
    </div>
  );
}