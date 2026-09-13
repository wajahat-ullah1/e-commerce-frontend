import { api } from "./api";

export const productService = {
  list: (params = {}) => api.get(`/products?${new URLSearchParams(params)}`),
  get: (id) => api.get(`/products/${id}`),
  create: (payload) => api.post("/products", payload),
  update: (id, payload) => api.put(`/products/${id}`, payload),
  remove: (id) => api.delete(`/products/${id}`),
};