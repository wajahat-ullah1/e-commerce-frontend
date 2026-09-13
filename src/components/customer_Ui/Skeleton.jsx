import styles from './Skeleton.module.css';

export function Skeleton({ className = '' }) {
  return <div className={`${styles.skeleton} ${className}`} />;
}

export function ProductCardSkeleton() {
  return (
    <div className={styles.card}>
      <Skeleton className={styles.image} />
      <div className={styles.body}>
        <Skeleton className={styles.line1} />
        <Skeleton className={styles.line2} />
        <Skeleton className={styles.line3} />
        <div className={styles.footerRow}>
          <Skeleton className={styles.priceLine} />
          <Skeleton className={styles.buttonLine} />
        </div>
      </div>
    </div>
  );
}

export function OrderCardSkeleton() {
  return (
    <div className={styles.orderCard}>
      <div className={styles.orderTopRow}>
        <Skeleton className={styles.orderNumber} />
        <Skeleton className={styles.orderPill} />
      </div>
      <Skeleton className={styles.orderDate} />
      <div className={styles.orderItemRow}>
        <Skeleton className={styles.orderThumb} />
        <div className={styles.orderItemText}>
          <Skeleton className={styles.orderItemLine1} />
          <Skeleton className={styles.orderItemLine2} />
        </div>
      </div>
    </div>
  );
}