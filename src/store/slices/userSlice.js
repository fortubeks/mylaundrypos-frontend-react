import { createSlice } from "@reduxjs/toolkit";
import { LOGOUT } from "../asyncActions/logout";
// import { PURGE } from "redux-persist";

const initialState = {
  user: [],
  userInfo: [],
  setup: {},
  businessInfoComplete: false,
  verified: false,
  message: "",
  error: "",
  loading: false,
  subscription: null, // { plan, status, has_premium, is_active, ends_at }
  subscriptionLoading: false,
};
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUser: (state, action) => {
      state.user = action.payload;
    },
    updateUserInfo: (state, action) => {
      state.userInfo = { ...state.userInfo, ...action.payload };
    },
    updateSetup: (state, action) => {
      state.setup = { ...state.setup, ...action.payload };
    },
    clearSetup: (state) => {
      state.setup = {};
    },
    updateMessage: (state, action) => {
      state.message = action.payload;
    },
    isError: (state, action) => {
      state.error = action.payload;
    },
    isLoading: (state, action) => {
      state.loading = action.payload;
    },
    isVerified: (state, action) => {
      state.verified = action.payload;
    },
    updateBusinessInfoComplete: (state, action) => {
      state.businessInfoComplete = action.payload;
    },
    updateSubscription: (state, action) => {
      state.subscription = action.payload;
    },
    setSubscriptionLoading: (state, action) => {
      state.subscriptionLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(LOGOUT, () => initialState);
  },
});

export const {
  updateUser,
  updateUserInfo,
  updateSetup,
  clearSetup,
  updateMessage,
  isError,
  isLoading,
  isVerified,
  updateBusinessInfoComplete,
  updateSubscription,
  setSubscriptionLoading,
} = userSlice.actions;

export default userSlice.reducer;
