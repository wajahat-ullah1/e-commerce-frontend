import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Search, Eye } from "lucide-react";
import {
  Card,
  Button,
  StatusBadge,
  EmptyState,
  Pagination,
} from "../../components/admin_Ui/Ui";
import { useFetch } from "../../hooks/useFetch";
import { orderService } from "../../services/orderService";
import { useApp } from "../../context/useApp";
import "./Orders.css";

function formatStatus(s) {
  if (!s) return s;
  return s
    .toLowerCase()
    .split("_")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

const ORDER_STATUSES = [
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "IN_TRANSIT",
  "DELIVERED",
  "CANCELLED",
  "RETURNED",
];
const PAYMENT_STATUSES = ["PENDING", "PAID", "FAILED", "REFUNDED"];

export default function Orders() {
  const navigate = useNavigate();
  const {
    data: orders,
    loading,
    error,
    refetch,
  } = useFetch(() => orderService.list(), []);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [payFilter, setPayFilter] = useState("all");
  const [page, setPage] = useState(1);

  const list = orders || [];

  useEffect(() => {
    const interval = setInterval(refetch, 60000);
    return () => clearInterval(interval);
  }, [refetch]);

  const filtered = list.filter((o) => {
    const matchSearch =
      String(o.id).includes(search) ||
      (o.customerName || "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    const matchPay = payFilter === "all" || o.paymentStatus === payFilter;
    return matchSearch && matchStatus && matchPay;
  });

  const perPage = 10;
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  if (loading) return <div className="orders-page">Loading orders…</div>;
  if (error)
    return <div className="orders-page">Failed to load orders: {error}</div>;

  return (
    <div className="orders-page">
      <div className="orders-page-header">
        <h1 className="orders-title">Orders</h1>
        <p className="orders-subtitle">{list.length} orders total</p>
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
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>
                {formatStatus(s)}
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
            {PAYMENT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {formatStatus(s)}
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
                          index === 8 ? "orders-th-right" : "orders-th-left"
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
                      <td className="orders-id">ORD-{o.id}</td>
                      <td>
                        <div className="orders-customer-name">
                          {o.customerName}
                        </div>
                        <div className="orders-customer-email">
                          {o.customerEmail}
                        </div>
                      </td>
                      <td className="orders-date">
                        {new Date(o.createdAt).toLocaleDateString("en-GB")}
                      </td>
                      <td className="orders-items">
                        {o.items.length} item{o.items.length !== 1 ? "s" : ""}
                      </td>
                      <td className="orders-total">
                        ${Number(o.totalAmount).toFixed(2)}
                      </td>
                      <td className="orders-payment">{o.paymentMethod}</td>
                      <td>
                        <StatusBadge status={formatStatus(o.paymentStatus)} />
                      </td>
                      <td>
                        <StatusBadge status={formatStatus(o.status)} />
                      </td>
                      <td className="orders-action-cell">
                        <button
                          type="button"
                          onClick={() => navigate(`/admin/orders/${o.id}`)}
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

export function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useApp();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [updating, setUpdating] = useState(false);

  const allowedTransitions = {
    PENDING: ["PROCESSING"],
    PROCESSING: ["SHIPPED"],
    SHIPPED: ["IN_TRANSIT"],
    IN_TRANSIT: ["DELIVERED", "RETURNED"],
    DELIVERED: [],
    CANCELLED: [],
    RETURNED: [],
  };
  const timeline = [
    "PENDING",
    "PROCESSING",
    "SHIPPED",
    "IN_TRANSIT",
    "DELIVERED",
  ];

  const loadOrder = () => {
    setLoading(true);
    orderService
      .list()
      .then((orders) => {
        const found = orders.find((o) => String(o.id) === String(id));
        if (!found) throw new Error("Order not found");
        setOrder(found);
      })
      .catch((err) => showToast("error", err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOrder();
  }, [id]);

  const currentIdx = order ? timeline.indexOf(order.status) : -1;
  const nextStatuses = order
    ? [...(allowedTransitions[order.status] || [])].sort(
        (a, b) => (a === "RETURNED" ? -1 : 0) - (b === "RETURNED" ? -1 : 0),
      )
    : [];

  const [selectedStatus, setSelectedStatus] = useState(null);
  const canReturn =
    order && order.status === "IN_TRANSIT" && order.paymentStatus !== "PAID";

  const handleAdvanceStatus = async () => {
    if (!selectedStatus) return;

    setUpdating(true);

    try {
      await orderService.updateStatus(order.id, selectedStatus);

      showToast("success", `Order moved to ${formatStatus(selectedStatus)}.`);

      setShowConfirm(false);
      setSelectedStatus(null);
      loadOrder();
    } catch (err) {
      showToast("error", err.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="order-detail-page">Loading order…</div>;
  if (!order) return <div className="order-detail-page">Order not found.</div>;

  return (
    <div className="order-detail-page">
      <div className="order-detail-header">
        <div>
          <button
            type="button"
            onClick={() => navigate("/admin/orders")}
            className="order-back-button"
          >
            ← All Orders
          </button>
          <h1 className="order-detail-title">ORD-{order.id}</h1>
          <div className="order-meta">
            <span>{new Date(order.createdAt).toLocaleDateString("en-GB")}</span>
            <StatusBadge status={formatStatus(order.status)} />
            <StatusBadge status={formatStatus(order.paymentStatus)} />
          </div>
        </div>

        <div className="order-detail-actions">
          {nextStatuses.map((status) => (
            <Button
              key={status}
              variant={status === "RETURNED" ? "secondary" : undefined}
              size="sm"
              onClick={() => {
                setSelectedStatus(status);
                setShowConfirm(true);
              }}
              disabled={updating}
            >
              {status === "RETURNED"
                ? "Mark as Returned"
                : `Move to ${formatStatus(status)}`}
            </Button>
          ))}
        </div>
      </div>

      {!["CANCELLED", "RETURNED"].includes(order.status) && (
        <Card className="order-timeline-card">
          <h2 className="order-section-title">Order Timeline</h2>
          <div className="order-timeline">
            {timeline.map((step, i) => (
              <div key={step} className="timeline-step-wrapper">
                <div className="timeline-step">
                  <div
                    className={`timeline-circle ${i <= currentIdx ? "timeline-circle-active" : "timeline-circle-inactive"}`}
                  >
                    {i < currentIdx ? "✓" : i + 1}
                  </div>
                  <span
                    className={`timeline-label ${i <= currentIdx ? "timeline-label-active" : "timeline-label-inactive"}`}
                  >
                    {formatStatus(step)}
                  </span>
                </div>
                {i < timeline.length - 1 && (
                  <div
                    className={`timeline-line ${i < currentIdx ? "timeline-line-active" : "timeline-line-inactive"}`}
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
              <h2 className="order-section-title">Order Items</h2>
            </div>
            {order.items.map((item) => (
              <div key={item.id} className="order-item">
                <img
                  src={item.product?.image}
                  alt={item.product?.name}
                  className="order-item-image"
                />
                <div className="order-item-info">
                  <p className="order-item-name">{item.product?.name}</p>
                  <p className="order-item-quantity">Qty: {item.quantity}</p>
                </div>
                <div className="order-item-price">
                  <p className="order-item-total">
                    ${(item.quantity * Number(item.price)).toFixed(2)}
                  </p>
                  <p className="order-item-unit-price">
                    ${Number(item.price).toFixed(2)} each
                  </p>
                </div>
              </div>
            ))}
            <div className="order-summary">
              <div className="order-total-row">
                <span>Total</span>
                <span>${Number(order.totalAmount).toFixed(2)}</span>
              </div>
              <div className="order-payment-info">
                Payment: {order.paymentMethod} ·{" "}
                <StatusBadge status={formatStatus(order.paymentStatus)} />
              </div>
            </div>
          </Card>
        </div>

        <div className="order-sidebar">
          <Card className="order-info-card">
            <h2 className="order-section-title">Customer</h2>
            <div className="order-customer-info">
              <p className="order-customer-name">{order.customerName}</p>
              <p>{order.customerEmail}</p>
              <p>{order.customerPhone}</p>
              {order.userId && (
                <p className="order-customer-id">User ID: {order.userId}</p>
              )}
            </div>
          </Card>

          <Card className="order-info-card">
            <h2 className="order-section-title">Shipping Address</h2>
            <address className="order-address">
              <p>{order.shippingAddressLine1}</p>
              {order.shippingAddressLine2 && (
                <p>{order.shippingAddressLine2}</p>
              )}
              <p>
                {order.shippingCity}, {order.shippingState}{" "}
                {order.shippingPostalCode}
              </p>
              <p>{order.shippingCountry}</p>
            </address>
          </Card>
        </div>
      </div>

      {showConfirm && selectedStatus && (
        <div className="order-modal">
          <div
            className="order-modal-backdrop"
            onClick={() => {
              setShowConfirm(false);
              setSelectedStatus(null);
            }}
          />

          <div className="order-status-modal">
            <h3 className="order-modal-title">Update Order Status</h3>

            <p>
              Move this order from <strong>{formatStatus(order.status)}</strong>{" "}
              to <strong>{formatStatus(selectedStatus)}</strong>?
            </p>

            <div className="order-modal-actions">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowConfirm(false);
                  setSelectedStatus(null);
                }}
              >
                Cancel
              </Button>

              <Button loading={updating} onClick={handleAdvanceStatus}>
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
