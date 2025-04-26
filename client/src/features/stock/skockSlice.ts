import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../app/store.js";
import {
  Stock,
  StockMovement,
  TechnicianStockMovement,
  Transaction,
} from "../../types/schemaTypes.js";
import {
  InternalMovement,
  StockMovFromLocation,
  StockMovToLocation,
  TransactionAmountType,
  TransactionMethods,
  TransactionStatus,
  TransactionType,
} from "../../types/enumTypes.js";

const baseURL = "http://localhost:1300/stock";

export const getAllStock = createAsyncThunk<
  Stock[],
  { partId?: string; location?: string; technicianId?: string },
  { rejectValue: string; state: RootState }
>("getAllStock", async (data, { rejectWithValue, getState }) => {
  // let token: string | null | undefined = getState().auth.token;
  // token = token ? token : sessionStorage.getItem("token");
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2I5YTYyNzQwMzdkYWI3ZDI2NWZiOWEiLCJ1c2VyVHlwZSI6Ik9GRklDRSIsImlhdCI6MTc0NTM3NDAyNCwiZXhwIjoxNzQ1NDYwNDI0fQ.sIYhV-_wAmf_R68wqUgTKEhpIm_Kvo60EGSVxqaZL6w";

  const partId = data.partId || "";
  const location = data.location || "";
  const technicianId = data.technicianId || "";
  try {
    const response = await axios.get(
      `${baseURL}/all-stock?partId=${partId}&location=${location}&technicianId=${technicianId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log("response - ", response.data);

    if (!response.data.success)
      return rejectWithValue("Failed to update service request.");

    return response.data.data;
  } catch (error: any) {
    console.log("response - ", error.response.data);
    return rejectWithValue(error.message);
  }
});

export const getAllMainStock = createAsyncThunk<
  Stock[],
  void,
  { rejectValue: string; state: RootState }
>("getAllMainStock", async (_, { rejectWithValue, getState }) => {
  // let token: string | null | undefined = getState().auth.token;
  // token = token ? token : sessionStorage.getItem("token");
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2I5YTYyNzQwMzdkYWI3ZDI2NWZiOWEiLCJ1c2VyVHlwZSI6Ik9GRklDRSIsImlhdCI6MTc0NTM3NDAyNCwiZXhwIjoxNzQ1NDYwNDI0fQ.sIYhV-_wAmf_R68wqUgTKEhpIm_Kvo60EGSVxqaZL6w";

  try {
    const response = await axios.get(`${baseURL}/all-main-stock`, {
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

export const getAllOfficeStock = createAsyncThunk<
  Stock[],
  void,
  { rejectValue: string; state: RootState }
>("getAllOfficeStock", async (_, { rejectWithValue, getState }) => {
  // let token: string | null | undefined = getState().auth.token;
  // token = token ? token : sessionStorage.getItem("token");
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2I5YTYyNzQwMzdkYWI3ZDI2NWZiOWEiLCJ1c2VyVHlwZSI6Ik9GRklDRSIsImlhdCI6MTc0NTM3NDAyNCwiZXhwIjoxNzQ1NDYwNDI0fQ.sIYhV-_wAmf_R68wqUgTKEhpIm_Kvo60EGSVxqaZL6w";

  try {
    const response = await axios.get(`${baseURL}/all-office-stock`, {
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

export const technicianStockPayment = createAsyncThunk<
  {
    newTransaction: Transaction;
    updateTechnicianStock: Stock;
    newTechnicianStockMovement: TechnicianStockMovement;
  },
  {
    partId: string;
    technicianId: string;
    quantity: number;
    revceivedBy: string;

    transactionDetails: {
      paymentDate: Date;
      amount: number;
      amountType: TransactionAmountType;
      transactionMethod: TransactionMethods;
      transactionStatus: TransactionStatus;
      transactionType: TransactionType;
    };
  },
  { rejectValue: string; state: RootState }
>("technicianStockPayment", async (data, { rejectWithValue, getState }) => {
  let token: string | null | undefined = getState().auth.token;
  token = token ? token : sessionStorage.getItem("token");

  try {
    const response = await axios.patch(
      `${baseURL}/${data.partId}/technician-stock-payment`,
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

export const internalStockMovement = createAsyncThunk<
  { moveFromStock: Stock; moveToStock: Stock; newStockMovement: StockMovement },
  {
    partId: string;
    fromLocation: InternalMovement;
    toLocation: InternalMovement;
    quantity: number;
  },
  { rejectValue: string; state: RootState }
>("internalStockMovement", async (data, { rejectWithValue, getState }) => {
  let token: string | null | undefined = getState().auth.token;
  token = token ? token : sessionStorage.getItem("token");

  try {
    const response = await axios.patch(
      `${baseURL}/${data.partId}/move-stock-internal`,
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
    console.log("Error - ", error.response.data);
    return rejectWithValue(error.response.data.message);
  }
});

interface StateType {
  officeStock: Stock[];
  mainStock: Stock[];
  stock: Stock[];
  loading: boolean;
  error?: string;
}

const initialState: StateType = {
  officeStock: [],
  mainStock: [],
  stock: [],
  loading: false,
};

const serviceSlice = createSlice({
  name: "ServiceSlice",
  initialState: initialState,
  extraReducers(builder) {
    builder
      .addCase(getAllStock.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(getAllStock.fulfilled, (state, action) => {
        state.loading = false;
        state.stock = action.payload;
      })
      .addCase(getAllStock.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | undefined;
      })
      .addCase(getAllOfficeStock.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(getAllOfficeStock.fulfilled, (state, action) => {
        state.loading = false;
        state.officeStock = action.payload;
      })
      .addCase(getAllOfficeStock.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | undefined;
      })
      .addCase(getAllMainStock.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(getAllMainStock.fulfilled, (state, action) => {
        state.loading = false;
        state.mainStock = action.payload;
      })
      .addCase(getAllMainStock.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | undefined;
      })
      .addCase(technicianStockPayment.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(technicianStockPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.stock = state.stock.map((item) => {
          if (item._id === action.payload.updateTechnicianStock._id) {
            item.quantity = action.payload.updateTechnicianStock.quantity;
          }
          return item;
        });
      })
      .addCase(technicianStockPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | undefined;
      })
      .addCase(internalStockMovement.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(internalStockMovement.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload.moveFromStock.location === "MAIN") {
          console.log("Move from stock - ", action.payload.moveFromStock);
          state.mainStock = state.mainStock.map((item) => {
            if (item._id === action.payload.moveFromStock._id)
              item.quantity = action.payload.moveFromStock.quantity;

            return item;
          });
          state.officeStock = state.officeStock.map((item) => {
            if (item._id === action.payload.moveToStock._id)
              item.quantity = action.payload.moveToStock.quantity;

            return item;
          });
        }
        if (action.payload.moveFromStock.location === "OFFICE") {
          console.log("Move from stock - ", action.payload.moveFromStock);
          state.officeStock = state.officeStock.map((item) => {
            if (item._id === action.payload.moveFromStock._id)
              item.quantity = action.payload.moveFromStock.quantity;

            return item;
          });
          state.mainStock = state.mainStock.map((item) => {
            if (item._id === action.payload.moveToStock._id)
              item.quantity = action.payload.moveToStock.quantity;

            return item;
          });
        }
      })
      .addCase(internalStockMovement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | undefined;
      });
  },
  reducers: {},
});

export default serviceSlice.reducer;
