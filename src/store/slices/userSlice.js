import { createSlice } from "@reduxjs/toolkit";
import { LOGOUT } from "../asyncActions/logout";
// import { PURGE } from "redux-persist";

const initialState = {
  user: [],
  userInfo: [],
  setup: {},
  verified: false,
  message: "",
  error: "",
  loading: false,
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
} = userSlice.actions;

export default userSlice.reducer;
