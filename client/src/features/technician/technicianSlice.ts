import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { RootState } from "../../app/store.js";
import {
  ServiceRecord,
  ServiceRequest,
  Stock,
  StockMovement,
  TechnicianStockMovement,
  Transaction,
} from "../../types/schemaTypes.js";
import { StockMovFromLocation, StockMovToLocation } from "@/types/enumTypes.js";

const baseURL = "http://localhost:1300";

export const getTechnicianServiceRequests = createAsyncThunk<
  ServiceRequest[],
  string,
  { rejectValue: string; state: RootState }
>("getTechnicianServiceRequests", async (id, { rejectWithValue, getState }) => {
  let token: string | null | undefined = getState().auth.token;
  token = token ? token : sessionStorage.getItem("token");

  try {
    const response = await axios.get(
      `${baseURL}/service/technician/${id}/all-requests`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!response.data.success)
      return rejectWithValue("Failed to update service request.");

    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const getTechnicianStockMovements = createAsyncThunk<
  TechnicianStockMovement[],
  string,
  { rejectValue: string; state: RootState }
>("getTechnicianStockMovements", async (id, { rejectWithValue, getState }) => {
  let token: string | null | undefined = getState().auth.token;
  token = token ? token : sessionStorage.getItem("token");

  try {
    const response = await axios.get(
      `${baseURL}/service/technician/${id}/all-requests`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!response.data.success)
      return rejectWithValue("Failed to update service request.");

    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const getAllTechnicianStock = createAsyncThunk<
  Stock[],
  void,
  { rejectValue: string; state: RootState }
>("getAllTechnicianStock", async (_, { rejectWithValue, getState }) => {
  // let token: string | null | undefined = getState().auth.token;
  // token = token ? token : sessionStorage.getItem("token");
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2I5YTYyNzQwMzdkYWI3ZDI2NWZiOWEiLCJ1c2VyVHlwZSI6Ik9GRklDRSIsImlhdCI6MTc0NTM3NDAyNCwiZXhwIjoxNzQ1NDYwNDI0fQ.sIYhV-_wAmf_R68wqUgTKEhpIm_Kvo60EGSVxqaZL6w";

  try {
    const response = await axios.get(`${baseURL}/stock/all-technician-stock`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.data.success)
      return rejectWithValue("Failed to update service request.");

    return response.data.data;
  } catch (error: any) {
    console.log("response - ", error.response.data);
    return rejectWithValue(error.message);
  }
});

export const assignStockTechnician = createAsyncThunk<
  {
    updatedExistingStockQty: Stock;
    updatedTechnicianStock: Stock;
    newStockMovement: StockMovement;
    newTechnicianStockMovement: TechnicianStockMovement;
  },
  {
    partId: string;
    fromLocation: StockMovFromLocation;
    technicianId: string;
    quantity: number;
    movementDate: Date;
    remarks: string;
  },
  { rejectValue: string; state: RootState }
>("assignStockTechnician", async (data, { rejectWithValue, getState }) => {
  // let token: string | null | undefined = getState().auth.token;
  // token = token ? token : sessionStorage.getItem("token");
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2I5YTYyNzQwMzdkYWI3ZDI2NWZiOWEiLCJ1c2VyVHlwZSI6Ik9GRklDRSIsImlhdCI6MTc0NTM3NDAyNCwiZXhwIjoxNzQ1NDYwNDI0fQ.sIYhV-_wAmf_R68wqUgTKEhpIm_Kvo60EGSVxqaZL6w";

  if (!data.partId) rejectWithValue("Missing parts details");
  if (!data.fromLocation) rejectWithValue("Missing movement root.");
  if (!data.technicianId) rejectWithValue("Missing technician details.");
  if (!data.quantity) rejectWithValue("Missing quantity.");
  try {
    const response = await axios.patch(
      `${baseURL}/stock/${data.partId}/assign-stock-technician`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Try block - ", response.data);
    if (!response.data.success) return rejectWithValue(response.data.message);

    return response.data.data;
  } catch (error: any) {
    console.log("catch block - ", error.response.data);
    return rejectWithValue(
      error instanceof AxiosError
        ? error?.response?.data.message
        : "Internal server error."
    );
  }
});

export const technicianStockReturn = createAsyncThunk<
  {
    updateExistingStockQty: Stock;
    updateTechnicianStock: Stock;
    newStockMovement: StockMovement;
    newTechnicianStockMovement: TechnicianStockMovement;
  },
  {
    partId: string;
    technicianId: string;
    recievedBy: string;
    quantity: number;
    movementDate: Date;
    remarks: string;
  },
  { rejectValue: string; state: RootState }
>("technicianStockReturn", async (data, { rejectWithValue, getState }) => {
  // let token: string | null | undefined = getState().auth.token;
  // token = token ? token : sessionStorage.getItem("token");
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2I5YTYyNzQwMzdkYWI3ZDI2NWZiOWEiLCJ1c2VyVHlwZSI6Ik9GRklDRSIsImlhdCI6MTc0NTM3NDAyNCwiZXhwIjoxNzQ1NDYwNDI0fQ.sIYhV-_wAmf_R68wqUgTKEhpIm_Kvo60EGSVxqaZL6w";

  try {
    const response = await axios.patch(
      `${baseURL}/stock/${data.partId}/technician-stock-return`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.data.success) return rejectWithValue(response.data.message);

    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const technicianStockSell = createAsyncThunk<
  {
    newTransaction: Transaction;
    updateTechnicianStock: Stock;
    newTechnicianStockMovement: TechnicianStockMovement;
  },
  {
    partId: string;
    soldTo: string;
    technicianId: string;
    recievedBy: string;
    quantity: number;

    transactionDetails: Partial<Transaction>;
  },
  { rejectValue: string; state: RootState }
>("technicianStockSell", async (data, { rejectWithValue, getState }) => {
  // let token: string | null | undefined = getState().auth.token;
  // token = token ? token : sessionStorage.getItem("token");
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2I5YTYyNzQwMzdkYWI3ZDI2NWZiOWEiLCJ1c2VyVHlwZSI6Ik9GRklDRSIsImlhdCI6MTc0NTM3NDAyNCwiZXhwIjoxNzQ1NDYwNDI0fQ.sIYhV-_wAmf_R68wqUgTKEhpIm_Kvo60EGSVxqaZL6w";

  try {
    const response = await axios.patch(
      `${baseURL}/stock/${data.partId}/technician-stock-payment`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(response.data);
    if (!response.data.success) return rejectWithValue(response.data.message);

    return response.data.data;
  } catch (error: any) {
    console.log("Catch block - ", error.response.data);
    return rejectWithValue(error.message);
  }
});

interface StateType {
  technicianStock: Stock[];
  serviceRequests: ServiceRequest[];
  serviceRecords: ServiceRecord[];
  stockMovement: TechnicianStockMovement[];
  loading: boolean;
  error?: string;
}

const initialState: StateType = {
  technicianStock: [],
  serviceRequests: [],
  serviceRecords: [],
  stockMovement: [],
  loading: false,
};

const technicianSlice = createSlice({
  name: "TechnicianSlice",
  initialState: initialState,
  extraReducers(builder) {
    builder
      .addCase(getTechnicianServiceRequests.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(getTechnicianServiceRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.serviceRequests = action.payload;
      })
      .addCase(getTechnicianServiceRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | undefined;
      })
      .addCase(getAllTechnicianStock.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(getAllTechnicianStock.fulfilled, (state, action) => {
        state.loading = false;
        state.technicianStock = action.payload;
      })
      .addCase(getAllTechnicianStock.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | undefined;
      })
      .addCase(assignStockTechnician.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(assignStockTechnician.fulfilled, (state, action) => {
        state.loading = false;
        state.technicianStock = state.technicianStock.map((item) => {
          if (item._id === action.payload.updatedTechnicianStock._id)
            item.quantity = action.payload.updatedTechnicianStock.quantity;

          return item;
        });
      })
      .addCase(assignStockTechnician.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | undefined;
      })
      .addCase(technicianStockReturn.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(technicianStockReturn.fulfilled, (state, action) => {
        state.loading = false;
        state.technicianStock = state.technicianStock.map((item) => {
          if (item._id === action.payload.updateTechnicianStock._id)
            item.quantity = action.payload.updateTechnicianStock.quantity;

          return item;
        });
        // state.stock = action.payload;
      })
      .addCase(technicianStockReturn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | undefined;
      })
      .addCase(technicianStockSell.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(technicianStockSell.fulfilled, (state, action) => {
        state.loading = false;
        state.technicianStock = state.technicianStock.map((item) => {
          if (item._id === action.payload.updateTechnicianStock._id)
            item.quantity = action.payload.updateTechnicianStock.quantity;

          return item;
        });
        // state.stock = action.payload;
      })
      .addCase(technicianStockSell.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | undefined;
      });
  },
  reducers: {},
});

export default technicianSlice.reducer;
