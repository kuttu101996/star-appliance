import { PopoverC } from "@/components/shadcn_like_custom_comps/Popover/Popover";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../../../components/ui/sheet";
import { Stock } from "../../../../types/schemaTypes";
import React, { ChangeEvent, useState } from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { AppDispatch } from "@/app/store";
import { useDispatch } from "react-redux";
import { assignStockTechnician } from "@/features/technician/technicianSlice";
import { StockMovFromLocation } from "@/types/enumTypes";

interface SheetDemoProps {
  children: React.ReactNode;
  item: Stock;
}

export function Assign({ children, item }: SheetDemoProps) {
  const { toast } = useToast();
  const dispatch: AppDispatch = useDispatch();

  const [assignRemarks, setAssignRemarks] = useState("");
  const [assignDateIsOpen, setAssignDateIsOpen] = useState(false);
  const [assignDate, setAssignDate] = useState<Date>();
  const [quantity, setQuantity] = useState<number | undefined>();

  const handleAssignTechnician = async () => {
    if (!item.technicianId)
      return toast({
        title: "Please select assignee.",
        variant: "destructive",
      });
    if (!quantity)
      return toast({
        title: "Please add quantity",
        variant: "destructive",
      });

    try {
      const resultAction = await dispatch(
        assignStockTechnician({
          partId: item?.partId?._id || "",
          fromLocation: StockMovFromLocation.OFFICE,
          technicianId: item.technicianId,
          movementDate: assignDate || new Date(),
          remarks: assignRemarks,
          quantity: Number(quantity),
        })
      );

      if (assignStockTechnician.fulfilled.match(resultAction)) {
        return toast({
          title: "Successfully assign stock to technician.",
          className: "bg-blue-500 text-white",
        });
      } else if (assignStockTechnician.rejected.match(resultAction)) {
        return toast({
          title: resultAction.payload as string,
          variant: "destructive",
          className: "tracking-wide",
        });
      }
    } catch (error) {
      return toast({
        title: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        {children}
        {/* <Button variant="outline">Open</Button> */}
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-base md:text-xl">
            Assigning Item{" "}
            <span className="text-blue-500 text-xl md:text-2xl ml-1">
              {item.partId.itemName}
            </span>
          </SheetTitle>
          {/* <SheetDescription className="text-xs md:text-sm">
            Please select a Technician to assign stock.
          </SheetDescription> */}
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 items-center mt-2">
            <span className="text-[10px] md:text-xs md:mb-1 font-medium tracking-wide text-red-500">
              Move From * -{" "}
              {/* <span className="text-gray-600 font-extrabold tracking-wider ml-1">
                {StockMovFromLocation.OFFICE}
              </span> */}
            </span>
            <Input
              value={StockMovFromLocation.OFFICE}
              placeholder="Any remarks want to add..."
              className="w-full font-normal text-xs md:text-sm lg:text-sm"
            />
          </div>
          <div className="grid grid-cols-1 items-center">
            <span className="text-[10px] md:text-xs md:mb-1 font-medium tracking-wide text-gray-800">
              Assign Date
            </span>
            <PopoverC
              isOpen={assignDateIsOpen}
              setIsOpen={setAssignDateIsOpen}
              className="w-full md:min-w-[18rem] border-2 rounded-md"
              trigger={
                <div className="bg-[#ffffff] h-10 rounded overflow-hidden flex items-center px-3 text-sm font-normal cursor-pointer">
                  <button className="flex items-center">
                    <CalendarIcon className="mr-2 h-4 w-4 text-gray-800" />
                    {assignDate ? (
                      <span className="text-gray-800">
                        {format(assignDate, "PPP")}
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
                selected={assignDate}
                onSelect={setAssignDate}
                initialFocus
                className="w-full md:min-w-[18rem] md:max-w-[18rem] lg:min-w-[18rem] lg:max-w-[18rem] rounded-sm overflow-hidden bg-white text-black"
              />
            </PopoverC>
          </div>
          <div className="grid grid-cols-1 items-center">
            <span className="text-[10px] md:text-xs md:mb-1 font-medium tracking-wide text-red-500">
              Qty *
            </span>
            <Input
              id="assignTechnicianStockQuantity"
              type="number"
              value={quantity}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const value = e.target.value;

                if (value === "") {
                  setQuantity(undefined);
                  return;
                }

                const numericValue = Number(value);

                if (isNaN(numericValue) || numericValue < 0) return;
                setQuantity(Number(e.target.value));
              }}
              placeholder="Enter quantity"
              className="w-full font-normal text-xs md:text-sm lg:text-sm"
            />
          </div>
          <div className="grid grid-cols-1 items-center">
            <span className="text-[10px] md:text-xs md:mb-1 font-medium tracking-wide text-gray-700">
              Remarks{" "}
              <span className="text-gray-400 font-light ml-1 tracking-wide">
                (optional)
              </span>
            </span>
            <Input
              value={assignRemarks}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setAssignRemarks(e.target.value);
              }}
              placeholder="Any remarks want to add..."
              className="w-full font-normal text-xs md:text-sm lg:text-sm"
            />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button
              type="submit"
              className="bg-blue-500"
              onClick={handleAssignTechnician}
            >
              Save changes
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
