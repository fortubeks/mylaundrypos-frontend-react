import api from "./https";

export const AuthService = {
  login(data) {
    const headers = {
      "Content-Type": "application/json",
    };
    return api.post(`/login`, data, { headers });
  },

  register(data) {
    const headers = {
      "Content-Type": "application/json",
    };
    return api.post(`/register`, data, { headers });
  },

  resendVerificationEmail(data) {
    const headers = {
      "Content-Type": "application/json",
    };
    return api.post(`/resend-verification-email`, data, { headers });
  },

  verifyEmail(data) {
    const headers = {
      "Content-Type": "application/json",
    };
    return api.post(`/verify-email`, data, { headers });
  },

  initiatePasswordReset(data) {
    const headers = {
      "Content-Type": "application/json",
    };
    return api.post(`/forgot-password`, data, { headers });
  },

  resetPassword(data) {
    const headers = {
      "Content-Type": "application/json",
    };
    return api.post(`/reset-password`, data, { headers });
  },
  
  resendOtp(data) {
    const headers = {
      "Content-Type": "application/json",
    };
    return api.post(`/resend-otp`, data, { headers });
  }
};
