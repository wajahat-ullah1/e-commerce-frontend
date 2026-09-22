import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Eye, Download, Printer, ArrowLeft, Boxes } from "lucide-react";
import {
  Card,
  Button,
  StatusBadge,
  Pagination,
} from "../../components/admin_Ui/Ui";
import { invoiceService } from "../../services/invoiceService";
import { useApp } from "../../context/useApp";
import "./Invoices.css";

export default function Invoices() {
  const navigate = useNavigate();
  const { showToast } = useApp();

  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    setLoading(true);

    try {
      const data = await invoiceService.list();
      setInvoices(data);
    } catch (error) {
      showToast("error", error.message || "Failed to load invoices");
    } finally {
      setLoading(false);
    }
  };

  const perPage = 8;

  const paginated = invoices.slice((page - 1) * perPage, page * perPage);

  const handleDownload = async (id) => {
    try {
      const blob = await invoiceService.download(id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice-${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      showToast("success", "Invoice downloaded successfully.");
    } catch (error) {
      showToast("error", error.message || "Failed to download invoice");
    }
  };

  return (
    <div className="invoices-page">
      <div className="invoices-page-header">
        <h1 className="invoices-title">Invoices</h1>
        <p className="invoices-subtitle">{invoices.length} invoices total</p>
      </div>

      <Card className="invoices-table-card">
        {loading ? (
          <div className="invoices-loading">Loading invoices...</div>
        ) : invoices.length === 0 ? (
          <div className="invoices-empty">No invoices found.</div>
        ) : (
          <>
            <div className="invoices-table-wrapper">
              <table className="invoices-table">
                <thead>
                  <tr>
                    {[
                      "Invoice #",
                      "Order ID",
                      "Customer",
                      "Date",
                      "Amount",
                      "Order Status",
                      "Actions",
                    ].map((heading, index) => (
                      <th
                        key={heading}
                        className={
                          index === 3 || index === 4 || index === 6
                            ? "invoices-th-right"
                            : "invoices-th-left"
                        }
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {paginated.map((inv) => (
                    <tr key={inv.id}>
                      <td className="invoices-number">{inv.invoiceNumber}</td>

                      <td className="invoices-order-id">{inv.orderId}</td>

                      <td className="invoices-customer">
                        {inv.order?.customerName}
                      </td>

                      <td className="invoices-date">
                        {new Date(inv.issuedAt).toLocaleDateString()}
                      </td>

                      <td className="invoices-amount">
                        ${(Number(inv.totalAmount) + Number(500)).toFixed(2)}
                      </td>

                      <td>
                        <StatusBadge status={inv.order?.status} />
                      </td>

                      <td className="invoices-actions-cell">
                        <div className="invoices-actions">
                          <button
                            type="button"
                            onClick={() =>
                              navigate(`/admin/invoices/${inv.id}`)
                            }
                            className="invoices-icon-button"
                            aria-label="View invoice"
                          >
                            <Eye />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDownload(inv.id)}
                            className="invoices-icon-button"
                            aria-label="Download invoice"
                          >
                            <Download />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="invoices-pagination">
              <Pagination
                page={page}
                total={invoices.length}
                perPage={perPage}
                onChange={setPage}
              />
            </div>
          </>
        )}
      </Card>
    </div>
  );
}

// ── Invoice Detail ────────────────────────────────────────────────

export function InvoiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useApp();

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInvoice();
  }, [id]);

  const loadInvoice = async () => {
    try {
      setLoading(true);

      const data = await invoiceService.get(id);

      setInvoice(data);
    } catch (error) {
      showToast("error", error.message || "Failed to load invoice");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="invoice-detail-page">Loading invoice...</div>;
  }

  if (!invoice) {
    return <div className="invoice-detail-page">Invoice not found.</div>;
  }

  const inv = invoice;

  const paymentStatus =
    inv.order?.status === "DELIVERED"
      ? "PAID"
      : inv.order?.status === "RETURNED" || inv.order?.status === "CANCELLED"
        ? "FAILED"
        : "PENDING";

  const handleDownload = async () => {
    try {
      const blob = await invoiceService.download(inv.id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${inv.invoiceNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      showToast("success", "Invoice downloaded successfully.");
    } catch (error) {
      showToast("error", error.message || "Failed to download invoice");
    }
  };

  return (
    <div className="invoice-detail-page">
      <div className="invoice-detail-toolbar">
        <button
          type="button"
          onClick={() => navigate("/admin/invoices")}
          className="invoice-back-button"
        >
          <ArrowLeft />
          All Invoices
        </button>

        <div className="invoice-toolbar-actions">
          <Button variant="secondary" size="sm">
            <Printer />
            Print
          </Button>

          <Button size="sm" onClick={handleDownload}>
            <Download />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Invoice Paper */}
      <Card className="invoice-paper">
        {/* Header */}
        <div className="invoice-header">
          <div className="invoice-company">
            <div className="invoice-company-icon">
              <Boxes />
            </div>

            <div>
              <p className="invoice-company-name">ShopAdmin Inc.</p>

              <p className="invoice-company-info">
                742 Commerce Street, Suite 300
              </p>

              <p className="invoice-company-info">San Francisco, CA 94105</p>
            </div>
          </div>

          <div className="invoice-heading">
            <p className="invoice-heading-title">INVOICE</p>

            <p className="invoice-heading-number">{inv.invoiceNumber}</p>

            <p className="invoice-heading-date">
              {new Date(inv.issuedAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Billing + Order Details */}
        <div className="invoice-details-grid">
          <div className="invoice-bill-to">
            <p className="invoice-section-label">Bill To</p>

            <p className="invoice-customer-name">{inv.order?.customerName}</p>

            <p className="invoice-detail-text">
              {inv.order?.customerEmail || "N/A"}
            </p>

            <p className="invoice-detail-text">
              {inv.order?.customerPhone || "N/A"}
            </p>

            <p className="invoice-detail-text invoice-address">
              {inv.order?.shippingAddressLine1 || "N/A"}
            </p>
          </div>

          <div className="invoice-order-details">
            <p className="invoice-section-label">Order Details</p>

            <div className="invoice-order-info">
              <div className="invoice-info-row">
                <span>Order ID</span>
                <strong>{inv.order?.id}</strong>
              </div>

              <div className="invoice-info-row">
                <span>Payment Method</span>
                <strong>Cash on Delivery</strong>
              </div>

              <div className="invoice-info-row">
                <span>Order Status</span>
                <StatusBadge status={inv.order?.status} />
              </div>

              <div className="invoice-info-row">
                <span>Order Status</span>
                <StatusBadge status={inv.order?.status} />
              </div>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="invoice-items-section">
          <table className="invoice-items-table">
            <thead>
              <tr>
                <th className="invoice-item-left">Product</th>

                <th className="invoice-item-center">Qty</th>

                <th className="invoice-item-right">Price</th>

                <th className="invoice-item-right">Total</th>
              </tr>
            </thead>

            <tbody>
              {inv.order?.items?.map((item) => (
                <tr key={item.id}>
                  <td>{item.product?.name}</td>

                  <td className="invoice-item-center">{item.quantity}</td>

                  <td className="invoice-item-right invoice-muted">
                    ${Number(item.price).toFixed(2)}
                  </td>

                  <td className="invoice-item-right invoice-item-total">
                    ${(Number(item.price) * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="invoice-summary">
          <div className="invoice-summary-row">
            <span>Subtotal</span>
            <span>${Number(inv.totalAmount).toFixed(2)}</span>
          </div>

          <div className="invoice-summary-row">
            <span>Shipping</span>
            <span>$500</span>
          </div>

          <div className="invoice-total-row">
            <span>Total</span>
            <span>${(Number(inv.totalAmount) + Number(500)).toFixed(2)}</span>
          </div>
        </div>

        {/* Footer Note */}
        <div className="invoice-footer-note">
          Payment via Cash on Delivery. Thank you for your order! · ShopAdmin
          Inc. · support@shopadmin.com
        </div>
      </Card>
    </div>
  );
}
