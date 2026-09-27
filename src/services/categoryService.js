import { api } from "./api";

function toCategoryFormData({ name, image }) {
  const formData = new FormData();
  if (name !== undefined) formData.append("name", name);
  // Only attach the file field when there actually is one — the backend
  // treats a missing file as "leave the existing image alone" on update,
  // and as "no image" on create.
  if (image) formData.append("image", image);
  return formData;
}

export const categoryService = {
  list: () =>
    api.get("/categories").then((res) => res.categories ?? res.data ?? res),

  // payload: { name, image? } — image is an optional File from an
  // <input type="file">.
  create: (payload) => api.post("/categories", toCategoryFormData(payload)),

  update: (id, payload) =>
    api.put(`/categories/${id}`, toCategoryFormData(payload)),

  remove: (id) => api.delete(`/categories/${id}`),
};