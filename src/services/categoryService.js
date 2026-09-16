import { api } from "./api";

export const categoryService = {
  list: () => api.get("/categories").then((res) => res.categories ?? res.data ?? res),
  create: (payload) => api.post("/categories", payload),
  update: (id, payload) => api.put(`/categories/${id}`, payload),
  remove: (id) => api.delete(`/categories/${id}`),
};