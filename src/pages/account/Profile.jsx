import { useState, useRef } from "react";
import { useApp } from "../../context/useApp";
import { profileService } from "../../services/profileService";
import "./Profile.css";

export default function Profile() {
  const { user, updateUser, showToast } = useApp();
  const fileInputRef = useRef(null);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });
  const [loading, setLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updated = await profileService.update(form);
      updateUser(updated);
      showToast("success", "Profile updated successfully!");
      setEditing(false);
    } catch (err) {
      showToast("error", err.message || "Could not update your profile.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditing(false);
    setForm({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    });
  };

  const handlePhotoClick = () => fileInputRef.current?.click();

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploadingPhoto(true);
    try {
      const updated = await profileService.uploadImage(file);
      updateUser(updated);
      showToast("success", "Profile photo updated!");
    } catch (err) {
      showToast("error", err.message || "Could not upload your photo.");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const fields = [
    { id: "name", label: "Full Name", type: "text" },
    { id: "email", label: "Email Address", type: "email" },
    { id: "phone", label: "Phone Number", type: "tel" },
  ];

  return (
    <div className="profile-page">
      <h1 className="profile-page-title">Profile</h1>

      <div className="profile-card profile-avatar-card">
        <div className="profile-avatar-content">
          <div className="profile-avatar-wrapper">
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt=""
                className="profile-avatar-image"
              />
            ) : (
              <div className="profile-avatar-placeholder">
                <span>{user?.name?.charAt(0)}</span>
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handlePhotoChange}
              style={{ display: "none" }}
            />

            <button
              type="button"
              onClick={handlePhotoClick}
              disabled={uploadingPhoto}
              className="profile-camera-btn"
            >
              <svg
                className="profile-camera-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
          </div>

          <div className="profile-user-info">
            <p className="profile-user-name">{user?.name}</p>
            <p className="profile-user-email">{user?.email}</p>

            <div className="profile-photo-actions">
              <button
                type="button"
                onClick={handlePhotoClick}
                disabled={uploadingPhoto}
                className="profile-change-photo"
              >
                {uploadingPhoto ? "Uploading…" : "Change Photo"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-card profile-information-card">
        <div className="profile-section-header">
          <h2>Personal Information</h2>

          {!editing && (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="profile-edit-btn"
            >
              Edit Profile
            </button>
          )}
        </div>

        <form onSubmit={handleSave} className="profile-form">
          {fields.map((field) => (
            <div key={field.id} className="profile-field">
              <label>{field.label}</label>

              {editing ? (
                <input
                  type={field.type}
                  value={form[field.id]}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, [field.id]: e.target.value }))
                  }
                />
              ) : (
                <div className="profile-field-value">
                  {form[field.id] || "—"}
                </div>
              )}
            </div>
          ))}

          {editing && (
            <div className="profile-form-actions">
              <button
                type="button"
                onClick={resetForm}
                className="profile-cancel-btn"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="profile-save-btn"
              >
                {loading && (
                  <svg
                    className="profile-loading-icon"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="profile-spinner-track"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="profile-spinner-path"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                )}
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
