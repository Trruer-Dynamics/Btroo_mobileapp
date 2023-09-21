import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  safe_height: 0,
  current_screen: "",
};

export const screenSlice = createSlice({
  name: "screen",
  initialState,
  reducers: {
    setSafeHeight: (state, action) => {
      state.safe_height = action.payload;
    },
    setCurrentScreen: (state, action) => {
      state.current_screen = action.payload;
    },
  },
});

export const { setSafeHeight, setCurrentScreen } = screenSlice.actions;

export default screenSlice.reducer;
