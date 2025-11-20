import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import thunk from "redux-thunk";
import userSlice from "./slices/userSlice";
import shippingSlice from "./slices/shippingSlice";
import generalSlice from "./slices/generalSlice";
// import subscriptionSlice from "./slices/subscriptionSlice";
import { LOGOUT } from "./asyncActions/logout";

const rootReducer = combineReducers({
  user: userSlice,
  shipping: shippingSlice,
  general: generalSlice,
  // subscription: subscriptionSlice,
});

const appReducer = (state, action) => {
  if (action.type === LOGOUT) {
    // Clear all persisted states
    Object.keys(state).forEach((key) => {
      storage.removeItem(`persist:${key}`);
    });
    state = undefined;
  }
  return rootReducer(state, action);
};

// Persist config for root reducer
const rootPersistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "shipping", "general"],
};

const persistedReducer = persistReducer(rootPersistConfig, appReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk],
});
