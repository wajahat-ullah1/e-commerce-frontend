import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { products } from '../../data/products';
import ProductCard from '../../components/customer_Ui/ProductCard';
import Breadcrumb from '../../components/customer_Ui/Breadcrumb';
import './Shop.css';

const CATEGORY_OPTIONS = [
  'Electronics',
  'Clothing',
  'Home & Living',
  'Beauty',
  'Sports',
  'Books',
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
];

export default function Shop() {
  const [params, setParams] = useSearchParams();

  const [filterOpen, setFilterOpen] = useState(false);

  const [selectedCategories, setSelectedCategories] = useState(() => {
    const category = params.get('category');
    return category ? [category] : [];
  });

  const [priceRange, setPriceRange] = useState([0, 1500]);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);

  const [sort, setSort] = useState(
    params.get('sort') === 'best' ? 'rating' : 'newest'
  );

  const [view, setView] = useState('grid');
  const [page, setPage] = useState(1);

  const LIMIT = 8;

  const query = params.get('q') || '';

  const filtered = useMemo(() => {
    let res = [...products];

    if (query) {
      const searchQuery = query.toLowerCase();

      res = res.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery) ||
          p.category.toLowerCase().includes(searchQuery)
      );
    }

    if (selectedCategories.length > 0) {
      res = res.filter((p) =>
        selectedCategories.includes(p.category)
      );
    }

    res = res.filter(
      (p) =>
        p.price >= priceRange[0] &&
        p.price <= priceRange[1]
    );

    if (minRating > 0) {
      res = res.filter((p) => p.rating >= minRating);
    }

    if (inStockOnly) {
      res = res.filter((p) => p.stock > 0);
    }

    switch (sort) {
      case 'price_asc':
        res.sort((a, b) => a.price - b.price);
        break;

      case 'price_desc':
        res.sort((a, b) => b.price - a.price);
        break;

      case 'rating':
        res.sort((a, b) => b.rating - a.rating);
        break;

      default:
        break;
    }

    return res;
  }, [
    query,
    selectedCategories,
    priceRange,
    minRating,
    inStockOnly,
    sort,
  ]);

  const totalPages = Math.ceil(filtered.length / LIMIT);

  const paginated = filtered.slice(
    (page - 1) * LIMIT,
    page * LIMIT
  );

  const toggleCategory = (category) => {
    setPage(1);

    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 1500]);
    setMinRating(0);
    setInStockOnly(false);
    setPage(1);
    setParams({});
  };

  const FilterPanel = () => (
    <div className="shop-filter-panel-content">

      <div className="shop-filter-header">
        <h3>Filters</h3>

        <button
          onClick={clearFilters}
          className="shop-clear-filters"
        >
          Clear all
        </button>
      </div>

      {/* Categories */}
      <div className="shop-filter-section">
        <p className="shop-filter-label">Category</p>

        <div className="shop-category-options">
          {CATEGORY_OPTIONS.map((category) => (
            <label
              key={category}
              className="shop-checkbox-label"
            >
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={() => toggleCategory(category)}
              />

              <span>{category}</span>
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
            value={priceRange[0]}
            onChange={(e) =>
              setPriceRange([
                Number(e.target.value),
                priceRange[1],
              ])
            }
            min={0}
            placeholder="Min"
          />

          <span>–</span>

          <input
            type="number"
            value={priceRange[1]}
            onChange={(e) =>
              setPriceRange([
                priceRange[0],
                Number(e.target.value),
              ])
            }
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
            <label
              key={rating}
              className="shop-radio-label"
            >
              <input
                type="radio"
                name="rating"
                checked={minRating === rating}
                onChange={() => setMinRating(rating)}
              />

              <span>
                {rating > 0
                  ? `${rating}★ & above`
                  : 'All ratings'}
              </span>
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
            onChange={(e) =>
              setInStockOnly(e.target.checked)
            }
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
            { label: 'Home', to: '/' },
            {
              label: query
                ? `Search: "${query}"`
                : 'Shop',
            },
          ]}
        />

        <div className="shop-header">
          <h1>
            {query
              ? `Results for "${query}"`
              : 'Shop'}
          </h1>

          {!query && (
            <p>
              Discover our full collection of premium
              products.
            </p>
          )}

          <span>
            {filtered.length} products
          </span>
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
                  {['grid', 'list'].map((viewType) => (
                    <button
                      key={viewType}
                      onClick={() => setView(viewType)}
                      className={
                        view === viewType
                          ? 'shop-view-btn shop-view-active'
                          : 'shop-view-btn shop-view-inactive'
                      }
                    >
                      {viewType === 'grid' ? (
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
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
                className="shop-sort-select"
              >
                {SORT_OPTIONS.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </select>

            </div>

            {/* Product Grid / Empty */}
            {filtered.length === 0 ? (
              <div className="shop-empty-state">

                <div className="shop-empty-icon">
                  🔍
                </div>

                <h3>No products found</h3>

                <p>
                  Try adjusting your filters or search
                  query.
                </p>

                <button
                  onClick={clearFilters}
                  className="shop-empty-clear-btn"
                >
                  Clear Filters
                </button>

              </div>
            ) : (
              <>
                <div
                  className={
                    view === 'list'
                      ? 'shop-product-list'
                      : 'shop-product-grid'
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
                        setPage((current) =>
                          Math.max(1, current - 1)
                        )
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
                          onClick={() =>
                            setPage(index + 1)
                          }
                          className={
                            page === index + 1
                              ? 'shop-page-number shop-page-number-active'
                              : 'shop-page-number shop-page-number-inactive'
                          }
                        >
                          {index + 1}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() =>
                        setPage((current) =>
                          Math.min(
                            totalPages,
                            current + 1
                          )
                        )
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
                Show {filtered.length} Products
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}