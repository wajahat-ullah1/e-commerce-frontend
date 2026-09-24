import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/useApp";
import { profileService } from "../../services/profileService";
import "./ChangePassword.css";

function strength(pwd) {
  let s = 0;
  if (pwd.length >= 8) s++;
  if (/[A-Z]/.test(pwd)) s++;
  if (/[0-9]/.test(pwd)) s++;
  if (/[^A-Za-z0-9]/.test(pwd)) s++;
  return s;
}

// Moved out of the component — a stable top-level component so React
// doesn't remount the <input> (and drop focus) on every keystroke.
function EyeToggle({ shown, onToggle }) {
  return (
    <button type="button" onClick={onToggle} className="password-eye-toggle">
      <svg
        className="password-eye-icon"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d={
            shown
              ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
              : "M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          }
        />
      </svg>
    </button>
  );
}

export default function ChangePassword() {
  const { showToast, logout } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ current: "", newPwd: "", confirm: "" });
  const [show, setShow] = useState({
    current: false,
    newPwd: false,
    confirm: false,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const s = strength(form.newPwd);

  const toggle = (field) =>
    setShow((prev) => ({ ...prev, [field]: !prev[field] }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.newPwd.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    if (form.newPwd !== form.confirm) {
      setError("New passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await profileService.changePassword(form.current, form.newPwd);
      setSuccess(true);
      setForm({ current: "", newPwd: "", confirm: "" });
      showToast("success", "Password changed — please log in again.");
      // Changing the password invalidates the current session token
      // server-side, so log out and send them back to sign in.
      setTimeout(() => {
        logout();
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(err.message || "Could not change your password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-password-page">
      <h1 className="change-password-title">Change Password</h1>

      <div className="change-password-card">
        {success && (
          <div className="password-success-message">
            <svg
              className="password-message-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Password changed successfully!
          </div>
        )}

        {error && <div className="password-error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="change-password-form">
          <div className="password-field">
            <label className="password-field-label">Current Password</label>
            <div className="password-input-wrapper">
              <input
                type={show.current ? "text" : "password"}
                value={form.current}
                onChange={(e) =>
                  setForm((p) => ({ ...p, current: e.target.value }))
                }
                required
                placeholder="••••••••"
                className="password-input"
              />
              <EyeToggle
                shown={show.current}
                onToggle={() => toggle("current")}
              />
            </div>
          </div>

          <div className="password-field">
            <label className="password-field-label">New Password</label>
            <div className="password-input-wrapper">
              <input
                type={show.newPwd ? "text" : "password"}
                value={form.newPwd}
                onChange={(e) =>
                  setForm((p) => ({ ...p, newPwd: e.target.value }))
                }
                required
                placeholder="Min. 8 characters"
                className="password-input"
              />
              <EyeToggle
                shown={show.newPwd}
                onToggle={() => toggle("newPwd")}
              />
            </div>

            {form.newPwd && (
              <div className="password-strength">
                <div className="password-strength-bars">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`password-strength-bar ${i <= s ? `strength-${s}` : "strength-empty"}`}
                    />
                  ))}
                </div>
                <p className="password-strength-label">
                  {["", "Weak", "Fair", "Good", "Strong"][s]}
                </p>
              </div>
            )}
          </div>

          <div className="password-field">
            <label className="password-field-label">Confirm New Password</label>
            <div className="password-input-wrapper">
              <input
                type={show.confirm ? "text" : "password"}
                value={form.confirm}
                onChange={(e) =>
                  setForm((p) => ({ ...p, confirm: e.target.value }))
                }
                required
                placeholder="Re-enter new password"
                className="password-input"
              />
              <EyeToggle
                shown={show.confirm}
                onToggle={() => toggle("confirm")}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="change-password-submit"
          >
            {loading && (
              <svg className="password-spinner" fill="none" viewBox="0 0 24 24">
                <circle
                  className="spinner-track"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="spinner-head"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            )}
            {loading ? "Changing..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
