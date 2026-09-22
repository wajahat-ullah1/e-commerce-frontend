import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/useApp';
import './Checkout.css';

const STEPS = [
  { n: 1, label: 'Customer Info' },
  { n: 2, label: 'Shipping' },
  { n: 3, label: 'Review Order' },
  { n: 4, label: 'Payment' },
];

export default function Checkout() {
  const { cart, cartTotal, isLoggedIn, addresses, clearCart } = useApp();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [guest, setGuest] = useState({
    name: '',
    phone: '',
    email: '',
  });

  const [addr, setAddr] = useState({
    line1: '',
    line2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
  });

  const [selectedAddrId, setSelectedAddrId] = useState(
    addresses.find((a) => a.isDefault)?.id || ''
  );

  const [placing, setPlacing] = useState(false);

  const selectedAddr = addresses.find((a) => a.id === selectedAddrId);

  const handlePlaceOrder = async () => {
    setPlacing(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    clearCart();

    navigate('/order-confirmation', {
      state: {
        orderNumber: Math.floor(
          100000 + Math.random() * 900000
        ).toString(),
        customer: isLoggedIn
          ? {
              name: 'Alex Johnson',
              phone: '+1 555 0123',
              email: 'alex@example.com',
            }
          : guest,
        address: isLoggedIn ? selectedAddr : addr,
        items: cart,
        total: cartTotal,
      },
    });
  };

  const InputField = ({
    label,
    value,
    onChange,
    required = false,
    type = 'text',
    placeholder = '',
  }) => (
    <div className="checkout-field">
      <label className="checkout-label">
        {label}
        {required && <span className="checkout-required">*</span>}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        className="checkout-input"
      />
    </div>
  );

  const shipping = 0;

  return (
    <div className="checkout-page">
      <div className="checkout-container">

        {/* Header */}
        <div className="checkout-header">
          <h1>Checkout</h1>
          <p>Complete your order securely</p>
        </div>

        {/* Step Indicator */}
        <div className="checkout-step-indicator">
          {STEPS.map((s, i) => (
            <div key={s.n} className="checkout-step-wrapper">
              <div className="checkout-step">
                <div
                  className={`checkout-step-circle ${
                    step > s.n
                      ? 'checkout-step-completed'
                      : step === s.n
                      ? 'checkout-step-active'
                      : 'checkout-step-upcoming'
                  }`}
                >
                  {step > s.n ? (
                    <svg
                      className="checkout-check-icon"
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
                    s.n
                  )}
                </div>

                <span
                  className={`checkout-step-label ${
                    step === s.n
                      ? 'checkout-step-label-active'
                      : 'checkout-step-label-inactive'
                  }`}
                >
                  {s.label}
                </span>
              </div>

              {i < STEPS.length - 1 && (
                <div
                  className={`checkout-step-line ${
                    step > s.n
                      ? 'checkout-step-line-completed'
                      : 'checkout-step-line-upcoming'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="checkout-layout">

          {/* Main Content */}
          <div className="checkout-main">
            <div className="checkout-content-card">

              {/* Step 1 */}
              {step === 1 && (
                <div>
                  <h2 className="checkout-section-title">
                    {isLoggedIn
                      ? 'Your Information'
                      : 'Customer Information'}
                  </h2>

                  {isLoggedIn ? (
                    <div className="checkout-user-box">
                      <div className="checkout-user-avatar">
                        <span>A</span>
                      </div>

                      <div>
                        <p className="checkout-user-name">
                          Alex Johnson
                        </p>
                        <p className="checkout-user-contact">
                          alex@example.com · +1 555 0123
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="checkout-fields">
                      <InputField
                        label="Full Name"
                        value={guest.name}
                        onChange={(value) =>
                          setGuest((g) => ({
                            ...g,
                            name: value,
                          }))
                        }
                        required
                        placeholder="Alex Johnson"
                      />

                      <InputField
                        label="Phone Number"
                        value={guest.phone}
                        onChange={(value) =>
                          setGuest((g) => ({
                            ...g,
                            phone: value,
                          }))
                        }
                        required
                        type="tel"
                        placeholder="+1 555 0123"
                      />

                      <InputField
                        label="Email Address"
                        value={guest.email}
                        onChange={(value) =>
                          setGuest((g) => ({
                            ...g,
                            email: value,
                          }))
                        }
                        type="email"
                        placeholder="Optional"
                      />
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="checkout-primary-btn checkout-full-btn"
                  >
                    Continue to Shipping
                  </button>
                </div>
              )}

              {/* Step 2 */}
              {step === 2 && (
                <div>
                  <h2 className="checkout-section-title">
                    Shipping Address
                  </h2>

                  {isLoggedIn && addresses.length > 0 ? (
                    <div className="checkout-address-list">
                      {addresses.map((a) => (
                        <label
                          key={a.id}
                          className={`checkout-address-option ${
                            selectedAddrId === a.id
                              ? 'checkout-address-selected'
                              : 'checkout-address-unselected'
                          }`}
                        >
                          <input
                            type="radio"
                            name="address"
                            value={a.id}
                            checked={selectedAddrId === a.id}
                            onChange={() =>
                              setSelectedAddrId(a.id)
                            }
                          />

                          <div className="checkout-address-content">
                            <div className="checkout-address-title">
                              <span>{a.label}</span>

                              {a.isDefault && (
                                <span className="checkout-default-badge">
                                  Default
                                </span>
                              )}
                            </div>

                            <p>
                              {a.line1}
                              {a.line2
                                ? `, ${a.line2}`
                                : ''}
                            </p>

                            <p>
                              {a.city}, {a.state}{' '}
                              {a.postalCode}
                            </p>

                            <p>{a.country}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div className="checkout-fields">
                      <InputField
                        label="Address Line 1"
                        value={addr.line1}
                        onChange={(value) =>
                          setAddr((a) => ({
                            ...a,
                            line1: value,
                          }))
                        }
                        required
                        placeholder="123 Main Street"
                      />

                      <InputField
                        label="Address Line 2"
                        value={addr.line2}
                        onChange={(value) =>
                          setAddr((a) => ({
                            ...a,
                            line2: value,
                          }))
                        }
                        placeholder="Apartment, suite, etc. (optional)"
                      />

                      <div className="checkout-form-grid">
                        <InputField
                          label="City"
                          value={addr.city}
                          onChange={(value) =>
                            setAddr((a) => ({
                              ...a,
                              city: value,
                            }))
                          }
                          required
                          placeholder="San Francisco"
                        />

                        <InputField
                          label="State / Province"
                          value={addr.state}
                          onChange={(value) =>
                            setAddr((a) => ({
                              ...a,
                              state: value,
                            }))
                          }
                          required
                          placeholder="CA"
                        />
                      </div>

                      <div className="checkout-form-grid">
                        <InputField
                          label="Postal Code"
                          value={addr.postalCode}
                          onChange={(value) =>
                            setAddr((a) => ({
                              ...a,
                              postalCode: value,
                            }))
                          }
                          required
                          placeholder="94102"
                        />

                        <div className="checkout-field">
                          <label className="checkout-label">
                            Country
                            <span className="checkout-required">
                              *
                            </span>
                          </label>

                          <select
                            value={addr.country}
                            onChange={(e) =>
                              setAddr((a) => ({
                                ...a,
                                country: e.target.value,
                              }))
                            }
                            className="checkout-input checkout-select"
                          >
                            {[
                              'United States',
                              'United Kingdom',
                              'Canada',
                              'Australia',
                              'Germany',
                              'France',
                              'Other',
                            ].map((country) => (
                              <option
                                key={country}
                                value={country}
                              >
                                {country}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="checkout-button-row">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="checkout-secondary-btn"
                    >
                      Back
                    </button>

                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="checkout-primary-btn"
                    >
                      Review Order
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3 */}
              {step === 3 && (
                <div>
                  <h2 className="checkout-section-title">
                    Review Your Order
                  </h2>

                  <div className="checkout-review-items">
                    {cart.map(({ product, quantity }) => (
                      <div
                        key={product.id}
                        className="checkout-review-item"
                      >
                        <img
                          src={product.images[0]}
                          alt=""
                          className="checkout-review-image"
                        />

                        <div className="checkout-review-details">
                          <p className="checkout-review-name">
                            {product.name}
                          </p>
                          <p className="checkout-review-quantity">
                            Qty: {quantity}
                          </p>
                        </div>

                        <span className="checkout-review-price">
                          $
                          {(product.price * quantity).toFixed(
                            2
                          )}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="checkout-review-summary">
                    <div>
                      <span>Subtotal</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>

                    <div>
                      <span>Shipping</span>
                      <span className="checkout-free">
                        Free
                      </span>
                    </div>

                    <div className="checkout-review-total">
                      <span>Total</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="checkout-button-row">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="checkout-secondary-btn"
                    >
                      Back
                    </button>

                    <button
                      type="button"
                      onClick={() => setStep(4)}
                      className="checkout-primary-btn"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4 */}
              {step === 4 && (
                <div>
                  <h2 className="checkout-section-title">
                    Payment Method
                  </h2>

                  <div className="checkout-payment-card">
                    <div className="checkout-radio-circle">
                      <div />
                    </div>

                    <div className="checkout-payment-content">
                      <p className="checkout-payment-title">
                        Cash on Delivery
                      </p>

                      <p className="checkout-payment-description">
                        Pay when your order is delivered to
                        your door. No upfront payment required.
                      </p>
                    </div>

                    <div className="checkout-payment-icon-box">
                      <svg
                        className="checkout-payment-icon"
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
                    </div>
                  </div>

                  <div className="checkout-payment-warning">
                    <svg
                      className="checkout-warning-icon"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>

                    <p>
                      Please have the exact amount ready when
                      the delivery arrives. Our courier will
                      provide a receipt upon delivery.
                    </p>
                  </div>

                  <div className="checkout-button-row">
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="checkout-secondary-btn"
                    >
                      Back
                    </button>

                    <button
                      type="button"
                      onClick={handlePlaceOrder}
                      disabled={placing}
                      className="checkout-place-order-btn"
                    >
                      {placing && (
                        <svg
                          className="checkout-spinner"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="checkout-spinner-track"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />

                          <path
                            className="checkout-spinner-path"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>
                      )}

                      {placing
                        ? 'Placing Order...'
                        : 'Place Order'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="checkout-sidebar">
            <div className="checkout-summary-card">
              <h3>Order Summary</h3>

              <div className="checkout-summary-items">
                {cart.slice(0, 3).map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="checkout-summary-item"
                  >
                    <div className="checkout-summary-image-wrapper">
                      <img
                        src={product.images[0]}
                        alt=""
                        className="checkout-summary-image"
                      />

                      <span className="checkout-summary-quantity">
                        {quantity}
                      </span>
                    </div>

                    <p className="checkout-summary-product-name">
                      {product.name}
                    </p>

                    <span className="checkout-summary-product-price">
                      $
                      {(product.price * quantity).toFixed(2)}
                    </span>
                  </div>
                ))}

                {cart.length > 3 && (
                  <p className="checkout-more-items">
                    +{cart.length - 3} more items
                  </p>
                )}
              </div>

              <div className="checkout-sidebar-total">
                <div>
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>

                <div>
                  <span>Shipping</span>
                  <span className="checkout-free">Free</span>
                </div>

                <div className="checkout-sidebar-total-row">
                  <span>Total</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}