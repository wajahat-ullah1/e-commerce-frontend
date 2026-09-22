import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { inventoryService } from "../../services/inventoryService";
import { useApp } from "../../context/useApp";
import "./Inventory.css";

function stockStatus(stock) {
  if (stock === 0) return "Out of Stock";
  if (stock <= 5) return "Low Stock";
  return "In Stock";
}

// ── Inventory Overview ─────────────────────────────────────────────

export default function Inventory() {
  const navigate = useNavigate();
  const { showToast } = useApp();

  const [items, setItems] = useState([]);
  const [stats, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updateItem, setUpdateItem] = useState(null);
  const [newStock, setNewStock] = useState("");
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);
  const [page, setPage] = useState(1);

  const loadData = () => {
    setLoading(true);
    Promise.all([inventoryService.list(), inventoryService.stats()])
      .then(([inv, statsData]) => {
        setItems(inv);
        setStatsData(statsData);
      })
      .catch((err) => showToast("error", err.message))
      .finally(() => setLoading(false));
  };

  useEffect(loadData, []);

  const filtered = items.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      statusFilter === "all" || stockStatus(item.stock) === statusFilter;
    return matchSearch && matchStatus;
  });

  const perPage = 7;
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  // const totalStock = inventoryItems.reduce(
  //   (total, item) => total + item.stock,
  //   0,
  // );

  // const lowCount = inventoryItems.filter(
  //   (item) => item.status === "Low Stock",
  // ).length;

  // const outCount = inventoryItems.filter(
  //   (item) => item.status === "Out of Stock",
  // ).length;

  const handleUpdate = async () => {
    if (!newStock || !reason) return;
    setSaving(true);
    try {
      await inventoryService.updateStock(
        updateItem.id,
        Number(newStock),
        reason,
      );
      showToast("success", "Stock updated successfully.");
      setUpdateItem(null);
      setNewStock("");
      setReason("");
      loadData();
    } catch (err) {
      showToast("error", err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="inventory-page">Loading inventory…</div>;

  const statCards = [
    {
      label: "Total Products",
      value: stats?.totalProducts ?? 0,
      className: "inventory-stat-indigo",
    },
    {
      label: "Total Stock",
      value: (stats?.totalStock ?? 0).toLocaleString(),
      className: "inventory-stat-emerald",
    },
    {
      label: "Low Stock",
      value: stats?.lowStock ?? 0,
      className: "inventory-stat-amber",
    },
    {
      label: "Out of Stock",
      value: stats?.outOfStock ?? 0,
      className: "inventory-stat-red",
    },
  ];

  return (
    <div className="inventory-page">
      {/* Header */}
      <div className="inventory-page-header">
        <h1 className="inventory-title">Inventory</h1>

        <p className="inventory-subtitle">Stock management overview</p>
      </div>

      {/* Stats */}
      <div className="inventory-stats-grid">
        {statCards.map((stat) => (
          <Card key={stat.label} className="inventory-stat-card">
            <div className={`inventory-stat-icon ${stat.className}`}>
              <Package />
            </div>

            <div>
              <p className="inventory-stat-label">{stat.label}</p>

              <p className="inventory-stat-value">{stat.value}</p>
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
            <option value="Out of Stock">Out of Stock</option>
          </select>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate("/admin/inventory/low-stock")}
          >
            <AlertTriangle className="inventory-button-icon" />
            Low Stock ({stats?.lowStock ?? 0})
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
                      index === 5 ? "inventory-th-right" : "inventory-th-left"
                    }
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {paginated.map((item) => {
                const status = stockStatus(item.stock);
                return (
                  <tr key={item.id}>
                    <td>
                      <p className="inventory-product-name">{item.name}</p>
                      <p className="inventory-product-id">PRD-{item.id}</p>
                    </td>
                    <td className="inventory-category">
                      {item.category?.name}
                    </td>
                    <td>
                      <span
                        className={`inventory-stock-number ${item.stock === 0 ? "inventory-stock-red" : item.stock <= 5 ? "inventory-stock-amber" : "inventory-stock-normal"}`}
                      >
                        {item.stock}
                      </span>
                    </td>
                    <td>
                      <StatusBadge status={status} />
                    </td>
                    <td className="inventory-updated">
                      {new Date(item.updatedAt).toLocaleDateString("en-GB")}
                    </td>
                    <td className="inventory-action-cell">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setUpdateItem(item);
                          setNewStock(String(item.stock));
                        }}
                      >
                        Update Stock
                      </Button>
                    </td>
                  </tr>
                );
              })}
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
            <h3 className="inventory-modal-title">Update Stock</h3>

            <div className="inventory-current-stock">
              <p className="inventory-current-product">{updateItem.name}</p>
              <p className="inventory-current-text">
                Current stock: <strong>{updateItem.stock}</strong> units
              </p>
            </div>

            <div className="inventory-form-group">
              <label>New Stock Quantity</label>
              <input
                type="number"
                value={newStock}
                onChange={(e) => setNewStock(e.target.value)}
                className="inventory-form-input"
              />
              {newStock && !isNaN(Number(newStock)) && (
                <p className="inventory-stock-change">
                  {updateItem.stock} →{" "}
                  <strong
                    className={
                      Number(newStock) > updateItem.stock
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
                onChange={(e) => setReason(e.target.value)}
                className="inventory-form-input"
              >
                <option value="">Select reason</option>
                <option value="New stock received">New stock received</option>
                <option value="Inventory adjustment">
                  Inventory adjustment
                </option>
                <option value="Damaged goods removed">
                  Damaged goods removed
                </option>
                <option value="Return processed">Return processed</option>
              </select>
            </div>

            <div className="inventory-modal-actions">
              <Button variant="secondary" onClick={() => setUpdateItem(null)}>
                Cancel
              </Button>
              <Button
                loading={saving}
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

export function LowStock() {
  const navigate = useNavigate();
  const { showToast } = useApp();
  const [lowItems, setLowItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    inventoryService
      .lowStock()
      .then(setLowItems)
      .catch((err) => showToast("error", err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="inventory-page">Loading…</div>;

  return (
    <div className="inventory-page inventory-low-stock-page">
      <div className="inventory-page-header inventory-low-header">
        <div>
          <h1 className="inventory-title">Low Stock</h1>
          <p className="inventory-subtitle">
            {lowItems.length} products need attention
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate("/admin/inventory")}
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
                  {["Product", "Category", "Current Stock", "Status"].map(
                    (heading) => (
                      <th key={heading}>{heading}</th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {lowItems.map((item) => {
                  const status = stockStatus(item.stock);
                  return (
                    <tr key={item.id}>
                      <td>
                        <div className="inventory-low-product">
                          <AlertTriangle
                            className={
                              status === "Out of Stock"
                                ? "inventory-alert-red"
                                : "inventory-alert-amber"
                            }
                          />
                          <div>
                            <p className="inventory-product-name">
                              {item.name}
                            </p>
                            <p className="inventory-product-id">PRD-{item.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="inventory-category">
                        {item.category?.name}
                      </td>
                      <td className="inventory-low-stock-number">
                        {item.stock}
                      </td>
                      <td>
                        <StatusBadge status={status} />
                      </td>
                    </tr>
                  );
                })}
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
  const { showToast } = useApp();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    inventoryService
      .historyAll()
      .then(setHistory)
      .catch((err) => showToast("error", err.message))
      .finally(() => setLoading(false));
  }, []);

  const perPage = 7;
  const paginated = history.slice((page - 1) * perPage, page * perPage);

  if (loading) return <div className="inventory-page">Loading history…</div>;

  return (
    <div className="inventory-page inventory-history-page">
      <div className="inventory-page-header">
        <h1 className="inventory-title">Inventory History</h1>
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
                  <th key={heading}>{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map((h) => (
                <tr key={h.id}>
                  <td className="inventory-history-date">
                    {new Date(h.createdAt).toLocaleDateString("en-GB")}
                  </td>
                  <td className="inventory-product-name">{h.product?.name}</td>
                  <td className="inventory-category">{h.previousStock}</td>
                  <td>
                    <span
                      className={`inventory-change ${h.quantity > 0 ? "inventory-change-up" : "inventory-change-down"}`}
                    >
                      {h.quantity > 0 ? <ArrowUp /> : <ArrowDown />}
                      {h.quantity > 0 ? "+" : ""}
                      {h.quantity}
                    </span>
                  </td>
                  <td className="inventory-new-stock">{h.newStock}</td>
                  <td>
                    <StatusBadge status={h.action} />
                  </td>
                  <td className="inventory-history-reason">
                    {h.reason || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="inventory-pagination">
          <Pagination
            page={page}
            total={history.length}
            perPage={perPage}
            onChange={setPage}
          />
        </div>
      </Card>
    </div>
  );
}
