import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  safe_height: 0,
};

export const screenSlice = createSlice({
  name: "screen",
  initialState,

  reducers: {
    setSafeHeight: (state, action) => {
      state.safe_height = action.payload;
    },
  },
});

export const { setSafeHeight } = screenSlice.actions;

export default screenSlice.reducer;
