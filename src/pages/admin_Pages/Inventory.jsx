import { useState } from "react";
import {
  Package,
  AlertTriangle,
  Search,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import {
  Card,
  Button,
  StatusBadge,
  EmptyState,
  Pagination,
} from "../../components/admin_Ui/Ui";
import {
  inventoryItems,
  inventoryHistory,
} from "../../data/mockData";
import "./Inventory.css";

// ── Inventory Overview ─────────────────────────────────────────────

export default function Inventory({ onNavigate, showToast }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updateItem, setUpdateItem] = useState(null);
  const [newStock, setNewStock] = useState("");
  const [reason, setReason] = useState("");
  const [page, setPage] = useState(1);

  const filtered = inventoryItems.filter((item) => {
    const matchSearch = item.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchStatus =
      statusFilter === "all" ||
      item.status === statusFilter;

    return matchSearch && matchStatus;
  });

  const perPage = 7;

  const paginated = filtered.slice(
    (page - 1) * perPage,
    page * perPage
  );

  const totalStock = inventoryItems.reduce(
    (total, item) => total + item.stock,
    0
  );

  const lowCount = inventoryItems.filter(
    (item) => item.status === "Low Stock"
  ).length;

  const outCount = inventoryItems.filter(
    (item) => item.status === "Out of Stock"
  ).length;

  const handleUpdate = () => {
    if (!newStock || !reason) return;

    showToast(
      "Stock updated successfully.",
      "success"
    );

    setUpdateItem(null);
    setNewStock("");
    setReason("");
  };

  const stats = [
    {
      label: "Total Products",
      value: inventoryItems.length,
      className: "inventory-stat-indigo",
    },
    {
      label: "Total Stock",
      value: totalStock.toLocaleString(),
      className: "inventory-stat-emerald",
    },
    {
      label: "Low Stock",
      value: lowCount,
      className: "inventory-stat-amber",
    },
    {
      label: "Out of Stock",
      value: outCount,
      className: "inventory-stat-red",
    },
  ];

  return (
    <div className="inventory-page">
      {/* Header */}
      <div className="inventory-page-header">
        <h1 className="inventory-title">
          Inventory
        </h1>

        <p className="inventory-subtitle">
          Stock management overview
        </p>
      </div>

      {/* Stats */}
      <div className="inventory-stats-grid">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className="inventory-stat-card"
          >
            <div
              className={`inventory-stat-icon ${stat.className}`}
            >
              <Package />
            </div>

            <div>
              <p className="inventory-stat-label">
                {stat.label}
              </p>

              <p className="inventory-stat-value">
                {stat.value}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="inventory-filter-card">
        <div className="inventory-filters">
          <div className="inventory-search">
            <Search className="inventory-search-icon" />

            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search products…"
              className="inventory-search-input"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="inventory-status-select"
          >
            <option value="all">All Status</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">
              Out of Stock
            </option>
          </select>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => onNavigate("low-stock")}
          >
            <AlertTriangle className="inventory-button-icon" />
            Low Stock ({lowCount})
          </Button>
        </div>
      </Card>

      {/* Table */}
      <Card className="inventory-table-card">
        <div className="inventory-table-wrapper">
          <table className="inventory-table">
            <thead>
              <tr>
                {[
                  "Product",
                  "Category",
                  "Stock",
                  "Status",
                  "Last Updated",
                  "Actions",
                ].map((heading, index) => (
                  <th
                    key={heading}
                    className={
                      index === 5
                        ? "inventory-th-right"
                        : "inventory-th-left"
                    }
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {paginated.map((item) => (
                <tr key={item.id}>
                  <td>
                    <p className="inventory-product-name">
                      {item.name}
                    </p>

                    <p className="inventory-product-id">
                      {item.id}
                    </p>
                  </td>

                  <td className="inventory-category">
                    {item.category}
                  </td>

                  <td>
                    <div className="inventory-stock-cell">
                      <span
                        className={`inventory-stock-number ${
                          item.stock === 0
                            ? "inventory-stock-red"
                            : item.stock < 10
                            ? "inventory-stock-amber"
                            : "inventory-stock-normal"
                        }`}
                      >
                        {item.stock}
                      </span>

                      <span className="inventory-threshold">
                        / {item.threshold} min
                      </span>
                    </div>
                  </td>

                  <td>
                    <StatusBadge status={item.status} />
                  </td>

                  <td className="inventory-updated">
                    {item.updated}
                  </td>

                  <td className="inventory-action-cell">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setUpdateItem(item);
                        setNewStock(
                          String(item.stock)
                        );
                      }}
                    >
                      Update Stock
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="inventory-pagination">
          <Pagination
            page={page}
            total={filtered.length}
            perPage={perPage}
            onChange={setPage}
          />
        </div>
      </Card>

      {/* Update Stock Modal */}
      {updateItem && (
        <div className="inventory-modal-overlay">
          <div
            className="inventory-modal-backdrop"
            onClick={() => setUpdateItem(null)}
          />

          <div className="inventory-update-modal">
            <h3 className="inventory-modal-title">
              Update Stock
            </h3>

            <div className="inventory-current-stock">
              <p className="inventory-current-product">
                {updateItem.name}
              </p>

              <p className="inventory-current-text">
                Current stock:{" "}
                <strong>
                  {updateItem.stock}
                </strong>{" "}
                units
              </p>
            </div>

            <div className="inventory-form-group">
              <label>
                New Stock Quantity
              </label>

              <input
                type="number"
                value={newStock}
                onChange={(e) =>
                  setNewStock(e.target.value)
                }
                className="inventory-form-input"
              />

              {newStock &&
                !isNaN(Number(newStock)) && (
                  <p className="inventory-stock-change">
                    {updateItem.stock} →{" "}
                    <strong
                      className={
                        Number(newStock) >
                        updateItem.stock
                          ? "inventory-change-positive"
                          : "inventory-change-negative"
                      }
                    >
                      {newStock}
                    </strong>
                  </p>
                )}
            </div>

            <div className="inventory-form-group">
              <label>Reason</label>

              <select
                value={reason}
                onChange={(e) =>
                  setReason(e.target.value)
                }
                className="inventory-form-input"
              >
                <option value="">
                  Select reason
                </option>

                <option value="New stock received">
                  New stock received
                </option>

                <option value="Inventory adjustment">
                  Inventory adjustment
                </option>

                <option value="Damaged goods removed">
                  Damaged goods removed
                </option>

                <option value="Return processed">
                  Return processed
                </option>
              </select>
            </div>

            <div className="inventory-modal-actions">
              <Button
                variant="secondary"
                onClick={() =>
                  setUpdateItem(null)
                }
              >
                Cancel
              </Button>

              <Button
                onClick={handleUpdate}
                disabled={!newStock || !reason}
              >
                Update Stock
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Low Stock ─────────────────────────────────────────────────────

export function LowStock({ onNavigate }) {
  const lowItems = inventoryItems.filter(
    (item) => item.status !== "In Stock"
  );

  return (
    <div className="inventory-page inventory-low-stock-page">
      <div className="inventory-page-header inventory-low-header">
        <div>
          <h1 className="inventory-title">
            Low Stock
          </h1>

          <p className="inventory-subtitle">
            {lowItems.length} products need attention
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => onNavigate("inventory")}
        >
          ← All Inventory
        </Button>
      </div>

      {lowItems.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Package className="inventory-empty-icon" />}
            title="No low stock products"
            description="All products are well stocked."
          />
        </Card>
      ) : (
        <Card className="inventory-table-card">
          <div className="inventory-table-wrapper">
            <table className="inventory-table inventory-low-table">
              <thead>
                <tr>
                  {[
                    "Product",
                    "Category",
                    "Current Stock",
                    "Threshold",
                    "Status",
                    "Action",
                  ].map((heading) => (
                    <th key={heading}>
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {lowItems.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="inventory-low-product">
                        <AlertTriangle
                          className={
                            item.status ===
                            "Out of Stock"
                              ? "inventory-alert-red"
                              : "inventory-alert-amber"
                          }
                        />

                        <div>
                          <p className="inventory-product-name">
                            {item.name}
                          </p>

                          <p className="inventory-product-id">
                            {item.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="inventory-category">
                      {item.category}
                    </td>

                    <td className="inventory-low-stock-number">
                      {item.stock}
                    </td>

                    <td className="inventory-category">
                      {item.threshold} units
                    </td>

                    <td>
                      <StatusBadge
                        status={item.status}
                      />
                    </td>

                    <td>
                      <Button
                        variant="outline"
                        size="sm"
                      >
                        Update Stock
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}

// ── Inventory History ──────────────────────────────────────────────

export function InventoryHistory() {
  const [page, setPage] = useState(1);

  const perPage = 7;

  const paginated = inventoryHistory.slice(
    (page - 1) * perPage,
    page * perPage
  );

  return (
    <div className="inventory-page inventory-history-page">
      <div className="inventory-page-header">
        <h1 className="inventory-title">
          Inventory History
        </h1>

        <p className="inventory-subtitle">
          All stock movements and adjustments
        </p>
      </div>

      <Card className="inventory-table-card">
        <div className="inventory-table-wrapper">
          <table className="inventory-table inventory-history-table">
            <thead>
              <tr>
                {[
                  "Date",
                  "Product",
                  "Previous",
                  "Change",
                  "New Stock",
                  "Action",
                  "Reason",
                ].map((heading) => (
                  <th key={heading}>
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {paginated.map((history) => (
                <tr key={history.id}>
                  <td className="inventory-history-date">
                    {history.date}
                  </td>

                  <td className="inventory-product-name">
                    {history.product}
                  </td>

                  <td className="inventory-category">
                    {history.prev}
                  </td>

                  <td>
                    <span
                      className={`inventory-change ${
                        history.change > 0
                          ? "inventory-change-up"
                          : "inventory-change-down"
                      }`}
                    >
                      {history.change > 0 ? (
                        <ArrowUp />
                      ) : (
                        <ArrowDown />
                      )}

                      {history.change > 0 ? "+" : ""}
                      {history.change}
                    </span>
                  </td>

                  <td className="inventory-new-stock">
                    {history.newStock}
                  </td>

                  <td>
                    <StatusBadge
                      status={history.action}
                    />
                  </td>

                  <td className="inventory-history-reason">
                    {history.reason}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="inventory-pagination">
          <Pagination
            page={page}
            total={inventoryHistory.length}
            perPage={perPage}
            onChange={setPage}
          />
        </div>
      </Card>
    </div>
  );
}