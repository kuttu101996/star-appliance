import { RootState } from "@/app/store";
import { PaymentStatus } from "@/types/enumTypes";
import { Purchase } from "@/types/schemaTypes";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const baseURL = "http://localhost:1300/purchase";

export const allPurchaseEntries = createAsyncThunk<
  Purchase[],
  void,
  { rejectValue: string; state: RootState }
>("allPurchaseEntries", async (data, { rejectWithValue, getState }) => {
  // let token: string | null | undefined = getState().auth.token;
  // token = token ? token : sessionStorage.getItem("token");
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2I5YTYyNzQwMzdkYWI3ZDI2NWZiOWEiLCJ1c2VyVHlwZSI6Ik9GRklDRSIsImlhdCI6MTc0NTM3NDAyNCwiZXhwIjoxNzQ1NDYwNDI0fQ.sIYhV-_wAmf_R68wqUgTKEhpIm_Kvo60EGSVxqaZL6w";

  try {
    const response = await axios.patch(`${baseURL}/new-purchase`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.data.success) return rejectWithValue(response.data.message);

    return response.data.data;
  } catch (error: any) {
    console.log("Error - ", error.response.data);
    return rejectWithValue(error.response.data.message);
  }
});

export const newPurchaseEntry = createAsyncThunk<
  { newPurchase: Purchase },
  {
    detail: { partId: string; quantity: number; unitCost: number }[];
    billNo: string;
    purchaseDate: Date;
    totalCost: number;
    transactionId?: string;
    paymentStatus: PaymentStatus;
    movementRemarks?: string;
  },
  { rejectValue: string; state: RootState }
>("newPurchaseEntry", async (data, { rejectWithValue, getState }) => {
  // let token: string | null | undefined = getState().auth.token;
  // token = token ? token : sessionStorage.getItem("token");
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2I5YTYyNzQwMzdkYWI3ZDI2NWZiOWEiLCJ1c2VyVHlwZSI6Ik9GRklDRSIsImlhdCI6MTc0NTM3NDAyNCwiZXhwIjoxNzQ1NDYwNDI0fQ.sIYhV-_wAmf_R68wqUgTKEhpIm_Kvo60EGSVxqaZL6w";

  if (!Array.isArray(data.detail) || data.detail.length <= 0) {
    return rejectWithValue("No purchase item found.");
  }
  if (!data.billNo) return rejectWithValue("Missing bill details.");
  if (!data.paymentStatus)
    return rejectWithValue("Please select payment status.");
  try {
    const response = await axios.post(`${baseURL}/new-purchase`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.data.success) return rejectWithValue(response.data.message);

    return response.data.data;
  } catch (error: any) {
    console.log("Error - ", error.response.data);
    return rejectWithValue(error.response.data.message);
  }
});

interface StateType {
  purchases: Purchase[];
  loading: boolean;
  error?: string;
}

const initialState: StateType = {
  purchases: [],
  loading: false,
};

const technicianSlice = createSlice({
  name: "PurchaseSlice",
  initialState: initialState,
  extraReducers(builder) {
    builder
      .addCase(newPurchaseEntry.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(newPurchaseEntry.fulfilled, (state, action) => {
        state.loading = false;
        state.purchases.push(action.payload.newPurchase);
      })
      .addCase(newPurchaseEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | undefined;
      });
  },
  reducers: {},
});

export default technicianSlice.reducer;
