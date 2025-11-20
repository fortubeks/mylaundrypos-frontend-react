import api from "./https";

export const RequestService = {
  // GET REQUEST
  get(endpoint) {
    const headers = {
      "Content-Type": "application/json",
    };
    return api.get(`${endpoint}`, { headers });
  },

  // GET REQUEST WITH PARAM
  getParam(endpoint, data) {
    const headers = {
      "Content-Type": "application/json",
    };
    return api.get(`${endpoint}`, {
      params: data,
      headers,
    });
  },

  // POST REQUEST
  post(endpoint, data) {
    const headers = {
      "Content-Type": "application/json",
    };
    return api.post(`${endpoint}`, data, { headers });
  },

  // POST REQUEST
  postForm(endpoint, data) {
    const headers = {
      "Content-Type": "multipart/form-data",
    };
    return api.post(`${endpoint}`, data, { headers });
  },

  // PUT REQUEST
  put(endpoint, data = null, id = null) {
    const headers = {
      "Content-Type": "application/json",
    };

    if (id !== null && data !== null) {
      return api.put(`${endpoint}/${id}`, data, { headers });
    } else if (id !== null) {
      return api.put(`${endpoint}/${id}`, null, { headers });
    } else if (data !== null) {
      return api.put(`${endpoint}`, data, { headers });
    } else {
      return api.put(`${endpoint}`, null, { headers });
    }
  },

  // DELETE REQUEST
  delete(endpoint, data = null, id = null) {
    const headers = {
      "Content-Type": "application/json",
    };

    if (id !== null && data !== null) {
      return api.delete(`${endpoint}/${id}`, { headers, data });
    } else if (id !== null) {
      return api.delete(`${endpoint}/${id}`, { headers });
    } else if (data !== null) {
      return api.delete(`${endpoint}`, { headers, data });
    } else {
      return api.delete(`${endpoint}`, { headers });
    }
  },
};
