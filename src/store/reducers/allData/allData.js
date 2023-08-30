import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  all_genders: [],
  all_languages: [],
  all_interests: [],
  all_prompts: [],
};

export const allDataSlice = createSlice({
  name: "allData",

  initialState,

  reducers: {
    setAllGenders: (state, action) => {
      state.all_genders = action.payload;
    },
    setAllLanguges: (state, action) => {
      state.all_languages = action.payload;
    },
    setAllInterests: (state, action) => {
      state.all_interests = action.payload;
    },
    setAllPrompts: (state, action) => {
      state.all_prompts = action.payload;
    },
  },
});

export const { setAllGenders, setAllLanguges, setAllInterests, setAllPrompts } =
  allDataSlice.actions;

export default allDataSlice.reducer;
