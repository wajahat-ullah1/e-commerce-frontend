import { useState } from "react";
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
  Stars,
} from "../../components/admin_Ui/Ui";
import { customers, recentOrders, reviews } from "../../data/mockData";
import "./Customers.css";

export default function Customers({ onNavigate }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(search.toLowerCase()) ||
      customer.email.toLowerCase().includes(search.toLowerCase()),
  );

  const perPage = 8;

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="customers-page">
      {/* Header */}
      <div className="customers-header">
        <div>
          <h1 className="customers-title">Customers</h1>

          <p className="customers-subtitle">
            {customers.length} registered customers
          </p>
        </div>
      </div>

      {/* Search */}
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

      {/* Customers Table */}
      <Card className="customers-table-card">
        {filtered.length === 0 ? (
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
                        className={`customers-th ${
                          index === 7
                            ? "customers-th-right"
                            : "customers-th-left"
                        }`}
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {paginated.map((customer) => (
                    <tr key={customer.id} className="customers-table-row">
                      {/* Customer */}
                      <td className="customers-td">
                        <div className="customers-profile">
                          <Avatar initials={customer.avatar} />

                          <div>
                            <p className="customers-name">{customer.name}</p>

                            <p className="customers-id">{customer.id}</p>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="customers-td customers-text">
                        {customer.email}
                      </td>

                      {/* Phone */}
                      <td className="customers-td customers-text customers-nowrap">
                        {customer.phone}
                      </td>

                      {/* Orders */}
                      <td className="customers-td customers-orders">
                        {customer.orders}
                      </td>

                      {/* Total Spent */}
                      <td className="customers-td customers-spent">
                        ${customer.spent.toFixed(2)}
                      </td>

                      {/* Joined */}
                      <td className="customers-td customers-text customers-nowrap">
                        {customer.joined}
                      </td>

                      {/* Status */}
                      <td className="customers-td">
                        <StatusBadge status={customer.status} />
                      </td>

                      {/* View */}
                      <td className="customers-td customers-view-cell">
                        <button
                          onClick={() => onNavigate("customer-detail")}
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

            {/* Pagination */}
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

export function CustomerDetail({ onNavigate }) {
  const customer = customers[0];

  const customerReviews = reviews.filter(
    (review) => review.customer === customer.name,
  );

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
      value: Math.floor(customer.orders * 0.7),
      className: "customers-stat-emerald",
    },
    {
      icon: <XCircle />,
      label: "Cancelled",
      value: Math.floor(customer.orders * 0.1),
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
      {/* Back */}
      <button
        onClick={() => onNavigate("customers")}
        className="customer-detail-back"
      >
        ← All Customers
      </button>

      {/* Profile + Statistics */}
      <div className="customer-detail-top">
        {/* Profile Card */}
        <Card className="customer-profile-card">
          <Avatar initials={customer.avatar} size="lg" />

          <h2 className="customer-profile-name">{customer.name}</h2>

          <p className="customer-profile-info">{customer.email}</p>

          <p className="customer-profile-info">{customer.phone}</p>

          <p className="customer-profile-joined">Joined {customer.joined}</p>

          <StatusBadge status={customer.status} />
        </Card>

        {/* Statistics */}
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

      {/* Recent Orders */}
      <Card className="customer-detail-card">
        <div className="customer-detail-card-header">
          <h2 className="customer-detail-section-title">Recent Orders</h2>
        </div>

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
              {recentOrders.slice(0, 4).map((order) => (
                <tr key={order.id}>
                  <td className="customer-order-id">{order.id}</td>

                  <td className="customer-order-date">{order.date}</td>

                  <td className="customer-order-total">
                    ${order.total.toFixed(2)}
                  </td>

                  <td>
                    <StatusBadge status={order.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Reviews */}
      <Card className="customer-detail-card">
        <div className="customer-detail-card-header">
          <h2 className="customer-detail-section-title">Customer Reviews</h2>
        </div>

        {customerReviews.length === 0 ? (
          <div className="customer-no-reviews">
            No reviews from this customer.
          </div>
        ) : (
          customerReviews.map((review) => (
            <div key={review.id} className="customer-review">
              <div className="customer-review-header">
                <p className="customer-review-product">{review.product}</p>

                <Stars rating={review.rating} />
              </div>

              <p className="customer-review-comment">{review.comment}</p>

              <p className="customer-review-date">{review.date}</p>
            </div>
          ))
        )}
      </Card>
    </div>
  );
}
