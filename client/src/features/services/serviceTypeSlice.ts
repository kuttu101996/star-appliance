import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../app/store.js";
import { ServiceType } from "../../types/schemaTypes.js";

const baseURL = "http://localhost:1300/service";

export const getAllServiceTypes = createAsyncThunk<
  ServiceType[],
  void,
  { rejectValue: string; state: RootState }
>("getAllServiceTypes", async (_, { rejectWithValue, getState }) => {
  // let token: string | null | undefined = getState().auth.token;
  // token = token ? token : sessionStorage.getItem("token");
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2I5YTYyNzQwMzdkYWI3ZDI2NWZiOWEiLCJ1c2VyVHlwZSI6Ik9GRklDRSIsImlhdCI6MTc0NTM3NDAyNCwiZXhwIjoxNzQ1NDYwNDI0fQ.sIYhV-_wAmf_R68wqUgTKEhpIm_Kvo60EGSVxqaZL6w";

  try {
    const response = await axios.get(`${baseURL}/service-type/getAll`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // console.log("Service Type ", response.data);
    if (!response.data.success) {
      return rejectWithValue("Failed to update service request.");
    }

    return response.data.data; // Extract result if success
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const getServiceTypeById = createAsyncThunk<
  ServiceType,
  string,
  { rejectValue: string; state: RootState }
>("getServiceTypeById", async (id, { rejectWithValue, getState }) => {
  // let token: string | null | undefined = getState().auth.token;
  // token = token ? token : sessionStorage.getItem("token");
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2I5YTYyNzQwMzdkYWI3ZDI2NWZiOWEiLCJ1c2VyVHlwZSI6Ik9GRklDRSIsImlhdCI6MTc0NTM3NDAyNCwiZXhwIjoxNzQ1NDYwNDI0fQ.sIYhV-_wAmf_R68wqUgTKEhpIm_Kvo60EGSVxqaZL6w";

  try {
    const response = await axios.get(`${baseURL}/service-type/${id}/get`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.data.success) {
      return rejectWithValue("Failed to update service request.");
    }

    return response.data.data; // Extract result if success
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const createServiceType = createAsyncThunk<
  ServiceType,
  Partial<ServiceType>,
  { rejectValue: string; state: RootState }
>("createServiceType", async (data, { rejectWithValue, getState }) => {
  // let token: string | null | undefined = getState().auth.token;
  // token = token ? token : sessionStorage.getItem("token");
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2I5YTYyNzQwMzdkYWI3ZDI2NWZiOWEiLCJ1c2VyVHlwZSI6Ik9GRklDRSIsImlhdCI6MTc0NTM3NDAyNCwiZXhwIjoxNzQ1NDYwNDI0fQ.sIYhV-_wAmf_R68wqUgTKEhpIm_Kvo60EGSVxqaZL6w";

  try {
    const response = await axios.post(`${baseURL}/service-type/add-new`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.data.success) {
      return rejectWithValue("Failed to create Service request.");
    }

    return response.data.data; // Extract result if success
  } catch (error: any) {
    return rejectWithValue(error.response.data.message);
  }
});

export const updateServiceType = createAsyncThunk<
  ServiceType,
  {
    _id: string;
    serviceName?: string;
    rate?: number;
    rateType?: string;
  },
  { rejectValue: string; state: RootState }
>("updateServiceType", async (data, { rejectWithValue, getState }) => {
  // let token: string | null | undefined = getState().auth.token;
  // token = token ? token : sessionStorage.getItem("token");
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2I5YTYyNzQwMzdkYWI3ZDI2NWZiOWEiLCJ1c2VyVHlwZSI6Ik9GRklDRSIsImlhdCI6MTc0NTM3NDAyNCwiZXhwIjoxNzQ1NDYwNDI0fQ.sIYhV-_wAmf_R68wqUgTKEhpIm_Kvo60EGSVxqaZL6w";

  if (!data._id) return rejectWithValue("Service type does not exist.");

  try {
    const response = await axios.patch(
      `${baseURL}/service-type/${data._id}/update`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.data.success) {
      return rejectWithValue("Failed to update service type.");
    }

    return response.data.data; // Extract result if success
  } catch (error: any) {
    return rejectWithValue(error.response.data.message);
  }
});

export const deleteServiceType = createAsyncThunk<
  boolean,
  { _id: string },
  { rejectValue: string; state: RootState }
>("deleteServiceType", async (data, { rejectWithValue, getState }) => {
  // let token: string | null | undefined = getState().auth.token;
  // token = token ? token : sessionStorage.getItem("token");
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2I5YTYyNzQwMzdkYWI3ZDI2NWZiOWEiLCJ1c2VyVHlwZSI6Ik9GRklDRSIsImlhdCI6MTc0NTM3NDAyNCwiZXhwIjoxNzQ1NDYwNDI0fQ.sIYhV-_wAmf_R68wqUgTKEhpIm_Kvo60EGSVxqaZL6w";

  try {
    const response = await axios.delete(
      `${baseURL}/service-type/${data._id}/delete`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!response.data.success) {
      return rejectWithValue(response.data.message);
    }
    return true;
  } catch (error: any) {
    return rejectWithValue(error.response.data.message);
  }
});

interface StateType {
  serviceTypes: ServiceType[];
  loading: boolean;
  error?: string;
}

const initialState: StateType = { serviceTypes: [], loading: false };

const serviceSlice = createSlice({
  name: "ServiceSlice",
  initialState: initialState,
  extraReducers(builder) {
    builder
      .addCase(getAllServiceTypes.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(getAllServiceTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.serviceTypes = action.payload;
      })
      .addCase(getAllServiceTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | undefined;
      })
      .addCase(getServiceTypeById.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(getServiceTypeById.fulfilled, (state, action) => {
        state.loading = false;
        state.serviceTypes.push(action.payload);
      })
      .addCase(getServiceTypeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | undefined;
      })
      .addCase(createServiceType.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(createServiceType.fulfilled, (state, action) => {
        state.loading = false;
        state.serviceTypes.push(action.payload);
      })
      .addCase(createServiceType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | undefined;
      })
      .addCase(updateServiceType.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(updateServiceType.fulfilled, (state, action) => {
        state.loading = false;
        state.serviceTypes.push(action.payload);
      })
      .addCase(updateServiceType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | undefined;
      })
      .addCase(deleteServiceType.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(deleteServiceType.fulfilled, (state, action) => {
        state.loading = false;
        state.serviceTypes = state.serviceTypes.filter(
          (item) => item._id !== action.meta.arg._id
        );
      })
      .addCase(deleteServiceType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | undefined;
      });
  },
  reducers: {},
});

export default serviceSlice.reducer;
