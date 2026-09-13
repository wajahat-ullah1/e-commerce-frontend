import styles from './Badge.module.css';

export default function Badge({ children, variant = 'default', size = 'sm' }) {
  return (
    <span className={`${styles.badge} ${styles[size]} ${styles[variant]}`}>
      {children}
    </span>
  );
}

export function OrderStatusBadge({ status }) {
  const map = {
    Pending: 'warning',
    Processing: 'info',
    Shipped: 'accent',
    'In Transit': 'accent',
    Delivered: 'success',
    Cancelled: 'danger',
    Returned: 'muted',
  };
  return <Badge variant={map[status]}>{status}</Badge>;
}

export function PaymentStatusBadge({ status }) {
  const map = {
    Pending: 'warning',
    Paid: 'success',
    Refunded: 'info',
    Failed: 'danger',
  };
  return <Badge variant={map[status]}>{status}</Badge>;
}

export function StockBadge({ stock }) {
  if (stock === 0) return <Badge variant="danger">Out of Stock</Badge>;
  if (stock <= 10) return <Badge variant="warning">Low Stock</Badge>;
  return <Badge variant="success">In Stock</Badge>;
}