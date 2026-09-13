import { Link } from 'react-router-dom';
import styles from './Breadcrumb.module.css';

export default function Breadcrumb({ crumbs }) {
  return (
    <nav className={styles.nav}>
      {crumbs.map((crumb, i) => (
        <div key={i} className={styles.crumb}>
          {i > 0 && <span className={styles.separator}>/</span>}
          {crumb.to ? (
            <Link to={crumb.to} className={styles.link}>
              {crumb.label}
            </Link>
          ) : (
            <span className={styles.current}>{crumb.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}