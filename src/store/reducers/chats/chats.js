import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chats_msgs: [],
  drafts_msgs: [],
  matches: [],
  icebreakers: [],
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
    setIceBreakers: (state, action) => {
      state.icebreakers = action.payload;
    },
  },
});

export const { setChatMsgs, setDraftMsgs, setMatches, setIceBreakers } =
  chatsSlice.actions;

export default chatsSlice.reducer;
