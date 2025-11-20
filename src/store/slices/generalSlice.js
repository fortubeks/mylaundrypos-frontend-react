import { createSlice } from "@reduxjs/toolkit";
import { LOGOUT } from "../asyncActions/logout";
// import { PURGE } from "redux-persist";

const initialState = {
  swiper: null,
  currentIndex: 0,
  sidebar: false,
  disableSidebar: false,
  showNotification: false,
  showSearch: false,
  countries: [],
};
export const generalSlice = createSlice({
  name: "general",
  initialState,
  reducers: {
    setSwiper: (state, action) => {
      state.swiper = action.payload;
    },
    setCurrentIndex: (state, action) => {
      state.currentIndex = action.payload;
    },
    setSidebar: (state, action) => {
      state.sidebar = action.payload;
    },
    setDisableSidebar: (state, action) => {
      state.disableSidebar = action.payload;
    },
    setShowNotification: (state, action) => {
      state.showNotification = action.payload;
    },
    setShowSearch: (state, action) => {
      state.showSearch = action.payload;
    },
    setCountries: (state, action) => {
      state.countries = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(LOGOUT, () => initialState);
  },
});

export const {
  setSwiper,
  setCurrentIndex,
  setSidebar,
  setDisableSidebar,
  setShowNotification,
  setShowSearch,
  setCountries,
} = generalSlice.actions;

export default generalSlice.reducer;
