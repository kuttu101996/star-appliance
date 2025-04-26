import React, { ChangeEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  StockMovToLocation,
  TransactionAmountType,
  TransactionMethods,
  TransactionStatus,
  TransactionType,
} from "@/types/enumTypes";
import { Employee, Stock } from "@/types/schemaTypes";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { PopoverC } from "@/components/shadcn_like_custom_comps/Popover/Popover";
import InputSearchSuggestion from "@/components/common/InputSearchSuggestion";
import { format } from "date-fns";
import TransactionForm from "../../TransactionForm";
import { useToast } from "@/hooks/use-toast";
import { AppDispatch, RootState } from "@/app/store";
import { useDispatch } from "react-redux";
import { createTransaction } from "@/features/transaction/transactionSlice";
import { useSelector } from "react-redux";
import { technicianStockReturn } from "@/features/technician/technicianSlice";

interface ReturnTriggerChild {
  children: React.ReactNode;
  item: Stock;
}

export function Return({ children, item }: ReturnTriggerChild) {
  const { toast } = useToast();
  const dispatch: AppDispatch = useDispatch();
  const latestCreatedTransaction = useSelector(
    (state: RootState) => state.transactions.latestCreatedTransaction
  );

  const [transactionId, setTransactionId] = useState<string>("");
  const [collectedByName, setCollectedByName] = useState("");
  const [collectedBy, setCollectedBy] = useState<Partial<Employee>>({});
  const [returnDateIsOpen, setReturnDateIsOpen] = useState(false);
  const [returnDate, setReturnDate] = useState<Date>();
  const [quantity, setQuantity] = useState<number | undefined>();
  const [returnRemarks, setReturnRemarks] = useState<string>("");

  const [transactionMade, setTransactionMade] = useState<boolean>(false);
  const [transactionAmtType, setTransactionAmtType] =
    useState<TransactionAmountType>();
  const [transactionMadeBy, setTransactionMadeBy] = useState<Partial<Employee>>(
    {}
  );
  const [paidToName, setPaidToName] = useState<string>("");
  const [paidTo, setPaidTo] = useState<Partial<Employee>>({});
  const [transactionMadeByName, setTransactionMadeByName] =
    useState<string>("");
  const [transactionDateIsOpen, setTransactionDateIsOpen] =
    useState<boolean>(false);
  const [transactionDate, setTransactionDate] = useState<Date | undefined>();
  const [amount, setAmount] = useState<string>("");
  const [transactionMethod, setTransactionMethod] =
    useState<TransactionMethods>();
  const [transactionStatus, setTransactionStatus] =
    useState<TransactionStatus>();
  const [transactionType, setTransactionType] = useState<TransactionType>();

  const handleCreateTransaction = async () => {
    if (!item.technicianId)
      return toast({
        title: "Please select assignee.",
        variant: "destructive",
      });
    if (!transactionMadeBy._id)
      return toast({
        title: "Please select assignee.",
        variant: "destructive",
      });

    try {
      const resultAction = await dispatch(
        createTransaction({
          paidBy: item?.technicianId || "",
          recievedBy: transactionMadeBy._id || "",
          transactionDate: transactionDate || new Date(),
          amount: Number(amount),
          amountType: TransactionAmountType.DEBIT,
          transactionMethod: transactionMethod || TransactionMethods.CASH,
          status: transactionStatus || TransactionStatus.SUCCESS,
          transactionType: transactionType || TransactionType.RETURN,
        })
      );

      if (createTransaction.fulfilled.match(resultAction)) {
        return toast({
          title: "Transaction successfully created.",
          className: "bg-blue-500 text-white",
        });
      } else if (createTransaction.rejected.match(resultAction)) {
        return toast({
          title: resultAction.payload || resultAction.error.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      return toast({
        title: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const handleReturn = async () => {
    try {
      const resultAction = await dispatch(
        technicianStockReturn({
          partId: item?.partId?._id || "",
          technicianId: item.technicianId || "",
          recievedBy: collectedBy._id || "",
          quantity: Number(quantity),
          movementDate: returnDate || new Date(),
          remarks: returnRemarks,
        })
      );

      if (technicianStockReturn.fulfilled.match(resultAction)) {
        return toast({
          title: "Return successfully initiated.",
          className: "bg-blue-500 text-white",
        });
      } else if (technicianStockReturn.rejected.match(resultAction)) {
        return toast({
          title: resultAction.payload || resultAction.error.message,
          variant: "destructive",
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
            Return Item{" "}
            <span className="text-blue-500 text-xl md:text-2xl ml-1">
              {item.partId.itemName}
            </span>
          </SheetTitle>
        </SheetHeader>
        <div className="grid gap-2 py-4">
          <div className="grid grid-cols-1 items-center">
            <span className="text-[10px] md:text-xs md:mb-1 font-medium tracking-wide text-red-500">
              Move To * -{" "}
              <span className="text-gray-600 font-extrabold tracking-wider">
                {StockMovToLocation.OFFICE}
              </span>
            </span>
          </div>
          <div className="flex items-start gap-3 mb-1">
            <Input
              type="checkbox"
              checked={transactionMade}
              onChange={() => setTransactionMade((prev) => !prev)}
              className="w-[16px]"
            />
            <div className="flex flex-col mt-2">
              <span className="text-[14px] md:text-xs font-medium tracking-wide text-red-500">
                Create transaction here if made any
              </span>
              <span className="text-red-400 font-light tracking-wide">
                (Please uncheck once created successfully)
              </span>
            </div>
          </div>
          {Object.keys(latestCreatedTransaction).length ? (
            <>
              <div className="grid grid-cols-1 items-center">
                <span className="text-[10px] md:text-xs md:mb-1 font-medium tracking-wide text-red-500">
                  Latest Created Transaction ID * -{" "}
                  <span className="text-gray-600 font-extrabold tracking-wider">
                    {latestCreatedTransaction?.transactionId || ""}
                  </span>
                </span>
              </div>
              <div className="grid grid-cols-1 items-center">
                <span className="text-[10px] md:text-xs md:mb-1 font-medium tracking-wide text-red-500">
                  Time * -{" "}
                  <span className="text-gray-600 font-extrabold tracking-wider">
                    {new Date(latestCreatedTransaction?.createdAt || "")
                      ?.toString()
                      .split("GMT")[0]
                      .trim()}
                  </span>
                </span>
              </div>
            </>
          ) : (
            <></>
          )}
          {transactionMade ? (
            <TransactionForm
              transactionAmtType={transactionAmtType}
              setTransactionAmtType={setTransactionAmtType}
              transactionDateIsOpen={transactionDateIsOpen}
              setTransactionDateIsOpen={setTransactionDateIsOpen}
              transactionDate={transactionDate}
              setTransactionDate={setTransactionDate}
              transactionMadeByName={transactionMadeByName}
              setTransactionMadeByName={setTransactionMadeByName}
              setTransactionMadeByEmp={setTransactionMadeBy}
              transactionType={transactionType}
              setTransactionType={setTransactionType}
              transactionMethod={transactionMethod}
              setTransactionMethod={setTransactionMethod}
              transactionStatus={transactionStatus}
              setTransactionStatus={setTransactionStatus}
              amount={amount}
              setAmount={setAmount}
              paidToName={paidToName}
              setPaidToName={setPaidToName}
              setPaidTo={setPaidTo}
              place="techRtn"
              // sellTo={sellTo}
            />
          ) : (
            <>
              <div className="grid grid-cols-1 items-center">
                <span className="text-[10px] md:text-xs md:mb-1 font-medium tracking-wide text-red-500">
                  Item Collected By *
                </span>
                <InputSearchSuggestion
                  inputClass="text-start border bg-gray-50 text-gray-800 border rounded-md h-10 px-3 text-sm font-normal"
                  suggestionItemsClass="text-black text-sm"
                  placeholder="Who collected items..."
                  inputValue={collectedByName}
                  setInputValue={setCollectedByName}
                  selectedEmp={setCollectedBy}
                  name={"officeEmp"}
                />
              </div>
              <div className="grid grid-cols-1 items-center">
                <span className="text-[10px] md:text-xs md:mb-1 font-medium tracking-wide text-red-500">
                  Return Date *
                </span>
                <PopoverC
                  isOpen={returnDateIsOpen}
                  setIsOpen={setReturnDateIsOpen}
                  className="w-full md:min-w-[18rem] border-2 rounded-md"
                  trigger={
                    <div className="bg-[#ffffff] h-10 rounded overflow-hidden flex items-center px-3 text-sm font-normal cursor-pointer">
                      <button className="flex items-center">
                        <CalendarIcon className="mr-2 h-4 w-4 text-gray-800" />
                        {returnDate ? (
                          <span className="text-gray-800">
                            {format(returnDate, "PPP")}
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
                    selected={returnDate}
                    onSelect={setReturnDate}
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
                  // id="assignTechnicianStockQuantity"
                  value={quantity}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    // if (isNaN(Number(e.target.value))) return;
                    setQuantity(Number(e.target.value));
                  }}
                  placeholder="Enter quantity"
                  className="w-full font-normal text-xs md:text-sm lg:text-sm"
                />
              </div>
              <div className="grid grid-cols-1 items-center">
                <span className="text-[10px] md:text-xs md:mb-1 font-medium tracking-wide text-gray-700">
                  Transaction ID{" "}
                  <span className="text-gray-400 font-light ml-1 tracking-wide">
                    (optional)
                  </span>
                </span>
                {/* <Input
                  value={transactionId}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    if (transactionIdCreated) return;
                    setTransactionId(e.target.value);
                  }}
                  placeholder="Transaction ID if made any..."
                  className="w-full font-normal text-xs md:text-sm lg:text-sm"
                /> */}
                <InputSearchSuggestion
                  inputClass="text-start border bg-gray-50 text-gray-800 border rounded-md h-10 px-3 text-sm font-normal"
                  suggestionItemsClass="text-black text-sm"
                  placeholder="Select transaction id..."
                  inputValue={transactionId}
                  setInputValue={setTransactionId}
                  selectedEmp={() => {}}
                  name={"transaction"}
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
                  value={returnRemarks}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setReturnRemarks(e.target.value);
                  }}
                  placeholder="Any remarks want to add..."
                  className="w-full font-normal text-xs md:text-sm lg:text-sm"
                />
              </div>
            </>
          )}
          {/* <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-right">Username</span>
            <Input id="username" value="@peduarte" className="col-span-3" />
          </div> */}
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button
              className="bg-blue-500 hover:bg-blue-600"
              onClick={() => {
                if (transactionMade) handleCreateTransaction();
                else handleReturn();
              }}
              type="submit"
            >
              {transactionMade ? "Create Transaction" : "Save changes"}
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
