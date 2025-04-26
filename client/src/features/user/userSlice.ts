import { RootState } from "@/app/store";
import { User, ApiResponse } from "@/types/schemaTypes";
import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  // SerializedError,
} from "@reduxjs/toolkit";
import axios from "axios";

// First parameter is a name, second is the callback.
// This createAsyncThunk returns a promise, which is handled in extraReducers.
export const createUser = createAsyncThunk<
  User,
  Partial<User>,
  { rejectValue: string; state: RootState }
>("createUser", async (data, { rejectWithValue, getState }) => {
  // let token: string | null | undefined = getState().auth.token;
  // token = token ? token : sessionStorage.getItem("token");
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2I5YTYyNzQwMzdkYWI3ZDI2NWZiOWEiLCJ1c2VyVHlwZSI6Ik9GRklDRSIsImlhdCI6MTc0NTM3NDAyNCwiZXhwIjoxNzQ1NDYwNDI0fQ.sIYhV-_wAmf_R68wqUgTKEhpIm_Kvo60EGSVxqaZL6w";

  try {
    const response = await fetch(`http://localhost:1300/user/create-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      return rejectWithValue("Failed to create user");
    }

    const result: ApiResponse<User> = await response.json();
    if (result.success) {
      return result.result; // Extract result if success
    } else {
      return rejectWithValue(result.message); // Handle API error
    }
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

// This async thunk fetches all users from the API
export const getAllUsers = createAsyncThunk<
  User[],
  void,
  { rejectValue: string; state: RootState }
>("getAllUsers", async (_, { rejectWithValue, getState }) => {
  // let token: string | null | undefined = getState().auth.token;
  // token = token ? token : sessionStorage.getItem("token");
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2I5YTYyNzQwMzdkYWI3ZDI2NWZiOWEiLCJ1c2VyVHlwZSI6Ik9GRklDRSIsImlhdCI6MTc0NTM3NDAyNCwiZXhwIjoxNzQ1NDYwNDI0fQ.sIYhV-_wAmf_R68wqUgTKEhpIm_Kvo60EGSVxqaZL6w";

  try {
    const response = await axios.get(`http://localhost:1300/user`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.data.success) {
      return rejectWithValue(response.data.message);
    }
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const updateUser = createAsyncThunk<
  User,
  { id: number; data: Partial<User> },
  { rejectValue: string; state: RootState }
>("updateUser", async ({ id, data }, { rejectWithValue, getState }) => {
  // let token: string | null | undefined = getState().auth.token;
  // token = token ? token : sessionStorage.getItem("token");
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2I5YTYyNzQwMzdkYWI3ZDI2NWZiOWEiLCJ1c2VyVHlwZSI6Ik9GRklDRSIsImlhdCI6MTc0NTM3NDAyNCwiZXhwIjoxNzQ1NDYwNDI0fQ.sIYhV-_wAmf_R68wqUgTKEhpIm_Kvo60EGSVxqaZL6w";

  try {
    const response = await fetch(
      `http://localhost:1300/user/update-user/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      return rejectWithValue("Failed to update user.");
    }

    const result: ApiResponse<User> = await response.json();
    if (result.success) {
      return result.result; // Extract result if success
    } else {
      return rejectWithValue(result.message); // Handle API error
    }
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const deleteUser = createAsyncThunk<
  User, // Return type: ID of the deleted user
  string, // Argument type: ID of the user to delete
  { rejectValue: string; state: RootState }
>("deleteUser", async (id, { rejectWithValue, getState }) => {
  // let token: string | null | undefined = getState().auth.token;
  // token = token ? token : sessionStorage.getItem("token");
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2I5YTYyNzQwMzdkYWI3ZDI2NWZiOWEiLCJ1c2VyVHlwZSI6Ik9GRklDRSIsImlhdCI6MTc0NTM3NDAyNCwiZXhwIjoxNzQ1NDYwNDI0fQ.sIYhV-_wAmf_R68wqUgTKEhpIm_Kvo60EGSVxqaZL6w";

  try {
    const response = await fetch(
      `http://localhost:1300/user/delete-user/${id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // if (!response.ok) {
    //   return rejectWithValue("Failed to delete user.");
    // }

    const result: ApiResponse<User> = await response.json();
    console.log(result);
    if (result.success) {
      return result.result; // Extract result if success
    } else {
      return rejectWithValue(result.message); // Handle API error
    }
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

interface UserState {
  users: User[];
  loading: boolean;
  error?: string; // Optional error message
}
const initialState: UserState = { users: [], loading: false };

export const userSlice = createSlice({
  name: "userDetail",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(createUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.users.push(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | undefined;
      })
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | undefined;
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        const index = state.users.findIndex(
          (user) => user._id === action.payload._id
        );
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | undefined;
      })
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.users = state.users.filter(
          (user) => user._id !== action.payload._id
        );
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | undefined;
      });
  },
  reducers: {},
});

export default userSlice.reducer;
