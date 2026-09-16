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
import ProductDetail from "../pages/admin_Pages/ProductDetail";

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
        <Route path="products/edit/:id" element={<AddProduct />} />
        <Route path="products/:id" element={<ProductDetail />} />
        <Route path="categories" element={<Categories />} />
        <Route path="orders" element={<Orders />} />
        <Route path="orders/:id" element={<OrderDetail />} />
        <Route path="customers" element={<Customers />} />
        <Route path="customers/:id" element={<CustomerDetail />} />
        <Route path="reviews" element={<Reviews />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="inventory/low-stock" element={<LowStock />} />
        <Route path="inventory/history" element={<InventoryHistory />} />
        <Route path="inventory/history/:productId" element={<InventoryHistory />} />
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