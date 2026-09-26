import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useApp } from "../../context/useApp";
import "./Header.css";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "Categories", to: "/shop" },
  { label: "New Arrivals", to: "/shop?sort=new" },
  { label: "Best Sellers", to: "/shop?sort=best" },
];

export default function Header() {
  const { cartCount, wishlist, isLoggedIn, user, logout, unreadCount } =
    useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const accountRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    setAccountOpen(false);
  }, [location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setSearchOpen(false);
    }
  };

  return (
    <header
      className={`site-header ${scrolled ? "site-header--scrolled" : ""}`}
    >
      <div className="header-container">
        {/* Desktop */}
        <div className="header-desktop">
          <Link to="/" className="header-logo">
            <div
              className="header-logo-icon"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #c026d3)",
              }}
            >
              <svg
                className="icon--logo"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M7 9v3m1.5-1.5h-3M15.5 10h.01M17.5 12h.01M7.5 6h9a5 5 0 015 5v3a4 4 0 01-4 4c-.9 0-1.5-.4-2-1l-.6-.8a1.5 1.5 0 00-1.2-.6h-2.4a1.5 1.5 0 00-1.2.6l-.6.8a4 4 0 01-2 1 4 4 0 01-4-4v-3a5 5 0 015-5z"
                />
              </svg>
            </div>
            <span className="header-logo-text">Sami Games</span>
          </Link>

          {/* Nav */}
          <nav className="header-nav">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className={`header-nav-link ${location.pathname === link.to ? "is-active" : ""}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right */}
          <div className="header-actions">
            <form onSubmit={handleSearch} className="header-search-form">
              <input
                type="text"
                id="header-search"
                name="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="header-search-input"
              />
              <svg
                className="header-search-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </form>

            {/* Wishlist */}
            <Link
              to={isLoggedIn ? "/account/wishlist" : "/login"}
              className="header-action-button header-action-button--badge"
            >
              <svg
                className="header-action-icon"
                fill="none"
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
              {wishlist.length > 0 && (
                <span className="header-badge header-badge--wishlist">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Notifications */}
            {isLoggedIn && (
              <Link
                to="/account/notifications"
                className="header-action-button header-action-button--badge"
              >
                <svg
                  className="header-action-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                {unreadCount > 0 && (
                  <span className="header-badge header-badge--notification">
                    {unreadCount}
                  </span>
                )}
              </Link>
            )}

            {/* Cart */}
            <Link
              to="/cart"
              className="header-action-button header-action-button--badge"
            >
              <svg
                className="header-action-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              {cartCount > 0 && (
                <span className="header-badge header-badge--cart">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Account */}
            {isLoggedIn ? (
              <div ref={accountRef} className="account-wrapper">
                <button
                  onClick={() => setAccountOpen((v) => !v)}
                  className="account-button"
                >
                  {user?.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.name}
                      className="account-avatar"
                    />
                  ) : (
                    <div className="account-avatar account-avatar--fallback">
                      <span>{user?.name?.charAt(0)}</span>
                    </div>
                  )}
                  <svg
                    className={`account-chevron ${accountOpen ? "is-open" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {accountOpen && (
                  <div className="account-menu">
                    <div className="account-menu-user">
                      <p className="account-menu-name">{user?.name}</p>
                      <p className="account-menu-email">{user?.email}</p>
                    </div>

                    {[
                      { label: "My Account", to: "/account" },
                      { label: "My Orders", to: "/account/orders" },
                      { label: "Wishlist", to: "/account/wishlist" },
                      { label: "Notifications", to: "/account/notifications" },
                    ].map((item) => (
                      <Link
                        key={item.label}
                        to={item.to}
                        className="account-menu-link"
                      >
                        {item.label}
                      </Link>
                    ))}

                    <div className="account-menu-logout">
                      <button
                        onClick={() => {
                          logout();
                          navigate("/");
                        }}
                        className="logout-button"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="sign-in-button">
                Sign In
              </Link>
            )}
          </div>
        </div>

        {/* Mobile */}
        <div className="header-mobile">
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="mobile-menu-button"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg
                className="mobile-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="mobile-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>

          <Link to="/" className="mobile-logo">
            <div
              className="mobile-logo-icon"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #c026d3)",
              }}
            >
              <svg
                className="icon--logo"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M7 9v3m1.5-1.5h-3M15.5 10h.01M17.5 12h.01M7.5 6h9a5 5 0 015 5v3a4 4 0 01-4 4c-.9 0-1.5-.4-2-1l-.6-.8a1.5 1.5 0 00-1.2-.6h-2.4a1.5 1.5 0 00-1.2.6l-.6.8a4 4 0 01-2 1 4 4 0 01-4-4v-3a5 5 0 015-5z"
                />
              </svg>
            </div>
            <span className="mobile-logo-text">Sami Games</span>
          </Link>

          <div className="mobile-actions">
            <button
              onClick={() => setSearchOpen((v) => !v)}
              className="mobile-action-button"
              aria-label="Search"
            >
              <svg
                className="mobile-action-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

            <Link
              to={isLoggedIn ? "/account/wishlist" : "/login"}
              className="mobile-action-button mobile-action-button--badge"
            >
              <svg
                className="mobile-action-icon"
                fill="none"
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
            </Link>

            {isLoggedIn && (
              <Link
                to="/account/notifications"
                className="mobile-action-button mobile-action-button--badge"
              >
                <svg
                  className="mobile-action-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                {unreadCount > 0 && (
                  <span className="mobile-cart-badge">{unreadCount}</span>
                )}
              </Link>
            )}

            <Link
              to="/cart"
              className="mobile-action-button mobile-action-button--badge"
            >
              <svg
                className="mobile-action-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              {cartCount > 0 && (
                <span className="mobile-cart-badge">{cartCount}</span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile search bar */}
        {searchOpen && (
          <div className="mobile-search">
            <form onSubmit={handleSearch} className="mobile-search-form">
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="mobile-search-input"
              />
              <svg
                className="mobile-search-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Nav Drawer */}
      {mobileOpen && (
        <div className="mobile-nav-drawer">
          <nav className="mobile-nav">
            {navLinks.map((link) => (
              <Link key={link.label} to={link.to} className="mobile-nav-link">
                {link.label}
              </Link>
            ))}

            <div className="mobile-account-links">
              {isLoggedIn ? (
                <>
                  <Link to="/account" className="mobile-account-link">
                    My Account
                  </Link>
                  <Link to="/account/orders" className="mobile-account-link">
                    My Orders
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      navigate("/");
                    }}
                    className="mobile-logout-button"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link to="/login" className="mobile-sign-in">
                  Sign In / Register
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
