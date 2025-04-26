import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../app/store.js";
import { ServiceRecord } from "../../types/schemaTypes.js";

const baseURL = "http://localhost:1300/service";

export const getAllServiceRecords = createAsyncThunk<
  ServiceRecord[],
  void,
  { rejectValue: string; state: RootState }
>("getAllServiceRecords", async (_, { rejectWithValue, getState }) => {
  // let token: string | null | undefined = getState().auth.token;
  // token = token ? token : sessionStorage.getItem("token");
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2I5YTYyNzQwMzdkYWI3ZDI2NWZiOWEiLCJ1c2VyVHlwZSI6Ik9GRklDRSIsImlhdCI6MTc0NTM3NDAyNCwiZXhwIjoxNzQ1NDYwNDI0fQ.sIYhV-_wAmf_R68wqUgTKEhpIm_Kvo60EGSVxqaZL6w";

  try {
    const response = await axios.get(`${baseURL}/all-records`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.data.success)
      return rejectWithValue("Failed to update service request.");

    return response.data.data; // Extract result if success
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const getServiceReqAllRecord = createAsyncThunk<
  ServiceRecord[],
  string,
  { rejectValue: string; state: RootState }
>("getServiceReqAllRecord", async (id, { rejectWithValue, getState }) => {
  // let token: string | null | undefined = getState().auth.token;
  // token = token ? token : sessionStorage.getItem("token");
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2I5YTYyNzQwMzdkYWI3ZDI2NWZiOWEiLCJ1c2VyVHlwZSI6Ik9GRklDRSIsImlhdCI6MTc0NTM3NDAyNCwiZXhwIjoxNzQ1NDYwNDI0fQ.sIYhV-_wAmf_R68wqUgTKEhpIm_Kvo60EGSVxqaZL6w";

  try {
    const response = await axios.get(
      `${baseURL}/service-request/${id}/all-records`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!response.data.success) {
      return rejectWithValue("Failed to update service request.");
    }

    return response.data.data; // Extract result if success
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

interface StateType {
  serviceRecords: ServiceRecord[];
  loading: boolean;
  error?: string;
}

const initialState: StateType = { serviceRecords: [], loading: false };

const serviceRecordSlice = createSlice({
  name: "ServiceRecordSlice",
  initialState: initialState,
  extraReducers(builder) {
    builder
      .addCase(getAllServiceRecords.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(getAllServiceRecords.fulfilled, (state, action) => {
        state.loading = false;
        state.serviceRecords = action.payload;
      })
      .addCase(getAllServiceRecords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | undefined;
      })
      .addCase(getServiceReqAllRecord.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(getServiceReqAllRecord.fulfilled, (state, action) => {
        state.loading = false;
        state.serviceRecords.push(...action.payload);
      })
      .addCase(getServiceReqAllRecord.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | undefined;
      });
  },
  reducers: {},
});

export default serviceRecordSlice.reducer;
