import { useState, useEffect } from "react";
import { Camera, Eye, EyeOff } from "lucide-react";
import { Card, Button, Input } from "../../components/admin_Ui/Ui";
import { useFetch } from "../../hooks/useFetch";
import { profileService } from "../../services/profileService";
import { useApp } from "../../context/AppContext";
import "./Profile.css";

import "./Profile.css";

// Admin Profile
export default function Profile() {
  const { showToast, updateUser } = useApp();
  const {
    data: profile,
    loading,
    error,
  } = useFetch(() => profileService.get(), []);

  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || "",
        email: profile.email || "",
        phone: profile.phone || "",
      });
    }
  }, [profile]);

  useEffect(() => {
    if (error) showToast("error", error);
  }, [error]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await profileService.update(form);
      updateUser(updated);
      showToast("success", "Profile updated successfully.");
    } catch (err) {
      showToast("error", err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const updated = await profileService.uploadImage(file);
      updateUser(updated);
      showToast("success", "Profile photo updated.");
    } catch (err) {
      showToast("error", err.message);
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  if (loading) return <div className="profile-page">Loading profile…</div>;

  const initials = profile?.name?.charAt(0).toUpperCase() || "A";

  return (
    <div className="profile-page">
      {/* Page Header */}
      <div className="profile-page-header">
        <h1 className="profile-title">My Profile</h1>

        <p className="profile-subtitle">Manage your administrator account</p>
      </div>

      {/* Profile Card */}
      <Card className="profile-card">
        {/* Avatar */}
        <div className="profile-avatar-section">
          <div className="profile-avatar-wrapper">
            {profile?.profileImage ? (
              <img
                src={profile.profileImage}
                alt={profile.name}
                className="profile-avatar profile-avatar-image"
              />
            ) : (
              <div className="profile-avatar">{initials}</div>
            )}

            <label
              className="profile-camera-button"
              aria-label="Change profile photo"
            >
              <Camera />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </label>
          </div>

          <div className="profile-user-info">
            <p className="profile-user-name">{profile?.name}</p>
            <p className="profile-user-role">Administrator</p>
            {uploadingImage && (
              <p className="profile-change-photo">Uploading…</p>
            )}
          </div>
        </div>

        {/* Profile Form */}
        <div className="profile-form">
          <Input
            label="Full Name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
          <Input
            label="Email Address"
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          />
          <Input
            label="Phone Number"
            type="tel"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          />
        </div>

        {/* Profile Actions */}
        <div className="profile-actions">
          <Button
            variant="secondary"
            onClick={() =>
              profile &&
              setForm({
                name: profile.name,
                email: profile.email,
                phone: profile.phone,
              })
            }
          >
            Cancel
          </Button>
          <Button loading={saving} onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </Card>
    </div>
  );
}

// Change Password
export function ChangePassword() {
  const { showToast } = useApp();

  const [form, setForm] = useState({ current: "", newPass: "", confirm: "" });
  const [show, setShow] = useState({
    current: false,
    newPass: false,
    confirm: false,
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const strength = (password) => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"];
  const strengthColor = [
    "",
    "strength-red",
    "strength-amber",
    "strength-yellow",
    "strength-green",
  ];
  const passwordStrength = strength(form.newPass);

  const validate = () => {
    const validationErrors = {};
    if (!form.current)
      validationErrors.current = "Current password is required.";
    if (!form.newPass || form.newPass.length < 8)
      validationErrors.newPass = "Password must be at least 8 characters.";
    if (form.newPass !== form.confirm)
      validationErrors.confirm = "Passwords do not match.";
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      await profileService.changePassword(form.current, form.newPass);
      showToast("success", "Password changed successfully.");
      setForm({ current: "", newPass: "", confirm: "" });
      setErrors({});
    } catch (err) {
      if (err.message.toLowerCase().includes("current password")) {
        setErrors({ current: err.message });
      } else {
        showToast("error", err.message);
      }
    } finally {
      setSaving(false);
    }
  };

  const PassInput = ({ field, label }) => (
    <div className="password-input-group">
      <label className="password-input-label">{label}</label>
      <div className="password-input-wrapper">
        <input
          type={show[field] ? "text" : "password"}
          placeholder="••••••••"
          value={form[field]}
          onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
          className={`password-input ${errors[field] ? "password-input-error" : ""}`}
        />
        <button
          type="button"
          onClick={() => setShow((s) => ({ ...s, [field]: !s[field] }))}
          className="password-toggle-button"
          aria-label={show[field] ? "Hide password" : "Show password"}
        >
          {show[field] ? <EyeOff /> : <Eye />}
        </button>
      </div>
      {errors[field] && <p className="password-error">{errors[field]}</p>}
    </div>
  );

  return (
    <div className="change-password-page">
      <div className="change-password-header">
        <h1 className="change-password-title">Change Password</h1>
        <p className="change-password-subtitle">Keep your account secure</p>
      </div>

      <Card className="change-password-card">
        <PassInput field="current" label="Current Password" />

        <div className="new-password-section">
          <PassInput field="newPass" label="New Password" />

          {form.newPass && (
            <div className="password-strength">
              <div className="strength-bars">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`strength-bar ${i <= passwordStrength ? strengthColor[passwordStrength] : "strength-inactive"}`}
                  />
                ))}
              </div>
              <p className="strength-label">
                Strength: <span>{strengthLabel[passwordStrength]}</span>
              </p>
              <ul className="password-requirements">
                <li
                  className={form.newPass.length >= 8 ? "requirement-met" : ""}
                >
                  · At least 8 characters
                </li>
                <li
                  className={
                    /[A-Z]/.test(form.newPass) ? "requirement-met" : ""
                  }
                >
                  · One uppercase letter
                </li>
                <li
                  className={
                    /[0-9]/.test(form.newPass) ? "requirement-met" : ""
                  }
                >
                  · One number
                </li>
              </ul>
            </div>
          )}
        </div>

        <PassInput field="confirm" label="Confirm New Password" />

        <div className="change-password-actions">
          <Button
            variant="secondary"
            onClick={() => {
              setForm({ current: "", newPass: "", confirm: "" });
              setErrors({});
            }}
          >
            Cancel
          </Button>
          <Button loading={saving} onClick={handleSave}>
            Change Password
          </Button>
        </div>
      </Card>
    </div>
  );
}
