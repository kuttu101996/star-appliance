import { configureStore } from "@reduxjs/toolkit";
import appReducer from "../features/appSlice/appSlice";
import authReducer from "../features/auth/authSlice";
import userReducer from "../features/user/userSlice";
import customerReducer from "../features/customer/customerSlice"; // Import the customerSlice
import employeeReducer from "../features/employee/employeeSlice";
import serviceRequestReducers from "../features/services/serviceReqSlice";
import serviceRecordReducers from "../features/services/serviceRecordSlice";
import stockReducers from "../features/stock/skockSlice";
import serviceTypeReducer from "../features/services/serviceTypeSlice";
import partsReducers from "../features/parts/partsSlice";
import transactionReducers from "../features/transaction/transactionSlice";
import technicianReducers from "../features/technician/technicianSlice";
import purchaseReducers from "../features/purchase/purchaseSlice";
// import inventoryReducers from "../features/inventory/inventorySlice";

export const store = configureStore({
  reducer: {
    todos: appReducer,
    auth: authReducer,
    users: userReducer,
    customers: customerReducer, // Add customerReducer to the store
    employees: employeeReducer,
    services: serviceRequestReducers,
    serviceRecords: serviceRecordReducers,
    stock: stockReducers,
    serviceType: serviceTypeReducer,
    parts: partsReducers,
    transactions: transactionReducers,
    technicians: technicianReducers,
    purchase: purchaseReducers,
    // inventory: inventoryReducers,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
