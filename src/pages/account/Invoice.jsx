import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { invoiceService } from "../../services/invoiceService";
import "./Invoice.css";

export default function Invoice() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    invoiceService
      .getMine(id)
      .then((data) => {
        if (!cancelled) setOrder(data);
      })
      .catch(() => {
        if (!cancelled) setOrder(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleDownload = async () => {
    try {
      const blob = await invoiceService.downloadMine(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${order?.invoiceNumber || "invoice"}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      // Fall back to the browser's print dialog if the PDF endpoint fails.
      window.print();
    }
  };

  if (loading) {
    return <div className="invoice-page">Loading invoice…</div>;
  }

  if (!order) {
    return (
      <div className="invoice-not-found">
        <h2>Invoice not found</h2>
        <Link to="/account/orders">Back to Orders</Link>
      </div>
    );
  }

  const formattedInvoiceDate = order.invoiceDate
    ? new Date(order.invoiceDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <div className="invoice-page">
      <div className="invoice-page-header">
        <h1>Invoice</h1>

        <button
          type="button"
          onClick={handleDownload}
          className="invoice-download-btn"
        >
          <svg
            className="invoice-download-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <span>Download PDF</span>
        </button>
      </div>

      <div className="invoice-document">
        <div className="invoice-header">
          <div className="company-info">
            <div className="company-brand">
              <div className="company-logo">
                <svg
                  className="company-logo-icon"
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
              <span className="company-name">Lumière</span>
            </div>

            <p>123 Commerce Street</p>
            <p>San Francisco, CA 94105</p>
            <p>support@lumiere.shop</p>
            <p>+1 800 555 0100</p>
          </div>

          <div className="invoice-meta">
            <p className="invoice-title">INVOICE</p>
            <p className="invoice-number">{order.invoiceNumber}</p>
            <p className="invoice-date">Issued: {formattedInvoiceDate}</p>
          </div>
        </div>

        <div className="invoice-address-section">
          <div className="address-column">
            <p className="section-label">Bill To</p>
            <p className="customer-name">{order.customer.name}</p>
            <p className="address-text">{order.customer.phone}</p>
            {order.customer.email && (
              <p className="address-text">{order.customer.email}</p>
            )}
          </div>

          <div className="address-column">
            <p className="section-label">Ship To</p>
            <p className="address-text">{order.address.line1}</p>
            {order.address.line2 && (
              <p className="address-text">{order.address.line2}</p>
            )}
            <p className="address-text">
              {order.address.city}, {order.address.state}{" "}
              {order.address.postalCode}
            </p>
            <p className="address-text">{order.address.country}</p>
          </div>
        </div>

        <div className="invoice-table-wrapper">
          <table className="invoice-table">
            <thead>
              <tr>
                <th className="product-column">Product</th>
                <th className="quantity-column">Qty</th>
                <th className="price-column">Unit Price</th>
                <th className="total-column">Total</th>
              </tr>
            </thead>

            <tbody>
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td className="product-cell">
                    <div className="product-info">
                      <img src={item.image} alt="" className="product-image" />
                      <span className="product-name">{item.name}</span>
                    </div>
                  </td>
                  <td className="quantity-cell">{item.quantity}</td>
                  <td className="price-cell">${item.price.toFixed(2)}</td>
                  <td className="total-cell">
                    ${(item.price * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="invoice-summary-container">
          <div className="invoice-summary">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>

            <div className="summary-row">
              <span>Shipping</span>
              <span className="free-shipping">Free</span>
            </div>

            <div className="grand-total-row">
              <span>Grand Total</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="payment-section">
          <div className="payment-info">
            <p className="section-label">Payment Method</p>
            <p className="payment-method">{order.paymentMethod}</p>
            <p className="payment-description">Payment due upon delivery</p>
          </div>

          <div className="payment-status-container">
            <p className="section-label">Payment Status</p>
            <span
              className={`payment-status ${
                order.paymentStatus === "Paid"
                  ? "payment-paid"
                  : "payment-pending"
              }`}
            >
              {order.paymentStatus}
            </span>
          </div>
        </div>

        <div className="invoice-footer">
          <p>
            Thank you for shopping with Lumière. For questions, contact
            support@lumiere.shop
          </p>
          <p>
            This is a computer-generated invoice and does not require a
            signature.
          </p>
        </div>
      </div>
    </div>
  );
}
