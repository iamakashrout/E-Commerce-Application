import { createSlice } from "@reduxjs/toolkit";

interface ThemeState {
  darkMode: boolean;
}

const initialState: ThemeState = {
  darkMode: false,
};

const Slice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
    setDarkMode: (state, action) => {
      state.darkMode = action.payload;
    },
  },
});

export const { toggleDarkMode, setDarkMode } = Slice.actions;
export default Slice.reducer;
