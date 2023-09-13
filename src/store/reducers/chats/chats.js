import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chats_msgs : [],
  drafts_msgs : []
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
  },
});

export const {
  setChatMsgs,
  setDraftMsgs
} = chatsSlice.actions;

export default chatsSlice.reducer;
