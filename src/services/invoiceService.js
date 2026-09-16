import { api } from "./api";

export const invoiceService = {
  // Get all invoices for admin
  list: () => api.get("/admin/invoices").then((res) => res.data),

  // Get a single invoice
  get: (id) => api.get(`/admin/invoice/${id}`).then((res) => res.data),

  // Download invoice PDF
  download: (id) => api.getBlob(`/admin/invoice/${id}/pdf`),
};
