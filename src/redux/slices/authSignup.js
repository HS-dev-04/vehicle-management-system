import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  user: {
    name: "",
    email: "",
    password: "",
    address: "",
    contact: "",
    role: "user",
  },
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signup: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    login: (state) => {
      state.isAuthenticated = true;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = initialState.user;
      state.isAuthenticated = false;
    },
  },
});

export const { signup, login, logout, setUser } = authSlice.actions;
export default authSlice.reducer;
