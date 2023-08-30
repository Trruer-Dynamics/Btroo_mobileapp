import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selected_distance: 200,
  selected_languages: [],
  selected_age_range: [18, 100],
  selected_height_range: [60, 270],
  selected_interests: [],
  selected_habits: [0, 0, 0],
};

export const filterSlice = createSlice({
  name: "filter",

  initialState,
  reducers: {
    setSelectedDistance: (state, action) => {
      state.selected_distance = action.payload;
    },
    setSelectedLanguages: (state, action) => {
      state.selected_languages = action.payload;
    },
    setSelectedAgeRange: (state, action) => {
      state.selected_age_range = action.payload;
    },
    setSelectedHeightRange: (state, action) => {
      state.selected_height_range = action.payload;
    },
    setSelectedInterests: (state, action) => {
      state.selected_interests = action.payload;
    },
    setSelectedHabits: (state, action) => {
      state.selected_habits = action.payload;
    },
  },
});

export const {
  setSelectedDistance,
  setSelectedLanguages,
  setSelectedAgeRange,
  setSelectedHeightRange,
  setSelectedInterests,
  setSelectedHabits,
} = filterSlice.actions;

export default filterSlice.reducer;
