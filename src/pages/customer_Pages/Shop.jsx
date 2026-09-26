import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { productService } from "../../services/productService";
import { categoryService } from "../../services/categoryService";
import { useFetch } from "../../hooks/useFetch";
import ProductCard from "../../components/customer_Ui/ProductCard";
import { ProductCardSkeleton } from "../../components/customer_Ui/Skeleton";
import Breadcrumb from "../../components/customer_Ui/Breadcrumb";
import "./Shop.css";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
];

const SERVER_SORTS = new Set(["price_asc", "price_desc", "oldest"]);

const DEFAULT_PRICE_RANGE = [0, 1500];
const LIMIT = 8;

const CLIENT_FILTER_FETCH_LIMIT = 100;

export default function Shop() {
  const [params, setParams] = useSearchParams();

  const [filterOpen, setFilterOpen] = useState(false);

  const [selectedCategoryId, setSelectedCategoryId] = useState(() => {
    const category = params.get("category");
    return category ? Number(category) : null;
  });

  const [priceRange, setPriceRange] = useState(DEFAULT_PRICE_RANGE);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);

  const [sort, setSort] = useState(
    params.get("sort") === "best" ? "rating" : "newest",
  );

  const [view, setView] = useState("grid");
  const [page, setPage] = useState(1);

  const query = params.get("q") || "";

  const { data: categoriesData } = useFetch(() => categoryService.list(), []);
  const categories = Array.isArray(categoriesData) ? categoriesData : [];

  const hasClientOnlyFilters =
    minRating > 0 || inStockOnly || sort === "rating";

  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setLoading(true);
      setError(null);

      const baseParams = {
        search: query || undefined,
        categoryId: selectedCategoryId || undefined,
        minPrice:
          priceRange[0] > DEFAULT_PRICE_RANGE[0] ? priceRange[0] : undefined,
        maxPrice:
          priceRange[1] < DEFAULT_PRICE_RANGE[1] ? priceRange[1] : undefined,
        sort: SERVER_SORTS.has(sort) ? sort : undefined,
      };

      try {
        if (hasClientOnlyFilters) {
          const { products: fetched } = await productService.listPaged({
            ...baseParams,
            page: 1,
            limit: CLIENT_FILTER_FETCH_LIMIT,
          });

          let result = fetched;
          if (minRating > 0)
            result = result.filter((p) => p.rating >= minRating);
          if (inStockOnly) result = result.filter((p) => p.stock > 0);
          if (sort === "rating")
            result = [...result].sort((a, b) => b.rating - a.rating);

          if (!cancelled) {
            setItems(result);
            setPagination(null);
          }
        } else {
          const { products: fetched, pagination: pageInfo } =
            await productService.listPaged({
              ...baseParams,
              page,
              limit: LIMIT,
            });

          if (!cancelled) {
            setItems(fetched);
            setPagination(pageInfo);
          }
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [
    query,
    selectedCategoryId,
    priceRange,
    sort,
    page,
    minRating,
    inStockOnly,
    hasClientOnlyFilters,
    retryKey,
  ]);

  const paginated = useMemo(
    () =>
      hasClientOnlyFilters
        ? items.slice((page - 1) * LIMIT, page * LIMIT)
        : items,
    [items, page, hasClientOnlyFilters],
  );

  const totalCount = hasClientOnlyFilters
    ? items.length
    : (pagination?.totalProducts ?? items.length);

  const totalPages = hasClientOnlyFilters
    ? Math.ceil(items.length / LIMIT)
    : (pagination?.totalPages ?? 1);

  const selectCategory = (categoryId) => {
    setPage(1);
    setSelectedCategoryId((prev) => (prev === categoryId ? null : categoryId));
  };

  const clearFilters = () => {
    setSelectedCategoryId(null);
    setPriceRange(DEFAULT_PRICE_RANGE);
    setMinRating(0);
    setInStockOnly(false);
    setPage(1);
    setParams({});
  };

  const FilterPanel = () => (
    <div className="shop-filter-panel-content">
      <div className="shop-filter-header">
        <h3>Filters</h3>

        <button onClick={clearFilters} className="shop-clear-filters">
          Clear all
        </button>
      </div>

      {/* Categories */}
      <div className="shop-filter-section">
        <p className="shop-filter-label">Category</p>

        <div className="shop-category-options">
          <label className="shop-radio-label">
            <input
              type="radio"
              name="category"
              checked={selectedCategoryId === null}
              onChange={() => selectCategory(null)}
            />

            <span>All Categories</span>
          </label>

          {categories.map((category) => (
            <label key={category.id} className="shop-radio-label">
              <input
                type="radio"
                name="category"
                checked={selectedCategoryId === category.id}
                onChange={() => selectCategory(category.id)}
              />

              <span>
                {category.name}
                {typeof category._count?.products === "number"
                  ? ` (${category._count.products})`
                  : ""}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price */}
      <div className="shop-filter-section">
        <p className="shop-filter-label">Price Range</p>

        <div className="shop-price-inputs">
          <input
            type="number"
            id="startprice"
            value={priceRange[0]}
            onChange={(e) => {
              setPage(1);
              setPriceRange([Number(e.target.value), priceRange[1]]);
            }}
            min={0}
            placeholder="Min"
          />

          <span>–</span>

          <input
            type="number"
            id="nndprice"
            value={priceRange[1]}
            onChange={(e) => {
              setPage(1);
              setPriceRange([priceRange[0], Number(e.target.value)]);
            }}
            min={0}
            placeholder="Max"
          />
        </div>
      </div>

      {/* Rating */}
      <div className="shop-filter-section">
        <p className="shop-filter-label">Minimum Rating</p>

        <div className="shop-rating-options">
          {[4, 3, 2, 0].map((rating) => (
            <label key={rating} className="shop-radio-label">
              <input
                type="radio"
                name="rating"
                checked={minRating === rating}
                onChange={() => {
                  setPage(1);
                  setMinRating(rating);
                }}
              />

              <span>{rating > 0 ? `${rating}★ & above` : "All ratings"}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Stock */}
      <div className="shop-stock-filter">
        <label className="shop-checkbox-label">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => {
              setPage(1);
              setInStockOnly(e.target.checked);
            }}
          />

          <span>In Stock Only</span>
        </label>
      </div>
    </div>
  );

  return (
    <div className="shop-page">
      <div className="shop-container">
        {/* Header */}
        <Breadcrumb
          crumbs={[
            { label: "Home", to: "/" },
            {
              label: query ? `Search: "${query}"` : "Shop",
            },
          ]}
        />

        <div className="shop-header">
          <h1>{query ? `Results for "${query}"` : "Shop"}</h1>

          {!query && <p>Discover our full collection of premium products.</p>}

          <span>{totalCount} products</span>
        </div>

        <div className="shop-layout">
          {/* Desktop Filter Sidebar */}
          <aside className="shop-sidebar">
            <div className="shop-sidebar-card">
              <FilterPanel />
            </div>
          </aside>

          {/* Products Area */}
          <div className="shop-products-area">
            {/* Toolbar */}
            <div className="shop-toolbar">
              <div className="shop-toolbar-left">
                {/* Mobile Filter */}
                <button
                  onClick={() => setFilterOpen(true)}
                  className="shop-mobile-filter-btn"
                >
                  <svg
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                    />
                  </svg>
                  Filters
                </button>

                {/* View Toggle */}
                <div className="shop-view-toggle">
                  {["grid", "list"].map((viewType) => (
                    <button
                      key={viewType}
                      onClick={() => setView(viewType)}
                      className={
                        view === viewType
                          ? "shop-view-btn shop-view-active"
                          : "shop-view-btn shop-view-inactive"
                      }
                    >
                      {viewType === "grid" ? (
                        <svg
                          width="16"
                          height="16"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                          />
                        </svg>
                      ) : (
                        <svg
                          width="16"
                          height="16"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6h16M4 12h16M4 18h16"
                          />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <select
                id="option"
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
                className="shop-sort-select"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Product Grid / Loading / Error / Empty */}
            {loading ? (
              <div className="shop-product-grid">
                {Array.from({ length: LIMIT }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : error ? (
              <div className="shop-empty-state">
                <div className="shop-empty-icon">⚠️</div>

                <h3>Couldn't load products</h3>

                <p>{error}</p>

                <button
                  onClick={() => setRetryKey((k) => k + 1)}
                  className="shop-empty-clear-btn"
                >
                  Try Again
                </button>
              </div>
            ) : paginated.length === 0 ? (
              <div className="shop-empty-state">
                <div className="shop-empty-icon">🔍</div>

                <h3>No products found</h3>

                <p>Try adjusting your filters or search query.</p>

                <button onClick={clearFilters} className="shop-empty-clear-btn">
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div
                  className={
                    view === "list" ? "shop-product-list" : "shop-product-grid"
                  }
                >
                  {paginated.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      view={view}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="shop-pagination">
                    <button
                      onClick={() =>
                        setPage((current) => Math.max(1, current - 1))
                      }
                      disabled={page === 1}
                      className="shop-pagination-btn shop-pagination-prev"
                    >
                      Previous
                    </button>

                    <div className="shop-page-numbers">
                      {Array.from({
                        length: totalPages,
                      }).map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setPage(index + 1)}
                          className={
                            page === index + 1
                              ? "shop-page-number shop-page-number-active"
                              : "shop-page-number shop-page-number-inactive"
                          }
                        >
                          {index + 1}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() =>
                        setPage((current) => Math.min(totalPages, current + 1))
                      }
                      disabled={page === totalPages}
                      className="shop-pagination-btn shop-pagination-next"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {filterOpen && (
        <div className="shop-filter-drawer">
          <div
            className="shop-drawer-overlay"
            onClick={() => setFilterOpen(false)}
          />

          <div className="shop-drawer">
            <div className="shop-drawer-header">
              <h2>Filters</h2>

              <button
                onClick={() => setFilterOpen(false)}
                className="shop-drawer-close"
              >
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="shop-drawer-content">
              <FilterPanel />
            </div>

            <div className="shop-drawer-footer">
              <button
                onClick={() => setFilterOpen(false)}
                className="shop-show-products-btn"
              >
                Show {totalCount} Products
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
