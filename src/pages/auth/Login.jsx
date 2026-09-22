import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../../context/useApp";
import "./Login.css";

export default function Login() {
  const { login, showToast } = useApp();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(email, password);
      showToast("success", `Welcome back, ${user.name}!`);
      navigate(user.role === "admin" ? "/admin" : "/account");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Left - Branding */}
      <div className="login-branding">
        <div className="login-branding-background">
          <img
            src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1000&h=1400&fit=crop&auto=format"
            alt="Shopping"
            className="login-branding-image"
          />
          <div className="login-branding-overlay" />
        </div>

        <div className="login-branding-content">
          <div className="login-brand-logo">
            <div className="login-brand-icon">
              <svg
                className="login-brand-icon-svg"
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
            </div>

            <span className="login-brand-name">Lumière</span>
          </div>

          <h2 className="login-brand-title">Welcome Back</h2>

          <p className="login-brand-description">
            Sign in to access your orders, wishlist, and exclusive member
            benefits.
          </p>

          <div className="login-stats">
            {[
              ["50k+", "Customers"],
              ["10k+", "Products"],
              ["4.9★", "Rating"],
            ].map(([value, label]) => (
              <div key={label} className="login-stat">
                <p className="login-stat-value">{value}</p>
                <p className="login-stat-label">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right - Form */}
      <div className="login-form-section">
        <div className="login-form-container">
          {/* Mobile Logo */}
          <div className="login-mobile-logo">
            <div className="login-mobile-icon">
              <svg
                className="login-mobile-icon-svg"
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
            </div>

            <span className="login-mobile-brand-name">Lumière</span>
          </div>

          <h1 className="login-title">Sign In</h1>

          <p className="login-description">
            Enter your credentials to access your account
          </p>

          {error && (
            <div className="login-error">
              <svg
                className="login-error-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>

              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            {/* Email */}
            <div className="login-field">
              <label className="login-label">Email Address</label>

              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="login-input"
              />
            </div>

            {/* Password */}
            <div className="login-field">
              <label className="login-label">Password</label>

              <div className="login-password-wrapper">
                <input
                  type={showPwd ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="login-input login-password-input"
                />

                <button
                  type="button"
                  onClick={() => setShowPwd((value) => !value)}
                  className="login-password-toggle"
                  aria-label={showPwd ? "Hide password" : "Show password"}
                >
                  {showPwd ? (
                    <svg
                      className="login-password-icon"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="login-password-icon"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember + Forgot Password */}
            <div className="login-options">
              <label className="login-remember">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="login-checkbox"
                />

                <span className="login-remember-text">Remember me</span>
              </label>

              <Link to="/forgot-password" className="login-forgot-link">
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading} className="login-submit">
              {loading && (
                <svg className="login-spinner" fill="none" viewBox="0 0 24 24">
                  <circle
                    className="login-spinner-track"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="login-spinner-path"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
              )}

              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Register */}
          <p className="login-register-text">
            Don't have an account?{" "}
            <Link to="/register" className="login-register-link">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
