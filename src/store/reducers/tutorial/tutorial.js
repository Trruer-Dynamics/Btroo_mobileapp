import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  swipe_tut: true,
  match_tut: true,
  chat_tut: true,
  chat_reveal_tut: true,
  repeat_tut: false,
};

export const tutorialSlice = createSlice({
  name: "tutorial",
  initialState,
  reducers: {
    setSwipeTut: (state, action) => {
      state.swipe_tut = action.payload;
    },
    setMatchTut: (state, action) => {
      state.match_tut = action.payload;
    },
    setChatTut: (state, action) => {
      state.chat_tut = action.payload;
    },
    setChatRevealTut: (state, action) => {
      state.chat_reveal_tut = action.payload;
    },
    setRepeatTut: (state, action) => {
      state.repeat_tut = action.payload;
    },
  },
});

export const { setSwipeTut, setMatchTut, setChatTut, setChatRevealTut,setRepeatTut } =
  tutorialSlice.actions;

export default tutorialSlice.reducer;
