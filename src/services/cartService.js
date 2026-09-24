import { api } from "./api";

// Logged-in user's cart — backed by /cart (auth required).
export const cartService = {
  get: () => api.get("/cart").then((res) => res.cart),

  add: (productId, quantity = 1) =>
    api.post("/cart/add", { productId, quantity }).then((res) => res.cartItem),

  update: (productId, quantity) =>
    api.put(`/cart/${productId}`, { quantity }).then((res) => res.cartItem),

  remove: (productId) =>
    api.delete(`/cart/${productId}`).then((res) => res.product),
};

// Anonymous visitor's cart — backed by /guest-cart (no auth). Keyed by a
// guestCartId we mint on first add and keep in localStorage.
export const guestCartService = {
  create: () => api.post("/guest-cart", {}).then((res) => res.guestCart),

  get: (guestCartId) =>
    api.get(`/guest-cart/${guestCartId}`).then((res) => res.guestCart),

  add: (guestCartId, productId, quantity = 1) =>
    api
      .post(`/guest-cart/${guestCartId}/add`, { productId, quantity })
      .then((res) => res.cartItem),

  update: (guestCartId, productId, quantity) =>
    api
      .put(`/guest-cart/${guestCartId}/${productId}`, { quantity })
      .then((res) => res.cartItem),

  remove: (guestCartId, productId) =>
    api
      .delete(`/guest-cart/${guestCartId}/${productId}`)
      .then((res) => res.product),

  clear: (guestCartId) => api.delete(`/guest-cart/${guestCartId}`),
};