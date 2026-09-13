import { Navigate, Outlet } from "react-router-dom";
import { useApp } from "../../context/AppContext";

export default function ProtectedRoute({ role, children }) {
  const { user, loading } = useApp();

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/login" replace />;

  return children;
}