import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { authService } from "../../services/authService";
import "./ResetPassword.css";

function passwordStrength(pwd) {
  let score = 0;

  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;

  return score;
}

export default function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useParams();

  const [state, setState] = useState(token ? 'form' : 'invalid');
  const [form, setForm] = useState({
    password: "",
    confirm: "",
  });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const strength = passwordStrength(form.password);

  const strengthColors = [
    "",
    "reset-strength-red",
    "reset-strength-amber",
    "reset-strength-blue",
    "reset-strength-emerald",
  ];

  const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    setLoading(true);
    try {
      await authService.resetPassword(token, form.password);
      setState("success");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (state === "invalid") {
    return (
      <div className="reset-password-page">
        <div className="reset-password-small-card">
          <div className="reset-invalid-icon">
            <svg
              className="reset-status-svg"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>

          <h2 className="reset-card-title">Invalid Reset Link</h2>

          <p className="reset-card-description">
            This reset link is invalid. Please request a new one.
          </p>

          <Link to="/forgot-password" className="reset-request-link">
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  if (state === "success") {
    return (
      <div className="reset-password-page">
        <div className="reset-password-small-card">
          <div className="reset-success-icon">
            <svg
              className="reset-status-svg"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h2 className="reset-card-title">Password Reset!</h2>

          <p className="reset-card-description">
            Your password has been successfully updated. You can now sign in
            with your new password.
          </p>

          <button
            onClick={() => navigate("/login")}
            className="reset-signin-btn"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="reset-password-page">
      <div className="reset-password-wrapper">
        <div className="reset-password-card">
          <div className="reset-lock-icon">
            <svg
              className="reset-lock-svg"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>

          <h1 className="reset-password-title">Reset Password</h1>

          <p className="reset-password-description">
            Choose a strong new password for your account.
          </p>

          {error && <div className="reset-password-error">{error}</div>}

          <form onSubmit={handleSubmit} className="reset-password-form">
            <div className="reset-field">
              <label className="reset-label">New Password</label>

              <div className="reset-input-wrapper">
                <input
                  type={showPwd ? "text" : "password"}
                  value={form.password}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  placeholder="Min. 8 characters"
                  className="reset-input reset-password-input"
                />

                <button
                  type="button"
                  onClick={() => setShowPwd((value) => !value)}
                  className="reset-password-toggle"
                  aria-label={showPwd ? "Hide password" : "Show password"}
                >
                  <svg
                    className="reset-eye-icon"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </button>
              </div>

              {form.password && (
                <div className="reset-strength">
                  <div className="reset-strength-bars">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`reset-strength-bar ${
                          i <= strength
                            ? strengthColors[strength]
                            : "reset-strength-empty"
                        }`}
                      />
                    ))}
                  </div>

                  <p className="reset-strength-text">
                    Password strength:{" "}
                    <span className="reset-strength-label">
                      {strengthLabels[strength]}
                    </span>
                  </p>
                </div>
              )}
            </div>

            <div className="reset-field">
              <label className="reset-label">Confirm New Password</label>

              <input
                type="password"
                value={form.confirm}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    confirm: e.target.value,
                  }))
                }
                placeholder="Re-enter password"
                className="reset-input"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="reset-submit-btn"
            >
              {loading && (
                <svg className="reset-spinner" fill="none" viewBox="0 0 24 24">
                  <circle
                    className="reset-spinner-track"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="reset-spinner-path"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
              )}

              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>

          <div className="reset-simulation-actions">
            <button
              onClick={() => setState("invalid")}
              className="reset-simulation-btn"
            >
              Simulate invalid link
            </button>

            <button
              onClick={() => setState("expired")}
              className="reset-simulation-btn"
            >
              Simulate expired
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
