import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../app/store.js";
import { Transaction } from "../../types/schemaTypes.js";
import {
  TransactionAmountType,
  TransactionMethods,
  TransactionStatus,
  TransactionType,
} from "@/types/enumTypes.js";

const baseURL = "http://localhost:1300/transaction";

export const getAllTransaction = createAsyncThunk<
  Transaction[],
  {
    paidBy?: string;
    recivedBy?: string;
    transactionDate?: Date;
    transactionMethod?: TransactionMethods;
    status?: TransactionStatus;
    transactionType?: TransactionType;
  },
  { rejectValue: string; state: RootState }
>("getAllTransaction", async (data, { rejectWithValue, getState }) => {
  // let token: string | null | undefined = getState().auth.token;
  // token = token ? token : sessionStorage.getItem("token");
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2I5YTYyNzQwMzdkYWI3ZDI2NWZiOWEiLCJ1c2VyVHlwZSI6Ik9GRklDRSIsImlhdCI6MTc0NTM3NDAyNCwiZXhwIjoxNzQ1NDYwNDI0fQ.sIYhV-_wAmf_R68wqUgTKEhpIm_Kvo60EGSVxqaZL6w";

  const paidBy = data.paidBy || "";
  const recievedBy = data.recivedBy || "";
  const transactionDate = data.transactionDate;
  const transactionMethod = data.transactionMethod || "";
  const status = data.status || "";
  const transactionType = data.transactionType || "";
  try {
    const response = await axios.get(
      `${baseURL}/all-transaction?paidBy=${paidBy}&recievedBy=${recievedBy}&transactionDate=${transactionDate}&transactionMethod=${transactionMethod}&status=${status}&transactionType=${transactionType}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!response.data.success)
      return rejectWithValue("Failed to get all transactions.");

    return response.data.data;
  } catch (error: any) {
    console.log("response - ", error.response.data);
    return rejectWithValue(error.message);
  }
});

export const createTransaction = createAsyncThunk<
  Transaction,
  {
    paidBy: string;
    recievedBy: string;
    transactionDate: Date;
    amount: number;
    amountType: TransactionAmountType;
    transactionMethod: TransactionMethods;
    status: TransactionStatus;
    transactionType: TransactionType;
  },
  { rejectValue: string; state: RootState }
>("createTransaction", async (data, { rejectWithValue, getState }) => {
  // let token: string | null | undefined = getState().auth.token;
  // token = token ? token : sessionStorage.getItem("token");
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2I5YTYyNzQwMzdkYWI3ZDI2NWZiOWEiLCJ1c2VyVHlwZSI6Ik9GRklDRSIsImlhdCI6MTc0NTM3NDAyNCwiZXhwIjoxNzQ1NDYwNDI0fQ.sIYhV-_wAmf_R68wqUgTKEhpIm_Kvo60EGSVxqaZL6w";

  try {
    const response = await axios.post(`${baseURL}/create-transaction`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("response - ", response.data);

    if (!response.data.success)
      return rejectWithValue("Failed to get all transactions.");

    return response.data.data;
  } catch (error: any) {
    console.log("response - ", error.response.data);
    return rejectWithValue(error.message);
  }
});

interface StateType {
  transactions: Transaction[];
  latestCreatedTransaction: Partial<Transaction>;
  loading: boolean;
  error?: string;
}

const initialState: StateType = {
  transactions: [],
  latestCreatedTransaction: {},
  loading: false,
};

const transactionSlice = createSlice({
  name: "TransactionSlice",
  initialState: initialState,
  extraReducers(builder) {
    builder
      .addCase(getAllTransaction.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(getAllTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.latestCreatedTransaction = action.payload.reduce(
          (latest, current) => {
            return new Date(current.createdAt) > new Date(latest.createdAt)
              ? current
              : latest;
          }
        );
        state.transactions = action.payload;
      })
      .addCase(getAllTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | undefined;
      })
      .addCase(createTransaction.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.latestCreatedTransaction = action.payload;
        state.transactions.push(action.payload);
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | undefined;
      });
  },
  reducers: {},
});

export default transactionSlice.reducer;
