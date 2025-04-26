import React, { ChangeEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import TransactionForm from "../../TransactionForm";
import {
  StockMovToLocation,
  TransactionAmountType,
  TransactionMethods,
  TransactionStatus,
  TransactionType,
} from "@/types/enumTypes";
import { Customer, Employee, Stock } from "@/types/schemaTypes";
import InputSearchSuggestion from "@/components/common/InputSearchSuggestion";
import { useToast } from "@/hooks/use-toast";
import { AppDispatch } from "@/app/store";
import { useDispatch } from "react-redux";
import { technicianStockSell } from "@/features/technician/technicianSlice";

interface SellTriggerChildren {
  children: React.ReactNode;
  item: Stock;
}

export function Sell({ children, item }: SellTriggerChildren) {
  const { toast } = useToast();
  const dispatch: AppDispatch = useDispatch();

  const [sellQty, setSellQty] = useState<number | undefined>();
  const [sellToName, setSellToName] = useState("");
  const [sellTo, setSellTo] = useState<Partial<Customer>>({});

  const [paidToName, setPaidToName] = useState<string>("");
  const [paidTo, setPaidTo] = useState<Partial<Employee>>({});
  const [transactionDateIsOpen, setTransactionDateIsOpen] =
    useState<boolean>(false);
  const [transactionDate, setTransactionDate] = useState<Date | undefined>();
  const [amount, setAmount] = useState<string>("");
  const [transactionMethod, setTransactionMethod] =
    useState<TransactionMethods>();
  const [transactionStatus, setTransactionStatus] =
    useState<TransactionStatus>();

  const handleTechnicianSell = async () => {
    // transactionMethod,
    // transactionStatus,
    // transactionType,
    //
    // transactionMethod,
    // status,
    // transactionType,

    if (!sellQty)
      return toast({ title: "Missing sell quantity", variant: "destructive" });
    if (!amount)
      return toast({ title: "Missing amount", variant: "destructive" });
    if (!transactionDate)
      return toast({
        title: "Missing transaction date.",
        variant: "destructive",
      });
    if (!transactionMethod)
      return toast({
        title: "Missing transactionMethod",
        variant: "destructive",
      });
    if (!transactionStatus)
      return toast({
        title: "Missing transactionStatus",
        variant: "destructive",
      });

    console.log("Data Send - ", {
      partId: item.partId?._id,
      soldTo: sellTo._id || "",
      technicianId: item.technicianId || "",
      recievedBy: paidTo._id || "",
      quantity: sellQty || 0,
      transactionDetails: {
        transactionDate,
        amount: Number(amount),
        amountType: TransactionAmountType.CREDIT,
        transactionMethod,
        status: transactionStatus,
        transactionType: TransactionType.TECHNICIAN_PAID,
      },
    });
    try {
      const resultAction = await dispatch(
        technicianStockSell({
          partId: item.partId?._id,
          soldTo: sellTo._id || "",
          technicianId: item.technicianId || "",
          recievedBy: paidTo._id || "",
          quantity: sellQty || 0,
          transactionDetails: {
            transactionDate,
            amount: Number(amount),
            amountType: TransactionAmountType.CREDIT,
            transactionMethod,
            status: transactionStatus,
            transactionType: TransactionType.TECHNICIAN_PAID,
          },
        })
      );

      if (technicianStockSell.fulfilled.match(resultAction)) {
        return toast({
          title: "Payment successfully initiated.",
          className: "bg-blue-500 text-white",
        });
      } else if (technicianStockSell.rejected.match(resultAction)) {
        return toast({
          title: resultAction.payload,
          variant: "default",
        });
      }
    } catch (error) {
      return toast({
        title: error instanceof Error ? error.message : "Catch block error",
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
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Technician Sell</SheetTitle>
          <SheetDescription>
            Enter transaction details is mandatory.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-3 py-4">
          <div className="grid grid-cols-1 items-center">
            <span className="text-[10px] md:text-xs md:mb-1 font-medium tracking-wide text-gray-700">
              Sell To{" "}
              <span className="text-gray-400 font-light ml-1 tracking-wide">
                (optional)
              </span>
            </span>
            <InputSearchSuggestion
              inputClass="text-start border bg-gray-50 text-gray-800 border rounded-md h-10 px-3 text-sm font-normal"
              suggestionItemsClass="text-black text-sm"
              placeholder="Who collected items..."
              inputValue={sellToName}
              setInputValue={setSellToName}
              selectedCus={setSellTo}
              name={"customer"}
            />
          </div>
          <div className="grid grid-cols-1 items-center">
            <span className="text-[10px] md:text-xs md:mb-1 font-medium tracking-wide text-red-500">
              Quantity *
            </span>
            <Input
              className="text-start border bg-gray-50 text-gray-800 rounded-md h-10 px-3 text-sm font-normal"
              placeholder="Who collected items..."
              value={sellQty ?? ""}
              type="number"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const value = e.target.value;

                if (value === "") {
                  setSellQty(undefined);
                  setAmount("");
                  return;
                }

                const numericValue = Number(value);

                if (isNaN(numericValue) || numericValue < 0) return;

                const price = Number(item.partId?.externalSellingPrice);

                if (isNaN(price)) {
                  setAmount("Invalid price");
                  return;
                }

                setSellQty(numericValue);
                setAmount((price * numericValue).toFixed(2));
              }}
            />
          </div>
          <TransactionForm
            transactionAmtType={TransactionAmountType.CREDIT}
            setTransactionAmtType={() => {}}
            transactionDateIsOpen={transactionDateIsOpen}
            setTransactionDateIsOpen={setTransactionDateIsOpen}
            transactionDate={transactionDate}
            setTransactionDate={setTransactionDate}
            transactionMadeByName={""}
            setTransactionMadeByName={() => {}}
            setTransactionMadeByEmp={() => {}}
            transactionType={TransactionType.TECHNICIAN_PAID}
            setTransactionType={() => {}}
            transactionMethod={transactionMethod}
            setTransactionMethod={setTransactionMethod}
            transactionStatus={transactionStatus}
            setTransactionStatus={setTransactionStatus}
            amount={amount}
            setAmount={setAmount}
            paidToName={paidToName}
            setPaidToName={setPaidToName}
            setPaidTo={setPaidTo}
            place="techSell"
            // sellTo={sellTo}
          />
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600"
              onClick={() => handleTechnicianSell()}
            >
              Save
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
