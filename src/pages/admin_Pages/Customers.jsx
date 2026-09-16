import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Search,
  Eye,
  ShoppingCart,
  DollarSign,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  Card,
  Button,
  StatusBadge,
  Avatar,
  EmptyState,
  Pagination,
} from "../../components/admin_Ui/Ui";
import { customerService } from "../../services/customerService";
import { orderService } from "../../services/orderService";
import { useApp } from "../../context/AppContext";
import "./Customers.css";

export default function Customers() {
  const navigate = useNavigate();
  const { showToast } = useApp();

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    customerService
      .list()
      .then(setCustomers)
      .catch((err) =>
        showToast("error", err.message || "Failed to load customers"),
      )
      .finally(() => setLoading(false));
  }, []);

  const filtered = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(search.toLowerCase()) ||
      customer.email.toLowerCase().includes(search.toLowerCase()),
  );

  const perPage = 8;
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="customers-page">
      <div className="customers-header">
        <div>
          <h1 className="customers-title">Customers</h1>
          <p className="customers-subtitle">
            {customers.length} registered customers
          </p>
        </div>
      </div>

      <Card className="customers-search-card">
        <div className="customers-search-wrapper">
          <Search className="customers-search-icon" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search customers…"
            className="customers-search-input"
          />
        </div>
      </Card>

      <Card className="customers-table-card">
        {loading ? (
          <div className="customers-loading">Loading customers...</div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<Search className="customers-empty-icon" />}
            title="No customers found"
          />
        ) : (
          <>
            <div className="customers-table-wrapper">
              <table className="customers-table">
                <thead>
                  <tr>
                    {[
                      "Customer",
                      "Email",
                      "Phone",
                      "Orders",
                      "Total Spent",
                      "Joined",
                      "Status",
                      "",
                    ].map((heading, index) => (
                      <th
                        key={index}
                        className={`customers-th ${index === 7 ? "customers-th-right" : "customers-th-left"}`}
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((customer) => (
                    <tr key={customer.id} className="customers-table-row">
                      <td className="customers-td">
                        <div className="customers-profile">
                          <Avatar
                            src={customer.profileImage}
                            initials={customer.name?.charAt(0).toUpperCase()}
                          />
                          <div>
                            <p className="customers-name">{customer.name}</p>
                            <p className="customers-id">{customer.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="customers-td customers-text">
                        {customer.email}
                      </td>
                      <td className="customers-td customers-text customers-nowrap">
                        {customer.phone}
                      </td>
                      <td className="customers-td customers-orders">
                        {customer.orders}
                      </td>
                      <td className="customers-td customers-spent">
                        ${customer.spent.toFixed(2)}
                      </td>
                      <td className="customers-td customers-text customers-nowrap">
                        {new Date(customer.joinedAt).toLocaleDateString(
                          "en-GB",
                        )}
                      </td>
                      <td className="customers-td">
                        <StatusBadge
                          status={
                            customer.status === "ACTIVE" ? "Active" : "Inactive"
                          }
                        />
                      </td>
                      <td className="customers-td customers-view-cell">
                        <button
                          onClick={() =>
                            navigate(`/admin/customers/${customer.id}`)
                          }
                          className="customers-view-button"
                          aria-label="View customer"
                        >
                          <Eye />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="customers-pagination">
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

// ─────────────────────────────────────────────────────────────
// Customer Detail
// ─────────────────────────────────────────────────────────────

export function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useApp();

  const [customer, setCustomer] = useState(null);
  const [customerOrders, setCustomerOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([customerService.list(), orderService.list()])
      .then(([customers, orders]) => {
        const found = customers.find((c) => String(c.id) === String(id));
        if (!found) throw new Error("Customer not found");
        setCustomer(found);
        setCustomerOrders(
          orders.filter((o) => String(o.userId) === String(id)),
        );
      })
      .catch((err) => showToast("error", err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return <div className="customer-detail-page">Loading customer…</div>;
  if (!customer)
    return <div className="customer-detail-page">Customer not found.</div>;

  const completed = customerOrders.filter(
    (o) => o.status === "DELIVERED",
  ).length;
  const cancelled = customerOrders.filter(
    (o) => o.status === "CANCELLED",
  ).length;

  const statistics = [
    {
      icon: <ShoppingCart />,
      label: "Total Orders",
      value: customer.orders,
      className: "customers-stat-indigo",
    },
    {
      icon: <CheckCircle />,
      label: "Completed",
      value: completed,
      className: "customers-stat-emerald",
    },
    {
      icon: <XCircle />,
      label: "Cancelled",
      value: cancelled,
      className: "customers-stat-red",
    },
    {
      icon: <DollarSign />,
      label: "Total Spent",
      value: `$${customer.spent.toFixed(0)}`,
      className: "customers-stat-amber",
    },
  ];

  return (
    <div className="customer-detail-page">
      <button
        onClick={() => navigate("/admin/customers")}
        className="customer-detail-back"
      >
        ← All Customers
      </button>

      <div className="customer-detail-top">
        <Card className="customer-profile-card">
          <Avatar
            src={customer.profileImage}
            initials={customer.name?.charAt(0).toUpperCase()}
            size="lg"
          />
          <h2 className="customer-profile-name">{customer.name}</h2>
          <p className="customer-profile-info">{customer.email}</p>
          <p className="customer-profile-info">{customer.phone}</p>
          <p className="customer-profile-joined">
            Joined {new Date(customer.joinedAt).toLocaleDateString("en-GB")}
          </p>
          <StatusBadge
            status={customer.status === "ACTIVE" ? "Active" : "Inactive"}
          />
        </Card>

        <Card className="customer-statistics-card">
          <h2 className="customer-detail-section-title">Customer Statistics</h2>
          <div className="customer-statistics-grid">
            {statistics.map((stat) => (
              <div key={stat.label} className="customer-stat-item">
                <div className={`customer-stat-icon ${stat.className}`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="customer-stat-label">{stat.label}</p>
                  <p className="customer-stat-value">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="customer-detail-card">
        <div className="customer-detail-card-header">
          <h2 className="customer-detail-section-title">Recent Orders</h2>
        </div>
        {customerOrders.length === 0 ? (
          <div className="customer-no-reviews">
            No orders from this customer yet.
          </div>
        ) : (
          <div className="customer-detail-table-wrapper">
            <table className="customer-detail-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Date</th>
                  <th className="customer-detail-th-right">Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {customerOrders.slice(0, 4).map((order) => (
                  <tr key={order.id}>
                    <td className="customer-order-id">ORD-{order.id}</td>
                    <td className="customer-order-date">
                      {new Date(order.createdAt).toLocaleDateString("en-GB")}
                    </td>
                    <td className="customer-order-total">
                      ${Number(order.totalAmount).toFixed(2)}
                    </td>
                    <td>
                      <StatusBadge status={order.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
