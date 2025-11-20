
import { logout } from "../store/asyncActions/logout";
import { store } from "../store/store";
import storage from "redux-persist/lib/storage";
import { getAuth, signOut } from "firebase/auth";
import { app } from "../../firebase";
import toast from "./Toast";

export async function Logout(msg) {
  store.dispatch(logout());
  const keysToRemove = [
    "persist:root",
    "persist:user",
    "persist:shipping",
    // "persist:subscription",
  ];

  keysToRemove.forEach((key) => storage.removeItem(key));
  toast.success(msg);

  localStorage.clear();

  const auth = getAuth(app);
  await signOut(auth);

  window.history.replaceState(null, "", "/");

  window.location.href = '/';
  return;
}
