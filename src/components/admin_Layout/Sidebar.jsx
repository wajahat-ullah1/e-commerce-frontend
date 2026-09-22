import {
  X,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Star,
  Warehouse,
  FileText,
  Bell,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  Boxes,
} from "lucide-react";
import { useState } from "react";
import { useApp } from "../../context/useApp";
import "./Sidebar.css";

const navItems = [
  {
    icon: <LayoutDashboard className="sidebar-icon" />,
    label: "Dashboard",
    page: "dashboard",
  },
  {
    icon: <Package className="sidebar-icon" />,
    label: "Products",
    children: [
      { label: "All Products", page: "products" },
      { label: "Add Product", page: "add-product" },
      { label: "Categories", page: "categories" },
    ],
  },
  {
    icon: <ShoppingCart className="sidebar-icon" />,
    label: "Orders",
    children: [{ label: "All Orders", page: "orders" }],
  },
  {
    icon: <Users className="sidebar-icon" />,
    label: "Customers",
    page: "customers",
  },
  {
    icon: <Star className="sidebar-icon" />,
    label: "Reviews",
    page: "reviews",
  },
  {
    icon: <Warehouse className="sidebar-icon" />,
    label: "Inventory",
    children: [
      { label: "Inventory", page: "inventory" },
      { label: "Low Stock", page: "low-stock" },
      { label: "History", page: "inventory-history" },
    ],
  },
  {
    icon: <FileText className="sidebar-icon" />,
    label: "Invoices",
    page: "invoices",
  },
  {
    icon: <Bell className="sidebar-icon" />,
    label: "Notifications",
    page: "notifications",
  },
  {
    icon: <Settings className="sidebar-icon" />,
    label: "Settings",
    children: [
      { label: "Profile", page: "profile" },
      { label: "Change Password", page: "change-password" },
    ],
  },
];

export default function Sidebar({
  currentPage,
  onNavigate,
  onLogout,
  mobileOpen,
  onMobileClose,
  unreadCount,
}) {
  const { user } = useApp();
  const [expanded, setExpanded] = useState({
    Products: true,
    Orders: true,
    Inventory: false,
    Settings: false,
  });

  const toggle = (label) =>
    setExpanded((e) => ({
      ...e,
      [label]: !e[label],
    }));

  const isActive = (item) => {
    if (item.page) return currentPage === item.page;

    return item.children?.some((child) => child.page === currentPage);
  };

  const sidebarContent = (
    <div className="sidebar-content">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <Boxes className="sidebar-logo-boxes" />
        </div>

        <span className="sidebar-logo-text">ShopAdmin</span>

        {mobileOpen && (
          <button onClick={onMobileClose} className="sidebar-close-button">
            <X className="sidebar-close-icon" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const active = isActive(item);

          if (item.children) {
            return (
              <div key={item.label} className="sidebar-nav-group">
                <button
                  onClick={() => toggle(item.label)}
                  className={`sidebar-nav-button ${
                    active
                      ? "sidebar-nav-button-active"
                      : "sidebar-nav-button-inactive"
                  }`}
                >
                  {item.icon}

                  <span className="sidebar-nav-label">{item.label}</span>

                  {expanded[item.label] ? (
                    <ChevronDown className="sidebar-chevron" />
                  ) : (
                    <ChevronRight className="sidebar-chevron" />
                  )}
                </button>

                {expanded[item.label] && (
                  <div className="sidebar-subnav">
                    {item.children.map((child) => (
                      <button
                        key={child.page}
                        onClick={() => {
                          onNavigate(child.page);
                          onMobileClose();
                        }}
                        className={`sidebar-subnav-button ${
                          currentPage === child.page
                            ? "sidebar-subnav-button-active"
                            : "sidebar-subnav-button-inactive"
                        }`}
                      >
                        {child.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <button
              key={item.page}
              onClick={() => {
                onNavigate(item.page);
                onMobileClose();
              }}
              className={`sidebar-nav-button ${
                currentPage === item.page
                  ? "sidebar-nav-button-active"
                  : "sidebar-nav-button-inactive"
              }`}
            >
              {item.icon}

              <span className="sidebar-nav-label">{item.label}</span>

              {item.page === "notifications" && unreadCount > 0 && (
                <span className="sidebar-notification-badge">
                  {unreadCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom: user + logout */}
      <div className="sidebar-bottom">
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.name}
                className="sidebar-user-avatar-image"
              />
            ) : (
              user?.name?.charAt(0).toUpperCase() || "A"
            )}
          </div>

          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user?.name}</div>
            <div className="sidebar-user-email">{user?.email}</div>
          </div>
        </div>

        <button onClick={onLogout} className="sidebar-logout-button">
          <LogOut className="sidebar-icon" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="sidebar-desktop">{sidebarContent}</aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="sidebar-mobile-overlay">
          <div className="sidebar-mobile-backdrop" onClick={onMobileClose} />

          <aside className="sidebar-mobile">{sidebarContent}</aside>
        </div>
      )}
    </>
  );
}
