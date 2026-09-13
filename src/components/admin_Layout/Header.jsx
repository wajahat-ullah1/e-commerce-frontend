import { useState } from "react";
import { Menu, Search, Bell, ChevronDown, User, Lock, LogOut } from "lucide-react";
import "./Header.css";

const breadcrumbs = {
  dashboard: ["Dashboard"],
  products: ["Products", "All Products"],
  "add-product": ["Products", "Add Product"],
  categories: ["Products", "Categories"],
  orders: ["Orders", "All Orders"],
  "order-detail": ["Orders", "Order Details"],
  customers: ["Customers"],
  "customer-detail": ["Customers", "Customer Details"],
  reviews: ["Reviews"],
  inventory: ["Inventory", "Overview"],
  "low-stock": ["Inventory", "Low Stock"],
  "inventory-history": ["Inventory", "History"],
  invoices: ["Invoices"],
  "invoice-detail": ["Invoices", "Invoice Details"],
  notifications: ["Notifications"],
  profile: ["Settings", "Profile"],
  "change-password": ["Settings", "Change Password"],
};

export default function Header({
  page,
  onNavigate,
  onMobileMenuToggle,
  unreadCount,
  onLogout,
}) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const crumbs = breadcrumbs[page] ?? [page];

  return (
    <header className="admin-header">
      <button onClick={onMobileMenuToggle} className="mobile-menu-button">
        <Menu className="header-menu-icon" />
      </button>

      <div className="header-breadcrumb">
        {crumbs.map((crumb, i) => (
          <span key={i} className="breadcrumb-item">
            {i > 0 && <span className="breadcrumb-separator">/</span>}
            <span className={i === crumbs.length - 1 ? "breadcrumb-current" : "breadcrumb-parent"}>
              {crumb}
            </span>
          </span>
        ))}
      </div>

      <div className="header-spacer" />

      <div className={`header-search ${searchFocused ? "search-focused" : "search-default"}`}>
        <Search className="search-icon" />
        <input
          type="text"
          placeholder="Search..."
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          className="search-input"
        />
      </div>

      <button
        onClick={() => onNavigate("notifications")}
        className="notification-button"
      >
        <Bell className="notification-icon" />
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>

      <div className="profile-container">
        <button
          onClick={() => setProfileOpen((o) => !o)}
          className="profile-button"
        >
          <div className="profile-avatar">AR</div>
          <span className="profile-name">Admin</span>
          <ChevronDown className="profile-chevron" />
        </button>

        {profileOpen && (
          <>
            <div
              className="profile-overlay"
              onClick={() => setProfileOpen(false)}
            />
            <div className="profile-dropdown">
              <button
                onClick={() => {
                  onNavigate("profile");
                  setProfileOpen(false);
                }}
                className="dropdown-button"
              >
                <User className="dropdown-icon" />
                My Profile
              </button>

              <button
                onClick={() => {
                  onNavigate("change-password");
                  setProfileOpen(false);
                }}
                className="dropdown-button"
              >
                <Lock className="dropdown-icon" />
                Change Password
              </button>

              <div className="dropdown-divider" />

              <button onClick={onLogout} className="dropdown-button logout-button">
                <LogOut className="dropdown-icon" />
                Logout
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
