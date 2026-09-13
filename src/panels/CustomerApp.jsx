import { Routes, Route } from "react-router-dom";
import Layout from "../components/customer_Layout/Layout.jsx";
import AccountLayout from "../components/customer_Layout/AccountLayout.jsx";
import ProtectedRoute from "../shared/components/ProtectedRoute.jsx";

import Home from "../pages/customer_Pages/Home.jsx";
import Shop from "../pages/customer_Pages/Shop.jsx";
import ProductDetail from "../pages/customer_Pages/ProductDetail.jsx";
import Cart from "../pages/customer_Pages/Cart.jsx";
import Checkout from "../pages/customer_Pages/Checkout.jsx";
import OrderConfirmation from "../pages/customer_Pages/OrderConfirmation.jsx";

import Dashboard from "../pages/account/Dashboard";
import Profile from "../pages/account/Profile";
import ChangePassword from "../pages/account/ChangePassword";
import Addresses from "../pages/account/Addresses";
import Wishlist from "../pages/account/Wishlist";
import Orders from "../pages/account/Orders";
import OrderDetail from "../pages/account/OrderDetail";
import Notifications from "../pages/account/Notifications";
import Invoice from "../pages/account/Invoice";

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <p className="text-6xl font-black text-slate-200 mb-4">404</p>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Page Not Found
        </h1>
        <p className="text-slate-500 mb-6">
          The page you're looking for doesn't exist.
        </p>
        <a
          href="/"
          className="px-6 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-indigo-600 transition-colors"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}

export default function CustomerApp() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="shop" element={<Shop />} />
        <Route path="product/:id" element={<ProductDetail />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="order-confirmation" element={<OrderConfirmation />} />

        <Route
          path="account"
          element={
            <ProtectedRoute role="customer">
              <AccountLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="orders" element={<Orders />} />
          <Route path="orders/:id" element={<OrderDetail />} />
          <Route path="invoice/:id" element={<Invoice />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="addresses" element={<Addresses />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="profile" element={<Profile />} />
          <Route path="password" element={<ChangePassword />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
