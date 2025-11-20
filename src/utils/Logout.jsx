
import { logout } from "../store/asyncActions/logout";
import { store } from "../store/store";
import storage from "redux-persist/lib/storage";
import toast from "./Toast";

export async function Logout(msg) {
  store.dispatch(logout());
  const keysToRemove = [
    "persist:root",
    "persist:user",
  ];

  keysToRemove.forEach((key) => storage.removeItem(key));
  toast.success(msg);

  localStorage.clear();

  window.history.replaceState(null, "", "/");

  window.location.href = '/';
  return;
}
