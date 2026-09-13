import { useState } from "react";
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Clock,
  AlertTriangle,
  TrendingUp,
  Eye,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, StatCard, StatusBadge, Button, Stars } from "../../components/admin_Ui/Ui";
import {
  revenueData,
  orderStatusData,
  recentOrders,
  products,
  inventoryItems,
} from "../../data/mockData";
import "./Dashboard.css";

const ranges = ["Today", "Last 7 Days", "Last 30 Days", "This Year"];

const activity = [
  {
    icon: "🛍️",
    text: "New order #ORD-10023 received from Marcus Webb",
    time: "5 min ago",
  },
  {
    icon: "📦",
    text: "Order #ORD-10021 delivered to James O'Brien",
    time: "2 hr ago",
  },
  {
    icon: "⚠️",
    text: "Classic Leather Wallet stock running low (6 units)",
    time: "3 hr ago",
  },
  {
    icon: "⭐",
    text: "Priya Sharma submitted a 5-star review",
    time: "4 hr ago",
  },
  {
    icon: "👤",
    text: "New customer Sofia Andersen registered",
    time: "5 hr ago",
  },
  {
    icon: "❌",
    text: "Order #ORD-10019 cancelled by Kwame Asante",
    time: "Yesterday",
  },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="dashboard-tooltip">
        <p className="dashboard-tooltip-label">{label}</p>

        {payload.map((item) => (
          <div key={item.name} className="dashboard-tooltip-row">
            <div
              className="dashboard-tooltip-dot"
              style={{ background: item.color }}
            />

            <span className="dashboard-tooltip-name">{item.name}:</span>

            <span className="dashboard-tooltip-value">
              {item.name === "revenue"
                ? `$${item.value.toLocaleString()}`
                : item.value}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export default function Dashboard({ onNavigate }) {
  const [range, setRange] = useState("Last 30 Days");

  return (
    <div className="dashboard-page">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <p className="dashboard-greeting">Good morning,</p>

          <h1 className="dashboard-title">Admin Rivera 👋</h1>
        </div>

        <div className="dashboard-range-selector">
          {ranges.map((item) => (
            <button
              key={item}
              onClick={() => setRange(item)}
              className={`dashboard-range-button ${
                range === item
                  ? "dashboard-range-active"
                  : "dashboard-range-inactive"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="dashboard-stat-grid">
        <StatCard
          icon={<DollarSign className="dashboard-stat-icon" />}
          label="Total Revenue"
          value="$41,200"
          change="12.5%"
          changeLabel="vs last month"
          trend="up"
        />

        <StatCard
          icon={<ShoppingCart className="dashboard-stat-icon" />}
          label="Total Orders"
          value="3,272"
          change="8.3%"
          changeLabel="vs last month"
          trend="up"
        />

        <StatCard
          icon={<Users className="dashboard-stat-icon" />}
          label="Customers"
          value="1,847"
          change="5.1%"
          changeLabel="vs last month"
          trend="up"
        />

        <StatCard
          icon={<Package className="dashboard-stat-icon" />}
          label="Products"
          value="247"
          change="3.2%"
          changeLabel="vs last month"
          trend="up"
        />

        <StatCard
          icon={<Clock className="dashboard-stat-icon" />}
          label="Pending Orders"
          value="198"
          change="2.4%"
          changeLabel="vs last month"
          trend="down"
        />

        <StatCard
          icon={<AlertTriangle className="dashboard-stat-icon" />}
          label="Low Stock"
          value="12"
          change="4 new"
          changeLabel="this week"
          trend="down"
        />
      </div>

      {/* Charts Row */}
      <div className="dashboard-charts-grid">
        {/* Revenue Chart */}
        <Card className="dashboard-revenue-card">
          <div className="dashboard-card-heading">
            <div>
              <h2 className="dashboard-section-title">Revenue & Orders</h2>

              <p className="dashboard-section-subtitle">
                Full year performance
              </p>
            </div>

            <div className="dashboard-chart-legend">
              <span className="dashboard-legend-item">
                <span className="dashboard-legend-line dashboard-revenue-line" />
                Revenue
              </span>

              <span className="dashboard-legend-item">
                <span className="dashboard-legend-line dashboard-orders-line" />
                Orders
              </span>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={220}>
            <AreaChart
              data={revenueData}
              margin={{
                top: 4,
                right: 4,
                bottom: 0,
                left: 0,
              }}
            >
              <defs>
                <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.15} />

                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                </linearGradient>

                <linearGradient id="gOrd" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />

                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#F3F4F6"
                vertical={false}
              />

              <XAxis
                dataKey="date"
                tick={{
                  fontSize: 11,
                  fill: "#9CA3AF",
                }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                tick={{
                  fontSize: 11,
                  fill: "#9CA3AF",
                }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />

              <Tooltip content={<CustomTooltip />} />

              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#4F46E5"
                strokeWidth={2}
                fill="url(#gRev)"
                dot={false}
                activeDot={{
                  r: 4,
                  fill: "#4F46E5",
                }}
              />

              <Area
                type="monotone"
                dataKey="orders"
                stroke="#10B981"
                strokeWidth={2}
                fill="url(#gOrd)"
                dot={false}
                activeDot={{
                  r: 4,
                  fill: "#10B981",
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Order Status */}
        <Card className="dashboard-order-status-card">
          <h2 className="dashboard-section-title">Order Status</h2>

          <p className="dashboard-section-subtitle dashboard-order-subtitle">
            Distribution by status
          </p>

          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={orderStatusData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={2}
                dataKey="value"
              >
                {orderStatusData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>

              <Tooltip
                formatter={(value) => [Number(value).toLocaleString()]}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="dashboard-status-list">
            {orderStatusData.slice(0, 5).map((status) => {
              const total = orderStatusData.reduce(
                (sum, item) => sum + item.value,
                0,
              );

              const percentage = (status.value / total) * 100;

              return (
                <div key={status.name} className="dashboard-status-item">
                  <div
                    className="dashboard-status-dot"
                    style={{
                      background: status.color,
                    }}
                  />

                  <span className="dashboard-status-name">{status.name}</span>

                  <span className="dashboard-status-value">
                    {status.value.toLocaleString()}
                  </span>

                  <span className="dashboard-status-percentage">
                    {percentage.toFixed(1)}%
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Tables Row */}
      <div className="dashboard-tables-grid">
        {/* Recent Orders */}
        <Card className="dashboard-recent-orders-card">
          <div className="dashboard-table-header">
            <h2 className="dashboard-section-title">Recent Orders</h2>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate("orders")}
            >
              View all →
            </Button>
          </div>

          <div className="dashboard-table-scroll">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th className="dashboard-th-right">Total</th>
                  <th>Status</th>
                  <th className="dashboard-th-right">Action</th>
                </tr>
              </thead>

              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="dashboard-order-id">{order.id}</td>

                    <td className="dashboard-customer-name">
                      {order.customer}
                    </td>

                    <td className="dashboard-order-total">
                      ${order.total.toFixed(2)}
                    </td>

                    <td>
                      <StatusBadge status={order.status} />
                    </td>

                    <td className="dashboard-action-cell">
                      <button
                        onClick={() => onNavigate("order-detail")}
                        className="dashboard-view-button"
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
        </Card>

        {/* Low Stock + Activity */}
        <div className="dashboard-side-column">
          {/* Low Stock */}
          <Card className="dashboard-low-stock-card">
            <div className="dashboard-table-header">
              <h2 className="dashboard-small-title">
                <AlertTriangle className="dashboard-warning-icon" />
                Low Stock
              </h2>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate("low-stock")}
              >
                View →
              </Button>
            </div>

            <div className="dashboard-low-stock-list">
              {inventoryItems
                .filter((item) => item.status !== "In Stock")
                .map((item) => (
                  <div key={item.id} className="dashboard-low-stock-item">
                    <div className="dashboard-low-stock-info">
                      <p className="dashboard-product-name">{item.name}</p>

                      <p className="dashboard-product-id">{item.id}</p>
                    </div>

                    <div className="dashboard-stock-info">
                      <p
                        className={`dashboard-stock-number ${
                          item.stock === 0
                            ? "dashboard-stock-empty"
                            : "dashboard-stock-low"
                        }`}
                      >
                        {item.stock}
                      </p>

                      <StatusBadge status={item.status} />
                    </div>
                  </div>
                ))}
            </div>
          </Card>

          {/* Activity */}
          <Card className="dashboard-activity-card">
            <div className="dashboard-activity-header">
              <h2 className="dashboard-small-title">
                <TrendingUp className="dashboard-trending-icon" />
                Recent Activity
              </h2>
            </div>

            <div className="dashboard-activity-list">
              {activity.map((item, index) => (
                <div key={index} className="dashboard-activity-item">
                  <span className="dashboard-activity-icon">{item.icon}</span>

                  <div className="dashboard-activity-content">
                    <p className="dashboard-activity-text">{item.text}</p>

                    <p className="dashboard-activity-time">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Top Products */}
      <Card className="dashboard-top-products-card">
        <div className="dashboard-table-header">
          <h2 className="dashboard-section-title">Top Selling Products</h2>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate("products")}
          >
            View all →
          </Button>
        </div>

        <div className="dashboard-table-scroll">
          <table className="dashboard-table dashboard-products-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th className="dashboard-th-right">Units Sold</th>
                <th className="dashboard-th-right">Revenue</th>
                <th className="dashboard-th-right">Stock</th>
              </tr>
            </thead>

            <tbody>
              {products.slice(0, 5).map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className="dashboard-product-cell">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="dashboard-product-image"
                      />

                      <div>
                        <p className="dashboard-product-title">
                          {product.name}
                        </p>

                        <div className="dashboard-product-rating">
                          <Stars rating={Math.floor(product.rating)} />

                          <span>({product.reviews})</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="dashboard-category">{product.category}</td>

                  <td className="dashboard-number-cell">
                    {(product.reviews * 1.2).toFixed(0)}
                  </td>

                  <td className="dashboard-number-cell dashboard-revenue-cell">
                    ${(product.price * product.reviews * 0.8).toFixed(0)}
                  </td>

                  <td className="dashboard-number-cell">
                    <span
                      className={`dashboard-product-stock ${
                        product.stock === 0
                          ? "dashboard-stock-red"
                          : product.stock < 10
                            ? "dashboard-stock-amber"
                            : "dashboard-stock-normal"
                      }`}
                    >
                      {product.stock}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
