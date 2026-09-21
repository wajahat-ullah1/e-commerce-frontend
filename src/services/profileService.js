import { api } from "./api";

export const profileService = {
  get: () => api.get("/users/profile").then((res) => res.user),
  update: (payload) => api.put("/users/profile", payload).then((res) => res.user),
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append("image", file);
    return api.put("/users/profile/image", formData).then((res) => res.user);
  },
  changePassword: (currentPassword, newPassword) =>
    api.put("/users/change-password", { currentPassword, newPassword }),
};