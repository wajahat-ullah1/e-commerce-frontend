import styles from './QuantitySelector.module.css';

export default function QuantitySelector({ value, onChange, min = 1, max = 99, size = 'md' }) {
  return (
    <div className={styles.wrap}>
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className={`${styles.button} ${styles[size]}`}
      >
        <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" />
        </svg>
      </button>
      <span className={`${styles.value} ${styles[`num${size}`]}`}>{value}</span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className={`${styles.button} ${styles[size]}`}
      >
        <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
}