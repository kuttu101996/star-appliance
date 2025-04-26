// import React from 'react'
import { useSelector } from "react-redux";
import "./ServiceRequests.css";
import { AppDispatch, RootState } from "@/app/store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import {
  assignServiceRequest,
  cancelServiceRequest,
  completeServiceRequest,
  deleteServiceRequest,
  getAllServiceRequests,
  getServiceRequestById,
  updateServiceRequest,
} from "@/features/services/serviceReqSlice";
import ServiceRecords from "../ServiceRecords/ServiceRecords";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogClose,
  DialogContent,
  // DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  CustomSelectOption,
  Employee,
  Parts,
  ServiceRequest,
  User,
} from "@/types/schemaTypes";
import CustomSelect from "../../CustomSelect/CustomSelect";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { getAllEmployees } from "@/features/employee/employeeSlice";
import InputSearchSuggestion from "@/components/common/InputSearchSuggestion";
import { ServiceReqStatus } from "@/types/enumTypes";
import { getTechnicianServiceRequests } from "@/features/technician/technicianSlice";
import { getAllParts } from "@/features/parts/partsSlice";
import ServiceCompleted from "@/components/common/ServiceCompleted";
import { Textarea } from "@/components/ui/textarea";

// interface ServiceRequestsProps {
//   userType?: string | undefined;
//   userId?: string | null;
// }

const statusOptions = [
  { label: "PENDING", _id: "PENDING" },
  { label: "ASSIGNED", _id: "ASSIGNED" },
  { label: "COMPLETED", _id: "COMPLETED" },
  { label: "CANCELED", _id: "CANCELED" },
];

export const formatCustomerName = (name?: string) => {
  if (!name) return "";
  const splitName = name.split(" ");
  const firstName = splitName[0]
    ? splitName[0].charAt(0).toUpperCase() + splitName[0].slice(1).toLowerCase()
    : "";
  const lastName = splitName[1]
    ? splitName[1].charAt(0).toUpperCase() + splitName[1].slice(1).toLowerCase()
    : "";
  return `${firstName} ${lastName}`;
};

const ServiceRequests: React.FC = () => {
  // console.log(userType, userId);
  // const user = useSelector((state: RootState) => state.auth.user);
  const user: User = JSON.parse(sessionStorage.getItem("user") || "{}");
  const dispatch: AppDispatch = useDispatch();

  const serviceRequests = useSelector(
    (state: RootState) => state.services.serviceRequests
  );
  const serviceRequestError = useSelector(
    (state: RootState) => state.services.error
  );

  const parts = useSelector((state: RootState) => state.parts.parts);
  const partsError = useSelector((state: RootState) => state.parts.error);

  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);

  // const [assignTechnicianPop, setAssignTechnicianPop] = useState(false);
  const [assignTo, setAssignTo] = useState<Partial<Employee>>({});
  const [reqAssgnName, setReqAssgnName] = useState<string>("");
  const [updateStatus, setUpdateStatus] = useState<ServiceReqStatus>();

  const [selectedServiceToUpdate, setSelectedServiceToUpdate] =
    useState<ServiceRequest | null>(null);

  const [serviceDatePickerIsOpen, setServiceDatePickerIsOpen] = useState(false);
  const [serviceDoneDate, setServiceDoneDate] = useState<Date>();
  const [serviceDescription, setServiceDescription] = useState<string>("");
  const [totalCos, setTotalCos] = useState<string>("");
  const [serviceCompletedBy, setServiceCompletedBy] = useState<
    Partial<Employee>
  >({});
  const [serviceCompletedByName, setServiceCompletedByName] =
    useState<string>("");
  const [partsUsed, setPartsUsed] = useState<
    { partId?: Partial<Parts>; price?: string }[]
  >([{ partId: { _id: "", itemName: "", itemCode: "" }, price: "" }]);

  const [cancelRsn, setCancelRsn] = useState("");

  const handleUpdate = async (item: ServiceRequest) => {
    if (updateStatus === "COMPLETED") {
      if (
        !serviceDoneDate ||
        !serviceCompletedBy._id ||
        !totalCos ||
        !serviceDescription
      )
        return toast({
          title: "Missing required fields.",
          className: "bg-red-500 text-white tracking-wider",
        });
      else {
        const serviceReqStatusCompleteData = {
          _id: item._id,
          actualServiceDate: serviceDoneDate,
          serviceDescription: serviceDescription,
          partsUsed: partsUsed.map((value) => ({
            partId: value?.partId?._id,
            price: Number(value.price),
          })),
          totalCos: Number(totalCos),
          serviceDoneBy: serviceCompletedBy._id,
        };
        const resultAction = await dispatch(
          completeServiceRequest(serviceReqStatusCompleteData)
        );
        if (completeServiceRequest.fulfilled.match(resultAction)) {
          return toast({
            title: "Success ✅",
            description: "Service request updated successfully",
            className: "bg-blue-500 text-white",
          });
        } else if (completeServiceRequest.rejected.match(resultAction)) {
          const errorMessage = resultAction.payload
            ? (resultAction.payload as string) // This is where 'User not found' comes from if you use `rejectWithValue`
            : resultAction.error.message; // Fallback in case the rejection was from an uncaught error

          return toast({ title: errorMessage, variant: "destructive" });
        }
      }
    } else if (
      updateStatus === "PENDING"
      // If already assigned & convert the status from assigned to pending then remove the employeeId & employee then make the update request
    ) {
      if (item?.status === "PENDING" && updateStatus === "PENDING") {
        setAssignTo({});
        setSelectedServiceToUpdate(null);
        setReqAssgnName("");
        setIsUpdateDialogOpen(false);
        return toast({
          title: "Success ✅",
          description: "Service request updated successfully",
          className: "bg-blue-500 text-white",
        });
      } else {
        const resultAction = await dispatch(
          updateServiceRequest({ _id: item._id, status: updateStatus })
        );
        if (updateServiceRequest.fulfilled.match(resultAction)) {
          setAssignTo({});
          setSelectedServiceToUpdate(null);
          setReqAssgnName("");
          setIsUpdateDialogOpen(false);
          return toast({
            title: "Success ✅",
            description: "Service request updated successfully",
            className: "bg-blue-500 text-white",
          });
        } else if (updateServiceRequest.rejected.match(resultAction)) {
          const errorMessage = resultAction.payload
            ? (resultAction.payload as string) // This is where 'User not found' comes from if you use `rejectWithValue`
            : resultAction.error.message; // Fallback in case the rejection was from an uncaught error

          return toast({ title: errorMessage, variant: "destructive" });
        }
      }
    } else if (updateStatus === "ASSIGNED") {
      if (
        item?.status === "ASSIGNED" &&
        item.technicianId?._id === assignTo?._id
      ) {
        setAssignTo({});
        setSelectedServiceToUpdate(null);
        setReqAssgnName("");
        setIsUpdateDialogOpen(false);
        return toast({
          title: "Success ✅",
          description: "Service request canceled successfully",
          className: "bg-blue-500 text-white",
        });
      }

      if (!assignTo || !assignTo._id)
        return toast({ title: "No assignee found!", variant: "destructive" });

      const resultAction = await dispatch(
        assignServiceRequest({
          _id: item._id,
          technicianId: assignTo._id,
        })
      );
      if (assignServiceRequest.fulfilled.match(resultAction)) {
        setAssignTo({});
        setSelectedServiceToUpdate(null);
        setReqAssgnName("");
        setIsUpdateDialogOpen(false);
        return toast({
          title: "Success ✅",
          description: `Request successfully assigned to ${assignTo?.name} employee.`,
          className: "bg-blue-500 text-white",
        });
      } else if (assignServiceRequest.rejected.match(resultAction)) {
        const errorMessage = resultAction.payload
          ? (resultAction.payload as string) // This is where 'User not found' comes from if you use `rejectWithValue`
          : resultAction.error.message; // Fallback in case the rejection was from an uncaught error

        return toast({ title: errorMessage, variant: "destructive" });
      }
    } else if (updateStatus === "CANCELED") {
      if (!cancelRsn || cancelRsn.trim() === "")
        return toast({
          title: "Please enter cancel reason first.",
          variant: "destructive",
        });

      if (
        item.status === "CANCELED" &&
        updateStatus === "CANCELED" &&
        item?.cancelReason === cancelRsn
      ) {
        setAssignTo({});
        setSelectedServiceToUpdate(null);
        setReqAssgnName("");
        setIsUpdateDialogOpen(false);
        return toast({
          title: "Success ✅",
          description: "Service request canceled successfully",
          className: "bg-blue-500 text-white",
        });
      }
      const resultAction = await dispatch(
        cancelServiceRequest({ _id: item._id, cancelRsn })
      );
      if (cancelServiceRequest.fulfilled.match(resultAction)) {
        setAssignTo({});
        setSelectedServiceToUpdate(null);
        setReqAssgnName("");
        setIsUpdateDialogOpen(false);
        return toast({
          title: "Success ✅",
          description: "Service request canceled successfully",
          className: "bg-blue-500 text-white",
        });
      } else if (cancelServiceRequest.rejected.match(resultAction)) {
        const errorMessage = resultAction.payload
          ? (resultAction.payload as string) // This is where 'User not found' comes from if you use `rejectWithValue`
          : resultAction.error.message; // Fallback in case the rejection was from an uncaught error

        return toast({ title: errorMessage, variant: "destructive" });
      }
    }
  };

  const handleDelete = async (reqId: string) => {
    try {
      const resultAction = await dispatch(deleteServiceRequest({ _id: reqId }));

      if (deleteServiceRequest.fulfilled.match(resultAction)) {
        return toast({
          title: "Success",
          description: "Service request deleted successfully",
          className: "bg-blue-500 text-white",
        });
      } else if (deleteServiceRequest.rejected.match(resultAction)) {
        const errorMessage = resultAction.payload
          ? (resultAction.payload as string) // This is where 'User not found' comes from if you use `rejectWithValue`
          : resultAction.error.message; // Fallback in case the rejection was from an uncaught error

        toast({ title: errorMessage, variant: "destructive" });
      }
    } catch (error) {
      console.log("Error deleting service request." + error);
    }
  };

  useEffect(() => {
    if (user.userType === "CUSTOMER") {
      dispatch(getServiceRequestById(user?._id));
    } else if (user.userType === "TECHNICIAN") {
      dispatch(getTechnicianServiceRequests(user._id));
    } else dispatch(getAllServiceRequests());
    dispatch(getAllEmployees());
    dispatch(getAllParts());
  }, []);

  useEffect(() => {
    setUpdateStatus(selectedServiceToUpdate?.status);
  }, [selectedServiceToUpdate, setSelectedServiceToUpdate]);

  useEffect(() => {
    let total = 0;
    partsUsed.forEach((item) =>
      item.price ? (total += Number(item.price)) : 0
    );
    setTotalCos(`${total}`);
  }, [partsUsed, setPartsUsed]);

  useEffect(() => {
    if (serviceRequestError)
      toast({ title: serviceRequestError, variant: "destructive" });
    if (partsError) toast({ title: partsError, variant: "destructive" });
  }, [serviceRequestError, partsError]);

  return (
    <>
      {/* <div className="w-full flex flex-col overflow-y-auto overflow-x-hidden"> */}

      <div className="w-full">
        <Tabs
          defaultValue="Service Requests"
          className="w-full justify-start mt-4 overflow-x-auto"
        >
          {/*grid w-full grid-cols-3 bg-[#21263c] text-[#ffffff] */}
          <TabsList className="bg-transparent w-full flex justify-start gap-2 pb-0 text-xs md:text-sm lg:text-sm">
            <TabsTrigger
              className="min-w-16 text-xs md:text-sm lg:text-sm md:min-w-24 lg:min-w-24"
              value="Service Requests"
            >
              <div className="hidden md:block lg:block md:mr-1 lg:mr-1">
                Service
              </div>{" "}
              Requests
            </TabsTrigger>
            <TabsTrigger
              className="min-w-16 text-xs md:text-sm lg:text-sm md:min-w-24 lg:min-w-24"
              value="Service Records"
            >
              <div className="hidden md:block lg:block md:mr-1 lg:mr-1">
                Service
              </div>{" "}
              Records
            </TabsTrigger>
            {/* {user && user.userType === "TECHNICIAN" ? (
              <TabsTrigger
                className="min-w-16 text-xs md:text-sm lg:text-sm md:min-w-24 lg:min-w-24"
                value="stock"
              >
                Stock
              </TabsTrigger>
            ) : (
              <></>
            )} */}
          </TabsList>

          <TabsContent
            className="w-full overflow-y-auto py-3"
            value="Service Requests"
          >
            <Accordion
              type="single"
              collapsible
              className="w-full lg:grid lg:grid-cols-1"
            >
              {serviceRequests.length ? (
                serviceRequests.map((item: ServiceRequest) =>
                  item?.status === "PENDING" ||
                  item?.status === "ASSIGNED" ||
                  item?.status === "CANCELED" ? (
                    <div key={`${item.createdAt}`}>
                      <AccordionItem
                        // This value is only expecting a string
                        value={`${item.createdAt}`}
                        className={`bg-gray-50 px-4`}
                      >
                        <AccordionTrigger
                          className={`hover:no-underline w-full text-[#408dfb]`}
                        >
                          {/*  md:w-9/12 lg:w-6/12 */}
                          <div className="flex items-center justify-between w-11/12 pl-0 md:pl-2 lg:pl-2">
                            <div className="flex flex-col items-start">
                              {/* <span>Customer Name</span> */}
                              <span className="text-base md:text-2xl lg:text-xl text-[#408dfb]">
                                {formatCustomerName(item?.customerId?.name)}
                              </span>
                              <div className="flex text-gray-400 text-base md:text-base lg:text-base items-center">
                                <span className="hidden md:flex lg:flex">
                                  Request Date{" "}
                                  <span className="md:pl-1 lg:pl-1 md:pr-2 lg:pr-2">
                                    {" "}
                                    :
                                  </span>{" "}
                                </span>
                                <span>
                                  {`${
                                    item.requestDate
                                      ?.toString()
                                      .split("T")[0] || ""
                                  }`}
                                </span>
                                {new Date(item.requestDate) <= new Date() ? (
                                  <Badge
                                    className={`text-[10px] md:text-xs lg:text-xs font-normal ml-3 bg-red-600`}
                                  >
                                    High Priority
                                  </Badge>
                                ) : (
                                  <></>
                                )}
                              </div>
                            </div>

                            {/* Status badge & cus type */}
                            <div className="flex flex-col md:flex-row lg:flex-row gap-1 md:gap-2 lg:gap-2">
                              {/* Status */}
                              <div>
                                <Badge
                                  className={`text-[10px] md:text-xs lg:text-xs font-normal ${
                                    item.status === "PENDING"
                                      ? "bg-violet-500 hover:bg-violet-400"
                                      : item.status === "ASSIGNED"
                                      ? "bg-orange-500 hover:bg-orange-400"
                                      : item.status === "CANCELED"
                                      ? "bg-red-500 hover:bg-red-400"
                                      : ""
                                  }`}
                                >
                                  {item.status === "PENDING"
                                    ? "Pending"
                                    : item.status === "ASSIGNED"
                                    ? "Assigned"
                                    : item.status === "CANCELED"
                                    ? "Canceled"
                                    : ""}
                                </Badge>
                              </div>

                              {/* Cus Type */}
                              <div>
                                {/* {item.customerId?.customerType === "AMC" ? ( */}
                                <Badge
                                  className={`text-[10px] md:text-xs lg:text-xs flex items-center justify-center font-normal bg-[#408dfb] hover:bg-blue-500`}
                                >
                                  {item.customerId?.customerType}
                                </Badge>
                                {/* ) : (
                                  <></>
                                )} */}
                              </div>
                            </div>
                          </div>
                        </AccordionTrigger>

                        {/*  */}
                        <AccordionContent className="text-xs md:text-[11px] lg:text-xs rounded-sm py-2 md:py-4 lg:py-4">
                          <div className="px-0 md:px-6 lg:px-3 w-full flex items-start justify-between">
                            <div className="w-[17rem] flex flex-col gap-2">
                              {/* Mobile */}
                              <div className="flex flex-col md:flex-row lg:flex-row items-start md:items-center lg:items-center font-medium text-gray-700">
                                <span className="md:flex-1 lg:flex-1">
                                  Cus Mobile
                                </span>
                                <span className="hidden md:block lg:block text-xs tracking-wide md:flex-1 lg:flex-1 text-center">
                                  <span>→</span>
                                </span>
                                <span className="hidden md:block lg:block ml-2 md:ml-2 lg:ml-2 md:flex-1 lg:flex-1 text-right text-[#408dfb]">
                                  {item.customerId?.mobile}
                                </span>

                                <span className="flex md:hidden lg:hidden">
                                  <span className="ml-3">→</span>
                                  <span className="ml-2 md:ml-2 lg:ml-2 text-right text-[#408dfb]">
                                    {item.customerId?.mobile}
                                  </span>
                                </span>
                              </div>

                              {/* Pincode */}
                              <div className="flex flex-col md:flex-row lg:flex-row items-start md:items-center lg:items-center font-medium text-gray-700">
                                <span className="md:flex-1 lg:flex-1">
                                  Pincode
                                </span>
                                <span className="hidden md:block lg:block text-xs tracking-wide md:flex-1 lg:flex-1 text-center">
                                  <span>→</span>
                                </span>
                                <span className="hidden md:block lg:block ml-2 md:ml-2 lg:ml-2 md:flex-1 lg:flex-1 text-right text-[#408dfb]">
                                  {item.customerId?.pincode}
                                </span>

                                <span className="flex md:hidden lg:hidden">
                                  <span className="ml-3">→</span>
                                  <span className="ml-2 md:ml-2 lg:ml-2 text-right text-[#408dfb]">
                                    {item.customerId?.pincode}
                                  </span>
                                </span>
                              </div>

                              {/* Type */}
                              <div className="flex flex-col md:flex-row lg:flex-row md:items-center lg:items-center font-medium text-gray-700">
                                <span className="flex-1">Type</span>
                                <span className="hidden md:block lg:block text-xs tracking-wide flex-1 text-center">
                                  <span>→</span>
                                </span>
                                <span className="hidden md:block lg:block ml-2 md:ml-2 lg:ml-2 flex-1 text-right text-[#408dfb]">
                                  {item.customerId?.customerType}
                                </span>

                                <span className="flex md:hidden lg:hidden">
                                  <span className="ml-3">→</span>
                                  <span className="ml-2 md:ml-2 lg:ml-2 text-right text-[#408dfb]">
                                    {item.customerId?.customerType}
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
                                    item.customerId?.installationDate
                                      ?.toString()
                                      .split("T")[0] || ""
                                  }`}
                                </span>

                                <span className="flex md:hidden lg:hidden">
                                  <span className="ml-3">→</span>
                                  <span className="ml-2 md:ml-2 lg:ml-2 text-right text-[#408dfb]">
                                    {`${
                                      item.customerId?.installationDate
                                        ?.toString()
                                        .split("T")[0] || ""
                                    }`}
                                  </span>
                                </span>
                              </div>

                              {/* Technician Name & Mobile */}
                              {item.technicianId ? (
                                <>
                                  <hr />
                                  <div className="flex flex-col md:flex-row lg:flex-row items-start md:items-center lg:items-center font-medium text-gray-700">
                                    <span className="md:flex-1 lg:flex-1">
                                      Assign To
                                    </span>
                                    <span className="hidden md:block lg:block text-xs tracking-wide md:flex-1 lg:flex-1 text-center">
                                      <span>→</span>
                                    </span>
                                    <span className="hidden md:block lg:block ml-2 md:ml-2 lg:ml-2 md:flex-1 lg:flex-1 text-right text-[#408dfb]">
                                      {item.technicianId.name}
                                    </span>

                                    <span className="flex md:hidden lg:hidden">
                                      <span className="ml-3">→</span>
                                      <span className="ml-2 md:ml-2 lg:ml-2 text-right text-[#408dfb]">
                                        {item.technicianId.name}
                                      </span>
                                    </span>
                                  </div>

                                  <div className="flex flex-col md:flex-row lg:flex-row items-start md:items-center lg:items-center font-medium text-gray-700">
                                    <span className="md:flex-1 lg:flex-1">
                                      Emp Mobile
                                    </span>
                                    <span className="hidden md:block lg:block text-xs tracking-wide md:flex-1 lg:flex-1 text-center">
                                      <span>→</span>
                                    </span>
                                    <span className="hidden md:block lg:block ml-2 md:ml-2 lg:ml-2 md:flex-1 lg:flex-1 text-right text-[#408dfb]">
                                      {item.technicianId.mobile}
                                    </span>

                                    <span className="flex md:hidden lg:hidden">
                                      <span className="ml-3">→</span>
                                      <span className="ml-2 md:ml-2 lg:ml-2 text-right text-[#408dfb]">
                                        {item.technicianId.mobile}
                                      </span>
                                    </span>
                                  </div>
                                </>
                              ) : (
                                <></>
                              )}
                            </div>

                            {/* Update & Delete service request */}
                            <div className="flex md:flex-row lg:flex-row gap-1 md:gap-2 lg:gap-2">
                              <Dialog
                                open={isUpdateDialogOpen}
                                onOpenChange={setIsUpdateDialogOpen}
                              >
                                <DialogTrigger asChild>
                                  <button
                                    onClick={() =>
                                      setSelectedServiceToUpdate(item)
                                    }
                                    className="font-normal text-white text-[10px] md:text-xs lg:text-xs bg-[#408dfb] hover:bg-blue-500 h-5 md:h-6 lg:h-6 rounded-sm px-1 md:px-4 lg:px-4 flex items-center justify-center"
                                  >
                                    Update
                                  </button>
                                </DialogTrigger>
                                <DialogContent className="max-w-80 rounded-lg sm:max-w-[425px]">
                                  <DialogHeader>
                                    <DialogTitle className="text-sm md:text-lg lg:text-lg text-center tracking-wide">
                                      Update Service Request
                                    </DialogTitle>
                                    {/* <DialogDescription className="text-xs md:text-sm lg:text-sm text-center"></DialogDescription> */}
                                  </DialogHeader>
                                  <div className="grid gap-4 py-2 md:py-4 lg:py-4">
                                    {/* Change Status */}
                                    <div className="grid grid-cols-1 items-center">
                                      <span className="text-[10px] md:text-xs md:mb-1 font-medium tracking-wide text-red-500">
                                        Change Status *
                                      </span>
                                      {/* <Input
                                        type="text"
                                        value={selectedServiceToUpdate?.status}
                                        placeholder="Status"
                                      /> */}
                                      <CustomSelect
                                        options={statusOptions}
                                        selectedValue={{
                                          _id: selectedServiceToUpdate?.status as ServiceReqStatus,
                                          label:
                                            selectedServiceToUpdate?.status as ServiceReqStatus,
                                        }}
                                        onSelect={(
                                          value: CustomSelectOption
                                        ) => {
                                          setUpdateStatus(
                                            value._id as ServiceReqStatus
                                          );
                                          setSelectedServiceToUpdate(
                                            (prev: ServiceRequest | null) => {
                                              if (!prev) return prev;

                                              return {
                                                ...prev,
                                                status:
                                                  value._id as ServiceReqStatus,
                                              };
                                            }
                                          );
                                        }}
                                        placeholder="Select status"
                                        className="w-full font-normal text-xs md:text-sm lg:text-sm"
                                      />
                                    </div>

                                    {/* Other fields to update */}
                                    {selectedServiceToUpdate?.status ===
                                    "ASSIGNED" ? (
                                      <InputSearchSuggestion
                                        inputClass="text-start bg-gray-50 text-gray-800 border rounded h-10 px-3 text-sm font-normal border-white"
                                        suggestionItemsClass="text-black text-sm"
                                        placeholder="Select Technician"
                                        inputValue={reqAssgnName}
                                        setInputValue={setReqAssgnName}
                                        selectedEmp={setAssignTo}
                                        name="technician"
                                      />
                                    ) : selectedServiceToUpdate?.status ===
                                      "COMPLETED" ? (
                                      <ServiceCompleted
                                        serviceDatePickerIsOpen={
                                          serviceDatePickerIsOpen
                                        }
                                        setServiceDatePickerIsOpen={
                                          setServiceDatePickerIsOpen
                                        }
                                        serviceDoneDate={serviceDoneDate}
                                        setServiceDoneDate={setServiceDoneDate}
                                        serviceCompletedByName={
                                          serviceCompletedByName
                                        }
                                        setServiceCompletedByName={
                                          setServiceCompletedByName
                                        }
                                        serviceCompletedBy={serviceCompletedBy}
                                        setServiceCompletedBy={
                                          setServiceCompletedBy
                                        }
                                        partsUsed={partsUsed}
                                        setPartsUsed={setPartsUsed}
                                        parts={parts}
                                        serviceDescription={serviceDescription}
                                        setServiceDescription={
                                          setServiceDescription
                                        }
                                        totalCos={totalCos}
                                        setTotalCos={setTotalCos}
                                      />
                                    ) : selectedServiceToUpdate?.status ===
                                      "CANCELED" ? (
                                      <div className="grid w-full gap-1.5">
                                        <Textarea
                                          value={cancelRsn}
                                          onChange={(e) =>
                                            setCancelRsn(e.target.value)
                                          }
                                          placeholder="Reason here..."
                                        />{" "}
                                        <p className="text-sm text-muted-foreground">
                                          <span className="font-semibold text-red-500">
                                            *
                                          </span>{" "}
                                          Please explain the exact cancel reason
                                          here.
                                        </p>
                                      </div>
                                    ) : (
                                      <></>
                                    )}
                                  </div>

                                  <DialogFooter className="gap-2 md:gap-1">
                                    <DialogClose>
                                      <button className="bg-gray-200 w-full hover:bg-gray-100 border border-gray-300 hover:border-gray-500 transition-all duration-300 font-medium px-4 h-8 rounded-sm text-xs">
                                        Cancel
                                      </button>
                                    </DialogClose>
                                    <button
                                      onClick={() => handleUpdate(item)}
                                      className="bg-[#408dfb] hover:bg-blue-500 transition-all duration-300 font-medium px-4 h-8 rounded-sm text-xs text-white"
                                    >
                                      Submit
                                    </button>
                                    {/* <Button type="submit">Save changes</Button> */}
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>

                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <button className="font-normal text-white text-[10px] md:text-xs lg:text-xs bg-red-500 hover:bg-red-600 h-5 md:h-6 lg:h-6 rounded-sm px-1 md:px-4 lg:px-4">
                                    Delete
                                  </button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="max-w-60 md:max-w-72">
                                  <AlertDialogHeader>
                                    <AlertDialogTitle className="text-xs md:text-base lg:text-base text-gray-700 text-center">
                                      Are you sure you want to delete this
                                      service request?
                                    </AlertDialogTitle>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel className="h-6 text-xs md:text-xs lg:text-xs border-gray-400">
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      className="h-6 text-xs md:text-xs lg:text-xs bg-red-500 hover:bg-red-600"
                                      onClick={() => handleDelete(item._id)}
                                    >
                                      Continue
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </div>
                  ) : (
                    <></>
                  )
                )
              ) : (
                <span>
                  No Pending or Assigned Service request found, try create one.
                </span>
              )}
            </Accordion>
          </TabsContent>
          <TabsContent
            className="w-full overflow-y-auto px-3"
            value="Service Records"
          >
            {user.userType === "TECHNICIAN" &&
              "All serice records, completed by this Technician will display here."}
            <ServiceRecords />
          </TabsContent>
          {user && user.userType === "TECHNICIAN" ? (
            <TabsContent className="w-full overflow-y-auto px-4" value="stock">
              Stock
            </TabsContent>
          ) : (
            <></>
          )}
        </Tabs>
      </div>
      {/* </div> */}
    </>
  );
};

export default ServiceRequests;
