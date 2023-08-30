import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  login: false,

  profile_data: {},

  profile_approved: true,
  profile_refresh: false,

  is_promptsfillingstarted: false,
  is_promptsfillingcomplete: false,
  is_session_expired: false,
  is_profile_revealed: false,
  is_socket_closed: true,
  active_user_location_details: {
    mobile: "",

    longitude: "",

    latitude: "",

    location: "",

    action: "",

    ip: "",
  },

  user_loggined: false,

  access_token: "",
  statusBarArg: { backgroundColor: "#fff", barStyle: "dark-content" },

  profile_imgs: [
    ["", "", true, "1", ""],
    ["", "", true, "2", ""],
    ["", "", true, "3", ""],
    ["", "", true, "4", ""],
    ["", "", true, "5", ""],
    ["", "", true, "6", ""],
    ["", "", true, "7", ""],
    ["", "", true, "8", ""],
    ["", "", true, "9", ""],
  ],

  csignup_screen: "MobileNo",
};

export const authenticationSlice = createSlice({
  name: "authenticate",

  initialState,

  reducers: {
    setLogin: (state, action) => {
      state.login = action.payload;
    },

    setProfileRefresh: (state, action) => {
      state.profile_refresh = action.payload;
    },

    setProfileApproved: (state, action) => {
      state.profile_approved = action.payload;
    },

    setProfiledata: (state, action) => {
      state.profile_data = action.payload;
    },

    setProfileImgs: (state, action) => {
      state.profile_imgs = action.payload;
    },

    setActiveUserLocationDetails: (state, action) => {
      state.active_user_location_details = action.payload;
    },

    setAccessToken: (state, action) => {
      state.access_token = action.payload;
    },

    setStatusBarArgs: (state, action) => {
      state.statusBarArg = action.payload;
    },

    setUserLoggined: (state, action) => {
      state.user_loggined = action.payload;
    },

    setPromptFillingStart: (state, action) => {
      state.is_promptsfillingstarted = action.payload;
    },

    setPromptFillingComplete: (state, action) => {
      state.is_promptsfillingcomplete = action.payload;
    },

    setProfileRevealed: (state, action) => {
      state.is_profile_revealed = action.payload;
    },

    setSocketClose: (state, action) => {
      state.is_socket_closed = action.payload;
    },

    setSessionExpired: (state, action) => {
      state.is_session_expired = action.payload;
    },
  },
});

export const {
  setLogin,
  setProfiledata,
  setSocketClose,
  setSessionExpired,
  setProfileRefresh,
  setProfileRevealed,
  setProfileApproved,
  setActiveUserLocationDetails,
  setAccessToken,
  setStatusBarArgs,
  setProfileImgs,
  setUserLoggined,
  setPromptFillingStart,
  setPromptFillingComplete,
} = authenticationSlice.actions;

export default authenticationSlice.reducer;
