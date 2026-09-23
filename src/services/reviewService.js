import { api } from "./api";

export const reviewService = {
  list: () => api.get("/reviews").then((res) => res.reviews ?? []),
  remove: (id) => api.delete(`/reviews/${id}`),

  // Public — reviews for a single product's detail page.
  listByProduct: (productId) =>
    api
      .get(`/reviews/user/${productId}`, { auth: false })
      .then((res) => res.reviews ?? []),

  // Requires login; the backend also requires a DELIVERED order containing
  // this product, and rejects a second review from the same user.
  create: (productId, { rating, comment }) =>
    api
      .post(`/reviews/${productId}`, { rating, comment })
      .then((res) => res.review),
};