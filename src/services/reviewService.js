import { api } from "./api";

export const reviewService = {
  list: () => api.get("/reviews").then((res) => res.reviews ?? []),
  remove: (id) => api.delete(`/reviews/${id}`),
};
