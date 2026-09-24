import { api } from "./api";

export const authService = {
  login: (email, password, guestCartId) =>
    api.post("/auth/login", { email, password, guestCartId }, { auth: false }),

  register: (payload) => api.post("/auth/register", payload, { auth: false }),

  forgotPassword: (email) =>
    api.post("/auth/forgot-password", { email }, { auth: false }),

  resetPassword: (token, password) =>
    api.post(`/auth/reset-password/${token}`, { password }, { auth: false }),

  logout: () => api.post("/auth/logout", {}),

  registerFromGuestOrder: (payload) =>
    api.post("/auth/register-from-order", payload, { auth: false }),
};
