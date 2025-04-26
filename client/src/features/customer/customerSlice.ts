import { RootState } from "@/app/store";
import { Customer, ApiResponse } from "@/types/schemaTypes";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export const getAllCustomers = createAsyncThunk<
  Customer[],
  void,
  // { page?: number; limit?: number },
  { rejectValue: string; state: RootState }
>("getAllCustomers", async (_, { rejectWithValue, getState }) => {
  // let token: string | null | undefined = getState().auth.token;
  // token = token ? token : sessionStorage.getItem("token");
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2I5YTYyNzQwMzdkYWI3ZDI2NWZiOWEiLCJ1c2VyVHlwZSI6Ik9GRklDRSIsImlhdCI6MTc0NTM3NDAyNCwiZXhwIjoxNzQ1NDYwNDI0fQ.sIYhV-_wAmf_R68wqUgTKEhpIm_Kvo60EGSVxqaZL6w";

  try {
    const response = await axios.get(
      `http://localhost:1300/customer`,
      // ?page=${pagination.page}&limit=${pagination.limit}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    // console.log(response.data.data);

    if (!response.data.success) {
      return rejectWithValue(response.data.message);
    }
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const createCustomer = createAsyncThunk<
  Customer,
  Partial<Customer>,
  { rejectValue: string; state: RootState }
>("createCustomer", async (data, { rejectWithValue, getState }) => {
  // let token: string | null | undefined = getState().auth.token;
  // token = token ? token : sessionStorage.getItem("token");
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2I5YTYyNzQwMzdkYWI3ZDI2NWZiOWEiLCJ1c2VyVHlwZSI6Ik9GRklDRSIsImlhdCI6MTc0NTM3NDAyNCwiZXhwIjoxNzQ1NDYwNDI0fQ.sIYhV-_wAmf_R68wqUgTKEhpIm_Kvo60EGSVxqaZL6w";

  try {
    const response = await axios.post(
      "http://localhost:1300/customer/add-customer",
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.data.success) {
      return rejectWithValue(response.data.message);
    }
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const updateCustomer = createAsyncThunk<
  Customer,
  Partial<Customer>,
  { rejectValue: string; state: RootState }
>("updateCustomer", async (data, { rejectWithValue, getState }) => {
  // let token: string | null | undefined = getState().auth.token;
  // token = token ? token : sessionStorage.getItem("token");
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2I5YTYyNzQwMzdkYWI3ZDI2NWZiOWEiLCJ1c2VyVHlwZSI6Ik9GRklDRSIsImlhdCI6MTc0NTM3NDAyNCwiZXhwIjoxNzQ1NDYwNDI0fQ.sIYhV-_wAmf_R68wqUgTKEhpIm_Kvo60EGSVxqaZL6w";

  if (!data._id)
    return rejectWithValue("Something went wrong, customer details missing.");

  try {
    const response = await axios.patch(
      `http://localhost:1300/customer/${data._id}/update-customer`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(response.data.data);
    if (!response.data.success) {
      return rejectWithValue(response.data.message);
    }
    return response.data.data;
  } catch (error: any) {
    console.log(error.response.data);
    return rejectWithValue(error.message);
  }
});

export const getAllServiceDueThisMonth = createAsyncThunk<
  Customer[],
  void,
  { rejectValue: string; state: RootState }
>("getAllServiceDueThisMonth", async (_, { rejectWithValue, getState }) => {
  // let token: string | null | undefined = getState().auth.token;
  // token = token ? token : sessionStorage.getItem("token");
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2I5YTYyNzQwMzdkYWI3ZDI2NWZiOWEiLCJ1c2VyVHlwZSI6Ik9GRklDRSIsImlhdCI6MTc0NTM3NDAyNCwiZXhwIjoxNzQ1NDYwNDI0fQ.sIYhV-_wAmf_R68wqUgTKEhpIm_Kvo60EGSVxqaZL6w";

  try {
    const response = await fetch(
      `http://localhost:1300/service/all-customers-service-due-this-month`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const result: ApiResponse<Customer[]> = await response.json();
    if (result.success) {
      return result.result; // Extract result if success
    } else {
      return rejectWithValue(result.message); // Handle API error
    }
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const getAllServiceDueBetweenDate = createAsyncThunk<
  Customer[],
  { startDate: Date; endDate: Date },
  { rejectValue: string; state: RootState }
>(
  "getAllServiceDueBetweenDate",
  async (data, { rejectWithValue, getState }) => {
    // let token: string | null | undefined = getState().auth.token;
    // token = token ? token : sessionStorage.getItem("token");
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2I5YTYyNzQwMzdkYWI3ZDI2NWZiOWEiLCJ1c2VyVHlwZSI6Ik9GRklDRSIsImlhdCI6MTc0NTM3NDAyNCwiZXhwIjoxNzQ1NDYwNDI0fQ.sIYhV-_wAmf_R68wqUgTKEhpIm_Kvo60EGSVxqaZL6w";

    try {
      const response = await fetch(
        `http://localhost:1300/service/all-customers-service-due-between?startDate=${data.startDate}&endDate=${data.endDate}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const result: ApiResponse<Customer[]> = await response.json();
      if (result.success) {
        return result.result; // Extract result if success
      } else {
        return rejectWithValue(result.message); // Handle API error
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

interface CustomerState {
  customers: Customer[];
  loading: boolean;
  error?: string;
}
const initialState: CustomerState = { customers: [], loading: false };

export const customerSlice = createSlice({
  name: "customerSlice",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getAllCustomers.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        getAllCustomers.fulfilled,
        (state, action: PayloadAction<Customer[]>) => {
          state.loading = false;
          state.customers = action.payload;
        }
      )
      .addCase(getAllCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | undefined;
      })
      .addCase(createCustomer.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        createCustomer.fulfilled,
        (state, action: PayloadAction<Customer>) => {
          state.loading = false;
          state.customers.push(action.payload);
        }
      )
      .addCase(createCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | undefined;
      })
      .addCase(updateCustomer.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        updateCustomer.fulfilled,
        (state, action: PayloadAction<Customer>) => {
          state.loading = false;
          const index = state.customers.findIndex(
            (request) => request._id === action.payload._id
          );

          if (index !== -1) {
            state.customers[index] = action.payload;
          }
        }
      )
      .addCase(updateCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | undefined;
      })
      .addCase(getAllServiceDueThisMonth.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(getAllServiceDueThisMonth.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload;
      })
      .addCase(getAllServiceDueThisMonth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | undefined;
      })
      .addCase(getAllServiceDueBetweenDate.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(getAllServiceDueBetweenDate.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload;
      })
      .addCase(getAllServiceDueBetweenDate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | undefined;
      });
  },
  reducers: {},
});

export default customerSlice.reducer;
