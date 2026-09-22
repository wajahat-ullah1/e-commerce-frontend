import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { products, reviews } from '../../data/products';
import { useApp } from '../../context/useApp';
import Breadcrumb from '../../components/customer_Ui/Breadcrumb';
import Rating, { StarSelector } from '../../components/customer_Ui/Rating';
import { StockBadge } from '../../components/customer_Ui/Badge';
import QuantitySelector from '../../components/customer_Ui/QuantitySelector';
import ProductCard from '../../components/customer_Ui/ProductCard';
import Modal from '../../components/customer_Ui/Modal';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    addToCart,
    toggleWishlist,
    wishlistIds,
    showToast,
    isLoggedIn,
  } = useApp();

  const product = products.find((p) => p.id === id);

  const [selectedImage, setSelectedImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [reviewModal, setReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  if (!product) {
    return (
      <div className="product-detail-not-found">
        <div className="product-detail-not-found-content">
          <div className="product-detail-not-found-icon">😕</div>

          <h2>Product Not Found</h2>

          <p>
            This product doesn't exist or has been removed.
          </p>

          <Link to="/shop" className="product-detail-back-btn">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const related = products
    .filter(
      (p) => p.category === product.category && p.id !== product.id
    )
    .slice(0, 4);

  const productReviews = reviews.filter(
    (r) => r.productId === product.id
  );

  const inWishlist = wishlistIds.has(product.id);

  const ratingDist = [5, 4, 3, 2, 1].map((star) => {
    const count = productReviews.filter(
      (r) => r.rating === star
    ).length;

    return {
      star,
      count,
      pct: productReviews.length
        ? Math.round((count / productReviews.length) * 100)
        : 0,
    };
  });

  const handleAddToCart = () => {
    addToCart(product, qty);
  };

  const handleBuyNow = () => {
    addToCart(product, qty);
    navigate('/checkout');
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();

    setReviewSubmitted(true);

    setTimeout(() => {
      setReviewModal(false);
      setReviewSubmitted(false);
      setReviewText('');
      setReviewRating(5);
    }, 2000);

    showToast('success', 'Review submitted successfully!');
  };

  const tabs = ['description', 'details', 'shipping', 'returns'];

  const trustIndicators = [
    {
      icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
      label: 'Secure Checkout',
    },
    {
      icon: 'M13 10V3L4 14h7v7l9-11h-7z',
      label: 'Fast Delivery',
    },
    {
      icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z',
      label: 'Quality Guaranteed',
    },
  ];

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">

        <Breadcrumb
          crumbs={[
            { label: 'Home', to: '/' },
            { label: 'Shop', to: '/shop' },
            {
              label: product.category,
              to: `/shop?category=${product.category}`,
            },
            { label: product.name },
          ]}
        />

        <div className="product-detail-main">

          {/* Image Gallery */}
          <div className="product-gallery">
            <div className="product-main-image-wrapper">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="product-main-image"
              />
            </div>

            {product.images.length > 1 && (
              <div className="product-thumbnail-list">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`product-thumbnail ${
                      selectedImage === i
                        ? 'product-thumbnail-active'
                        : 'product-thumbnail-inactive'
                    }`}
                  >
                    <img src={img} alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="pdp-info">

            <span className="product-category">
              {product.category}
            </span>

            <h1 className="product-title">
              {product.name}
            </h1>

            <div className="product-rating">
              <Rating
                value={product.rating}
                size="md"
                showValue
                count={product.reviewCount}
              />
            </div>

            <div className="product-price-row">
              <span className="product-price">
                ${product.price.toFixed(2)}
              </span>

              {product.originalPrice && (
                <>
                  <span className="product-original-price">
                    ${product.originalPrice.toFixed(2)}
                  </span>

                  <span className="product-discount">
                    -{Math.round(
                      (1 - product.price / product.originalPrice) * 100
                    )}%
                  </span>
                </>
              )}
            </div>

            <div className="product-stock-section">
              <StockBadge stock={product.stock} />

              {product.stock > 0 && product.stock <= 10 && (
                <p className="product-low-stock">
                  Only {product.stock} left in stock
                </p>
              )}
            </div>

            {/* Quantity + Actions */}
            <div className="product-actions-section">

              <div className="product-quantity-row">
                <span className="product-quantity-label">
                  Qty:
                </span>

                <QuantitySelector
                  value={qty}
                  onChange={setQty}
                  max={product.stock || 1}
                />
              </div>

              <div className="product-action-buttons">

                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="product-add-cart-btn"
                >
                  {product.stock === 0
                    ? 'Out of Stock'
                    : 'Add to Cart'}
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  className="product-buy-now-btn"
                >
                  Buy Now
                </button>

                <button
                  onClick={() => toggleWishlist(product)}
                  className={`product-wishlist-btn ${
                    inWishlist
                      ? 'product-wishlist-active'
                      : 'product-wishlist-inactive'
                  }`}
                  aria-label="Toggle wishlist"
                >
                  <svg
                    width="20"
                    height="20"
                    fill={inWishlist ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>

              </div>
            </div>

            {/* Trust Indicators */}
            <div className="trust-indicators">
              {trustIndicators.map((item) => (
                <div
                  key={item.label}
                  className="trust-indicator"
                >
                  <svg
                    width="20"
                    height="20"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeWidth={1.8}
                      d={item.icon}
                    />
                  </svg>

                  <span>{item.label}</span>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="product-tabs">

              <div className="product-tab-buttons">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`product-tab-button ${
                      activeTab === tab
                        ? 'product-tab-active'
                        : 'product-tab-inactive'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="product-tab-content">

                {activeTab === 'description' && (
                  <p>{product.description}</p>
                )}

                {activeTab === 'details' && (
                  <ul className="product-details-list">
                    {product.details.map((detail, i) => (
                      <li key={i}>
                        <svg
                          width="16"
                          height="16"
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

                        {detail}
                      </li>
                    ))}
                  </ul>
                )}

                {activeTab === 'shipping' && (
                  <div className="product-tab-text">
                    <p>
                      <strong>Standard Delivery:</strong>{' '}
                      3-5 business days — Free on all orders
                    </p>

                    <p>
                      <strong>Express Delivery:</strong>{' '}
                      1-2 business days — $9.99
                    </p>

                    <p>
                      Orders placed before 2pm are shipped the
                      same business day.
                    </p>
                  </div>
                )}

                {activeTab === 'returns' && (
                  <div className="product-tab-text">
                    <p>
                      <strong>30-Day Returns:</strong>{' '}
                      Return or exchange any item within 30 days
                      of delivery.
                    </p>

                    <p>
                      Items must be unused and in original
                      packaging. Free return shipping included.
                    </p>
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>

        {/* Reviews */}
        <section className="product-reviews-section">

          <div className="reviews-header">
            <h2>Customer Reviews</h2>

            <button
              onClick={() =>
                isLoggedIn
                  ? setReviewModal(true)
                  : navigate('/login')
              }
              className="write-review-btn"
            >
              Write a Review
            </button>
          </div>

          <div className="reviews-grid">

            {/* Summary */}
            <div className="review-summary">

              <div className="review-average">
                {product.rating.toFixed(1)}
              </div>

              <div className="review-summary-rating">
                <Rating value={product.rating} size="lg" />
              </div>

              <p className="review-count">
                {product.reviewCount.toLocaleString()} reviews
              </p>

              <div className="rating-distribution">
                {ratingDist.map(({ star, count, pct }) => (
                  <div
                    key={star}
                    className="rating-distribution-row"
                  >
                    <span className="rating-star-label">
                      {star}★
                    </span>

                    <div className="rating-progress">
                      <div
                        className="rating-progress-fill"
                        style={{ width: `${pct}%` }}
                      />
                    </div>

                    <span className="rating-count">
                      {count}
                    </span>
                  </div>
                ))}
              </div>

            </div>

            {/* Review List */}
            <div className="review-list">

              {productReviews.length === 0 ? (
                <div className="no-reviews">
                  <p>No reviews yet</p>
                  <span>
                    Be the first to share your experience
                  </span>
                </div>
              ) : (
                productReviews.map((review) => (
                  <div
                    key={review.id}
                    className="review-card"
                  >
                    <div className="review-card-header">

                      <img
                        src={review.avatar}
                        alt={review.author}
                        className="review-avatar"
                      />

                      <div className="review-author-info">
                        <p>{review.author}</p>

                        <span>
                          {new Date(
                            review.date
                          ).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                      </div>

                      <div className="review-card-rating">
                        <Rating value={review.rating} />
                      </div>

                    </div>

                    <p className="review-text">
                      {review.text}
                    </p>
                  </div>
                ))
              )}

            </div>
          </div>
        </section>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="related-products-section">

            <h2>Related Products</h2>

            <div className="related-products-grid">
              {related.map((item) => (
                <ProductCard
                  key={item.id}
                  product={item}
                />
              ))}
            </div>

          </section>
        )}

      </div>

      {/* Write Review Modal */}
      <Modal
        open={reviewModal}
        onClose={() => setReviewModal(false)}
        title="Write a Review"
      >
        <div className="review-modal-content">

          {reviewSubmitted ? (
            <div className="review-success">

              <div className="review-success-icon">
                <svg
                  width="24"
                  height="24"
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

              <p>Review submitted!</p>

              <span>
                Thank you for your feedback.
              </span>

            </div>
          ) : (
            <form
              onSubmit={handleReviewSubmit}
              className="review-form"
            >

              <div className="review-product-preview">

                <img
                  src={product.images[0]}
                  alt=""
                />

                <p>{product.name}</p>

              </div>

              <div className="review-form-field">

                <label>Your Rating</label>

                <StarSelector
                  value={reviewRating}
                  onChange={setReviewRating}
                />

              </div>

              <div className="review-form-field">

                <label>Your Review</label>

                <textarea
                  required
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  rows={4}
                  placeholder="Share your experience with this product..."
                />

              </div>

              <button
                type="submit"
                className="submit-review-btn"
              >
                Submit Review
              </button>

            </form>
          )}

        </div>
      </Modal>
    </div>
  );
}