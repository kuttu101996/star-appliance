// import React from 'react'

import { useSelector } from "react-redux";
import ServiceRequests from "../../ServiceOperations/ServiceRequests/ServiceRequests";
import { RootState } from "@/app/store";
import HomeTopLeftSide from "../../HomeTopLeftSide/HomeTopLeftSide";

const TechnicianHome = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div className="w-full flex flex-col overflow-y-auto overflow-x-hidden">
      <div className="flex items-center justify-between">
        <HomeTopLeftSide />
      </div>
      <ServiceRequests userType={user?.userType} userId={user?.id || null} />
    </div>
  );
};

export default TechnicianHome;
