import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../app/store.js";
import { ServiceRecord, ServiceRequest } from "../../types/schemaTypes.js";

const baseURL = "http://localhost:1300/service";

export const getAllServiceRequests = createAsyncThunk<
  ServiceRequest[],
  void,
  { rejectValue: string; state: RootState }
>("getAllServiceRequests", async (_, { rejectWithValue, getState }) => {
  // let token: string | null | undefined = getState().auth.token;
  // token = token ? token : sessionStorage.getItem("token");
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2I5YTYyNzQwMzdkYWI3ZDI2NWZiOWEiLCJ1c2VyVHlwZSI6Ik9GRklDRSIsImlhdCI6MTc0NTM3NDAyNCwiZXhwIjoxNzQ1NDYwNDI0fQ.sIYhV-_wAmf_R68wqUgTKEhpIm_Kvo60EGSVxqaZL6w";

  try {
    const response = await axios.get(`${baseURL}/all-requests`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log(`Service Requests - ${new Date()}`, response.data);
    if (!response.data.success) {
      return rejectWithValue("Failed to update service request.");
    }

    return response.data.data; // Extract result if success
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const getServiceRequestById = createAsyncThunk<
  ServiceRequest, // return data type
  string,
  { rejectValue: string; state: RootState }
>("getServiceRequestsById", async (id, { rejectWithValue, getState }) => {
  // let token: string | null | undefined = getState().auth.token;
  // token = token ? token : sessionStorage.getItem("token");
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2I5YTYyNzQwMzdkYWI3ZDI2NWZiOWEiLCJ1c2VyVHlwZSI6Ik9GRklDRSIsImlhdCI6MTc0NTM3NDAyNCwiZXhwIjoxNzQ1NDYwNDI0fQ.sIYhV-_wAmf_R68wqUgTKEhpIm_Kvo60EGSVxqaZL6w";

  try {
    const response = await axios.get(`${baseURL}/all-requests/${id}`, {
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

export const createServiceRequest = createAsyncThunk<
  ServiceRequest, // return data type
  Partial<ServiceRequest>,
  { rejectValue: string; state: RootState }
>("createServiceRequest", async (data, { rejectWithValue, getState }) => {
  // let token: string | null | undefined = getState().auth.token;
  // token = token ? token : sessionStorage.getItem("token");
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2I5YTYyNzQwMzdkYWI3ZDI2NWZiOWEiLCJ1c2VyVHlwZSI6Ik9GRklDRSIsImlhdCI6MTc0NTM3NDAyNCwiZXhwIjoxNzQ1NDYwNDI0fQ.sIYhV-_wAmf_R68wqUgTKEhpIm_Kvo60EGSVxqaZL6w";

  try {
    const response = await axios.post(`${baseURL}/new-service-request`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.data.success)
      return rejectWithValue("Failed to create Service request.");

    return response.data.data; // Extract result if success
  } catch (error: any) {
    return rejectWithValue(error.response.data.message);
  }
});

export const completeServiceRequest = createAsyncThunk<
  { newServiceRecord: ServiceRecord; updatedServiceReq: ServiceRequest }, // return data type
  {
    _id: string;
    actualServiceDate: Date;
    serviceDescription: string;
    partsUsed: { partId?: string; price?: number }[];
    totalCos: number;
    serviceDoneBy?: string;
  },
  { rejectValue: string; state: RootState }
>("completeServiceRequest", async (data, { rejectWithValue, getState }) => {
  // let token: string | null | undefined = getState().auth.token;
  // token = token ? token : sessionStorage.getItem("token");
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2I5YTYyNzQwMzdkYWI3ZDI2NWZiOWEiLCJ1c2VyVHlwZSI6Ik9GRklDRSIsImlhdCI6MTc0NTM3NDAyNCwiZXhwIjoxNzQ1NDYwNDI0fQ.sIYhV-_wAmf_R68wqUgTKEhpIm_Kvo60EGSVxqaZL6w";

  if (!data._id) return rejectWithValue("Service request does not exist.");

  try {
    const response = await axios.patch(
      `${baseURL}/service-request/${data._id}/complete`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.data.success) {
      return rejectWithValue("Failed to update service request.");
    }

    return response.data.data; // Extract result if success
    // {newServiceRecord, updatedServiceReq}
  } catch (error: any) {
    return rejectWithValue(error.response.data.message);
  }
});

export const assignServiceRequest = createAsyncThunk<
  ServiceRequest, // return data type
  {
    _id: string;
    technicianId: string;
  },
  { rejectValue: string; state: RootState }
>("assignServiceRequest", async (data, { rejectWithValue, getState }) => {
  // let token: string | null | undefined = getState().auth.token;
  // token = token ? token : sessionStorage.getItem("token");
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2I5YTYyNzQwMzdkYWI3ZDI2NWZiOWEiLCJ1c2VyVHlwZSI6Ik9GRklDRSIsImlhdCI6MTc0NTM3NDAyNCwiZXhwIjoxNzQ1NDYwNDI0fQ.sIYhV-_wAmf_R68wqUgTKEhpIm_Kvo60EGSVxqaZL6w";

  if (!data._id) return rejectWithValue("Service request does not exist.");
  if (!data.technicianId) return rejectWithValue("Technician not selected.");

  try {
    const response = await axios.patch(
      `${baseURL}/service-request/${data._id}/assign`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Assign API Hit", response.data);
    if (!response.data.success) {
      return rejectWithValue("Failed to update service request.");
    }

    return response.data.data; // Extract result if success
  } catch (error: any) {
    return rejectWithValue(error.response.data.message);
  }
});

export const updateServiceRequest = createAsyncThunk<
  ServiceRequest,
  {
    _id: string;
    status?: string;
    requestDate?: Date;
    serviceTypeId?: string;
    cusDescription?: string;
    resolutionNotes?: string;
  },
  { rejectValue: string; state: RootState }
>("updateServiceRequest", async (data, { rejectWithValue, getState }) => {
  // let token: string | null | undefined = getState().auth.token;
  // token = token ? token : sessionStorage.getItem("token");
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2I5YTYyNzQwMzdkYWI3ZDI2NWZiOWEiLCJ1c2VyVHlwZSI6Ik9GRklDRSIsImlhdCI6MTc0NTM3NDAyNCwiZXhwIjoxNzQ1NDYwNDI0fQ.sIYhV-_wAmf_R68wqUgTKEhpIm_Kvo60EGSVxqaZL6w";

  if (!data._id) return rejectWithValue("Service request does not exist.");

  try {
    const response = await axios.patch(
      `${baseURL}/service-request/${data._id}/update`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.data.success) {
      return rejectWithValue("Failed to update service request.");
    }

    return response.data.data; // Extract result if success
  } catch (error: any) {
    return rejectWithValue(error.response.data.message);
  }
});

export const cancelServiceRequest = createAsyncThunk<
  ServiceRequest,
  { _id: string; cancelRsn: string },
  { rejectValue: string; state: RootState }
>("cancelServiceRequest", async (data, { rejectWithValue, getState }) => {
  // let token: string | null | undefined = getState().auth.token;
  // token = token ? token : sessionStorage.getItem("token");
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2I5YTYyNzQwMzdkYWI3ZDI2NWZiOWEiLCJ1c2VyVHlwZSI6Ik9GRklDRSIsImlhdCI6MTc0NTM3NDAyNCwiZXhwIjoxNzQ1NDYwNDI0fQ.sIYhV-_wAmf_R68wqUgTKEhpIm_Kvo60EGSVxqaZL6w";

  if (!data._id) return rejectWithValue("Service request does not exist.");

  try {
    const response = await axios.post(
      `${baseURL}/service-request/${data._id}/cancel`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.data.success)
      return rejectWithValue("Failed to update service request.");

    return response.data.data; // Extract result if success
  } catch (error: any) {
    return rejectWithValue(error.response.data.message);
  }
});

export const deleteServiceRequest = createAsyncThunk<
  boolean,
  { _id: string },
  { rejectValue: string; state: RootState }
>("deleteServiceRequest", async (data, { rejectWithValue, getState }) => {
  // let token: string | null | undefined = getState().auth.token;
  // token = token ? token : sessionStorage.getItem("token");
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2I5YTYyNzQwMzdkYWI3ZDI2NWZiOWEiLCJ1c2VyVHlwZSI6Ik9GRklDRSIsImlhdCI6MTc0NTM3NDAyNCwiZXhwIjoxNzQ1NDYwNDI0fQ.sIYhV-_wAmf_R68wqUgTKEhpIm_Kvo60EGSVxqaZL6w";

  if (!data._id) return rejectWithValue("Service request does not exist.");
  try {
    const response = await axios.delete(
      `${baseURL}/service-request/${data._id}/delete`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
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
  serviceRequests: ServiceRequest[];
  loading: boolean;
  error?: string;
}

const initialState: StateType = { serviceRequests: [], loading: false };

const serviceSlice = createSlice({
  name: "ServiceSlice",
  initialState: initialState,
  extraReducers(builder) {
    builder
      .addCase(getAllServiceRequests.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(getAllServiceRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.serviceRequests = action.payload;
      })
      .addCase(getAllServiceRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | undefined;
      })
      .addCase(getServiceRequestById.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(getServiceRequestById.fulfilled, (state, action) => {
        state.loading = false;
        state.serviceRequests.push(action.payload);
      })
      .addCase(getServiceRequestById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | undefined;
      })
      .addCase(createServiceRequest.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(createServiceRequest.fulfilled, (state, action) => {
        state.loading = false;
        console.log("Created Service Req Slice", action.payload);
        state.serviceRequests.push(action.payload);
      })
      .addCase(createServiceRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | undefined;
      })
      .addCase(completeServiceRequest.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(completeServiceRequest.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.serviceRequests.findIndex(
          (request) => request._id === action.payload.updatedServiceReq._id
        );

        if (index !== -1) {
          // If the item exists in the array, update it
          state.serviceRequests[index] = action.payload.updatedServiceReq;
        }
      })
      .addCase(completeServiceRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | undefined;
      })
      .addCase(assignServiceRequest.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(assignServiceRequest.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.serviceRequests.findIndex(
          (request) => request._id === action.payload._id
        );

        if (index !== -1) {
          // If the item exists in the array, update it
          state.serviceRequests[index] = action.payload;
        }
      })
      .addCase(assignServiceRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | undefined;
      })
      .addCase(updateServiceRequest.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(updateServiceRequest.fulfilled, (state, action) => {
        state.loading = false;
        // console.log("action payload", action.payload);
        // Find the index of the service request to be updated
        const index = state.serviceRequests.findIndex(
          (request) => request._id === action.payload._id
        );

        if (index !== -1) {
          // If the item exists in the array, update it
          state.serviceRequests[index] = action.payload;
        }
      })
      .addCase(updateServiceRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | undefined;
      })
      .addCase(cancelServiceRequest.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(cancelServiceRequest.fulfilled, (state, action) => {
        state.loading = false;
        // console.log("action payload", action.payload);
        // Find the index of the service request to be updated
        const index = state.serviceRequests.findIndex(
          (request) => request._id === action.payload._id
        );

        if (index !== -1) {
          // If the item exists in the array, update it
          state.serviceRequests[index] = action.payload;
        }
      })
      .addCase(cancelServiceRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | undefined;
      })
      .addCase(deleteServiceRequest.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(deleteServiceRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.serviceRequests = state.serviceRequests.filter(
          (item) => item._id !== action.meta.arg._id
        );
      })
      .addCase(deleteServiceRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | undefined;
      });
  },
  reducers: {},
});

export default serviceSlice.reducer;
