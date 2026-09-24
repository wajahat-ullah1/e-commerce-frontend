import { api } from "./api";

const STATUS_DISPLAY = {
  PENDING: "Pending",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  IN_TRANSIT: "In Transit",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  RETURNED: "Returned",
};

const PAYMENT_STATUS_DISPLAY = {
  PENDING: "Pending",
  PAID: "Paid",
  FAILED: "Failed",
};

export function normalizeOrder(o) {
  if (!o) return o;
  const total = Number(o.totalAmount);
  return {
    id: o.id,
    orderNumber: String(o.id),
    date: o.createdAt,
    updatedAt: o.updatedAt,
    status: STATUS_DISPLAY[o.status] || o.status,
    paymentStatus: PAYMENT_STATUS_DISPLAY[o.paymentStatus] || o.paymentStatus,
    paymentMethod: o.paymentMethod === "COD" ? "Cash on Delivery" : o.paymentMethod,
    subtotal: total,
    total,
    customer: {
      name: o.customerName,
      phone: o.customerPhone,
      email: o.customerEmail,
    },
    address: {
      line1: o.shippingAddressLine1,
      line2: o.shippingAddressLine2 || "",
      city: o.shippingCity,
      state: o.shippingState || "",
      postalCode: o.shippingPostalCode,
      country: o.shippingCountry,
    },
    items: (o.items || []).map((item) => ({
      id: item.id,
      productId: item.productId,
      name: item.product?.name,
      image: item.product?.images?.[0]?.url ?? null,
      price: Number(item.price),
      quantity: item.quantity,
    })),
    invoiceId: o.invoice?.id ?? null,
    invoiceNumber: o.invoice?.invoiceNumber ?? null,
    invoiceDate: o.invoice?.issuedAt ?? null,
  };
}

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
  myOrders: () =>
    api.get("/orders").then((res) => (res.orders || []).map(normalizeOrder)),
  getMyOrder: (id) =>
    api.get(`/orders/${id}`).then((res) => normalizeOrder(res.order)),
  cancelMyOrder: (id) =>
    api.put(`/orders/${id}/cancel`).then((res) => normalizeOrder(res.order)),
};