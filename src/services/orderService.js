import { api } from "./api";

export const orderService = {
  list: () => api.get("/admin/orders").then((res) => res.orders),
  updateStatus: (id, status) =>
    api.put(`/admin/orders/${id}/status`, { status }).then((res) => res.order),
  markReturned: (id) =>
    api.put(`/admin/orders/${id}/return`).then((res) => res.order),
};