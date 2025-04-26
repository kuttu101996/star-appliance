// import { useState } from 'react'
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Root from "./components/custom/Root/Root";
import Login from "./components/custom/Login/Login";
import CusRoot from "./components/custom/CustomerOperations/CusRoot";
import CusServiceCard from "./components/custom/CustomerOperations/CusServiceCard/CusServiceCard";
import CusServiceRequest from "./components/custom/CustomerOperations/CusServiceRequest/CusServiceRequest";
// import UserComponent from "./components/custom/UserComponent/UserComponent";
import ProtectedRoutes from "./components/custom/ProtectedRoutes/ProtectedRoutes";
import InventoryRoot from "./components/custom/InventoryOperations/InventoryRoot";
// import MainStock from "./components/custom/InventoryOperations/MainStock/MainStock";
// import OfficeStock from "./components/custom/InventoryOperations/OfficeStock/OfficeStock";
import InventoryProtection from "./components/custom/InventoryOperations/InventoryProtection";
import NotFound from "./NotFound";
import TechnicianRoot from "./components/custom/TechnicianOperations/TechnicianRoot";
import TechnicianProfile from "./components/custom/TechnicianOperations/TechnicianProfile/TechnicianProfile";
import AllTechnicians from "./components/custom/TechnicianOperations/AllTechnicians/AllTechnicians";
import Unauthorize from "./Unauthorize";
import ServiceRoot from "./components/custom/ServiceOperations/ServiceRoot";
import ServiceRequests from "./components/custom/ServiceOperations/ServiceRequests/ServiceRequests";
import ServiceRecords from "./components/custom/ServiceOperations/ServiceRecords/ServiceRecords";
import AdminRoot from "./components/custom/AdminOperations/AdminRoot";
import AdminProtection from "./components/custom/AdminOperations/AdminProtection";
import AdminMainPage from "./components/custom/AdminOperations/AdminMainPage/AdminMainPage";
import EmployeeRoot from "./components/custom/EmployeeOperations/EmployeeRoot";
import Employees from "./components/custom/EmployeeOperations/Employees/Employees";
import { RootState } from "./app/store";
import { useSelector } from "react-redux";
import UserProfile from "./components/custom/UserComponent/UserProfile/UserProfile";
import OfficeEmpHome from "./components/custom/EmployeeOperations/OfficeEmpHome/OfficeEmpHome";
import TechnicianHome from "./components/custom/TechnicianOperations/TechnicianHome/TechnicianHome";
import CustomerHome from "./components/custom/CustomerOperations/CustomerHome/CustomerHome";

function App() {
  // const user = useSelector((state: RootState) => state.auth.user);
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoutes>
            <Root />
          </ProtectedRoutes>
        }
      >
        {/* <Route path="" element={<h1>Home</h1>} /> */}
        <Route
          path=""
          element={
            user && user.userType === "ADMIN" ? (
              <ProtectedRoutes>
                <AdminProtection>
                  <AdminMainPage />
                </AdminProtection>
              </ProtectedRoutes>
            ) : user && user.userType === "OFFICE" ? (
              <ProtectedRoutes>
                <OfficeEmpHome />
                {/* <UserComponent /> */}
              </ProtectedRoutes>
            ) : user && user.userType === "TECHNICIAN" ? (
              <ProtectedRoutes>
                <TechnicianHome />
              </ProtectedRoutes>
            ) : user && user.userType === "CUSTOMER" ? (
              <ProtectedRoutes>
                <CustomerHome />
              </ProtectedRoutes>
            ) : (
              <></>
            )
          }
        />
        <Route
          path="profile"
          element={
            <ProtectedRoutes>
              <UserProfile />
            </ProtectedRoutes>
          }
        />
        <Route
          path="employees"
          element={
            <AdminProtection>
              <EmployeeRoot />
            </AdminProtection>
          }
        >
          <Route path="" element={<Employees />} />
        </Route>

        <Route path="customer" element={<CusRoot />}>
          <Route
            path=""
            element={
              <ProtectedRoutes>
                <CusServiceCard />
              </ProtectedRoutes>
            }
          />
          <Route
            path="service-records"
            element={
              <ProtectedRoutes>
                <CusServiceRequest />
              </ProtectedRoutes>
            }
          />
        </Route>

        <Route path="service" element={<ServiceRoot />}>
          <Route
            path=""
            element={
              <>
                <ServiceRequests />
              </>
            }
          />
          <Route
            path="service-records"
            element={
              <ProtectedRoutes>
                <ServiceRecords />
              </ProtectedRoutes>
            }
          />
        </Route>

        {/* <Route path="inventory" element={<InventoryRoot />}></Route> */}
        <Route
          path="inventory"
          element={
            <ProtectedRoutes>
              <InventoryProtection>
                <InventoryRoot />
              </InventoryProtection>
            </ProtectedRoutes>
          }
        />
        {/* <Route
            path="office-stock"
            element={
              <ProtectedRoutes>
                <InventoryProtection>
                  <OfficeStock />
                </InventoryProtection>
              </ProtectedRoutes>
            }
          /> */}

        <Route path="technician" element={<TechnicianRoot />}>
          <Route path="" element={<AllTechnicians />} />
          <Route path=":id" element={<TechnicianProfile />} />
        </Route>

        <Route path="admin" element={<AdminRoot />}>
          <Route
            path=""
            element={
              <AdminProtection>
                <AdminMainPage />
              </AdminProtection>
            }
          />
        </Route>
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/*" element={<NotFound />} />
      <Route path="/not-authorize" element={<Unauthorize />} />
    </Routes>
  );
}

export default App;
