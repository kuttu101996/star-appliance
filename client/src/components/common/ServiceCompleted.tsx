import React, { ChangeEvent } from "react";
import { PopoverC } from "@/components/shadcn_like_custom_comps/Popover/Popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import InputSearchSuggestion from "./InputSearchSuggestion";
import { CustomSelectOption, Employee, Parts } from "@/types/schemaTypes";
import { toast } from "@/hooks/use-toast";
import CustomSelect from "../custom/CustomSelect/CustomSelect";

interface Props {
  serviceDatePickerIsOpen: boolean;
  setServiceDatePickerIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  serviceDoneDate?: Date;
  setServiceDoneDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  serviceCompletedByName: string;
  setServiceCompletedByName: React.Dispatch<React.SetStateAction<string>>;
  serviceCompletedBy: Partial<Employee>;
  setServiceCompletedBy: React.Dispatch<
    React.SetStateAction<Partial<Employee>>
  >;
  partsUsed: { partId?: Partial<Parts>; price?: string }[];
  setPartsUsed: React.Dispatch<
    React.SetStateAction<{ partId?: Partial<Parts>; price?: string }[]>
  >;
  parts: Parts[];
  serviceDescription: string;
  setServiceDescription: React.Dispatch<React.SetStateAction<string>>;
  totalCos: string;
  setTotalCos: React.Dispatch<React.SetStateAction<string>>;
}

const ServiceCompleted = ({
  serviceDatePickerIsOpen,
  setServiceDatePickerIsOpen,
  serviceDoneDate,
  setServiceDoneDate,
  serviceCompletedByName,
  setServiceCompletedByName,
  //   serviceCompletedBy,
  setServiceCompletedBy,
  partsUsed,
  setPartsUsed,
  parts,
  serviceDescription,
  setServiceDescription,
  totalCos,
  setTotalCos,
}: Props) => {
  let partsList: { _id: string; label: string }[] = parts.map((item) => ({
    _id: item._id,
    label: item.itemName,
  }));

  return (
    <div className="flex flex-col gap-2">
      {/* Service completion date */}
      <div className="flex items-center justify-between gap-2">
        <div className="grid grid-cols-1 items-center w-[48%]">
          <span className="text-[10px] md:text-xs md:mb-1 font-medium tracking-wide text-red-500">
            Service Completed On *
          </span>
          <PopoverC
            isOpen={serviceDatePickerIsOpen}
            setIsOpen={setServiceDatePickerIsOpen}
            className="w-full"
            trigger={
              <div className="bg-gray-200 h-10 rounded overflow-hidden flex items-center px-3 text-sm font-normal cursor-pointer">
                <button className="flex items-center">
                  <CalendarIcon className="mr-2 h-4 w-4 text-gray-800" />
                  {serviceDoneDate ? (
                    <span className="text-gray-800">
                      {format(serviceDoneDate, "PPP")}
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
              selected={serviceDoneDate}
              onSelect={setServiceDoneDate}
              initialFocus
              className="w-full md:min-w-[18rem] md:max-w-[18rem] lg:min-w-[18rem] lg:max-w-[18rem] rounded-sm overflow-hidden bg-white text-black"
            />
          </PopoverC>
        </div>
        {/* Service done by */}
        <div className="grid grid-cols-1 items-center w-[48%]">
          <span className="text-[10px] md:text-xs md:mb-1 font-medium tracking-wide text-red-500">
            Service Completed By *
          </span>
          <InputSearchSuggestion
            inputClass="text-start bg-gray-50 text-gray-800 rounded h-10 px-3 text-sm font-normal"
            suggestionItemsClass="text-black text-sm"
            placeholder="Select Technician"
            inputValue={serviceCompletedByName}
            setInputValue={setServiceCompletedByName}
            selectedEmp={setServiceCompletedBy}
            name="technician"
          />
        </div>
      </div>
      {/* Parts used */}
      <div className="grid grid-cols-1 items-center">
        <div className="flex items-center justify-between">
          <span className="text-[10px] md:text-xs md:mb-1 font-medium tracking-wide">
            Parts Used
          </span>
          <span
            onClick={() =>
              setPartsUsed((prev) => {
                // Check if any row has an empty partId._id, and show a toast message if so
                const hasEmptyPartId = prev.some((item) => !item?.partId?._id);

                if (hasEmptyPartId) {
                  toast({
                    title: "Your last row is empty.",
                    className: "bg-orange-500 text-white",
                  });
                  return prev;
                }

                return [
                  ...prev,
                  {
                    partId: {
                      _id: "",
                      itemName: "",
                      itemCode: "",
                    }, // New empty row
                    price: undefined, // You can initialize this as undefined or any default value
                  },
                ];
              })
            }
            className="text-blue-600 font-medium cursor-pointer underline underline-offset-2 "
          >
            Add
          </span>
        </div>
        {partsUsed.map((item, index) => (
          <div
            key={`${item.partId?._id || Date.now().toString() + index}`}
            className="flex flex-col justify-end"
          >
            <div className="flex items-center justify-between gap-3">
              <CustomSelect
                options={partsList}
                selectedValue={{
                  _id: item?.partId?._id || "",
                  label: item?.partId?.itemName || "",
                }}
                onSelect={(value: CustomSelectOption) => {
                  // Find the corresponding `Parts` object from the list using _id
                  const selectedPart = parts.find(
                    (part) => part._id === value._id
                  );

                  if (selectedPart) {
                    // Update the state with the selected part, using the selectedPart object
                    setPartsUsed((prevParts) =>
                      prevParts.map(
                        (val, i) =>
                          i === index
                            ? {
                                ...val, // Spread the existing properties of the item
                                partId: selectedPart, // Replace partId with the selected part object
                              }
                            : val // Return unchanged object if no match
                      )
                    );
                  }
                }}
                placeholder="Select status"
                className="font-normal text-xs md:text-sm lg:text-sm h-10 w-[48%]"
              />
              <input
                className="px-2 w-[48%] h-10 md:px-2 lg:px-2 font-normal text-sm bg-gray-50 text-gray-800 border border-gray-300 hover:border-[#408dfb] focus:border-[#408dfb] transition duration-200 focus:ring-0 focus:outline-none focus:shadow-xl focus:shadow-[#408dfb80]"
                placeholder="Price charged"
                type="text"
                value={item.price}
                onChange={(e) => {
                  if (e.target.value.length !== 0) {
                    const newPrice = parseFloat(e.target.value);

                    // If the input is empty or invalid (like NaN), set a default value (e.g., 0)
                    if (isNaN(newPrice)) {
                      return; // Optionally set it to 0 or handle invalid input
                    }
                  }
                  // Ensure that the price is a number (convert from string to number)

                  setPartsUsed((prev) =>
                    prev.map((val, i) =>
                      i === index
                        ? {
                            ...val,
                            price: `${e.target.value}`, // Update the price with the correct number value
                          }
                        : val
                    )
                  );
                }}
              />
            </div>
            <div className="flex w-full items-center justify-end">
              <button
                onClick={() => {
                  if (partsUsed.length === 1) {
                    setPartsUsed((prev) =>
                      prev.map((val) => ({
                        ...val,
                        partId: {
                          _id: "",
                          itemName: "",
                          itemCode: "",
                        },
                        price: "",
                      }))
                    );
                    return;
                  }
                  setPartsUsed(
                    (prev) => prev.filter((_, i) => i !== index) // Removes the clicked item by index
                  );
                }}
                className="text-red-600 underline underline-offset-2 font-medium cursor-pointer"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Service Description */}
      <div className="grid grid-cols-1 items-center">
        <span className="text-[10px] md:text-xs md:mb-1 font-medium tracking-wide text-red-500">
          Service Description *
        </span>
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
      {/* Total Cost */}
      <div className="grid grid-cols-1 items-center">
        <span className="text-[10px] md:text-xs md:mb-1 font-medium tracking-wide text-red-500">
          Total Cost *
        </span>
        <input
          type="text"
          value={totalCos}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setTotalCos(e.target.value)
          }
          className="px-2 h-10 w-full md:px-3 lg:px-3 font-normal text-sm bg-gray-50 text-gray-800 border border-gray-300 hover:border-[#408dfb] focus:border-[#408dfb] transition duration-200 focus:ring-0 focus:outline-none focus:shadow-xl focus:shadow-[#408dfb80]"
          placeholder="Total Cost..."
        />
      </div>
    </div>
  );
};

export default ServiceCompleted;
