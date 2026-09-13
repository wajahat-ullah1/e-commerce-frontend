import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext.jsx';
import Rating from './Rating.jsx';
import Badge, { StockBadge } from './Badge.jsx';
import styles from './ProductCard.module.css';

export default function ProductCard({ product, view = 'grid' }) {
  const { addToCart, toggleWishlist, wishlistIds } = useApp();
  const inWishlist = wishlistIds.has(product.id);

  if (view === 'list') {
    return (
      <div className={styles.listCard}>
        <Link to={`/product/${product.id}`} className={styles.listImageWrap}>
          <img src={product.images[0]} alt={product.name} className={styles.image} />
        </Link>
        <div className={styles.listBody}>
          <div>
            <div className={styles.listTopRow}>
              <div>
                <span className={styles.category}>{product.category}</span>
                <Link to={`/product/${product.id}`}>
                  <h3 className={`${styles.listTitle} line-clamp-2`}>{product.name}</h3>
                </Link>
              </div>
              {product.badge && (
                <Badge variant={product.badge === 'Sale' ? 'danger' : product.badge === 'New' ? 'accent' : 'warning'}>
                  {product.badge}
                </Badge>
              )}
            </div>
            <Rating value={product.rating} count={product.reviewCount} />
            <p className={`${styles.listDescription} line-clamp-2`}>{product.description}</p>
          </div>
          <div className={styles.listFooterRow}>
            <div>
              <span className={styles.priceLarge}>${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className={styles.originalPriceLarge}>${product.originalPrice.toFixed(2)}</span>
              )}
            </div>
            <div className={styles.listActions}>
              <StockBadge stock={product.stock} />
              <button
                onClick={() => toggleWishlist(product)}
                className={`${styles.wishlistButtonList} ${inWishlist ? styles.wishlistActive : ''}`}
              >
                <svg className={styles.heartIcon} fill={inWishlist ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
              <button
                disabled={product.stock === 0}
                onClick={() => addToCart(product)}
                className={styles.addButtonList}
              >
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`product-card ${styles.gridCard}`}>
      <div className={`product-card-image ${styles.gridImageWrap}`}>
        <Link to={`/product/${product.id}`}>
          <img src={product.images[0]} alt={product.name} className={styles.image} />
        </Link>

        {product.badge && (
          <div className={styles.badgeOverlay}>
            <Badge variant={product.badge === 'Sale' ? 'danger' : product.badge === 'New' ? 'accent' : 'warning'}>
              {product.badge}
            </Badge>
          </div>
        )}

        <button
          onClick={() => toggleWishlist(product)}
          className={`${styles.wishlistButtonGrid} ${inWishlist ? styles.wishlistActive : styles.wishlistHidden}`}
        >
          <svg className={styles.heartIcon} fill={inWishlist ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      <div className={styles.gridBody}>
        <span className={styles.category}>{product.category}</span>
        <Link to={`/product/${product.id}`}>
          <h3 className={`${styles.gridTitle} line-clamp-2`}>{product.name}</h3>
        </Link>
        <div className={styles.ratingWrap}>
          <Rating value={product.rating} count={product.reviewCount} />
        </div>
        <div className={styles.gridFooterRow}>
          <div>
            <span className={styles.priceSmall}>${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className={styles.originalPriceSmall}>${product.originalPrice.toFixed(2)}</span>
            )}
          </div>
          <button
            disabled={product.stock === 0}
            onClick={() => addToCart(product)}
            className={styles.addButtonGrid}
          >
            {product.stock === 0 ? 'Sold Out' : '+ Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}