import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../../context/useApp";
import "./Register.css";

function passwordStrength(pwd) {
  let score = 0;

  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;

  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = ["", "red", "amber", "blue", "emerald"];

  return {
    score,
    label: labels[score] || "",
    color: colors[score] || "",
  };
}

export default function Register() {
  const { register, showToast } = useApp();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
  });

  const [showPwd, setShowPwd] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const strength = passwordStrength(form.password);

  const validate = () => {
    const e = {};

    if (!form.name.trim()) {
      e.name = "Full name is required";
    }

    if (!form.email.includes("@")) {
      e.email = "Valid email is required";
    }

    if (form.phone && !/^\+?[\d\s\-]{7,}$/.test(form.phone)) {
      e.phone = "Invalid phone number";
    }

    if (form.password.length < 8) {
      e.password = "Password must be at least 8 characters";
    }

    if (form.password !== form.confirm) {
      e.confirm = "Passwords do not match";
    }

    if (!agreed) {
      e.agreed = "You must accept the terms";
    }

    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      const user = await register({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });
      showToast("success", "Account created successfully!");
      navigate(user.role === "admin" ? "/admin" : "/account");
    } catch (err) {
      setErrors({ form: err.message });
    } finally {
      setLoading(false);
    }
  };

  const update = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const fields = [
    {
      id: "name",
      label: "Full Name",
      type: "text",
      placeholder: "Alex Johnson",
    },
    {
      id: "email",
      label: "Email Address",
      type: "email",
      placeholder: "you@example.com",
    },
    {
      id: "phone",
      label: "Phone Number",
      type: "tel",
      placeholder: "+1 555 0123",
    },
  ];

  return (
    <div className="register-page">
      {/* Left - Branding */}
      <div className="register-branding">
        <div className="register-branding-background">
          <img
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1000&h=1400&fit=crop&auto=format"
            alt=""
            className="register-branding-image"
          />

          <div className="register-branding-overlay" />
        </div>

        <div className="register-branding-content">
          <div className="register-brand-logo">
            <div className="register-brand-icon">
              <svg
                className="register-brand-icon-svg"
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

            <span className="register-brand-name">Lumière</span>
          </div>

          <h2 className="register-brand-title">Join Lumière</h2>

          <p className="register-brand-description">
            Create your account and unlock exclusive deals, order tracking, and
            a personalized shopping experience.
          </p>
        </div>
      </div>

      {/* Right - Form */}
      <div className="register-form-section">
        <div className="register-form-container">
          <h1 className="register-title">Create Account</h1>

          <p className="register-description">
            Join thousands of happy customers
          </p>

          {errors.form && (
            <div className="register-error-banner">{errors.form}</div>
          )}

          <form onSubmit={handleSubmit} className="register-form">
            {/* Basic Fields */}
            {fields.map((field) => (
              <div key={field.id} className="register-field">
                <label className="register-label">{field.label}</label>

                <input
                  type={field.type}
                  value={form[field.id]}
                  onChange={(e) => update(field.id, e.target.value)}
                  placeholder={field.placeholder}
                  className={`register-input ${
                    errors[field.id] ? "register-input-error" : ""
                  }`}
                />

                {errors[field.id] && (
                  <p className="register-error-text">{errors[field.id]}</p>
                )}
              </div>
            ))}

            {/* Password */}
            <div className="register-field">
              <label className="register-label">Password</label>

              <div className="register-password-wrapper">
                <input
                  type={showPwd ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  placeholder="Min. 8 characters"
                  className={`register-input register-password-input ${
                    errors.password ? "register-input-error" : ""
                  }`}
                />

                <button
                  type="button"
                  onClick={() => setShowPwd((value) => !value)}
                  className="register-password-toggle"
                  aria-label={showPwd ? "Hide password" : "Show password"}
                >
                  <svg
                    className="register-password-icon"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={
                        showPwd
                          ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                          : "M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      }
                    />
                  </svg>
                </button>
              </div>

              {/* Password Strength */}
              {form.password && (
                <div className="register-password-strength">
                  <div className="register-strength-bars">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`register-strength-bar ${
                          i <= strength.score
                            ? `register-strength-${strength.color}`
                            : "register-strength-empty"
                        }`}
                      />
                    ))}
                  </div>

                  <p className="register-strength-text">
                    Password strength:{" "}
                    <span className="register-strength-label">
                      {strength.label || "Too short"}
                    </span>
                  </p>
                </div>
              )}

              {errors.password && (
                <p className="register-error-text">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="register-field">
              <label className="register-label">Confirm Password</label>

              <input
                type="password"
                value={form.confirm}
                onChange={(e) => update("confirm", e.target.value)}
                placeholder="Re-enter password"
                className={`register-input ${
                  errors.confirm ? "register-input-error" : ""
                }`}
              />

              {errors.confirm && (
                <p className="register-error-text">{errors.confirm}</p>
              )}
            </div>

            {/* Terms */}
            <div className="register-terms-section">
              <label className="register-terms-label">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="register-checkbox"
                />

                <span className="register-terms-text">
                  I agree to the{" "}
                  <a href="#" className="register-terms-link">
                    Terms & Conditions
                  </a>{" "}
                  and{" "}
                  <a href="#" className="register-terms-link">
                    Privacy Policy
                  </a>
                </span>
              </label>

              {errors.agreed && (
                <p className="register-error-text">{errors.agreed}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="register-submit"
            >
              {loading && (
                <svg
                  className="register-spinner"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="register-spinner-track"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />

                  <path
                    className="register-spinner-path"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
              )}

              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          {/* Login Link */}
          <p className="register-login-text">
            Already have an account?{" "}
            <Link to="/login" className="register-login-link">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
