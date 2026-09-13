import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Trash2, Edit3, Eye, Filter } from "lucide-react";
import {
  Card,
  Button,
  StatusBadge,
  Stars,
  Badge,
  EmptyState,
  ConfirmDialog,
  Pagination,
} from "../../components/admin_Ui/Ui";
import { useFetch } from "../../hooks/useFetch";
import { productService } from "../../services/productService";
import { useApp } from "../../context/AppContext";
import "./Products.css";

export default function Products() {
  const navigate = useNavigate();
  const { showToast } = useApp();
  const {
    data: products,
    loading,
    error,
    refetch,
  } = useFetch(() => productService.list(), []);

  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [selected, setSelected] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [page, setPage] = useState(1);

  const list = products || [];
  // Get unique product categories
  const categories = Array.from(new Set(products.map((p) => p.category)));

  // Filter products according to search, category and stock
  const filtered = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      String(p.id).toLowerCase().includes(search.toLowerCase());

    const matchCat = catFilter === "all" || p.category === catFilter;

    const matchStock =
      stockFilter === "all" ||
      (stockFilter === "low" && p.stock > 0 && p.stock < 10) ||
      (stockFilter === "out" && p.stock === 0) ||
      (stockFilter === "in" && p.stock >= 10);

    return matchSearch && matchCat && matchStock;
  });

  // Pagination
  const perPage = 7;

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  // Select or unselect a single product
  const toggleSelect = (id) => {
    setSelected((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id],
    );
  };

  // Select or unselect all products on current page
  const toggleAll = () => {
    setSelected(
      selected.length === paginated.length ? [] : paginated.map((p) => p.id),
    );
  };

  // Delete a single product
  const handleDelete = async (id) => {
    try {
      await productService.remove(id);
      setDeleteId(null);
      showToast("success", "Product deleted successfully.");
      refetch();
    } catch (err) {
      showToast("error", err.message);
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(selected.map((id) => productService.remove(id)));
      showToast("success", `${selected.length} products deleted.`);
      setSelected([]);
      refetch();
    } catch (err) {
      showToast("error", err.message);
    }
  };

  if (loading) return <div className="products-page">Loading products…</div>;
  if (error)
    return (
      <div className="products-page">Failed to load products: {error}</div>
    );

  return (
    <div className="products-page">
      {/* Page Header */}
      <div className="products-page-header">
        <div>
          <h1 className="products-title">Products</h1>

          <p className="products-subtitle">{products.length} products total</p>
        </div>

        <Button onClick={() => onNavigate("add-product")}>
          <Plus className="products-button-icon" />
          Add Product
        </Button>
      </div>

      {/* Filters */}
      <Card className="products-filter-card">
        <div className="products-filters">
          {/* Search */}
          <div className="products-search">
            <Search className="products-search-icon" />

            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search products…"
              className="products-search-input"
            />
          </div>

          {/* Category Filter */}
          <select
            value={catFilter}
            onChange={(e) => {
              setCatFilter(e.target.value);
              setPage(1);
            }}
            className="products-filter-select"
          >
            <option value="all">All Categories</option>

            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Stock Filter */}
          <select
            value={stockFilter}
            onChange={(e) => {
              setStockFilter(e.target.value);
              setPage(1);
            }}
            className="products-filter-select"
          >
            <option value="all">All Stock</option>
            <option value="in">In Stock</option>
            <option value="low">Low Stock</option>
            <option value="out">Out of Stock</option>
          </select>

          {/* Bulk Actions */}
          {selected.length > 0 && (
            <div className="products-bulk-actions">
              <Badge variant="info">{selected.length} selected</Badge>

              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  setProducts((ps) =>
                    ps.filter((p) => !selected.includes(p.id)),
                  );

                  setSelected([]);

                  showToast(`${selected.length} products deleted.`, "success");
                }}
              >
                <Trash2 className="products-small-icon" />
                Delete Selected
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Products Table */}
      <Card className="products-table-card">
        {filtered.length === 0 ? (
          <EmptyState
            icon={<Filter className="products-empty-icon" />}
            title="No products found"
            description="Try adjusting your search or filter criteria."
          />
        ) : (
          <>
            <div className="products-table-wrapper">
              <table className="products-table">
                <thead>
                  <tr>
                    <th className="products-checkbox-header">
                      <input
                        type="checkbox"
                        checked={
                          selected.length === paginated.length &&
                          paginated.length > 0
                        }
                        onChange={toggleAll}
                      />
                    </th>

                    <th>Product</th>
                    <th>Category</th>
                    <th className="products-price-header">Price</th>
                    <th className="products-stock-header">Stock</th>
                    <th>Rating</th>
                    <th>Status</th>
                    <th className="products-actions-header">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {paginated.map((p) => (
                    <tr
                      key={p.id}
                      className={
                        selected.includes(p.id) ? "product-row-selected" : ""
                      }
                    >
                      {/* Checkbox */}
                      <td className="products-checkbox-cell">
                        <input
                          type="checkbox"
                          checked={selected.includes(p.id)}
                          onChange={() => toggleSelect(p.id)}
                        />
                      </td>

                      {/* Product */}
                      <td>
                        <div className="product-info">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="product-image"
                          />

                          <div>
                            <p className="product-name">{p.name}</p>

                            <p className="product-id">{p.id}</p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="product-category">{p.category}</td>

                      {/* Price */}
                      <td className="product-price">${p.price.toFixed(2)}</td>

                      {/* Stock */}
                      <td className="product-stock">
                        <span
                          className={
                            p.stock === 0
                              ? "stock-out"
                              : p.stock < 10
                                ? "stock-low"
                                : "stock-normal"
                          }
                        >
                          {p.stock}
                        </span>
                      </td>

                      {/* Rating */}
                      <td>
                        <div className="product-rating">
                          <Stars rating={Math.floor(p.rating)} />

                          <span>{p.rating}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td>
                        <StatusBadge status={p.status} />
                      </td>

                      {/* Actions */}
                      <td className="product-actions">
                        <div className="product-action-buttons">
                          {/* View Product */}
                          <button
                            type="button"
                            onClick={() => onNavigate("product-detail")}
                            className="product-action-button"
                            aria-label="View product"
                          >
                            <Eye />
                          </button>

                          {/* Edit Product */}
                          <button
                            type="button"
                            onClick={() => onNavigate("edit-product")}
                            className="product-action-button"
                            aria-label="Edit product"
                          >
                            <Edit3 />
                          </button>

                          {/* Delete Product */}
                          <button
                            type="button"
                            onClick={() => setDeleteId(p.id)}
                            className="product-delete-button"
                            aria-label="Delete product"
                          >
                            <Trash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="products-pagination">
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

      {/* Delete Confirmation Dialog */}
      {deleteId && (
        <ConfirmDialog
          title="Delete Product"
          message={`Are you sure you want to delete "${
            products.find((p) => p.id === deleteId)?.name
          }"? This action cannot be undone.`}
          confirmLabel="Delete Product"
          onConfirm={() => handleDelete(deleteId)}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}
