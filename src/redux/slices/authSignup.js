import { createSlice } from "@reduxjs/toolkit";
import { db } from "../../../public/Firebase";
import { collection } from "firebase/firestore";
import { addDoc } from "firebase/firestore"; 
const initialState = {
    user: {
        name: '',
        email: '',
        password: '',
        address: '',
        contact: '',
        role: 'user' 
    },
    isAuthenticated: false
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        signup: (state, action) => {
            state.user = action.payload;
        },
        login: (state) => {
            state.isAuthenticated = true;
        },
        // logout: (state) => {
        //     state.user = initialState.user;
        //     state.isAuthenticated = false;
        // }
    }
})

export const { signup, login, logout } = authSlice.actions;
export const signupAsync = (userData) => async (dispatch) => {
  try {
    console.log("Attempting to add document to Firestore...");
    const docRef = await addDoc(collection(db, "users"), {
      ...userData,
      createdAt: new Date(),
    });
    console.log("Document written with ID: ", docRef.id); // Success log
    dispatch(signup(userData));
  } catch (error) {
    console.error("Full error details:", {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
  }
};

export default authSlice.reducer;
