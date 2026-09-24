import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { useApp } from "../../context/useApp";
import "./OrderConfirmation.css";

export default function OrderConfirmation() {
  const { state } = useLocation();
  const { registerFromGuestOrder, showToast } = useApp();

  const [wantsAccount, setWantsAccount] = useState(null); // null | true | false
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [creating, setCreating] = useState(false);
  const [accountCreated, setAccountCreated] = useState(false);

  const data = state || {
    orderId: null,
    orderNumber: "123456",
    customer: {
      name: "Alex Johnson",
      phone: "+1 555 0123",
      email: "alex@example.com",
    },
    address: {
      line1: "123 Maple Street",
      city: "San Francisco",
      state: "CA",
      postalCode: "94102",
      country: "United States",
    },
    items: [],
    total: 0,
    isGuestOrder: false,
    guestCartId: null,
  };

  const orderSummary = [
    {
      label: "Order Number",
      value: `#${data.orderNumber}`,
    },
    {
      label: "Order Date",
      value: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    },
    {
      label: "Total Amount",
      value: `$${data.total?.toFixed(2) || "0.00"}`,
    },
    {
      label: "Payment",
      value: "Cash on Delivery",
    },
  ];

  const handleCreateAccount = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      showToast("error", "Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      showToast("error", "Passwords don't match.");
      return;
    }

    setCreating(true);
    try {
      await registerFromGuestOrder({
        orderId: data.orderId,
        guestCartId: data.guestCartId,
        password,
      });
      setAccountCreated(true);
      showToast("success", "Account created — you are now logged in.");
    } catch (err) {
      showToast("error", err.message || "Could not create your account.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="order-confirmation-page">
      <div className="order-confirmation-container">
        {/* Success */}
        <div className="order-confirmation-success">
          <div className="order-confirmation-success-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1>Order Confirmed!</h1>

          <p>Thank you for your purchase. Your order is being processed.</p>

          {data.customer.email && (
            <p className="order-confirmation-email">
              A confirmation email has been sent to{" "}
              <strong>{data.customer.email}</strong>
            </p>
          )}
        </div>

        {/* Order Details Card */}
        <div className="order-confirmation-card">
          {/* Header */}
          <div className="order-confirmation-summary">
            {orderSummary.map(({ label, value }) => (
              <div key={label} className="order-confirmation-summary-item">
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
                  <div key={product.id} className="order-confirmation-item">
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
                <span>${data.total?.toFixed(2)}</span>
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

              {data.customer?.email && <p>{data.customer.email}</p>}
            </div>

            {/* Shipping Address */}
            <div className="order-confirmation-info-section">
              <h3>Shipping Address</h3>

              {data.address && (
                <>
                  <p>{data.address.line1}</p>

                  {data.address.line2 && <p>{data.address.line2}</p>}

                  <p>
                    {data.address.city}, {data.address.state}{" "}
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
                  Payment of ${data.total?.toFixed(2)} will be collected upon
                  delivery.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Guest → Account creation prompt */}
        {data.isGuestOrder && !accountCreated && (
          <div className="order-confirmation-account-card">
            {wantsAccount === null && (
              <>
                <h3>Save your info for next time?</h3>
                <p>
                  Create an account using the details from this order — you'll
                  just need to set a password.
                </p>
                <div className="order-confirmation-account-actions">
                  <button
                    type="button"
                    onClick={() => setWantsAccount(false)}
                    className="order-confirmation-shopping-btn"
                  >
                    No thanks
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!data.customer?.email) {
                        showToast(
                          "error",
                          "An email is needed to create an account — this order didn't include one.",
                        );
                        return;
                      }
                      setWantsAccount(true);
                    }}
                    className="order-confirmation-view-btn"
                  >
                    Yes, create my account
                  </button>
                </div>
              </>
            )}

            {wantsAccount === true && (
              <form onSubmit={handleCreateAccount}>
                <h3>Create your account</h3>

                <div className="order-confirmation-account-prefilled">
                  <p>
                    <strong>Name:</strong> {data.customer?.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {data.customer?.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {data.customer?.phone}
                  </p>
                </div>

                <div className="order-confirmation-account-fields">
                  <input
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="order-confirmation-account-input"
                    required
                  />
                  <input
                    type="password"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="order-confirmation-account-input"
                    required
                  />
                </div>

                <div className="order-confirmation-account-actions">
                  <button
                    type="button"
                    onClick={() => setWantsAccount(null)}
                    className="order-confirmation-shopping-btn"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="order-confirmation-view-btn"
                  >
                    {creating ? "Creating account..." : "Create Account"}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {accountCreated && (
          <div className="order-confirmation-account-card order-confirmation-account-success">
            <p>
              🎉 Your account has been created and you're now logged in — this
              order and any past guest orders under {data.customer?.email} are
              now linked to your account.
            </p>
          </div>
        )}

        {/* CTAs */}
        <div className="order-confirmation-actions">
          <Link to="/account/orders" className="order-confirmation-view-btn">
            View Order
          </Link>

          <Link to="/shop" className="order-confirmation-shopping-btn">
            Continue Shopping
          </Link>
        </div>

        {/* Estimated Delivery */}
        <div className="order-confirmation-delivery">
          <p>
            Estimated delivery: <span>3-5 business days</span>
          </p>
        </div>
      </div>
    </div>
  );
}
