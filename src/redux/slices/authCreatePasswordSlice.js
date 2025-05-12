import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  password: "",
  confirmPassword: "",
};

const authCreatePasswordSlice = createSlice({
  name: "authCreatePassword",
  initialState,
  reducers: {
    setPasswords: (state, action) => {
      state.password = action.payload.password;
      state.confirmPassword = action.payload.confirmPassword;
    },
  },
});

export const { setPasswords } = authCreatePasswordSlice.actions;
export default authCreatePasswordSlice.reducer;
