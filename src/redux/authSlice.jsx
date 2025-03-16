import { createSlice } from "@reduxjs/toolkit";

// Get stored login data from localStorage
const storedUser = JSON.parse(localStorage.getItem("user")) || null;
const storedRole = localStorage.getItem("role") || "guest";

const authSlice = createSlice({
  name: "auth",
  initialState: { user: storedUser, role: storedRole },
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user;
      state.role = action.payload.role;
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("role", action.payload.role);
    },
    logout: (state) => {
      state.user = null;
      state.role = "guest";
      localStorage.removeItem("user");
      localStorage.removeItem("role");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
