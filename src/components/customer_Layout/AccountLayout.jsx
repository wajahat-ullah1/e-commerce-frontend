import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/useApp';
import './AccountLayout.css';

const navItems = [
  { label: 'Overview', to: '/account', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { label: 'My Orders', to: '/account/orders', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  { label: 'Wishlist', to: '/account/wishlist', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
  { label: 'Addresses', to: '/account/addresses', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z' },
  { label: 'Notifications', to: '/account/notifications', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
  { label: 'Profile', to: '/account/profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  { label: 'Change Password', to: '/account/password', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
];

export default function AccountLayout() {
  const { user, logout } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="account-layout">
      <div className="account-container">
        <div className="account-main">
          {/* Sidebar */}
          <aside className="account-sidebar">
            {/* Profile summary */}
            <div className="account-profile-card">
              <div className="account-profile-row">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="account-profile-avatar" />
                ) : (
                  <div className="account-profile-avatar account-profile-avatar--fallback">
                    <span>{user?.name?.charAt(0)}</span>
                  </div>
                )}
                <div className="account-profile-info">
                  <p className="account-profile-name">{user?.name}</p>
                  <p className="account-profile-email">{user?.email}</p>
                </div>
              </div>
            </div>

            {/* Nav */}
            <nav className="account-nav">
              {navItems.map((item) => {
                const active = location.pathname === item.to;
                return (
                  <Link
                    key={item.label}
                    to={item.to}
                    className={`account-nav-link ${active ? 'is-active' : ''}`}
                  >
                    <svg className={`account-nav-icon ${active ? 'is-active' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={item.icon} />
                    </svg>
                    {item.label}
                  </Link>
                );
              })}

              <button
                onClick={() => { logout(); navigate('/'); }}
                className="account-logout"
              >
                <svg className="account-nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </nav>
          </aside>

          {/* Content */}
          <div className="account-content">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
