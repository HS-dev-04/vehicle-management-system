import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  email: "",
};

const authResetSlice = createSlice({
  name: "authReset",
  initialState,
  reducers: {
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    clearEmail: (state) => {
      state.email = "";
    },
  },
});

export const { setEmail, clearEmail } = authResetSlice.actions;
export default authResetSlice.reducer;
