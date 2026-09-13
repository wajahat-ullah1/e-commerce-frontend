import { Link } from 'react-router-dom';
import './Footer.css';

const footerLinks = {
  Shop: [
    { label: 'All Products', to: '/shop' },
    { label: 'New Arrivals', to: '/shop?sort=new' },
    { label: 'Best Sellers', to: '/shop?sort=best' },
    { label: 'Categories', to: '/shop' },
  ],
  'Customer Service': [
    { label: 'Track Order', to: '/account/orders' },
    { label: 'Returns & Exchanges', to: '/' },
    { label: 'Shipping Info', to: '/' },
    { label: 'FAQ', to: '/' },
  ],
  Account: [
    { label: 'My Account', to: '/account' },
    { label: 'My Orders', to: '/account/orders' },
    { label: 'Wishlist', to: '/account/wishlist' },
    { label: 'Notifications', to: '/account/notifications' },
  ],
};

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <div className="footer-logo-icon">
                <svg className="footer-logo-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <span className="footer-logo-text">Lumière</span>
            </Link>

            <p className="footer-description">
              Premium quality products, thoughtfully curated and delivered to your door. Shop with confidence.
            </p>

            <div className="footer-socials">
              {[
                {
                  label: 'Instagram',
                  path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z'
                },
                {
                  label: 'Twitter',
                  path: 'M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z'
                },
                {
                  label: 'Facebook',
                  path: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z'
                },
              ].map(social => (
                <button key={social.label} className="footer-social-button" aria-label={social.label}>
                  <svg className="footer-social-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={social.path} />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="footer-link-column">
              <h4 className="footer-column-title">{title}</h4>
              <ul className="footer-link-list">
                {links.map(link => (
                  <li key={link.label}>
                    <Link to={link.to} className="footer-link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">© 2026 Lumière. All rights reserved.</p>
          <div className="footer-legal-links">
            <Link to="/" className="footer-legal-link">Privacy Policy</Link>
            <Link to="/" className="footer-legal-link">Terms &amp; Conditions</Link>
            <Link to="/" className="footer-legal-link">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
