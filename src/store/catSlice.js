import { createSlice } from "@reduxjs/toolkit";
export const catSlice = createSlice({
  name: "cats",
  initialState: {
    cats: [],
    isLoading: false,
  },
  reducers: {
    getCatsFetch: (state) => {
      console.log("catSlice: getCatsFetch");
      state.isLoading = true;
    },
    getCatsSuccess: (state, action) => {
      console.log("catSlice: getCatsSuccess");
      state.cats = action.payload;
      state.isLoading = false;
    },
    getCatsFailuer: (state) => {
      state.isLoading = false;
    },
  },
});

export const { getCatsFetch, getCatsSuccess, getCatsFailuer } =
  catSlice.actions;

export default catSlice.reducer;
