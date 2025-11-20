import { createSlice } from "@reduxjs/toolkit";
import { LOGOUT } from "../asyncActions/logout";

const initialState = {
  compare: {
    wghtMsr: {
      name: "LB",
      value: "lb",
    },
    dimentionMsr: {
      name: "IN",
      value: "in",
    },
    customsInfo: null,
  },
  compareList: null,
  newShipment: {
    wghtMsr: {
      name: "LB",
      value: "lb",
    },
    dimentionMsr: {
      name: "IN",
      value: "in",
    },
    senderPhoneCode: { phone_code: "1", emoji: "🇨🇦" },
    receiverPhoneCode: { phone_code: "234", emoji: "🇳🇬" },
    mer: "AM",
    merEnd: "AM",
    date: new Date(Date.now()),
    dateEnd: new Date(Date.now()),
    packages: [
      {
        id: "1",
        quantity: 1,
        selectedPackage: "",
        weight: "",
        wghtMsr: {
          name: "LB",
          value: "lb",
        },
        dimentionMsr: {
          name: "IN",
          value: "in",
        },
        length: "",
        width: "",
        height: "",
        description: "",
      },
    ],
    customsInfo: null,
  },
  details: null,
  documents: null,
  sendTrack: null,
  addresses: null,
  savedPackages: null,
  showQuestionnaire: false,
  message: "",
  error: "",
  loading: false,
};

export const shippingSlice = createSlice({
  name: "shipping",
  initialState,
  reducers: {
    setCompareList: (state, action) => {
      state.compareList = action.payload;
      state.loading = false;
    },
    setCompare: (state, action) => {
      state.compare = { ...state.compare, ...action.payload };
    },
    resetCompare: (state) => {
      state.compare = initialState.compare;
    },
    updateDetails: (state, action) => {
      state.details = action.payload;
    },
    updateDocuments: (state, action) => {
      state.documents = action.payload;
    },
    updateSendTrack: (state, action) => {
      state.sendTrack = action.payload;
    },
    updateNewShipment: (state, action) => {
      state.newShipment = { ...state.newShipment, ...action.payload };
    },
    updatePackages: (state, action) => {
      state.newShipment.packages = action.payload;
    },
    updateCompareCustomsInfo: (state, action) => {
      state.compare.customsInfo = action.payload;
    },
    updateCustomsInfo: (state, action) => {
      state.newShipment.customsInfo = action.payload;
    },
    resetNewShipment: (state) => {
      state.newShipment = initialState.newShipment;
    },
    updateAddresses: (state, action) => {
      state.addresses = action.payload;
    },
    updateSavedPackages: (state, action) => {
      state.savedPackages = action.payload;
    },
    showQuestionnaire: (state, action) => {
      state.showQuestionnaire = action.payload;
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
  setCompareList,
  setCompare,
  updateDetails,
  updateDocuments,
  updateSendTrack,
  updateNewShipment,
  updatePackages,
  updateCompareCustomsInfo,
  updateCustomsInfo,
  updateAddresses,
  updateSavedPackages,
  updateMessage,
  resetNewShipment,
  resetCompare,
  isError,
  isLoading,
  showQuestionnaire,
} = shippingSlice.actions;

export default shippingSlice.reducer;
