import api from "./https";

export const SubscriptionService = {
  async getPlans() {
    const response = await api.get("/subscription/plans");
    return response.data.data;
  },

  async getStatus() {
    const response = await api.get("/subscription/status");
    return response.data.data;
  },

  /**
   * Initialize Paystack payment for a plan.
   * Returns { access_code, reference }.
   */
  async initializePayment(plan) {
    const response = await api.post("/subscription/initialize", { plan });
    return response.data.data;
  },

  /**
   * Verify payment after Paystack popup completes.
   * Returns { subscription, has_premium, is_active }.
   */
  async verifyPayment(reference) {
    const response = await api.post("/subscription/verify", { reference });
    return response.data.data;
  },
};
