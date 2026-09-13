import { useState } from "react";
import {
  Eye,
  Download,
  Printer,
  ArrowLeft,
  Boxes,
} from "lucide-react";
import {
  Card,
  Button,
  StatusBadge,
  Pagination,
} from "../../components/admin_Ui/Ui";
import { invoices } from "../../data/mockData";
import "./Invoices.css";

export default function Invoices({ onNavigate }) {
  const [page, setPage] = useState(1);

  const perPage = 8;

  const paginated = invoices.slice(
    (page - 1) * perPage,
    page * perPage
  );

  return (
    <div className="invoices-page">
      <div className="invoices-page-header">
        <h1 className="invoices-title">Invoices</h1>
        <p className="invoices-subtitle">
          {invoices.length} invoices total
        </p>
      </div>

      <Card className="invoices-table-card">
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
                      index === 3 ||
                      index === 4 ||
                      index === 6
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
                  <td className="invoices-number">
                    {inv.id}
                  </td>

                  <td className="invoices-order-id">
                    {inv.orderId}
                  </td>

                  <td className="invoices-customer">
                    {inv.customer}
                  </td>

                  <td className="invoices-date">
                    {inv.date}
                  </td>

                  <td className="invoices-amount">
                    ${inv.amount.toFixed(2)}
                  </td>

                  <td>
                    <StatusBadge status={inv.orderStatus} />
                  </td>

                  <td className="invoices-actions-cell">
                    <div className="invoices-actions">
                      <button
                        type="button"
                        onClick={() =>
                          onNavigate("invoice-detail")
                        }
                        className="invoices-icon-button"
                        aria-label="View invoice"
                      >
                        <Eye />
                      </button>

                      <button
                        type="button"
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
      </Card>
    </div>
  );
}

// ── Invoice Detail ────────────────────────────────────────────────

export function InvoiceDetail({ onNavigate, showToast }) {
  const inv = invoices[0];

  return (
    <div className="invoice-detail-page">
      <div className="invoice-detail-toolbar">
        <button
          type="button"
          onClick={() => onNavigate("invoices")}
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

          <Button
            size="sm"
            onClick={() =>
              showToast(
                "Invoice downloaded successfully.",
                "success"
              )
            }
          >
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
              <p className="invoice-company-name">
                ShopAdmin Inc.
              </p>

              <p className="invoice-company-info">
                742 Commerce Street, Suite 300
              </p>

              <p className="invoice-company-info">
                San Francisco, CA 94105
              </p>
            </div>
          </div>

          <div className="invoice-heading">
            <p className="invoice-heading-title">
              INVOICE
            </p>

            <p className="invoice-heading-number">
              {inv.id}
            </p>

            <p className="invoice-heading-date">
              {inv.date}
            </p>
          </div>
        </div>

        {/* Billing + Order Details */}
        <div className="invoice-details-grid">
          <div className="invoice-bill-to">
            <p className="invoice-section-label">
              Bill To
            </p>

            <p className="invoice-customer-name">
              {inv.customer}
            </p>

            <p className="invoice-detail-text">
              m.webb@email.com
            </p>

            <p className="invoice-detail-text">
              +1 (555) 201-3847
            </p>

            <p className="invoice-detail-text invoice-address">
              742 Evergreen Terrace, Apt 4B
            </p>

            <p className="invoice-detail-text">
              Springfield, IL 62701
            </p>
          </div>

          <div className="invoice-order-details">
            <p className="invoice-section-label">
              Order Details
            </p>

            <div className="invoice-order-info">
              <div className="invoice-info-row">
                <span>Order ID</span>
                <strong>{inv.orderId}</strong>
              </div>

              <div className="invoice-info-row">
                <span>Payment Method</span>
                <strong>Cash on Delivery</strong>
              </div>

              <div className="invoice-info-row">
                <span>Payment Status</span>
                <StatusBadge status="Pending" />
              </div>

              <div className="invoice-info-row">
                <span>Order Status</span>
                <StatusBadge status={inv.orderStatus} />
              </div>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="invoice-items-section">
          <table className="invoice-items-table">
            <thead>
              <tr>
                <th className="invoice-item-left">
                  Product
                </th>

                <th className="invoice-item-center">
                  Qty
                </th>

                <th className="invoice-item-right">
                  Price
                </th>

                <th className="invoice-item-right">
                  Total
                </th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>Premium Wireless Headphones</td>
                <td className="invoice-item-center">
                  2
                </td>
                <td className="invoice-item-right invoice-muted">
                  $149.99
                </td>
                <td className="invoice-item-right invoice-item-total">
                  $299.98
                </td>
              </tr>

              <tr>
                <td>Classic Leather Wallet</td>
                <td className="invoice-item-center">
                  1
                </td>
                <td className="invoice-item-right invoice-muted">
                  $59.99
                </td>
                <td className="invoice-item-right invoice-item-total">
                  $59.99
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="invoice-summary">
          <div className="invoice-summary-row">
            <span>Subtotal</span>
            <span>$359.97</span>
          </div>

          <div className="invoice-summary-row">
            <span>Shipping</span>
            <span>$14.50</span>
          </div>

          <div className="invoice-total-row">
            <span>Total</span>
            <span>
              ${inv.amount.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Footer Note */}
        <div className="invoice-footer-note">
          Payment via Cash on Delivery. Thank you for your
          order! · ShopAdmin Inc. · support@shopadmin.com
        </div>
      </Card>
    </div>
  );
}

