// import { ChevronsUpDown, Check, MinusIcon, PlusIcon } from "lucide-react";
import { CalendarIcon } from "lucide-react";
import HomeTopLeftSide from "../../HomeTopLeftSide/HomeTopLeftSide";
import ServiceRequests from "../../ServiceOperations/ServiceRequests/ServiceRequests";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../../../ui/drawer";
import { ChangeEvent, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Customer,
  CustomSelectOption,
  Employee,
  ServiceType,
} from "../../../../types/schemaTypes";
import CustomSelect from "../../CustomSelect/CustomSelect";
import { format } from "date-fns";
import { Calendar } from "../../../ui/calendar";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../app/store";
import { useDispatch } from "react-redux";
// import { getAllCustomers } from "../../../../features/customer/customerSlice";
import { getAllEmployees } from "../../../../features/employee/employeeSlice";
import {
  createServiceRequest,
  // getAllServiceRequests,
} from "../../../../features/services/serviceReqSlice";
import { CustomerType, ServiceReqStatus } from "../../../../types/enumTypes";
// import Combobox from "../../../shadcn_like_custom_comps/Combobox/Combobox";
import { PopoverC } from "../../../shadcn_like_custom_comps/Popover/Popover";
import InputSearchSuggestion from "../../../common/InputSearchSuggestion";
import { getAllServiceTypes } from "../../../../features/services/serviceTypeSlice";

const statusOptions = [
  { label: "PENDING", _id: "PENDING" },
  { label: "ASSIGNED", _id: "ASSIGNED" },
  // { label: "COMPLETED", _id: "COMPLETED" },
];

// const cusTypeOptions = [
//   { label: "In Warranty", value: CustomerType.IN_WARRANTY },
//   { label: "AMC", value: CustomerType.AMC },
//   { label: "Out of Warranty", value: CustomerType.OUT_OF_WARRANTY },
//   { label: "Extended Warranty", value: CustomerType.EXTENDED_WARRANTY },
// ];

const OfficeEmpHome = () => {
  const { toast } = useToast();
  // const user = useSelector((state: RootState) => state.auth.user);
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  const dispatch: AppDispatch = useDispatch();

  // const customers = useSelector(
  //   (state: RootState) => state.customers.customers
  // );
  const serviceTypes = useSelector(
    (state: RootState) => state.serviceType.serviceTypes
  );
  const serviceTypeOptions = serviceTypes.map((item: ServiceType) => ({
    _id: item._id,
    label: item.serviceName,
  }));

  // const [cusNameIsOpen, setCusNameIsOpen] = useState(false);
  const [reqDateIsOpen, setReqDateIsOpen] = useState(false);

  // Create new request
  const [newReqCustomerName, setNewReqCustomerName] = useState<string>("");
  const [selectedCus, setSelectedCus] = useState<Partial<Customer>>({}); // customerId
  const [reqDate, setReqDate] = useState<Date>();
  const [serviceType, setServiceType] = useState<CustomSelectOption>();
  const [status, setStatus] = useState<CustomSelectOption>();
  const [assignTo, setAssignTo] = useState<Partial<Employee>>({}); // employeeId
  const [newReqAssgnName, setNewReqAssgnName] = useState<string>("");
  const [serviceDescription, setServiceDescription] = useState<string>("");
  const [resolutionNote, setResolutionNote] = useState<string>("");

  // Add new customer
  const [customerName, setCustomerName] = useState<string>("");
  const [customerMobile, setCustomerMobile] = useState<string | null>(null);
  const [model, setModel] = useState<string>("");
  const [serialNo, setSerialNo] = useState<string>("");
  const [cusType, setCusType] = useState<CustomerType | "">("");
  const [installDate, setInstallDate] = useState<Date | null>(null);
  const [address, setAddress] = useState<string>("");
  const [pincode, setPincode] = useState<string>("");
  const [remark, setRemark] = useState<string>("");

  // State for errors
  const [errorFields, setErrorFields] = useState<string[]>([]);

  const handleCreateNewCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    // Array to collect missing fields
    const errors: string[] = [];

    if (!customerName) errors.push("customerName");
    if (!customerMobile) errors.push("customerMobile");
    if (!address) errors.push("address");
    if (!pincode) errors.push("pincode");
    if (!serialNo) errors.push("serialNo");
    if (!cusType) errors.push("cusType");
    if (!installDate) errors.push("installDate");

    setErrorFields(errors);

    // If there are errors, set a timer to remove the errors after 10 seconds
    if (errors.length > 0) {
      toast({
        title: "Required details missing.",
        description:
          "Please check, Required fields are mentioned with this '*'",
        variant: "destructive",
      });
      setTimeout(() => {
        setErrorFields([]);
      }, 15000);
    } else {
      // Perform the form submit action here, if no errors
      console.log("Form submitted successfully");
    }
  };

  const handleCreateServiceReq = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedCus && reqDate) {
      try {
        const resultAction = await dispatch(
          createServiceRequest({
            customerId: selectedCus,
            requestDate: reqDate,
            serviceTypeId: serviceType,
            status: assignTo?._id
              ? ("ASSIGNED" as ServiceReqStatus)
              : (status?._id as ServiceReqStatus),
            technicianId: assignTo,
            cusDescription: serviceDescription,
            resolutionNotes: resolutionNote,
          })
        );

        if (createServiceRequest.fulfilled.match(resultAction)) {
          toast({
            title: "Service request created successfully",
            className: "bg-blue-400 text-[#ffffff]",
          });
          // dispatch(getAllServiceRequests());
          // The request was successful
          console.log("Service request created successfully", resultAction);
        } else if (createServiceRequest.rejected.match(resultAction)) {
          // The request failed
          console.error(
            "Failed to create service request:",
            resultAction.payload || resultAction.error.message
          );
        }
      } catch (error) {
        console.error("Error in creating service request:", error);
      }
    } else
      return toast({
        title: "Required details missing",
        description:
          "Please check, Required fields are mentioned with this '*'",
        variant: "destructive",
      });
  };

  const hasError = (field: string) => errorFields.includes(field);

  useEffect(() => {
    if (user && (user.userType === "OFFICE" || user.userType === "ADMIN")) {
      // dispatch(getAllCustomers());
      dispatch(getAllEmployees());
      dispatch(getAllServiceTypes());
    }
  }, []);

  return (
    <div className="w-full flex flex-col overflow-y-auto overflow-x-hidden">
      <div className="flex items-center justify-between">
        <HomeTopLeftSide />

        {/* Add new Req btn */}
        <div>
          <Drawer>
            {/* New Request Button */}
            <DrawerTrigger asChild>
              <button className="font-normal text-white text-[11px] md:text-xs lg:text-xs bg-[#408dfb] hover:bg-blue-500 h-auto md:h-8 lg:h-8 rounded-sm px-2 md:px-4 lg:px-4">
                New Request
                <span className="text-base"> +</span>
              </button>
            </DrawerTrigger>

            {/* bg-[#09090b] bg-[#21263c] */}
            {/* Actual Drawer */}
            <DrawerContent className="bg-[#181c2e] text-gray-100">
              {/* Main inner div of drawer content */}
              <div className="mx-auto w-full max-w-[18rem] md:max-w-md lg:max-w-xl min-h-[39rem] md:min-h-[30.4rem] lg:min-h-[30.4rem] flex flex-col justify-between">
                <DrawerHeader>
                  <DrawerTitle className="tracking-wide text-center text-base">
                    Create new Service Request
                  </DrawerTitle>
                  {/* <DrawerDescription className="text-gray-300"> */}
                  {/* </DrawerDescription> */}
                </DrawerHeader>
                <div className="p-4 pb-0 max-w-[1040px] flex flex-col gap-4 md:gap-5 lg:gap-5">
                  {/* Will display customer name but for create request id will be required */}
                  <div className="flex flex-col md:flex-row lg:flex-row items-start md:items-center lg:items-center justify-between gap-1 md:gap-3">
                    <label className="text-[#eb6462] text-xs md:text-[14px] lg:text-[14px] tracking-wide min-w-[7.7rem]">
                      Customer Name *
                    </label>

                    <InputSearchSuggestion
                      mainDivClass="w-[288px]"
                      inputClass="w-[288px] text-start bg-[#ffffff] text-gray-800 border rounded h-10 px-3 text-sm font-normal border-white"
                      suggestionItemsClass="text-black text-sm"
                      placeholder="Customer Name"
                      inputValue={newReqCustomerName}
                      setInputValue={setNewReqCustomerName}
                      selectedCus={setSelectedCus}
                      name="customer"
                    />
                  </div>

                  {/* Request Date */}
                  <div className="flex flex-col md:flex-row lg:flex-row items-start md:items-center lg:items-center justify-between gap-1 md:gap-3">
                    <label className="text-[#eb6462] text-xs md:text-[14px] lg:text-[14px] tracking-wide min-w-[7.7rem]">
                      Request Date *
                    </label>
                    <PopoverC
                      isOpen={reqDateIsOpen}
                      setIsOpen={setReqDateIsOpen}
                      className="w-full md:min-w-[18rem] lg:max-w-[18rem]"
                      trigger={
                        <div className="bg-[#ffffff] h-10 rounded overflow-hidden flex items-center px-3 text-sm font-normal cursor-pointer">
                          <button className="flex items-center">
                            <CalendarIcon className="mr-2 h-4 w-4 text-gray-800" />
                            {reqDate ? (
                              <span className="text-gray-800">
                                {format(reqDate, "PPP")}
                              </span>
                            ) : (
                              <span className="text-gray-800">Pick a date</span>
                            )}
                          </button>
                        </div>
                      }
                    >
                      <Calendar
                        mode="single"
                        selected={reqDate}
                        onSelect={setReqDate}
                        initialFocus
                        className="w-full md:min-w-[18rem] md:max-w-[18rem] lg:min-w-[18rem] lg:max-w-[18rem] rounded-sm overflow-hidden bg-white text-black"
                      />
                    </PopoverC>
                    {/* <Popover
                        open={reqDatePicker}
                        onOpenChange={setReqDatePicker}
                      >
                        <PopoverTrigger asChild>
                          <button
                            className={cn(
                              "flex justify-start text-left font-normal max-w-[18rem] w-full h-8 bg-gray-100 rounded flex-shrink text-gray-800 text-sm px-2 md:px-3 lg:px-3 py-1 border border-gray-300 hover:border-[#408dfb] focus:border-[#408dfb] transition duration-200 focus:ring-0 focus:outline-none focus:shadow-xl focus:shadow-[#408dfb80]",
                              !reqDate && "text-muted-foreground"
                            )}
                          >
                            <div className="flex items-center">
                              <CalendarIcon className="mr-2 h-4 w-4 text-gray-800" />
                              {reqDate ? (
                                format(reqDate, "PPP")
                              ) : (
                                <span className="text-gray-800">
                                  Pick a date
                                </span>
                              )}
                            </div>
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={reqDate}
                            onSelect={setReqDate}
                            initialFocus
                            className="w-[254px] md:min-w-[18rem] md:max-w-[18rem] lg:min-w-[18rem] lg:max-w-[18rem] md:px-2 lg:px-2"
                          />
                        </PopoverContent>
                      </Popover> */}
                    {/* <input
                        type="date"
                        value={
                          reqDate ? reqDate.toISOString().split("T")[0] : ""
                        }
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          const dateValue = e.target.value;
                          setReqDate(dateValue ? new Date(dateValue) : null);
                        }}
                        placeholder="Request date"
                        className="max-w-[18rem] w-full h-8 bg-gray-100 rounded flex-shrink font-normal text-gray-800 text-sm px-2 md:px-3 lg:px-3 py-1 border border-gray-300 hover:border-[#408dfb] focus:border-[#408dfb] transition duration-200 focus:ring-0 focus:outline-none focus:shadow-lg focus:shadow-[#408dfb80]"
                      /> */}
                  </div>

                  {/* Service Type */}
                  <div className="flex flex-col md:flex-row lg:flex-row items-start md:items-center lg:items-center justify-between gap-1 md:gap-3">
                    <label
                      htmlFor=""
                      className="text-xs md:text-[14px] lg:text-[14px] tracking-wide min-w-[7.7rem]"
                    >
                      Service Type
                    </label>
                    <div className="w-full md:max-w-[18rem] lg:max-w-[18rem]">
                      <CustomSelect
                        options={serviceTypeOptions}
                        selectedValue={serviceType}
                        onSelect={(value) => setServiceType(value)}
                        placeholder="Select service type"
                        className="w-full font-normal text-sm"
                        btnClassName="h-10"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row lg:flex-row items-start md:items-center lg:items-center justify-between gap-1 md:gap-3">
                    <label className="text-[#eb6462] text-xs md:text-[14px] lg:text-[14px] tracking-wide min-w-[7.7rem]">
                      Assign To
                    </label>

                    <InputSearchSuggestion
                      mainDivClass="w-[288px]"
                      inputClass="w-[288px] text-start bg-[#ffffff] text-gray-800 border rounded h-10 px-3 text-sm font-normal border-white"
                      suggestionItemsClass="text-black text-sm"
                      placeholder="Technician Name"
                      inputValue={newReqAssgnName}
                      setInputValue={setNewReqAssgnName}
                      selectedEmp={setAssignTo}
                      name="technician"
                    />
                  </div>

                  {/* status */}
                  <div className="flex flex-col md:flex-row lg:flex-row items-start md:items-center lg:items-center justify-between gap-1 md:gap-3">
                    <label className="text-xs md:text-[14px] lg:text-[14px] tracking-wide min-w-[7.7rem]">
                      Status{" "}
                      <span className="font-thin text-[10px] text-gray-300">
                        (Default pending)
                      </span>
                    </label>
                    <div className="w-full md:max-w-[18rem] lg:max-w-[18rem]">
                      <CustomSelect
                        options={statusOptions}
                        selectedValue={
                          assignTo && assignTo._id
                            ? ({
                                _id: "ASSIGNED",
                                label: "ASSIGNED",
                              } as CustomSelectOption)
                            : (status as CustomSelectOption)
                        }
                        onSelect={(value) => {
                          if (assignTo && assignTo._id)
                            return toast({
                              title:
                                "You need to remove selected technician to update the status",
                              className: "bg-orange-500 text-white",
                            });
                          setStatus(value as CustomSelectOption);
                        }}
                        placeholder="Select status"
                        className="w-full font-normal text-sm"
                        btnClassName="h-10"
                      />
                      {/* {status && <p className="mt-4">Selected: {status}</p>} */}
                      {/* <Select onValueChange={setStatus}>
                        <SelectTrigger className="text-gray-800 text-sm font-normal max-w-[18rem] w-full h-8 rounded-sm">
                          <SelectValue placeholder="Select a fruit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Fruits</SelectLabel>
                            <SelectItem value="PENDING">PENDING</SelectItem>
                            <SelectItem value="ASSIGNED">ASSIGNED</SelectItem>
                            <SelectItem value="COMPLETED">COMPLETED</SelectItem>
                            <SelectItem value="CANCELED">CANCELED</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select> */}
                    </div>
                  </div>

                  {/* service description */}
                  <div className="flex flex-col md:flex-row lg:flex-row items-start md:items-center lg:items-center justify-between gap-1 md:gap-3">
                    <label className="text-xs md:text-[14px] lg:text-[14px] tracking-wide min-w-[7.7rem]">
                      Service Description
                    </label>
                    <div className="w-full md:max-w-[18rem] lg:max-w-[18rem]">
                      <input
                        type="text"
                        value={serviceDescription}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setServiceDescription(e.target.value)
                        }
                        className="px-2 h-10 w-full md:px-3 lg:px-3 font-normal text-sm text-gray-800 border border-gray-300 hover:border-[#408dfb] focus:border-[#408dfb] transition duration-200 focus:ring-0 focus:outline-none focus:shadow-xl focus:shadow-[#408dfb80]"
                        placeholder="Service description here..."
                      />
                    </div>
                  </div>

                  {/* service resolution */}
                  <div className="flex flex-col md:flex-row lg:flex-row items-start md:items-center lg:items-center justify-between gap-1 md:gap-3">
                    <label className="text-xs md:text-[14px] lg:text-[14px] tracking-wide min-w-[7.7rem]">
                      Service Resolution
                    </label>
                    <div className="w-full md:max-w-[18rem] lg:max-w-[18rem]">
                      <input
                        type="text"
                        value={resolutionNote}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setResolutionNote(e.target.value)
                        }
                        className="h-10 w-full px-2 md:px-3 lg:px-3 font-normal text-sm text-gray-800 border border-gray-300 hover:border-[#408dfb] focus:border-[#408dfb] transition duration-200 focus:ring-0 focus:outline-none focus:shadow-xl focus:shadow-[#408dfb80]"
                        placeholder="Write a resolution note..."
                      />
                    </div>
                  </div>
                </div>

                {/*  */}
                <DrawerFooter>
                  <div className="w-full flex items-center justify-end gap-3">
                    <DrawerClose asChild>
                      <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-4 h-8 rounded-sm text-xs">
                        Cancel
                      </button>
                    </DrawerClose>
                    <button
                      onClick={handleCreateServiceReq}
                      className="bg-[#408dfb] hover:bg-blue-500 font-medium px-4 h-8 rounded-sm text-xs"
                    >
                      Submit
                    </button>
                  </div>
                </DrawerFooter>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>

      <ServiceRequests />
    </div>
  );
};

export default OfficeEmpHome;
