import { api } from "./api";

export const productService = {
  list: (params = {}) =>
    api.get(`/products?${new URLSearchParams(params)}`).then((res) => res.products),
  get: (id) => api.get(`/products/${id}`).then((res) => res.product),
  create: (formData) => api.post("/products", formData).then((res) => res.product),
  update: (id, formData) => api.put(`/products/${id}`, formData).then((res) => res.product),
  remove: (id) => api.delete(`/products/${id}`),
};