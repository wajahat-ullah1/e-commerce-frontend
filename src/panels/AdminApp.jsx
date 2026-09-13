import { Routes, Route, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import Sidebar from "../components/admin_Layout/Sidebar";
import Header from "../components/admin_Layout/Header";
import "../components/admin_Layout/AdminLayout.css";
import { useApp } from "../context/AppContext";

import Dashboard from "../pages/admin_Pages/Dashboard";
import Products from "../pages/admin_Pages/Products";
import AddProduct from "../pages/admin_Pages/AddProduct";
import Categories from "../pages/admin_Pages/Categories";
import Orders, { OrderDetail } from "../pages/admin_Pages/Orders";
import Customers, { CustomerDetail } from "../pages/admin_Pages/Customers";
import Reviews from "../pages/admin_Pages/Reviews";
import Inventory, {
  LowStock,
  InventoryHistory,
} from "../pages/admin_Pages/Inventory";
import Invoices, { InvoiceDetail } from "../pages/admin_Pages/Invoices";
import Notifications from "../pages/admin_Pages/Notifications";
import Profile, { ChangePassword } from "../pages/admin_Pages/Profile";

// route path (relative to /admin) → sidebar/header "page" slug, and back
const PAGE_TO_PATH = {
  "dashboard": "",
  "products": "products",
  "add-product": "products/add",
  "categories": "categories",
  "orders": "orders",
  "customers": "customers",
  "reviews": "reviews",
  "inventory": "inventory",
  "low-stock": "inventory/low-stock",
  "inventory-history": "inventory/history",
  "invoices": "invoices",
  "notifications": "notifications",
  "profile": "profile",
  "change-password": "change-password",
};
const PATH_TO_PAGE = Object.fromEntries(
  Object.entries(PAGE_TO_PATH).map(([page, path]) => [path, page])
);

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  const relativePath = location.pathname.replace(/^\/admin\/?/, "");
  const currentPage = PATH_TO_PAGE[relativePath] ?? "dashboard";

  const handleNavigate = (page) => {
    navigate(`/admin/${PAGE_TO_PATH[page] ?? ""}`);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="admin-layout">
      <Sidebar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        unreadCount={4}
      />
      <div className="admin-content">
        <Header
          page={currentPage}
          onNavigate={handleNavigate}
          onMobileMenuToggle={() => setMobileOpen(true)}
          onLogout={handleLogout}
          unreadCount={4}
        />
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function ProductDetailPlaceholder() {
  const product = {
    name: "Premium Wireless Headphones",
    category: "Electronics",
    price: 149.99,
    stock: 84,
    rating: 4.8,
    reviews: 312,
    created: "Oct 5, 2026",
    updated: "Dec 8, 2026",
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop&auto=format",
    description:
      "Studio-grade sound with adaptive noise cancellation and 30-hour battery life. Compatible with all Bluetooth devices.",
  };

  return (
    <div className="product-detail-page">
      <div className="product-detail-header">
        <button type="button" className="product-detail-back">
          ← All Products
        </button>
        <button type="button" className="product-detail-edit">
          Edit Product
        </button>
      </div>
      <div className="product-detail-grid">
        <div className="product-detail-image-column">
          <div className="product-detail-image-card">
            <img
              src={product.image}
              alt={product.name}
              className="product-detail-image"
            />
            <div className="product-detail-status-wrapper">
              <span className="product-detail-status">{product.status}</span>
            </div>
          </div>
        </div>
        <div className="product-detail-info-column">
          <div className="product-detail-info-card">
            <h1 className="product-detail-name">{product.name}</h1>
            <p className="product-detail-category">{product.category}</p>
            <p className="product-detail-price">${product.price.toFixed(2)}</p>
            <p className="product-detail-description">{product.description}</p>
            <div className="product-detail-stats">
              {[
                ["Stock", `${product.stock} units`],
                ["Rating", `${product.rating} ★`],
                ["Reviews", product.reviews],
                ["Created", product.created],
                ["Updated", product.updated],
              ].map(([label, value]) => (
                <div key={label} className="product-detail-stat">
                  <p className="product-detail-stat-label">{label}</p>
                  <p className="product-detail-stat-value">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div className="admin-not-found">
      <div className="admin-not-found-content">
        <p className="admin-not-found-number">404</p>
        <h1>Page Not Found</h1>
        <p>The page you're looking for doesn't exist.</p>
        <a href="/admin">Go to Dashboard</a>
      </div>
    </div>
  );
}

export default function AdminApp() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="products/add" element={<AddProduct />} />
        <Route path="products/edit" element={<AddProduct />} />
        <Route path="products/:id" element={<ProductDetailPlaceholder />} />
        <Route path="categories" element={<Categories />} />
        <Route path="orders" element={<Orders />} />
        <Route path="orders/:id" element={<OrderDetail />} />
        <Route path="customers" element={<Customers />} />
        <Route path="customers/:id" element={<CustomerDetail />} />
        <Route path="reviews" element={<Reviews />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="inventory/low-stock" element={<LowStock />} />
        <Route path="inventory/history" element={<InventoryHistory />} />
        <Route path="invoices" element={<Invoices />} />
        <Route path="invoices/:id" element={<InvoiceDetail />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="profile" element={<Profile />} />
        <Route path="change-password" element={<ChangePassword />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}