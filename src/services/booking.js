import api from "./https";
import axios from "axios";

// A separate axios instance without auth header for public routes
const publicApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const PublicService = {
  async getLaundry(slug) {
    const res = await publicApi.get(`/public/${slug}`);
    return res.data.data;
  },

  async getServices(slug) {
    const res = await publicApi.get(`/public/${slug}/services`);
    return res.data.data;
  },

  async createBooking(slug, data) {
    const res = await publicApi.post(`/public/${slug}/bookings`, data);
    return res.data.data;
  },
};

export const BookingService = {
  async getBookings(params = {}) {
    const res = await api.get(`/bookings`, { params });
    return res.data.data;
  },

  async getBooking(id) {
    const res = await api.get(`/bookings/${id}`);
    return res.data.data;
  },

  async confirmBooking(id) {
    const res = await api.put(`/bookings/${id}/confirm`);
    return res.data.data;
  },

  async cancelBooking(id) {
    const res = await api.put(`/bookings/${id}/cancel`);
    return res.data.data;
  },

  async convertToOrder(id) {
    const res = await api.post(`/bookings/${id}/convert`);
    return res.data.data;
  },

  async getLandingPage() {
    const res = await api.get(`/laundry/landing-page`);
    return res.data.data;
  },

  async updateLandingPage(data) {
    const res = await api.put(`/laundry/landing-page`, data);
    return res.data.data;
  },

  async uploadCoverImage(file) {
    const formData = new FormData();
    formData.append("cover_image", file);
    const res = await api.post(`/laundry/cover-image`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data;
  },

  async uploadLogo(file) {
    const formData = new FormData();
    formData.append("logo", file);
    const res = await api.post(`/laundry/logo`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data;
  },
};
