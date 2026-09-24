import { api } from "./api";

export const orderService = {
  // Admin
  list: () => api.get("/admin/orders").then((res) => res.orders),
  updateStatus: (id, status) =>
    api.put(`/admin/orders/${id}/status`, { status }).then((res) => res.order),
  markReturned: (id) =>
    api.put(`/admin/orders/${id}/return`).then((res) => res.order),

  // Customer
  checkout: (addressId) =>
    api.post("/orders/checkout", { addressId }).then((res) => res.order),

  guestCheckout: (payload) =>
    api
      .post("/orders/guest-checkout", payload, { auth: false })
      .then((res) => res.order),

  myOrders: () => api.get("/orders").then((res) => res.orders),
  getMyOrder: (id) => api.get(`/orders/${id}`).then((res) => res.order),
  cancelMyOrder: (id) =>
    api.put(`/orders/${id}/cancel`).then((res) => res.order),
};
