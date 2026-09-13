import { useState } from "react";
import { Link } from "react-router-dom";
import { authService } from "../../services/authService";
import "./ForgotPassword.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-container">
        <div className="forgot-password-card">
          <div className="forgot-password-back">
            <Link to="/login" className="forgot-password-back-link">
              <svg
                className="forgot-password-back-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Link>

            <span className="forgot-password-back-text">Back to Sign In</span>
          </div>

          {sent ? (
            <div className="forgot-password-success">
              <div className="forgot-password-success-icon">
                <svg
                  className="forgot-password-success-svg"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>

              <h2 className="forgot-password-success-title">
                Check Your Email
              </h2>

              <p className="forgot-password-success-text">
                We've sent a password reset link to <strong>{email}</strong>.
                Check your inbox and follow the instructions.
              </p>

              <p className="forgot-password-retry-text">
                Didn't receive it? Check your spam folder or{" "}
                <button
                  onClick={() => setSent(false)}
                  className="forgot-password-retry-btn"
                >
                  try again
                </button>
                .
              </p>
            </div>
          ) : (
            <>
              <div className="forgot-password-lock-icon">
                <svg
                  className="forgot-password-lock-svg"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>

              <h1 className="forgot-password-title">Forgot Password?</h1>

              <p className="forgot-password-description">
                Enter your email and we'll send you a reset link.
              </p>

              {error && <div className="forgot-password-error">{error}</div>}

              <form onSubmit={handleSubmit} className="forgot-password-form">
                <div className="forgot-password-field">
                  <label className="forgot-password-label">Email Address</label>

                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="forgot-password-input"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="forgot-password-submit"
                >
                  {loading && (
                    <svg
                      className="forgot-password-spinner"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="forgot-password-spinner-track"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="forgot-password-spinner-path"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                  )}

                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
