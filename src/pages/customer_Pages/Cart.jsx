import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/useApp';
import Breadcrumb from '../../components/customer_Ui/Breadcrumb';
import QuantitySelector from '../../components/customer_Ui/QuantitySelector';
import './Cart.css';

export default function Cart() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    cartTotal,
    isLoggedIn,
  } = useApp();

  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="cart-empty-page">
        <div className="cart-empty-content">

          <div className="cart-empty-icon">
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>

          <h2>
            Your cart is empty
          </h2>

          <p>
            Looks like you haven't added anything yet.
            Explore our collection and find something you
            love.
          </p>

          <Link
            to="/shop"
            className="cart-continue-btn"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const shipping = cartTotal > 0 ? 0 : 9.99;

  const totalItems = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <div className="cart-page">

      <div className="cart-container">

        {/* Breadcrumb */}
        <Breadcrumb
          crumbs={[
            {
              label: 'Home',
              to: '/',
            },
            {
              label: 'Shopping Cart',
            },
          ]}
        />

        {/* Page Heading */}
        <h1 className="cart-page-title">
          Shopping Cart

          <span className="cart-item-count">
            ({totalItems} items)
          </span>
        </h1>

        {/* Main Cart Grid */}
        <div className="cart-layout">

          {/* Cart Items */}
          <div className="cart-items-column">

            {cart.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="cart-item-card"
              >
                <div className="cart-item-content">

                  {/* Product Image */}
                  <Link
                    to={`/product/${product.id}`}
                    className="cart-product-image-link"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="cart-product-image"
                    />
                  </Link>

                  {/* Product Details */}
                  <div className="cart-product-details">

                    <div className="cart-product-header">

                      <div className="cart-product-title-section">

                        <span className="cart-product-category">
                          {product.category}
                        </span>

                        <Link
                          to={`/product/${product.id}`}
                          className="cart-product-link"
                        >
                          <h3>
                            {product.name}
                          </h3>
                        </Link>

                      </div>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() =>
                          removeFromCart(product.id)
                        }
                        className="cart-remove-btn"
                        aria-label={`Remove ${product.name}`}
                      >
                        <svg
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>

                    {/* Stock Messages */}
                    {product.stock === 0 && (
                      <span className="cart-out-of-stock">
                        Out of Stock
                      </span>
                    )}

                    {product.stock > 0 &&
                      product.stock <= 5 && (
                        <span className="cart-low-stock">
                          Only {product.stock} left
                        </span>
                      )}

                    {/* Quantity + Price */}
                    <div className="cart-product-footer">

                      <QuantitySelector
                        value={quantity}
                        onChange={(qty) =>
                          updateQuantity(
                            product.id,
                            qty
                          )
                        }
                        max={product.stock || 1}
                        size="sm"
                      />

                      <div className="cart-product-price">
                        <p>
                          {(
                            product.price *
                            quantity
                          ).toFixed(2)}
                        </p>

                        {quantity > 1 && (
                          <span>
                            {product.price.toFixed(2)} each
                          </span>
                        )}
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Continue Shopping */}
            <div className="cart-actions">
              <Link
                to="/shop"
                className="cart-continue-shopping"
              >
                Continue Shopping
              </Link>
            </div>

          </div>

          {/* Order Summary */}
          <div className="cart-summary-column">

            <div className="cart-summary-card">

              <h2>
                Order Summary
              </h2>

              <div className="cart-summary-details">

                {/* Subtotal */}
                <div className="cart-summary-row">
                  <span>
                    Subtotal ({totalItems} items)
                  </span>

                  <span className="cart-summary-price">
                    {cartTotal.toFixed(2)}
                  </span>
                </div>

                {/* Shipping */}
                <div className="cart-summary-row">
                  <span>
                    Shipping
                  </span>

                  <span
                    className={
                      shipping === 0
                        ? 'cart-free-shipping'
                        : 'cart-summary-price'
                    }
                  >
                    {shipping === 0
                      ? 'Free'
                      : `$${shipping.toFixed(2)}`}
                  </span>
                </div>

                {/* Free Shipping Message */}
                {shipping === 0 && (
                  <p className="cart-free-shipping-message">
                    ✓ Free shipping on this order
                  </p>
                )}

              </div>

              {/* Total */}
              <div className="cart-total-row">
                <span>
                  Total
                </span>

                <span>
                  {(cartTotal + shipping).toFixed(2)}
                </span>
              </div>

              {/* Checkout */}
              <button
                type="button"
                onClick={() =>
                  navigate('/checkout')
                }
                className="cart-checkout-btn"
              >
                Proceed to Checkout
              </button>

              {/* Login Message */}
              {!isLoggedIn && (
                <p className="cart-login-message">
                  <Link
                    to="/login"
                    className="cart-login-link"
                  >
                    Sign in
                  </Link>{' '}
                  to save your cart and earn rewards
                </p>
              )}

              {/* Security Information */}
              <div className="cart-security-info">

                <div className="cart-security-item">
                  <svg
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>

                  <span>
                    Secure checkout
                  </span>
                </div>

                <div className="cart-security-item">
                  <svg
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>

                  <span>
                    Satisfaction guaranteed
                  </span>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}