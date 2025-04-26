import { PopoverC } from "@/components/shadcn_like_custom_comps/Popover/Popover";
import HomeTopLeftSide from "../../HomeTopLeftSide/HomeTopLeftSide";
import CustomerTable from "../CustomerTable";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "../../../ui/calendar";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ChangeEvent, useState } from "react";
import CustomSelect from "../../CustomSelect/CustomSelect";
import { CustomerType, Gender } from "@/types/enumTypes";
import { Customer, CustomSelectOption } from "@/types/schemaTypes";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { AppDispatch } from "@/app/store";
import { useDispatch } from "react-redux";
import {
  createCustomer,
  updateCustomer,
} from "@/features/customer/customerSlice";

const CusServiceCard = () => {
  const { toast } = useToast();
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  const dispatch: AppDispatch = useDispatch();

  const [drawerHandle, setDrawerHandle] = useState(false);
  const [selectedForEdit, setSelectedForEdit] = useState(false);
  const [selectedCusId, setSelectedCusId] = useState("");

  const [customerName, setCustomerName] = useState("");
  const [installDateIsOpen, setInstallDateIsOpen] = useState(false);
  const [installDate, setInstallDate] = useState<Date>();
  const [nextServDateIsOpen, setNextServDateIsOpen] = useState(false);
  const [nextServDate, setNextServDate] = useState<Date>();
  const [lastServDateIsOpen, setLastServDateIsOpen] = useState(false);
  const [lastServDate, setLastServDate] = useState<Date>();
  const [customerType, setCustomerType] = useState<CustomSelectOption>();
  const [gender, setGender] = useState<CustomSelectOption>();
  const [dobIsOpen, setDobIsOpen] = useState(false);
  const [dob, setDob] = useState<Date>();

  const [cusMobile, setCusMobile] = useState("");
  const [cusEmail, setCusEmail] = useState("");
  const [cusAddress, setCusAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [model, setModel] = useState("");
  const [serialNo, setSerialNo] = useState("");

  const validateRequiredStates = () => {
    if (user.userType === "CUSTOMER" && user.userType === "TECHNICIAN") {
      toast({ title: "Not authorised", variant: "destructive" });
      return false;
    }

    if (!customerName || customerName.trim() === "") {
      toast({
        title: "Please enter customer name.",
        variant: "destructive",
      });
      return false;
    }
    if (!installDate || installDate.toString().trim() === "") {
      toast({
        title: "Please enter installation date.",
        variant: "destructive",
      });
      return false;
    }
    if (!nextServDate || nextServDate.toString().trim() === "") {
      toast({
        title: "Please enter next service date.",
        variant: "destructive",
      });
      return false;
    }
    if (!customerType || customerType.toString().trim() === "") {
      toast({
        title: "Please enter customer type.",
        variant: "destructive",
      });
      return false;
    }
    if (!cusMobile || cusMobile.toString().trim() === "") {
      toast({
        title: "Please enter mobile number.",
        variant: "destructive",
      });
      return false;
    }
    if (!model || model.toString().trim() === "") {
      toast({
        title: "Please enter model name.",
        variant: "destructive",
      });
      return false;
    }
    if (!serialNo || serialNo.toString().trim() === "") {
      toast({
        title: "Please enter serial number.",
        variant: "destructive",
      });
      return false;
    }
    if (!cusAddress || cusAddress.toString().trim() === "") {
      toast({
        title: "Please enter customer address.",
        variant: "destructive",
      });
      return false;
    }
    if (!pincode || pincode.toString().trim() === "") {
      toast({
        title: "Please enter customer pincode.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleCreateCus = async () => {
    try {
      const result = validateRequiredStates();
      if (!result) return;

      const resultAction = await dispatch(
        createCustomer({
          name: customerName,
          mobile: cusMobile,
          email: cusEmail,
          address: cusAddress,
          gender: gender?._id as Gender,
          dob: dob?.toString(),
          pincode,
          model,
          serialNo,
          installationDate: installDate,
          lastServiceDate: lastServDate,
          nextServiceDate: nextServDate,
          customerType: customerType?._id as CustomerType,
        })
      );

      if (createCustomer.fulfilled.match(resultAction)) {
        setDrawerHandle(false);
        clearAllState();
        return toast({
          title: "Success ✅",
          description: "New customer successfully created",
          className: "bg-blue-500 text-white",
        });
      } else if (createCustomer.rejected.match(resultAction)) {
        const errorMessage = resultAction.payload
          ? (resultAction.payload as string)
          : resultAction.error.message;

        return toast({ title: errorMessage, variant: "destructive" });
      }
    } catch (error: unknown) {
      return toast({
        title: error instanceof Error ? error.message : "Something went wrong",
      });
    }
  };

  const handleUpdateCus = async () => {
    try {
      validateRequiredStates();

      const resultAction = await dispatch(
        updateCustomer({
          _id: selectedCusId,
          name: customerName,
          mobile: cusMobile,
          email: cusEmail,
          address: cusAddress,
          gender: gender?._id as Gender,
          dob: dob?.toString(),
          pincode,
          model,
          serialNo,
          installationDate: installDate,
          lastServiceDate: lastServDate,
          nextServiceDate: nextServDate,
          customerType: customerType?._id as CustomerType,
        })
      );
      if (updateCustomer.fulfilled.match(resultAction)) {
        clearAllState();
        setSelectedForEdit(false);
        setDrawerHandle(false);
        return toast({ title: "Customer details updated successfully." });
      } else if (updateCustomer.rejected.match(resultAction)) {
        const errorMessage = resultAction.payload
          ? (resultAction.payload as string)
          : resultAction.error.message;

        return toast({ title: errorMessage, variant: "destructive" });
      }
    } catch (error) {
      return toast({
        title: error instanceof Error ? error.message : "Something went wrong",
      });
    }
  };

  const clearAllState = () => {
    setCustomerName("");
    setInstallDate(undefined);
    setNextServDate(undefined);
    setLastServDate(undefined);
    setCustomerType(undefined);
    setGender(undefined);
    setDob(undefined);
    setCusMobile("");
    setCusEmail("");
    setCusAddress("");
    setPincode("");
    setModel("");
    setSerialNo("");
  };

  const [cusUpdate, setCusUpdate] = useState(false);
  const handleSelectedCustomerUpdate = (item: Partial<Customer>) => {
    setSelectedCusId(item._id || "");
    setCustomerName(item.name || "");
    setInstallDate(item.installationDate);
    setNextServDate(item.nextServiceDate);
    setLastServDate(item.lastServiceDate);
    setCustomerType({
      _id: item.customerType || "",
      label: item.customerType || "",
    });
    setGender({ _id: item.gender || "", label: item.gender || "" });
    setDob(item.dob ? new Date(item.dob) : undefined);
    setCusMobile(item.mobile || "");
    setCusEmail(item.email || "");
    setCusAddress(item.address || "");
    setPincode(item.pincode || "");
    setModel(item.model || "");
    setSerialNo(item.serialNo || "");

    setCusUpdate(true);
    setSelectedForEdit(true);
    setDrawerHandle(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <HomeTopLeftSide />
        <div>
          <Drawer open={drawerHandle} onOpenChange={setDrawerHandle}>
            {/* New Request Button */}
            <DrawerTrigger asChild>
              <button
                onClick={() => {
                  clearAllState();
                  setSelectedForEdit(false);
                }}
                className="font-normal text-white text-[11px] md:text-xs lg:text-xs bg-[#408dfb] hover:bg-blue-500 h-auto md:h-8 lg:h-8 rounded-sm px-2 md:px-4 lg:px-4"
              >
                New Customer
                <span className="text-base"> +</span>
              </button>
            </DrawerTrigger>

            {/* bg-[#09090b] bg-[#21263c] */}
            {/* Actual Drawer */}
            <DrawerContent className="bg-[#181c2e] text-gray-100">
              {/* Main inner div of drawer content */}
              <div className="mx-auto min-h-[39rem] md:min-h-[30.4rem] lg:min-h-[34rem] flex flex-col justify-between">
                <DrawerHeader>
                  <DrawerTitle className="tracking-wide text-center text-base">
                    {cusUpdate ? "Update customer detail" : "Add new Customer"}
                  </DrawerTitle>
                  {/* <DrawerDescription className="text-gray-300"> */}
                  {/* </DrawerDescription> */}
                </DrawerHeader>
                <div className="flex flex-row gap-6 justify-center">
                  <div className="p-4 pb-0 max-w-[1040px] flex flex-col gap-4 md:gap-5 lg:gap-5">
                    {/* Installation Date */}
                    <div className="flex flex-col md:flex-row lg:flex-row items-start md:items-center lg:items-center justify-between gap-1 md:gap-3">
                      <label className="text-[#eb6462] text-xs md:text-[14px] lg:text-[14px] tracking-wide min-w-[7.7rem]">
                        Installation Date *
                      </label>
                      <PopoverC
                        isOpen={installDateIsOpen}
                        setIsOpen={setInstallDateIsOpen}
                        className="w-full md:min-w-[18rem] lg:max-w-[18rem]"
                        trigger={
                          <div className="bg-[#ffffff] h-10 rounded overflow-hidden flex items-center px-3 text-sm font-normal cursor-pointer">
                            <button className="flex items-center">
                              <CalendarIcon className="mr-2 h-4 w-4 text-gray-800" />
                              {installDate ? (
                                <span className="text-gray-800">
                                  {format(installDate, "PPP")}
                                </span>
                              ) : (
                                <span className="text-gray-800">
                                  Pick a date
                                </span>
                              )}
                            </button>
                          </div>
                        }
                      >
                        <Calendar
                          mode="single"
                          selected={installDate}
                          onSelect={setInstallDate}
                          initialFocus
                          className="w-full md:min-w-[18rem] md:max-w-[18rem] lg:min-w-[18rem] lg:max-w-[18rem] rounded-sm overflow-hidden bg-white text-black"
                        />
                      </PopoverC>
                    </div>

                    {/* Next Service Date */}
                    <div className="flex flex-col md:flex-row lg:flex-row items-start md:items-center lg:items-center justify-between gap-1 md:gap-3">
                      <label className="text-[#eb6462] text-xs md:text-[14px] lg:text-[14px] tracking-wide min-w-[7.7rem]">
                        Next Service Date *
                      </label>
                      <PopoverC
                        isOpen={nextServDateIsOpen}
                        setIsOpen={setNextServDateIsOpen}
                        className="w-full md:min-w-[18rem] lg:max-w-[18rem]"
                        trigger={
                          <div className="bg-[#ffffff] h-10 rounded overflow-hidden flex items-center px-3 text-sm font-normal cursor-pointer">
                            <button className="flex items-center">
                              <CalendarIcon className="mr-2 h-4 w-4 text-gray-800" />
                              {nextServDate ? (
                                <span className="text-gray-800">
                                  {format(nextServDate, "PPP")}
                                </span>
                              ) : (
                                <span className="text-gray-800">
                                  Pick a date
                                </span>
                              )}
                            </button>
                          </div>
                        }
                      >
                        <Calendar
                          mode="single"
                          selected={nextServDate}
                          onSelect={setNextServDate}
                          initialFocus
                          className="w-full md:min-w-[18rem] md:max-w-[18rem] lg:min-w-[18rem] lg:max-w-[18rem] rounded-sm overflow-hidden bg-white text-black"
                        />
                      </PopoverC>
                    </div>

                    {/* Cus Name */}
                    <div className="flex flex-col md:flex-row lg:flex-row items-start md:items-center lg:items-center justify-between gap-1 md:gap-3">
                      <label className="text-[#eb6462] text-xs md:text-[14px] lg:text-[14px] tracking-wide min-w-[7.7rem]">
                        Customer Name *
                      </label>
                      <div className="w-full md:max-w-[18rem] lg:max-w-[18rem]">
                        <input
                          type="text"
                          value={customerName}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setCustomerName(e.target.value)
                          }
                          className="px-2 h-10 w-full md:px-3 lg:px-3 font-normal text-sm text-gray-800 border border-gray-300 hover:border-[#408dfb] focus:border-[#408dfb] transition duration-200 focus:ring-0 focus:outline-none focus:shadow-xl focus:shadow-[#408dfb80]"
                          placeholder="Customer name..."
                        />
                      </div>
                    </div>

                    {/* Customer Type */}
                    <div className="flex flex-col md:flex-row lg:flex-row items-start md:items-center lg:items-center justify-between gap-1 md:gap-3">
                      <label
                        htmlFor=""
                        className="text-[#eb6462] text-xs md:text-[14px] lg:text-[14px] tracking-wide min-w-[7.7rem]"
                      >
                        Customer Type *
                      </label>
                      <div className="w-full md:max-w-[18rem] lg:max-w-[18rem]">
                        <CustomSelect
                          options={Object.values(CustomerType)
                            .filter((item) => item !== CustomerType.AMC)
                            .map((item) => ({
                              _id: item,
                              label: item,
                            }))}
                          selectedValue={customerType}
                          onSelect={(value) => setCustomerType(value)}
                          placeholder="Select customer type"
                          className="w-full font-normal text-sm"
                          btnClassName="h-10"
                        />
                      </div>
                    </div>

                    {/* Cus Mobile */}
                    <div className="flex flex-col md:flex-row lg:flex-row items-start md:items-center lg:items-center justify-between gap-1 md:gap-3">
                      <label className="text-[#eb6462] text-xs md:text-[14px] lg:text-[14px] tracking-wide min-w-[7.7rem]">
                        Mobile No. *
                      </label>
                      <div className="w-full md:max-w-[18rem] lg:max-w-[18rem]">
                        <Input
                          type="text"
                          value={cusMobile}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            if (isNaN(Number(e.target.value))) return;
                            setCusMobile(`${e.target.value}`);
                          }}
                          className="px-2 h-10 w-full md:px-3 lg:px-3 font-normal text-sm text-gray-800 border border-gray-300 hover:border-[#408dfb] focus:border-[#408dfb] transition duration-200 focus:ring-0 focus:outline-none focus:shadow-xl focus:shadow-[#408dfb80]"
                          placeholder="Mobile number..."
                        />
                      </div>
                    </div>

                    {/* Model */}
                    <div className="flex flex-col md:flex-row lg:flex-row items-start md:items-center lg:items-center justify-between gap-1 md:gap-3">
                      <label className="text-[#eb6462] text-xs md:text-[14px] lg:text-[14px] tracking-wide min-w-[7.7rem]">
                        Model *
                      </label>
                      <div className="w-full md:max-w-[18rem] lg:max-w-[18rem]">
                        <input
                          type="text"
                          value={model}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setModel(e.target.value)
                          }
                          className="px-2 h-10 w-full md:px-3 lg:px-3 font-normal text-sm text-gray-800 border border-gray-300 hover:border-[#408dfb] focus:border-[#408dfb] transition duration-200 focus:ring-0 focus:outline-none focus:shadow-xl focus:shadow-[#408dfb80]"
                          placeholder="Model name..."
                        />
                      </div>
                    </div>

                    {/* Serial No. */}
                    <div className="flex flex-col md:flex-row lg:flex-row items-start md:items-center lg:items-center justify-between gap-1 md:gap-3">
                      <label className="text-[#eb6462] text-xs md:text-[14px] lg:text-[14px] tracking-wide min-w-[7.7rem]">
                        Serial No. *
                      </label>
                      <div className="w-full md:max-w-[18rem] lg:max-w-[18rem]">
                        <input
                          type="text"
                          value={serialNo}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setSerialNo(e.target.value)
                          }
                          className="px-2 h-10 w-full md:px-3 lg:px-3 font-normal text-sm text-gray-800 border border-gray-300 hover:border-[#408dfb] focus:border-[#408dfb] transition duration-200 focus:ring-0 focus:outline-none focus:shadow-xl focus:shadow-[#408dfb80]"
                          placeholder="Serial number..."
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pb-0 max-w-[1040px] flex flex-col gap-4 md:gap-5 lg:gap-5">
                    {/* Last Service Date */}
                    <div className="flex flex-col md:flex-row lg:flex-row items-start md:items-center lg:items-center justify-between gap-1 md:gap-3">
                      <label className="text-xs md:text-[14px] lg:text-[14px] tracking-wide min-w-[7.7rem]">
                        Last Service Date
                      </label>
                      <PopoverC
                        isOpen={lastServDateIsOpen}
                        setIsOpen={setLastServDateIsOpen}
                        className="w-full md:min-w-[18rem] lg:max-w-[18rem]"
                        trigger={
                          <div className="bg-[#ffffff] h-10 rounded overflow-hidden flex items-center px-3 text-sm font-normal cursor-pointer">
                            <button className="flex items-center">
                              <CalendarIcon className="mr-2 h-4 w-4 text-gray-800" />
                              {lastServDate ? (
                                <span className="text-gray-800">
                                  {format(lastServDate, "PPP")}
                                </span>
                              ) : (
                                <span className="text-gray-800">
                                  Pick a date
                                </span>
                              )}
                            </button>
                          </div>
                        }
                      >
                        <Calendar
                          mode="single"
                          selected={lastServDate}
                          onSelect={setLastServDate}
                          initialFocus
                          className="w-full md:min-w-[18rem] md:max-w-[18rem] lg:min-w-[18rem] lg:max-w-[18rem] rounded-sm overflow-hidden bg-white text-black"
                        />
                      </PopoverC>
                    </div>

                    {/* Date of Birth */}
                    <div className="flex flex-col md:flex-row lg:flex-row items-start md:items-center lg:items-center justify-between gap-1 md:gap-3">
                      <label className="text-xs md:text-[14px] lg:text-[14px] tracking-wide min-w-[7.7rem]">
                        Date Of Birth
                      </label>
                      <PopoverC
                        isOpen={dobIsOpen}
                        setIsOpen={setDobIsOpen}
                        className="w-full md:min-w-[18rem] lg:max-w-[18rem]"
                        trigger={
                          <div className="bg-[#ffffff] h-10 rounded overflow-hidden flex items-center px-3 text-sm font-normal cursor-pointer">
                            <button className="flex items-center">
                              <CalendarIcon className="mr-2 h-4 w-4 text-gray-800" />
                              {dob ? (
                                <span className="text-gray-800">
                                  {format(dob, "PPP")}
                                </span>
                              ) : (
                                <span className="text-gray-800">
                                  Pick a date
                                </span>
                              )}
                            </button>
                          </div>
                        }
                      >
                        <Calendar
                          mode="single"
                          selected={dob}
                          onSelect={setDob}
                          initialFocus
                          className="w-full md:min-w-[18rem] md:max-w-[18rem] lg:min-w-[18rem] lg:max-w-[18rem] rounded-sm overflow-hidden bg-white text-black"
                        />
                      </PopoverC>
                    </div>

                    {/* Email */}
                    <div className="flex flex-col md:flex-row lg:flex-row items-start md:items-center lg:items-center justify-between gap-1 md:gap-3">
                      <label className="text-xs md:text-[14px] lg:text-[14px] tracking-wide min-w-[7.7rem]">
                        Email
                      </label>
                      <div className="w-full md:max-w-[18rem] lg:max-w-[18rem]">
                        <Input
                          type="text"
                          value={cusEmail}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            setCusEmail(e.target.value);
                          }}
                          className="px-2 h-10 w-full md:px-3 lg:px-3 font-normal text-sm text-gray-800 border border-gray-300 hover:border-[#408dfb] focus:border-[#408dfb] transition duration-200 focus:ring-0 focus:outline-none focus:shadow-xl focus:shadow-[#408dfb80]"
                          placeholder="Enter email..."
                        />
                      </div>
                    </div>

                    {/* Gender */}
                    <div className="flex flex-col md:flex-row lg:flex-row items-start md:items-center lg:items-center justify-between gap-1 md:gap-3">
                      <label
                        htmlFor=""
                        className="text-xs md:text-[14px] lg:text-[14px] tracking-wide min-w-[7.7rem]"
                      >
                        Gender
                      </label>
                      <div className="w-full md:max-w-[18rem] lg:max-w-[18rem]">
                        <CustomSelect
                          options={Object.values(Gender).map((item) => ({
                            _id: item,
                            label: item,
                          }))}
                          selectedValue={gender}
                          onSelect={(value) => setGender(value)}
                          placeholder="Select gender"
                          className="w-full font-normal text-sm"
                          btnClassName="h-10"
                        />
                      </div>
                    </div>

                    {/* Cus Address */}
                    <div className="flex flex-col md:flex-row lg:flex-row items-start md:items-center lg:items-center justify-between gap-1 md:gap-3">
                      <label className="text-[#eb6462] text-xs md:text-[14px] lg:text-[14px] tracking-wide min-w-[7.7rem]">
                        Address *
                      </label>
                      <div className="w-full md:max-w-[18rem] lg:max-w-[18rem]">
                        <Textarea
                          value={cusAddress}
                          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                            setCusAddress(e.target.value)
                          }
                          rows={4}
                          className="px-2 w-full md:px-3 resize-none lg:px-3 font-normal text-sm text-gray-800 border border-gray-300 hover:border-[#408dfb] focus:border-[#408dfb] transition duration-200 focus:ring-0 focus:outline-none focus:shadow-xl focus:shadow-[#408dfb80]"
                          placeholder="Enter address..."
                        />
                      </div>
                    </div>

                    {/* Pincode */}
                    <div className="flex flex-col md:flex-row lg:flex-row items-start md:items-center lg:items-center justify-between gap-1 md:gap-3">
                      <label className="text-[#eb6462] text-xs md:text-[14px] lg:text-[14px] tracking-wide min-w-[7.7rem]">
                        Pincode *
                      </label>
                      <div className="w-full md:max-w-[18rem] lg:max-w-[18rem]">
                        <input
                          type="text"
                          value={pincode}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            if (isNaN(Number(e.target.value))) return;
                            setPincode(e.target.value);
                          }}
                          className="px-2 h-10 w-full md:px-3 lg:px-3 font-normal text-sm text-gray-800 border border-gray-300 hover:border-[#408dfb] focus:border-[#408dfb] transition duration-200 focus:ring-0 focus:outline-none focus:shadow-xl focus:shadow-[#408dfb80]"
                          placeholder="Pincode..."
                        />
                      </div>
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
                      onClick={() => {
                        if (selectedForEdit) handleUpdateCus();
                        else handleCreateCus();
                      }}
                      className="bg-[#408dfb] hover:bg-blue-500 font-medium px-4 h-8 rounded-sm text-xs"
                    >
                      Save
                    </button>
                  </div>
                </DrawerFooter>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
      <CustomerTable
        handleSelectedCustomerUpdate={handleSelectedCustomerUpdate}
      />
    </div>
  );
};

export default CusServiceCard;
