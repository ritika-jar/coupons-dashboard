import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../index";

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

const refreshToken =
  typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null;
const accessToken =
  typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

const initialState: AuthState = {
  token: accessToken,
  refreshToken: refreshToken,
  isAuthenticated: !!accessToken,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      {
        payload: { token, refreshToken },
      }: PayloadAction<{ token: string; refreshToken?: string }>
    ) => {
      if (token && token !== "undefined") {
        state.token = token;
        state.isAuthenticated = true;
        localStorage.setItem("accessToken", token);
      }
      if (refreshToken && refreshToken !== "undefined") {
        state.refreshToken = refreshToken;
        localStorage.setItem("refreshToken", refreshToken);
      }
    },
    logout: (state) => {
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;

export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
