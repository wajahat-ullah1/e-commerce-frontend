import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";

import "./Ui.css";

// ── Badge ─────────────────────────────────────────────────────────────────

const badgeStyles = {
  default: "ui-badge-default",
  success: "ui-badge-success",
  warning: "ui-badge-warning",
  error: "ui-badge-error",
  info: "ui-badge-info",
  muted: "ui-badge-muted",
};

export function Badge({ children, variant = "default" }) {
  return (
    <span className={`ui-badge ${badgeStyles[variant] || badgeStyles.default}`}>
      {children}
    </span>
  );
}

// ── Status Badge ──────────────────────────────────────────────────────────

export function StatusBadge({ status }) {
  const statusMap = {
    Active: "success",
    Inactive: "muted",
    Delivered: "success",
    Processing: "default",
    Shipped: "info",
    "In Transit": "info",
    Pending: "warning",
    Cancelled: "error",
    Returned: "muted",
    "In Stock": "success",
    "Low Stock": "warning",
    "Out of Stock": "error",
    Paid: "success",
    Failed: "error",
    Refunded: "muted",
    PURCHASE: "success",
    SALE: "info",
    RETURN: "warning",
    ADJUSTMENT: "muted",
    CANCELLATION: "error",
  };

  return <Badge variant={statusMap[status] || "default"}>{status}</Badge>;
}

// ── Button ────────────────────────────────────────────────────────────────

const buttonVariants = {
  primary: "ui-button-primary",
  secondary: "ui-button-secondary",
  ghost: "ui-button-ghost",
  danger: "ui-button-danger",
  outline: "ui-button-outline",
};

const buttonSizes = {
  sm: "ui-button-sm",
  md: "ui-button-md",
  lg: "ui-button-lg",
};

export function Button({
  variant = "primary",
  size = "md",
  children,
  loading = false,
  className = "",
  ...props
}) {
  return (
    <button
      {...props}
      disabled={props.disabled || loading}
      className={`ui-button ${
        buttonVariants[variant] || buttonVariants.primary
      } ${buttonSizes[size] || buttonSizes.md} ${className}`}
    >
      {loading && (
        <svg
          className="ui-button-spinner"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle
            className="ui-spinner-circle"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />

          <path
            className="ui-spinner-path"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          />
        </svg>
      )}

      {children}
    </button>
  );
}

// ── Input ─────────────────────────────────────────────────────────────────

export function Input({ label, error, icon, className = "", ...props }) {
  return (
    <div className="ui-input-group">
      {label && <label className="ui-input-label">{label}</label>}

      <div className="ui-input-wrapper">
        {icon && <span className="ui-input-icon">{icon}</span>}

        <input
          {...props}
          className={`ui-input ${icon ? "ui-input-with-icon" : ""} ${
            error ? "ui-input-error" : ""
          } ${className}`}
        />
      </div>

      {error && <p className="ui-input-error-message">{error}</p>}
    </div>
  );
}

// ── Select ────────────────────────────────────────────────────────────────

export function Select({ label, options, className = "", ...props }) {
  return (
    <div className="ui-select-group">
      {label && <label className="ui-select-label">{label}</label>}

      <select {...props} className={`ui-select ${className}`}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// ── Card ──────────────────────────────────────────────────────────────────

export function Card({ children, className = "" }) {
  return <div className={`ui-card ${className}`}>{children}</div>;
}

// ── Star Rating ───────────────────────────────────────────────────────────

export function Stars({ rating }) {
  return (
    <div className="ui-stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`ui-star ${
            star <= rating ? "ui-star-active" : "ui-star-inactive"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

// ── Toast ─────────────────────────────────────────────────────────────────

const toastConfig = {
  success: {
    icon: <CheckCircle className="toast-icon-success" />,
    style: "toast-success",
  },

  error: {
    icon: <XCircle className="toast-icon-error" />,
    style: "toast-error",
  },

  warning: {
    icon: <AlertTriangle className="toast-icon-warning" />,
    style: "toast-warning",
  },

  info: {
    icon: <Info className="toast-icon-info" />,
    style: "toast-info",
  },
};

export function Toast({ type, message, onClose }) {
  const config = toastConfig[type] || toastConfig.success;

  return (
    <div className={`ui-toast ${config.style}`}>
      {config.icon}

      <span className="ui-toast-message">{message}</span>

      <button
        type="button"
        onClick={onClose}
        className="ui-toast-close"
        aria-label="Close notification"
      >
        <X />
      </button>
    </div>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────

export function Modal({ title, children, onClose }) {
  return (
    <div className="ui-modal-overlay">
      {/* Modal backdrop */}
      <div className="ui-modal-backdrop" onClick={onClose} />

      {/* Modal content */}
      <div className="ui-modal">
        {/* Modal Header */}
        <div className="ui-modal-header">
          <h3 className="ui-modal-title">{title}</h3>

          <button
            type="button"
            onClick={onClose}
            className="ui-modal-close"
            aria-label="Close modal"
          >
            <X />
          </button>
        </div>

        {/* Modal Body */}
        <div className="ui-modal-body">{children}</div>
      </div>
    </div>
  );
}

// ── Confirm Dialog ────────────────────────────────────────────────────────

export function ConfirmDialog({
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel = "Confirm",
  variant = "danger",
}) {
  return (
    <Modal title={title} onClose={onCancel}>
      <p className="ui-confirm-message">{message}</p>

      <div className="ui-confirm-actions">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>

        <Button variant={variant} onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}

// ── Empty State ───────────────────────────────────────────────────────────

export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="ui-empty-state">
      <div className="ui-empty-icon">{icon}</div>

      <h3 className="ui-empty-title">{title}</h3>

      {description && <p className="ui-empty-description">{description}</p>}

      {action}
    </div>
  );
}

// ── Stat Card ─────────────────────────────────────────────────────────────

export function StatCard({ icon, label, value, change, changeLabel, trend }) {
  return (
    <Card className="ui-stat-card">
      <div className="ui-stat-top">
        <div className="ui-stat-icon">{icon}</div>

        {/* <span
          className={`ui-stat-change ${
            trend === "up" ? "ui-stat-change-up" : "ui-stat-change-down"
          }`}
        >
          {trend === "up" ? "↑" : "↓"} {change}
        </span> */}
      </div>

      <div className="ui-stat-value">{value}</div>

      <div className="ui-stat-label">{label}</div>

      <div className="ui-stat-change-label">{changeLabel}</div>
    </Card>
  );
}

// ── Pagination ────────────────────────────────────────────────────────────

export function Pagination({ page, total, perPage, onChange }) {
  const pages = Math.ceil(total / perPage);

  const start = total === 0 ? 0 : (page - 1) * perPage + 1;

  const end = Math.min(page * perPage, total);

  const visiblePages = Array.from(
    { length: pages },
    (_, index) => index + 1,
  ).slice(Math.max(0, page - 3), page + 2);

  return (
    <div className="ui-pagination">
      <span className="ui-pagination-info">
        Showing {start}–{end} of {total}
      </span>

      <div className="ui-pagination-buttons">
        <button
          type="button"
          disabled={page === 1}
          onClick={() => onChange(page - 1)}
          className="ui-pagination-button"
        >
          Prev
        </button>

        {visiblePages.map((pageNumber) => (
          <button
            type="button"
            key={pageNumber}
            onClick={() => onChange(pageNumber)}
            className={`ui-pagination-button ${
              pageNumber === page ? "ui-pagination-active" : ""
            }`}
          >
            {pageNumber}
          </button>
        ))}

        <button
          type="button"
          disabled={page === pages}
          onClick={() => onChange(page + 1)}
          className="ui-pagination-button"
        >
          Next
        </button>
      </div>
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────

export function Skeleton({ className = "" }) {
  return <div className={`ui-skeleton ${className}`} />;
}

// ── Avatar ────────────────────────────────────────────────────────────────

export function Avatar({ initials, src, size = "md" }) {
  const sizeClass =
    size === "sm"
      ? "ui-avatar-sm"
      : size === "lg"
        ? "ui-avatar-lg"
        : "ui-avatar-md";

  const colors = [
    "ui-avatar-indigo",
    "ui-avatar-purple",
    "ui-avatar-emerald",
    "ui-avatar-blue",
    "ui-avatar-amber",
  ];

  const safeInitials = initials || "?";
  const color = colors[safeInitials.charCodeAt(0) % colors.length];

  if (src) {
    return (
      <img src={src} alt={safeInitials} className={`ui-avatar ${sizeClass}`} />
    );
  }

  return (
    <div className={`ui-avatar ${sizeClass} ${color}`}>{safeInitials}</div>
  );
}

// ── Error Dialog ────────────────────────────────────────────────────────────────

export function ErrorDialog({ title = "Action Failed", message, onClose }) {
  return (
    <Modal title={title} onClose={onClose}>
      <div className="ui-error-dialog-body">
        <div className="ui-error-dialog-icon">
          <AlertTriangle />
        </div>
        <p className="ui-error-dialog-message">{message}</p>
      </div>

      <div className="ui-confirm-actions">
        <Button onClick={onClose}>OK</Button>
      </div>
    </Modal>
  );
}
