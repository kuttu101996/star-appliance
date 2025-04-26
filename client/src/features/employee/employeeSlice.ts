import { RootState } from "@/app/store";
import { EmployeeType } from "@/types/enumTypes";
import { ApiResponse, Employee } from "@/types/schemaTypes";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export const createEmployee = createAsyncThunk<
  Employee,
  Partial<Employee>,
  { rejectValue: string; state: RootState }
>("createEmployee", async (data, { rejectWithValue, getState }) => {
  // let token: string | null | undefined = getState().auth.token;
  // token = token ? token : sessionStorage.getItem("token");
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2I5YTYyNzQwMzdkYWI3ZDI2NWZiOWEiLCJ1c2VyVHlwZSI6Ik9GRklDRSIsImlhdCI6MTc0NTM3NDAyNCwiZXhwIjoxNzQ1NDYwNDI0fQ.sIYhV-_wAmf_R68wqUgTKEhpIm_Kvo60EGSVxqaZL6w";

  try {
    const response = await fetch(
      `http://localhost:1300/employee/add-employee`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add token to Authorization header
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      return rejectWithValue("Failed to create user");
    }

    const result: ApiResponse<Employee> = await response.json();
    if (result.success) {
      return result.result; // Extract result if success
    } else {
      return rejectWithValue(result.message); // Handle API error
    }
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const getAllEmployees = createAsyncThunk<
  Employee[],
  void,
  { rejectValue: string; state: RootState }
>("getEmployees", async (_, { rejectWithValue, getState }) => {
  // let token: string | null | undefined = getState().auth.token;
  // token = token ? token : sessionStorage.getItem("token");
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2I5YTYyNzQwMzdkYWI3ZDI2NWZiOWEiLCJ1c2VyVHlwZSI6Ik9GRklDRSIsImlhdCI6MTc0NTM3NDAyNCwiZXhwIjoxNzQ1NDYwNDI0fQ.sIYhV-_wAmf_R68wqUgTKEhpIm_Kvo60EGSVxqaZL6w";

  try {
    const response = await axios.get(`http://localhost:1300/employee`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.data.success) {
      return rejectWithValue(response.data.message);
    }
    // console.log(response.data.data);
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const getAllTechnicians = createAsyncThunk<
  Employee[],
  void,
  { rejectValue: string; state: RootState }
>("getTechnicians", async (_, { rejectWithValue, getState }) => {
  // let token: string | null | undefined = getState().auth.token;
  // token = token ? token : sessionStorage.getItem("token");
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2I5YTYyNzQwMzdkYWI3ZDI2NWZiOWEiLCJ1c2VyVHlwZSI6Ik9GRklDRSIsImlhdCI6MTc0NTM3NDAyNCwiZXhwIjoxNzQ1NDYwNDI0fQ.sIYhV-_wAmf_R68wqUgTKEhpIm_Kvo60EGSVxqaZL6w";

  try {
    const response = await axios.get(
      `http://localhost:1300/employee/technician`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.data.success) {
      return rejectWithValue(response.data.message);
    }
    // console.log("API response", response.data.data);
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

interface EmployeeState {
  officeEmp: Employee[];
  employees: Employee[];
  technicians: Employee[];
  loading: boolean;
  error?: string; // Optional error message
}

const initialState: EmployeeState = {
  officeEmp: [],
  employees: [],
  technicians: [],
  loading: false,
};

export const employeeSlice = createSlice({
  name: "employeeSlice",
  initialState,
  extraReducers(builder) {
    builder.addCase(createEmployee.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(
      createEmployee.fulfilled,
      (state, action: PayloadAction<Employee>) => {
        state.loading = false;
        state.employees.push(action.payload);
      }
    );
    builder.addCase(createEmployee.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string | undefined;
    });
    builder.addCase(getAllEmployees.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(
      getAllEmployees.fulfilled,
      (state, action: PayloadAction<Employee[]>) => {
        state.loading = false;
        state.officeEmp = action.payload.filter(
          (item) => item.employeeType === EmployeeType.OFFICE
        );
        state.employees = action.payload;
      }
    );
    builder.addCase(getAllEmployees.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string | undefined;
    });
    builder.addCase(getAllTechnicians.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(
      getAllTechnicians.fulfilled,
      (state, action: PayloadAction<Employee[]>) => {
        state.loading = false;
        state.technicians = action.payload;
      }
    );
    builder.addCase(getAllTechnicians.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string | undefined;
    });
  },
  reducers: {},
});

export default employeeSlice.reducer;
