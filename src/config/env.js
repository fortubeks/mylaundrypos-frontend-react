const DEFAULT_API_BASE_URL = import.meta.env.DEV
  ? "http://127.0.0.1:8000/api"
  : "https://api.mylaundrypos.com/api";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL;

export const IMAGE_BASE_URL =
  import.meta.env.VITE_API_IMAGE_BASE_URL ||
  `${API_BASE_URL.replace(/\/api\/?$/, "")}/storage/`;

export const FRONTEND_BASE_URL =
  import.meta.env.VITE_FRONTEND_BASE_URL ||
  import.meta.env.VITE_APP_BASE_URL ||
  window.location.origin;

export const APP_BASE_URL =
  FRONTEND_BASE_URL;
