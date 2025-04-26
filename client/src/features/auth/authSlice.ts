import { RootState } from "@/app/store";
import { User } from "@/types/schemaTypes";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// void,
export const loginUser = createAsyncThunk<
  { token: string; user: User },
  { mobile?: string; password: string },
  { rejectValue: string; state: RootState }
>("loginUser", async (loginData, { rejectWithValue }) => {
  try {
    const response = await axios.post(
      "http://localhost:1300/user/login",
      loginData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    if (response.data.success) {
      sessionStorage.setItem("token", response.data.token);
      sessionStorage.setItem("user", JSON.stringify(response.data.data));
      setToken(response.data.token);
      return { token: response.data.token, user: response.data.data };
    } else return rejectWithValue(response.data.message);
  } catch (error: any) {
    console.log(error.response.data.message);
    return rejectWithValue(error.response.data.message);
  }
});

// Define initial state
interface AuthState {
  token?: string;
  user?: User;
  loading: boolean;
  error?: string;
}
const initialState: AuthState = { loading: false };

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    logout: (state) => {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");

      window.location.href = "/login";

      state.token = undefined;
      state.user = undefined;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        // state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | undefined;
      });
  },
});

export const { setToken, logout } = authSlice.actions;
export default authSlice.reducer;
