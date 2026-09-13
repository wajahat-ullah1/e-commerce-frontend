import { api } from "./api";

export const authService = {
  login: (email, password) =>
    api.post("/auth/login", { email, password }, { auth: false }),

  register: (payload) => api.post("/auth/register", payload, { auth: false }),

  forgotPassword: (email) =>
    api.post("/auth/forgot-password", { email }, { auth: false }),

  resetPassword: (token, password) =>
    api.post(`/auth/reset-password/${token}`, { password }, { auth: false }),

  logout: () => api.post("/auth/logout", {}),
};
