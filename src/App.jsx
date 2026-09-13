import { Routes, Route, BrowserRouter } from "react-router-dom";

import CustomerApp from "./panels/CustomerApp.jsx";
import AdminApp from "./panels/AdminApp.jsx";

import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import ForgotPassword from "./pages/auth/ForgotPassword.jsx";
import ResetPassword from "./pages/auth/ResetPassword.jsx";

import ProtectedRoute from "./shared/components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* shared auth pages — same login for customer & admin */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        <Route
          path="/admin/*"
          element={
            <ProtectedRoute role="admin">
              <AdminApp />
            </ProtectedRoute>
          }
        />

        {/* home, shop, cart, account... */}
        <Route path="/*" element={<CustomerApp />} />
      </Routes>
    </BrowserRouter>
  );
}
