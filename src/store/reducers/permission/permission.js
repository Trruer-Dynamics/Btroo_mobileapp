import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  location_perm: false,
  notification_perm: false,
};

export const permissionSlice = createSlice({
  name: "permission",

  initialState,

  reducers: {
    setLocationPermission: (state, action) => {
      state.location_perm = action.payload;
    },
    setNotificationPermission: (state, action) => {
      state.notification_perm = action.payload;
    },
  },
});

export const { setLocationPermission, setNotificationPermission } =
  permissionSlice.actions;

export default permissionSlice.reducer;
