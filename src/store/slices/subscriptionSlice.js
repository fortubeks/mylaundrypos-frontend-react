import { createSlice } from "@reduxjs/toolkit";
// import { PURGE } from "redux-persist";
import { LOGOUT } from "../asyncActions/logout";

const initialState = {
  sub: null,
  subscription: null,
  openSub: false,
  message: "",
  error: "",
  loading: false,
};

export const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {
    updateSub: (state, action) => {
      state.sub = action.payload;
    },
    updateSubscription: (state, action) => {
      state.subscription = action.payload;
    },
    setOpenSub: (state, action) => {
      state.openSub = action.payload;
    },
    updateMessage: (state, action) => {
      state.message = action.payload;
      state.loading = false;
    },
    isError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    isLoading: (state) => {
      state.loading = true;
    },

    purge: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(LOGOUT, () => initialState);
  },
});

export const {
  updateSubscription,
  updateSub,
  setOpenSub,
  updateMessage,
  isError,
  isLoading,
} = subscriptionSlice.actions;

export default subscriptionSlice.reducer;
