import api from "./https";
import { store } from "../store/store";
import {
  setNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  removeNotification,
  setNotificationLoading,
} from "../store/slices/notificationSlice";

export const NotificationService = {
  async fetchNotifications() {
    store.dispatch(setNotificationLoading(true));
    try {
      const res = await api.get("/notifications");
      store.dispatch(setNotifications(res.data.data));
      return res.data.data;
    } finally {
      store.dispatch(setNotificationLoading(false));
    }
  },

  async markRead(id) {
    store.dispatch(markNotificationRead(id));
    await api.put(`/notifications/${id}/read`);
  },

  async markAllRead() {
    store.dispatch(markAllNotificationsRead());
    await api.put("/notifications/read-all");
  },

  async deleteNotification(id) {
    store.dispatch(removeNotification(id));
    await api.delete(`/notifications/${id}`);
  },

  async updateEmailPreference(type, enabled) {
    const payload =
      type === "order"
        ? { order_email_notifications: enabled }
        : { booking_email_notifications: enabled };
    const res = await api.put(
      "/user/settings/notification-preferences",
      payload,
    );
    return res.data.data;
  },
};
