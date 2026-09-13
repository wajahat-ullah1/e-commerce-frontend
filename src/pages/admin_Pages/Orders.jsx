import { useState } from "react";
import { Search, Eye, Download } from "lucide-react";
import {
  Card,
  Button,
  StatusBadge,
  EmptyState,
  Pagination,
} from "../../components/admin_Ui/Ui";
import { recentOrders as initialOrders } from "../../data/mockData";
import "./Orders.css";

export default function Orders({ onNavigate }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [payFilter, setPayFilter] = useState("all");
  const [page, setPage] = useState(1);

  const filtered = initialOrders.filter((o) => {
    const matchSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase());

    const matchStatus =
      statusFilter === "all" ||
      o.status === statusFilter;

    const matchPay =
      payFilter === "all" ||
      o.paymentStatus === payFilter;

    return matchSearch && matchStatus && matchPay;
  });

  const perPage = 10;

  const paginated = filtered.slice(
    (page - 1) * perPage,
    page * perPage
  );

  return (
    <div className="orders-page">
      <div className="orders-page-header">
        <h1 className="orders-title">Orders</h1>

        <p className="orders-subtitle">
          {initialOrders.length} orders total
        </p>
      </div>

      <Card className="orders-filter-card">
        <div className="orders-filters">
          <div className="orders-search">
            <Search className="orders-search-icon" />

            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search order ID or customer…"
              className="orders-search-input"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="orders-filter-select"
          >
            <option value="all">All Statuses</option>

            {[
              "Pending",
              "Processing",
              "Shipped",
              "In Transit",
              "Delivered",
              "Cancelled",
              "Returned",
            ].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select
            value={payFilter}
            onChange={(e) => {
              setPayFilter(e.target.value);
              setPage(1);
            }}
            className="orders-filter-select"
          >
            <option value="all">All Payments</option>

            {[
              "Pending",
              "Paid",
              "Failed",
              "Refunded",
            ].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </Card>

      <Card className="orders-table-card">
        {filtered.length === 0 ? (
          <EmptyState
            icon={<Search className="orders-empty-search-icon" />}
            title="No orders found"
            description="Try adjusting your search or filter criteria."
          />
        ) : (
          <>
            <div className="orders-table-wrapper">
              <table className="orders-table">
                <thead>
                  <tr>
                    {[
                      "Order ID",
                      "Customer",
                      "Date",
                      "Items",
                      "Total",
                      "Payment",
                      "Pay Status",
                      "Order Status",
                      "Actions",
                    ].map((heading, index) => (
                      <th
                        key={heading}
                        className={
                          index === 8
                            ? "orders-th-right"
                            : "orders-th-left"
                        }
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {paginated.map((o) => (
                    <tr key={o.id}>
                      <td className="orders-id">
                        {o.id}
                      </td>

                      <td>
                        <div className="orders-customer-name">
                          {o.customer}
                        </div>

                        <div className="orders-customer-email">
                          {o.email}
                        </div>
                      </td>

                      <td className="orders-date">
                        {o.date}
                      </td>

                      <td className="orders-items">
                        {o.items} item
                        {o.items !== 1 ? "s" : ""}
                      </td>

                      <td className="orders-total">
                        ${o.total.toFixed(2)}
                      </td>

                      <td className="orders-payment">
                        {o.payment}
                      </td>

                      <td>
                        <StatusBadge
                          status={o.paymentStatus}
                        />
                      </td>

                      <td>
                        <StatusBadge status={o.status} />
                      </td>

                      <td className="orders-action-cell">
                        <button
                          type="button"
                          onClick={() =>
                            onNavigate("order-detail")
                          }
                          className="orders-view-button"
                          aria-label="View order"
                        >
                          <Eye />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="orders-pagination">
              <Pagination
                page={page}
                total={filtered.length}
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

export function OrderDetail({
  onNavigate,
  showToast,
}) {
  const [status, setStatus] = useState("Processing");
  const [showUpdate, setShowUpdate] = useState(false);
  const [newStatus, setNewStatus] = useState(status);

  const order = {
    id: "ORD-10023",
    date: "Dec 11, 2026",
    paymentStatus: "Pending",
    total: 284.5,
    subtotal: 270.0,
    shipping: 14.5,
    customer: {
      name: "Marcus Webb",
      email: "m.webb@email.com",
      phone: "+1 (555) 201-3847",
      id: "CUS-001",
    },
    address: {
      line1: "742 Evergreen Terrace",
      line2: "Apt 4B",
      city: "Springfield",
      state: "Illinois",
      zip: "62701",
      country: "United States",
    },
    items: [
      {
        name: "Premium Wireless Headphones",
        qty: 2,
        price: 149.99,
        image:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=60&h=60&fit=crop&auto=format",
      },
      {
        name: "Classic Leather Wallet",
        qty: 1,
        price: 59.99,
        image:
          "https://images.unsplash.com/photo-1627123424574-724758594e93?w=60&h=60&fit=crop&auto=format",
      },
    ],
  };

  const timeline = [
    "Pending",
    "Processing",
    "Shipped",
    "In Transit",
    "Delivered",
  ];

  const currentIdx = timeline.indexOf(status);

  const updateStatus = () => {
    setStatus(newStatus);
    setShowUpdate(false);

    showToast(
      "Order status updated.",
      "success"
    );
  };

  return (
    <div className="order-detail-page">
      <div className="order-detail-header">
        <div>
          <button
            type="button"
            onClick={() => onNavigate("orders")}
            className="order-back-button"
          >
            ← All Orders
          </button>

          <h1 className="order-detail-title">
            {order.id}
          </h1>

          <div className="order-meta">
            <span>{order.date}</span>

            <StatusBadge status={status} />

            <StatusBadge
              status={order.paymentStatus}
            />
          </div>
        </div>

        <div className="order-detail-actions">
          <Button variant="secondary" size="sm">
            <Download className="order-action-icon" />
            Invoice
          </Button>

          <Button
            size="sm"
            onClick={() => setShowUpdate(true)}
          >
            Update Status
          </Button>
        </div>
      </div>

      {!["Cancelled", "Returned"].includes(status) && (
        <Card className="order-timeline-card">
          <h2 className="order-section-title">
            Order Timeline
          </h2>

          <div className="order-timeline">
            {timeline.map((step, i) => (
              <div
                key={step}
                className="timeline-step-wrapper"
              >
                <div className="timeline-step">
                  <div
                    className={`timeline-circle ${
                      i <= currentIdx
                        ? "timeline-circle-active"
                        : "timeline-circle-inactive"
                    }`}
                  >
                    {i < currentIdx ? "✓" : i + 1}
                  </div>

                  <span
                    className={`timeline-label ${
                      i <= currentIdx
                        ? "timeline-label-active"
                        : "timeline-label-inactive"
                    }`}
                  >
                    {step}
                  </span>
                </div>

                {i < timeline.length - 1 && (
                  <div
                    className={`timeline-line ${
                      i < currentIdx
                        ? "timeline-line-active"
                        : "timeline-line-inactive"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      <div className="order-content-grid">
        <div className="order-main-column">
          <Card className="order-items-card">
            <div className="order-card-header">
              <h2 className="order-section-title">
                Order Items
              </h2>
            </div>

            {order.items.map((item) => (
              <div
                key={item.name}
                className="order-item"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="order-item-image"
                />

                <div className="order-item-info">
                  <p className="order-item-name">
                    {item.name}
                  </p>

                  <p className="order-item-quantity">
                    Qty: {item.qty}
                  </p>
                </div>

                <div className="order-item-price">
                  <p className="order-item-total">
                    $
                    {(
                      item.qty * item.price
                    ).toFixed(2)}
                  </p>

                  <p className="order-item-unit-price">
                    ${item.price.toFixed(2)} each
                  </p>
                </div>
              </div>
            ))}

            <div className="order-summary">
              <div className="order-summary-row">
                <span>Subtotal</span>
                <span>
                  ${order.subtotal.toFixed(2)}
                </span>
              </div>

              <div className="order-summary-row">
                <span>Shipping</span>
                <span>
                  ${order.shipping.toFixed(2)}
                </span>
              </div>

              <div className="order-total-row">
                <span>Total</span>
                <span>
                  ${order.total.toFixed(2)}
                </span>
              </div>

              <div className="order-payment-info">
                Payment: Cash on Delivery ·{" "}
                <StatusBadge
                  status={order.paymentStatus}
                />
              </div>
            </div>
          </Card>
        </div>

        <div className="order-sidebar">
          <Card className="order-info-card">
            <h2 className="order-section-title">
              Customer
            </h2>

            <div className="order-customer-info">
              <p className="order-customer-name">
                {order.customer.name}
              </p>

              <p>{order.customer.email}</p>

              <p>{order.customer.phone}</p>

              <p className="order-customer-id">
                ID: {order.customer.id}
              </p>
            </div>
          </Card>

          <Card className="order-info-card">
            <h2 className="order-section-title">
              Shipping Address
            </h2>

            <address className="order-address">
              <p>{order.address.line1}</p>

              {order.address.line2 && (
                <p>{order.address.line2}</p>
              )}

              <p>
                {order.address.city},{" "}
                {order.address.state}{" "}
                {order.address.zip}
              </p>

              <p>{order.address.country}</p>
            </address>
          </Card>
        </div>
      </div>

      {showUpdate && (
        <div className="order-modal">
          <div
            className="order-modal-backdrop"
            onClick={() => setShowUpdate(false)}
          />

          <div className="order-status-modal">
            <h3 className="order-modal-title">
              Update Order Status
            </h3>

            <select
              value={newStatus}
              onChange={(e) =>
                setNewStatus(e.target.value)
              }
              className="order-status-select"
            >
              {[
                "Pending",
                "Processing",
                "Shipped",
                "In Transit",
                "Delivered",
                "Cancelled",
                "Returned",
              ].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <div className="order-modal-actions">
              <Button
                variant="secondary"
                onClick={() =>
                  setShowUpdate(false)
                }
              >
                Cancel
              </Button>

              <Button onClick={updateStatus}>
                Update Status
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
