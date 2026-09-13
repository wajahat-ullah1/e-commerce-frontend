import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Rating from '../../components/customer_Ui/Rating';
import { StockBadge } from '../../components/customer_Ui/Badge';
import './Wishlist.css';

export default function Wishlist() {
  const {
    wishlist,
    toggleWishlist,
    addToCart,
  } = useApp();

  if (wishlist.length === 0) {
    return (
      <div className="wishlist-page">

        {/* Page Title */}
        <h1 className="wishlist-page-title">
          Wishlist
        </h1>

        {/* Empty Wishlist */}
        <div className="wishlist-empty">

          <div className="wishlist-empty-icon">
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div>

          <h3>
            Your wishlist is waiting for something special.
          </h3>

          <p>
            Save items you love and come back to them
            when you're ready.
          </p>

          <Link
            to="/shop"
            className="wishlist-explore-btn"
          >
            Explore Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">

      {/* Header */}
      <div className="wishlist-header">
        <h1 className="wishlist-page-title">
          Wishlist
        </h1>

        <span className="wishlist-count">
          {wishlist.length} item
          {wishlist.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Products Grid */}
      <div className="wishlist-grid">

        {wishlist.map((product) => (
          <div
            key={product.id}
            className="wishlist-product-card"
          >

            {/* Product Image */}
            <div className="wishlist-image-wrapper">

              <Link
                to={`/product/${product.id}`}
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="wishlist-product-image"
                />
              </Link>

              {/* Remove Wishlist Button */}
              <button
                type="button"
                onClick={() =>
                  toggleWishlist(product)
                }
                className="wishlist-remove-btn"
              >
                <svg
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            {/* Product Information */}
            <div className="wishlist-product-info">

              <span className="wishlist-category">
                {product.category}
              </span>

              <Link
                to={`/product/${product.id}`}
                className="wishlist-product-link"
              >
                <h3 className="wishlist-product-name">
                  {product.name}
                </h3>
              </Link>

              {/* Rating */}
              <div className="wishlist-rating">
                <Rating
                  value={product.rating}
                  count={product.reviewCount}
                />
              </div>

              {/* Price + Stock + Cart */}
              <div className="wishlist-product-footer">

                <div className="wishlist-price-section">

                  <span className="wishlist-price">
                    ${product.price.toFixed(2)}
                  </span>

                  <div className="wishlist-stock">
                    <StockBadge
                      stock={product.stock}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  disabled={product.stock === 0}
                  onClick={() =>
                    addToCart(product)
                  }
                  className="wishlist-cart-btn"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}