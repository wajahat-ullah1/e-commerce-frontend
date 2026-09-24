import { api } from "./api";
import { normalizeOrder } from "./orderService";

function normalizeInvoice(invoice) {
  if (!invoice) return invoice;
  return {
    ...normalizeOrder(invoice.order),
    invoiceNumber: invoice.invoiceNumber,
    invoiceDate: invoice.issuedAt,
  };
}

export const invoiceService = {
  // Admin
  list: () => api.get("/admin/invoices").then((res) => res.data),
  get: (id) => api.get(`/admin/invoice/${id}`).then((res) => res.data),
  download: (id) => api.getBlob(`/admin/invoice/${id}/pdf`),

  // Customer
  getMine: (id) => api.get(`/invoices/${id}`).then((res) => normalizeInvoice(res.data)),
  downloadMine: (id) => api.getBlob(`/invoices/${id}/pdf`),
};