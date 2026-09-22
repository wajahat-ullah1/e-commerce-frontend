import { api } from "./api";

export const notificationService = {
  list: () => api.get("/notifications").then((res) => res.notifications),
  unreadCount: () => api.get("/notifications/unread-count").then((res) => res.unreadCount),
  markRead: (id) => api.put(`/notifications/${id}/read`).then((res) => res.notification),
  remove: (id) => api.delete(`/notifications/${id}`),
  clearAll: () => api.delete('/notifications')
};