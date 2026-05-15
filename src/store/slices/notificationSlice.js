import { createSlice } from "@reduxjs/toolkit";
import { LOGOUT } from "../asyncActions/logout";

const initialState = {
  notifications: [],
  unreadCount: 0,
  panelOpen: false,
  loading: false,
};

export const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotifications: (state, action) => {
      state.notifications = action.payload.notifications;
      state.unreadCount = action.payload.unread_count;
    },
    setNotificationPanelOpen: (state, action) => {
      state.panelOpen = action.payload;
    },
    markNotificationRead: (state, action) => {
      const id = action.payload;
      const n = state.notifications.find((n) => n.id === id);
      if (n && !n.read_at) {
        n.read_at = new Date().toISOString();
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllNotificationsRead: (state) => {
      state.notifications.forEach((n) => {
        if (!n.read_at) n.read_at = new Date().toISOString();
      });
      state.unreadCount = 0;
    },
    removeNotification: (state, action) => {
      const id = action.payload;
      const n = state.notifications.find((n) => n.id === id);
      if (n && !n.read_at) {
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
      state.notifications = state.notifications.filter((n) => n.id !== id);
    },
    setNotificationLoading: (state, action) => {
      state.loading = action.payload;
    },
    prependNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      if (!action.payload.read_at) {
        state.unreadCount += 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(LOGOUT, () => initialState);
  },
});

export const {
  setNotifications,
  setNotificationPanelOpen,
  markNotificationRead,
  markAllNotificationsRead,
  removeNotification,
  setNotificationLoading,
  prependNotification,
} = notificationSlice.actions;

export default notificationSlice.reducer;
