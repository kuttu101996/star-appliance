import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../app/store.js";
import { Parts } from "../../types/schemaTypes.js";

const baseURL = "http://localhost:1300/part";

export const getAllParts = createAsyncThunk<
  Parts[],
  void,
  { rejectValue: string; state: RootState }
>("getAllParts", async (_, { rejectWithValue, getState }) => {
  //   let token: string | null | undefined = getState().auth.token;
  //   token = token ? token : sessionStorage.getItem("token");
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2I5YTYyNzQwMzdkYWI3ZDI2NWZiOWEiLCJ1c2VyVHlwZSI6Ik9GRklDRSIsImlhdCI6MTc0NTM3NDAyNCwiZXhwIjoxNzQ1NDYwNDI0fQ.sIYhV-_wAmf_R68wqUgTKEhpIm_Kvo60EGSVxqaZL6w";

  try {
    const response = await axios.get(`${baseURL}/all-parts`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // console.log("Parts list ", response.data);
    if (!response.data.success) return rejectWithValue(response.data.message);

    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const createNewPart = createAsyncThunk<
  Parts,
  {
    itemName: string;
    itemCode: string;
    description?: string;
    costPrice: number;
    internalSellingPrice: number;
    externalSellingPrice: number;
  },
  { rejectValue: string; state: RootState }
>("createNewPart", async (data, { rejectWithValue, getState }) => {
  //   let token: string | null | undefined = getState().auth.token;
  //   token = token ? token : sessionStorage.getItem("token");
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2I5YTYyNzQwMzdkYWI3ZDI2NWZiOWEiLCJ1c2VyVHlwZSI6Ik9GRklDRSIsImlhdCI6MTc0NTM3NDAyNCwiZXhwIjoxNzQ1NDYwNDI0fQ.sIYhV-_wAmf_R68wqUgTKEhpIm_Kvo60EGSVxqaZL6w";

  try {
    const response = await axios.post(`${baseURL}/new-part`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Response - ", response.data);
    if (!response.data.success) return rejectWithValue(response.data.message);

    return response.data.data;
  } catch (error: any) {
    console.log("Catch -  ", error.response.data);
    return rejectWithValue(error.message);
  }
});

interface StateType {
  parts: Parts[];
  loading: boolean;
  error?: string;
}

const initialState: StateType = {
  parts: [],
  loading: false,
};

const partsSlice = createSlice({
  name: "PartsSlice",
  initialState: initialState,
  extraReducers(builder) {
    builder
      .addCase(getAllParts.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(getAllParts.fulfilled, (state, action) => {
        state.loading = false;
        state.parts = action.payload;
      })
      .addCase(getAllParts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | undefined;
      })
      .addCase(createNewPart.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(createNewPart.fulfilled, (state, action) => {
        state.loading = false;
        state.parts.push(action.payload);
      })
      .addCase(createNewPart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | undefined;
      });
  },
  reducers: {},
});

export default partsSlice.reducer;
