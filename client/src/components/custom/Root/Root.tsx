// import React from "react";

import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar/Navbar";
import LeftNavbar from "../Navbar/LeftNavigation/LeftNavbar";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";

const Root = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div className="full-page flex overflow-hidden h-screen max-h-screen">
      {user?.userType === "TECHNICIAN" || user?.userType === "CUSTOMER" ? (
        <></>
      ) : (
        <LeftNavbar />
      )}
      <div
        className={`${
          user?.userType === "TECHNICIAN" || user?.userType === "CUSTOMER"
            ? "w-full"
            : "w-[92%]"
        } md:w-full lg:w-full h-full flex flex-col`}
      >
        <Navbar />
        <div className="pb-7 px-4 md:px-6 lg:px-6 overflow-auto h-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Root;
