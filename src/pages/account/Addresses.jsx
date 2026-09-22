import { useState } from 'react';
import { useApp } from '../../context/useApp';
import Modal from '../../components/customer_Ui/Modal';
import './Addresses.css';

const BLANK = {
  label: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'United States',
  isDefault: false,
};

export default function Addresses() {
  const { addresses, addAddress, updateAddress, deleteAddress, setDefaultAddress, showToast } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState(BLANK);

  const openAdd = () => {
    setEditId(null);
    setForm(BLANK);
    setModalOpen(true);
  };

  const openEdit = (addr) => {
    setEditId(addr.id);
    setForm({
      label: addr.label,
      line1: addr.line1,
      line2: addr.line2 || '',
      city: addr.city,
      state: addr.state,
      postalCode: addr.postalCode,
      country: addr.country,
      isDefault: addr.isDefault,
    });
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      updateAddress(editId, form);
      showToast('success', 'Address updated!');
    } else {
      addAddress(form);
      showToast('success', 'Address added!');
    }
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteAddress(deleteId);
      showToast('info', 'Address removed.');
      setDeleteId(null);
    }
  };

  const Field = ({ label, value, onChange, placeholder = '', required = false }) => (
    <div className="address-field">
      <label className="address-field-label">
        {label}
        {required && <span className="address-required">*</span>}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="address-input"
      />
    </div>
  );

  return (
    <div className="addresses-page">
      <div className="addresses-header">
        <h1 className="addresses-title">Addresses</h1>
        <button onClick={openAdd} className="address-add-button">
          <svg className="address-add-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Address
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="addresses-empty">
          <div className="addresses-empty-icon">📍</div>
          <h3 className="addresses-empty-title">No addresses saved</h3>
          <p className="addresses-empty-text">Add a delivery address for faster checkout.</p>
          <button onClick={openAdd} className="address-empty-add-button">Add Address</button>
        </div>
      ) : (
        <div className="addresses-grid">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`address-card ${addr.isDefault ? 'address-card-default' : ''}`}
            >
              <div className="address-card-header">
                <div className="address-card-label-row">
                  <span className="address-card-label">{addr.label || 'Address'}</span>
                  {addr.isDefault && <span className="address-default-badge">Default</span>}
                </div>
              </div>

              <p className="address-line">{addr.line1}</p>
              {addr.line2 && <p className="address-line">{addr.line2}</p>}
              <p className="address-line">{addr.city}, {addr.state} {addr.postalCode}</p>
              <p className="address-line">{addr.country}</p>

              <div className="address-actions">
                <button onClick={() => openEdit(addr)} className="address-edit-button">Edit</button>
                <button onClick={() => setDeleteId(addr.id)} className="address-delete-button">Delete</button>
                {!addr.isDefault && (
                  <button
                    onClick={() => {
                      setDefaultAddress(addr.id);
                      showToast('success', 'Default address updated!');
                    }}
                    className="address-default-button"
                  >
                    Set as Default
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editId ? 'Edit Address' : 'Add New Address'}
      >
        <form onSubmit={handleSubmit} className="address-form">
          <Field
            label="Label (e.g. Home, Office)"
            value={form.label}
            onChange={(v) => setForm((p) => ({ ...p, label: v }))}
            placeholder="Home"
            required
          />
          <Field
            label="Address Line 1"
            value={form.line1}
            onChange={(v) => setForm((p) => ({ ...p, line1: v }))}
            placeholder="123 Main Street"
            required
          />
          <Field
            label="Address Line 2"
            value={form.line2 || ''}
            onChange={(v) => setForm((p) => ({ ...p, line2: v }))}
            placeholder="Apartment, suite, floor (optional)"
          />

          <div className="address-form-grid">
            <Field
              label="City"
              value={form.city}
              onChange={(v) => setForm((p) => ({ ...p, city: v }))}
              placeholder="San Francisco"
              required
            />
            <Field
              label="State"
              value={form.state}
              onChange={(v) => setForm((p) => ({ ...p, state: v }))}
              placeholder="CA"
              required
            />
          </div>

          <div className="address-form-grid">
            <Field
              label="Postal Code"
              value={form.postalCode}
              onChange={(v) => setForm((p) => ({ ...p, postalCode: v }))}
              placeholder="94102"
              required
            />
            <div className="address-field">
              <label className="address-field-label">
                Country<span className="address-required">*</span>
              </label>
              <select
                value={form.country}
                onChange={(e) => setForm((p) => ({ ...p, country: e.target.value }))}
                className="address-input address-select"
              >
                {['United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 'Other'].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <label className="address-checkbox-label">
            <input
              type="checkbox"
              checked={form.isDefault}
              onChange={(e) => setForm((p) => ({ ...p, isDefault: e.target.checked }))}
              className="address-checkbox"
            />
            <span>Set as default delivery address</span>
          </label>

          <div className="address-form-actions">
            <button type="button" onClick={() => setModalOpen(false)} className="address-cancel-button">
              Cancel
            </button>
            <button type="submit" className="address-submit-button">
              {editId ? 'Save Changes' : 'Add Address'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Address"
      >
        <div className="address-delete-modal">
          <p className="address-delete-text">
            Are you sure you want to delete this address? This action cannot be undone.
          </p>
          <div className="address-delete-actions">
            <button onClick={() => setDeleteId(null)} className="address-cancel-button">Cancel</button>
            <button onClick={handleDelete} className="address-confirm-delete">Delete</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
