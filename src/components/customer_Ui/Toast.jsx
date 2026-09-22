import { useApp } from '../../context/useApp';
import styles from './Toast.module.css';

const icons = {
  success: (
    <svg className={`${styles.icon} ${styles.iconSuccess}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  error: (
    <svg className={`${styles.icon} ${styles.iconError}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  info: (
    <svg className={`${styles.icon} ${styles.iconInfo}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

export default function ToastContainer() {
  const { toasts, dismissToast } = useApp();

  return (
    <div className={styles.container}>
      {toasts.map(toast => (
        <div key={toast.id} className={styles.toast}>
          {icons[toast.type]}
          <span className={styles.message}>{toast.message}</span>
          <button onClick={() => dismissToast(toast.id)} className={styles.dismissButton}>
            <svg className={styles.dismissIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}