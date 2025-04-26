// import React from 'react'

import { AppDispatch, RootState } from "@/app/store";
import { ServiceRecord, User } from "@/types/schemaTypes";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { getAllServiceRecords } from "@/features/services/serviceRecordSlice";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useDispatch } from "react-redux";

const ServiceRecords = () => {
  // const user = useSelector((state: RootState) => state.auth.user);
  const user: User = JSON.parse(sessionStorage.getItem("user") || "{}");
  const dispatch: AppDispatch = useDispatch();
  const serviceRecords = useSelector(
    (state: RootState) => state.serviceRecords.serviceRecords
  );
  const serviceRecordError = useSelector(
    (state: RootState) => state.serviceRecords.error
  );

  useEffect(() => {
    if (user.userType === "OFFICE" || user.userType === "ADMIN")
      dispatch(getAllServiceRecords());
  }, []);

  useEffect(() => {
    if (serviceRecordError)
      toast({ title: serviceRecordError, variant: "destructive" });
  }, [serviceRecordError]);

  const formatCustomerName = (name?: string) => {
    if (!name) return "";
    const splitName = name.split(" ");
    const firstName = splitName[0]
      ? splitName[0].charAt(0).toUpperCase() +
        splitName[0].slice(1).toLowerCase()
      : "";
    const lastName = splitName[1]
      ? splitName[1].charAt(0).toUpperCase() +
        splitName[1].slice(1).toLowerCase()
      : "";
    return `${firstName} ${lastName}`;
  };

  return (
    <Accordion
      type="single"
      collapsible
      className="w-full lg:grid lg:grid-cols-1"
    >
      {serviceRecords.length ? (
        serviceRecords.map((item: ServiceRecord) => (
          <div key={`${item.createdAt}`}>
            <AccordionItem
              // This value is only expecting a string
              value={`${item.createdAt}`}
              className="bg-gray-50 px-4"
            >
              <AccordionTrigger className="hover:no-underline w-full text-[#408dfb]">
                {/*  md:w-9/12 lg:w-6/12 */}
                <div className="flex items-center justify-between w-11/12 pl-0 md:pl-2 lg:pl-2">
                  <div className="flex flex-col items-start">
                    {/* <span>Customer Name</span> */}
                    <span className="text-base md:text-2xl lg:text-xl text-[#408dfb]">
                      {formatCustomerName(item?.serviceReq?.customerId?.name)}
                    </span>
                    <span className="flex text-gray-400 text-[10px] md:text-xs lg:text-xs">
                      <span className="hidden md:flex lg:flex">
                        Service Done Date{" "}
                        <span className="md:pl-1 lg:pl-1 md:pr-2 lg:pr-2">
                          {" "}
                          :
                        </span>{" "}
                      </span>
                      <span>
                        {`${
                          item.actualServiceDate?.toString().split("T")[0] || ""
                        }`}
                      </span>
                    </span>
                    <span className="flex text-gray-400 text-[10px] md:text-xs lg:text-xs">
                      <span className="hidden md:flex lg:flex">
                        Request Date{" "}
                        <span className="md:pl-1 lg:pl-1 md:pr-2 lg:pr-2">
                          {" "}
                          :
                        </span>{" "}
                      </span>
                      <span>
                        {`${
                          item.serviceDueDate?.toString().split("T")[0] || ""
                        }`}
                      </span>
                    </span>
                  </div>

                  {/* Status badge & cus type */}
                  <div className="flex flex-col md:flex-row lg:flex-row gap-1 md:gap-2 lg:gap-2">
                    {/* Cus Type */}
                    <Badge className="bg-teal-500 hover:bg-teal-500 font-normal tracking-wide">
                      Total: {item.totalCos}
                    </Badge>
                    <div>
                      <Badge
                        className={`text-[10px] md:text-xs lg:text-xs flex items-center justify-center font-normal bg-[#408dfb] hover:bg-blue-500`}
                      >
                        {item.serviceReq?.customerId?.customerType}
                      </Badge>
                    </div>
                  </div>
                </div>
              </AccordionTrigger>

              {/*  */}
              <AccordionContent className="text-xs md:text-[11px] lg:text-xs rounded-sm py-2 md:py-4 lg:py-4">
                <div className="px-0 md:px-6 lg:px-3 w-full flex items-start justify-between">
                  <div className="w-[22rem] flex flex-col gap-2">
                    {/* Customer Mobile */}
                    <div className="flex flex-col md:flex-row lg:flex-row items-start md:items-center lg:items-center font-medium text-gray-700">
                      <span className="md:flex-1 lg:flex-1">Customer No.</span>
                      <span className="hidden md:block lg:block text-xs tracking-wide md:flex-1 lg:flex-1 text-center">
                        <span>→</span>
                      </span>
                      <span className="hidden md:block lg:block ml-2 md:ml-2 lg:ml-2 md:flex-1 lg:flex-1 text-right text-[#408dfb]">
                        {item.serviceReq?.customerId?.mobile}
                      </span>

                      <span className="flex md:hidden lg:hidden">
                        <span className="ml-3">→</span>
                        <span className="ml-2 md:ml-2 lg:ml-2 text-right text-[#408dfb]">
                          {item.serviceReq?.customerId?.mobile}
                        </span>
                      </span>
                    </div>
                    {/* Technician Name & Mobile */}
                    <div className="flex flex-col md:flex-row lg:flex-row items-start md:items-center lg:items-center font-medium text-gray-700">
                      <span className="md:flex-1 lg:flex-1">Entry Made By</span>
                      <span className="hidden md:block lg:block text-xs tracking-wide md:flex-1 lg:flex-1 text-center">
                        <span>→</span>
                      </span>
                      <span className="hidden md:block lg:block ml-2 md:ml-2 lg:ml-2 md:flex-1 lg:flex-1 text-right text-[#408dfb]">
                        {item.createdUser?.displayName}
                      </span>

                      <span className="flex md:hidden lg:hidden">
                        <span className="ml-3">→</span>
                        <span className="ml-2 md:ml-2 lg:ml-2 text-right text-[#408dfb]">
                          {item.createdUser?.displayName}
                        </span>
                      </span>
                    </div>
                    <>
                      <div className="flex flex-col md:flex-row lg:flex-row items-start md:items-center lg:items-center font-medium text-gray-700">
                        <span className="md:flex-1 lg:flex-1">
                          Completed By
                        </span>
                        <span className="hidden md:block lg:block text-xs tracking-wide md:flex-1 lg:flex-1 text-center">
                          <span>→</span>
                        </span>
                        <span className="hidden md:block lg:block ml-2 md:ml-2 lg:ml-2 md:flex-1 lg:flex-1 text-right text-[#408dfb]">
                          {item.serviceDoneTechnician?.name}
                        </span>

                        <span className="flex md:hidden lg:hidden">
                          <span className="ml-3">→</span>
                          <span className="ml-2 md:ml-2 lg:ml-2 text-right text-[#408dfb]">
                            {item.serviceDoneTechnician?.name}
                          </span>
                        </span>
                      </div>
                    </>
                    {item.serviceDoneTechnician?._id ===
                    item.serviceReq?.technicianId?._id ? (
                      <></>
                    ) : (
                      <>
                        <div className="flex flex-col md:flex-row lg:flex-row items-start md:items-center lg:items-center font-medium text-gray-700">
                          <span className="md:flex-1 lg:flex-1">
                            Assigned Technician
                          </span>
                          <span className="hidden md:block lg:block text-xs tracking-wide md:flex-1 lg:flex-1 text-center">
                            <span>→</span>
                          </span>
                          <span className="hidden md:block lg:block ml-2 md:ml-2 lg:ml-2 md:flex-1 lg:flex-1 text-right text-[#408dfb]">
                            {item.serviceReq?.technicianId?.name}
                          </span>

                          <span className="flex md:hidden lg:hidden">
                            <span className="ml-3">→</span>
                            <span className="ml-2 md:ml-2 lg:ml-2 text-right text-[#408dfb]">
                              {item.serviceReq?.technicianId?.name}
                            </span>
                          </span>
                        </div>
                      </>
                    )}

                    {/* Pincode */}
                    <div className="flex flex-col md:flex-row lg:flex-row items-start md:items-center lg:items-center font-medium text-gray-700">
                      <span className="md:flex-1 lg:flex-1">Pincode</span>
                      <span className="hidden md:block lg:block text-xs tracking-wide md:flex-1 lg:flex-1 text-center">
                        <span>→</span>
                      </span>
                      <span className="hidden md:block lg:block ml-2 md:ml-2 lg:ml-2 md:flex-1 lg:flex-1 text-right text-[#408dfb]">
                        {item.serviceReq?.customerId?.pincode}
                      </span>

                      <span className="flex md:hidden lg:hidden">
                        <span className="ml-3">→</span>
                        <span className="ml-2 md:ml-2 lg:ml-2 text-right text-[#408dfb]">
                          {item.serviceReq?.customerId?.pincode}
                        </span>
                      </span>
                    </div>

                    {/* Install date */}
                    <div className="flex flex-col md:flex-row lg:flex-row md:items-center lg:items-center font-medium text-gray-700">
                      <span className="flex-1">Install Date</span>
                      <span className="hidden md:block lg:block text-xs tracking-wide flex-1 text-center">
                        <span>→</span>
                      </span>
                      <span className="hidden md:block lg:block ml-2 md:ml-2 lg:ml-2 flex-1 text-right text-[#408dfb]">
                        {`${
                          item.serviceReq?.customerId?.installationDate
                            ?.toString()
                            .split("T")[0] || ""
                        }`}
                      </span>

                      <span className="flex md:hidden lg:hidden">
                        <span className="ml-3">→</span>
                        <span className="ml-2 md:ml-2 lg:ml-2 text-right text-[#408dfb]">
                          {`${
                            item.serviceReq?.customerId?.installationDate
                              ?.toString()
                              .split("T")[0] || ""
                          }`}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </div>
        ))
      ) : (
        <span>💥 No Service Record found so far!</span>
      )}
    </Accordion>
  );
};

export default ServiceRecords;
