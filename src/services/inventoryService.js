import { api } from "./api";

export const inventoryService = {
  list: () => api.get("/admin/inventory").then((res) => res.data),
  stats: () => api.get("/admin/inventory/stats").then((res) => res.data),
  lowStock: (threshold) =>
    api
      .get(
        `/admin/inventory/low-stock${threshold ? `?threshold=${threshold}` : ""}`,
      )
      .then((res) => res.data),
  historyAll: () => api.get("/admin/inventory/history").then((res) => res.data),
  history: (productId) =>
    api.get(`/admin/inventory/${productId}/history`).then((res) => res.data),
  updateStock: (productId, stock, reason) =>
    api
      .put(`/admin/inventory/${productId}/stock`, { stock, reason })
      .then((res) => res.data),
};
