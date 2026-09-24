import { api } from "./api";

export function normalizeProduct(p) {
  if (!p) return p;
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    price: Number(p.price),
    stock: p.stock,
    // Backend already orders these by position, so images[0] is whichever
    // photo the admin marked as primary.
    images: p.images?.length
      ? p.images.map((img) => img.url)
      : p.image
        ? [p.image]
        : [],
    category: p.category?.name ?? "",
    categoryId: p.categoryId ?? p.category?.id ?? null,
    rating: Number(p.rating) || 0,
    reviewCount: p.totalReviews ?? 0,
    createdAt: p.createdAt,
  };
}

function buildQuery(params = {}) {
  const clean = Object.fromEntries(
    Object.entries(params).filter(
      ([, v]) => v !== undefined && v !== null && v !== "",
    ),
  );
  return new URLSearchParams(clean).toString();
}

export const productService = {
  list: (params = {}) =>
    api.get(`/products?${new URLSearchParams(params)}`).then((res) => res.products),
  get: (id) => api.get(`/products/${id}`).then((res) => res.product),
  create: (formData) => api.post("/products", formData).then((res) => res.product),
  update: (id, formData) => api.put(`/products/${id}`, formData).then((res) => res.product),
  remove: (id) => api.delete(`/products/${id}`),

  // Customer-facing: same GET /products endpoint, but returns normalized
  // products plus the pagination info the backend already computes.
  listPaged: (params = {}) =>
    api.get(`/products?${buildQuery(params)}`).then((res) => ({
      products: (res.products || []).map(normalizeProduct),
      pagination: res.pagination,
    })),

  // Customer-facing single product fetch, normalized the same way.
  getNormalized: (id) =>
    api.get(`/products/${id}`).then((res) => normalizeProduct(res.product)),
};