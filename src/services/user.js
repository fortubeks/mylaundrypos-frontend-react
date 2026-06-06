import api from "./https";
import { store } from "../store/store";
import { updateUser } from "../store/slices/userSlice";

export const UserService = {
  async getUser() {
    const headers = {
      "Content-Type": "application/json",
    };
    const response = await api.get(`/user`, { headers });
    store.dispatch(updateUser(response.data.data));
    return response.data.data;
  },

  async updateUser(data) {
    const headers = {
      "Content-Type": "application/json",
    };
    const response = await api.put(`/user`, data, { headers });
    await this.getUser();
    return response.data.data || response.data;
  },

  async deleteAccount() {
    const headers = {
      "Content-Type": "application/json",
    };
    const response = await api.delete(`/user`, { headers });
    return response.data.data || response.data;
  },

  async changePassword(data) {
    const headers = {
      "Content-Type": "application/json",
    };
    const response = await api.put(`/user/change-password`, data, {
      headers,
    });
    return response.data.data || response.data;
  }
};
