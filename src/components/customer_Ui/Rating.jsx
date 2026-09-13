import styles from './Rating.module.css';

const STAR_PATH = 'M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z';

export default function Rating({ value, max = 5, size = 'sm', showValue, count }) {
  const sizeClass = styles[size];

  return (
    <div className={styles.wrap}>
      <div className={styles.stars}>
        {Array.from({ length: max }).map((_, i) => {
          const filled = i < Math.floor(value);
          const partial = !filled && i < value;
          return (
            <svg
              key={i}
              className={`${sizeClass} ${filled || partial ? styles.starFilled : styles.starEmpty}`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              {partial ? (
                <>
                  <defs>
                    <clipPath id={`half-${i}`}>
                      <rect x="0" y="0" width="10" height="20" />
                    </clipPath>
                  </defs>
                  <path d={STAR_PATH} className={styles.starEmpty} />
                  <path d={STAR_PATH} className={styles.starFilled} clipPath={`url(#half-${i})`} />
                </>
              ) : (
                <path d={STAR_PATH} />
              )}
            </svg>
          );
        })}
      </div>
      {showValue && <span className={styles.valueText}>{value.toFixed(1)}</span>}
      {count !== undefined && (
        <span className={styles.countText}>({count.toLocaleString()})</span>
      )}
    </div>
  );
}

export function StarSelector({ value, onChange }) {
  return (
    <div className={styles.wrap}>
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className={styles.selectorButton}
        >
          <svg
            className={`${styles.selectorStar} ${star <= value ? styles.starFilled : styles.starEmpty}`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d={STAR_PATH} />
          </svg>
        </button>
      ))}
    </div>
  );
}