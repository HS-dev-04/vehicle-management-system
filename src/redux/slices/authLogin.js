import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  email: "",
  password: "",
};

const authLoginSlice = createSlice({
  name: "authLogin",
  initialState,
  reducers: {
    updateLoginData: (state, action) => {
      state.email =
        action.payload.email !== undefined ? action.payload.email : state.email;
      state.password =
        action.payload.password !== undefined
          ? action.payload.password
          : state.password;
    },
  },
});

export const { updateLoginData } = authLoginSlice.actions;
export default authLoginSlice.reducer;
