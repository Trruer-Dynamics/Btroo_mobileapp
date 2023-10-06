import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chats_msgs: [],
  drafts_msgs: [],
  matches: [],
  matches_imgs: [],
  icebreakers: [],
  rvl_time: false,
};

export const chatsSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    setChatMsgs: (state, action) => {
      state.chats_msgs = action.payload;
    },
    setDraftMsgs: (state, action) => {
      state.drafts_msgs = action.payload;
    },
    setMatches: (state, action) => {
      state.matches = action.payload;
    },
    setMatchesImgs: (state, action) => {
      state.matches_imgs = action.payload;
    },
    setIceBreakers: (state, action) => {
      state.icebreakers = action.payload;
    },
    
  },
});

export const { setChatMsgs, setDraftMsgs, setMatches, setIceBreakers,setMatchesImgs } =
  chatsSlice.actions;

export default chatsSlice.reducer;
