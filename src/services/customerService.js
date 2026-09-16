import { api } from "./api";

export const customerService = {
  list: () =>
    api.get("/admin/customers").then((res) => res.data || res.customers),

  get: (id) =>
    api.get(`/admin/customers/${id}`).then((res) => res.data || res.customer),
};