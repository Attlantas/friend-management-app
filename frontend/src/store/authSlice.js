import { createSlice } from "@reduxjs/toolkit";

const userJson = localStorage.getItem("user") || sessionStorage.getItem("user");
const user = userJson ? JSON.parse(userJson) : null;

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: localStorage.getItem("token") || sessionStorage.getItem("token") || null,
    user: user || null,
    loading: false,
    error: null,
    isRegistering: false,
    registrationSuccess: false
  },
  reducers: {
    loginRequest: (state) => { state.loading = true; },
    loginSuccess: (state, action) => {
      const { token, user, rememberMe } = action.payload;
      state.loading = false;
      state.token = token;
      state.user = user;
      if (rememberMe) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("user", JSON.stringify(user));
      }
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
    },
    registerRequest: (state) => {
      state.isRegistering = true;
      state.registrationSuccess = false;
    },
    registerSuccess: (state, action) => {
      state.isRegistering = false;
      state.registrationSuccess = true;
      state.user = action.payload.user;
    },
    registerFailure: (state, action) => {
      state.isRegistering = false;
      state.registrationSuccess = false;
      state.error = action.payload;
    },
  },
});

export const { loginRequest, loginSuccess, loginFailure, logout, registerRequest, registerSuccess, registerFailure } = authSlice.actions;
export default authSlice.reducer;
