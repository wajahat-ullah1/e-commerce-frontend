import { api } from "./api";
import { normalizeProduct } from "./productService";

export const wishlistService = {
  list: () =>
    api
      .get("/wishlist")
      .then((res) =>
        (res.wishlistItems || []).map((item) => normalizeProduct(item.product)),
      ),
  add: (productId) => api.post(`/wishlist/${productId}`),
  remove: (productId) => api.delete(`/wishlist/${productId}`),
};
