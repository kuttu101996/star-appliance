// import { Outlet } from "react-router-dom";
import { Input } from "@/components/ui/input";
import HomeTopLeftSide from "../HomeTopLeftSide/HomeTopLeftSide";
import StockTabs from "./StockTabs";
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
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
// import {
//   createNewItem,
//   purchaseEntry,
// } from "@/features/inventory/inventorySliceFunctions";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/app/store";
import { useToast } from "@/hooks/use-toast";
// import { Inventory } from "@/types/schemaTypes";
// import { useSelector } from "react-redux";
import CustomDatePicker from "@/components/common/CustomDatePicker";
import { CustomSelectOption, Parts, Stock } from "@/types/schemaTypes";
import { createNewPart, getAllParts } from "@/features/parts/partsSlice";
import MultiSelectChips from "@/components/common/MultiSelectChips";
import { CalendarIcon, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useSelector } from "react-redux";
import CustomSelect from "../CustomSelect/CustomSelect";
import { PaymentStatus } from "@/types/enumTypes";
import InputSearchSuggestion from "@/components/common/InputSearchSuggestion";
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
import { PopoverC } from "@/components/shadcn_like_custom_comps/Popover/Popover";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { newPurchaseEntry } from "@/features/purchase/purchaseSlice";
import { getAllTransaction } from "@/features/transaction/transactionSlice";
import { getAllMainStock } from "@/features/stock/skockSlice";
import { Textarea } from "@/components/ui/textarea";

const InventoryRoot = () => {
  const { toast } = useToast();
  const dispatch: AppDispatch = useDispatch();
  4;
  const allParts = useSelector((state: RootState) => state.parts.parts);
  // const user = useSelector((state: RootState) => state.auth.user);
  // const stockItems = useSelector((state: RootState) => state.inventory.items);
  // const stockGettingError = useSelector(
  //   (state: RootState) => state.inventory.error
  // );
  const latestCreatedTransaction = useSelector(
    (state: RootState) => state.transactions.latestCreatedTransaction
  );

  //
  const [purchaseEntryOpen, setPurchaseEntryOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [itemCode, setItemCode] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemCost, setItemCost] = useState("");
  const [internalCost, setInternalCost] = useState("");
  const [externalCost, setExternalCost] = useState("");

  const [billNo, setBillNo] = useState<string>("");
  const [billTotal, setBillTotal] = useState<string>("");
  const [purchaseDateIsOpen, setPurchaseDateIsOpen] = useState(false);
  const [purchaseDate, setPurchaseDate] = useState<Date>();
  const [itemWithQty, setItemWithQty] = useState<
    { item: Partial<Parts>; qty: number; unitCost: number }[]
  >([]);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>();
  const [transactionId, setTransactionId] = useState<string>("");
  const [remarks, setRemarks] = useState<string>("");

  const handleNewPurchaseEntry = async (e: FormEvent) => {
    e.preventDefault();
    console.log("Data - ", {
      itemWithQty,
      billNo,
      purchaseDate,
    });

    if (!billNo) {
      return toast({
        title: "Required details missing",
        variant: "destructive",
      });
    }

    try {
      const resultAction = await dispatch(
        newPurchaseEntry({
          detail: itemWithQty.map((item) => ({
            partId: item.item._id || "",
            quantity: item.qty || 0,
            unitCost: item.unitCost || 0,
          })),
          billNo: billNo,
          purchaseDate: purchaseDate || new Date(),
          totalCost: Number(billTotal),
          transactionId: transactionId,
          paymentStatus: paymentStatus || PaymentStatus.DUE,
          movementRemarks: remarks,
        })
      );
      if (newPurchaseEntry.fulfilled.match(resultAction)) {
        setPurchaseEntryOpen(false);
        dispatch(getAllMainStock());
        return toast({
          title: "Success",
          description: "Purchase entry successful.",
          className: "bg-blue-500 text-white",
        });
      } else if (newPurchaseEntry.rejected.match(resultAction)) {
        // The request failed
        console.error(
          "Failed to create service request:",
          resultAction.payload || resultAction.error.message
        );
        return toast({
          title: resultAction.error.message,
          description: resultAction.payload,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error in creating service request:", error);
    }
  };

  const handleCreateItem = async (e: FormEvent) => {
    e.preventDefault();

    if (!itemName || !itemCode || !itemCost || !externalCost) {
      return toast({
        title: "Required details missing",
        variant: "destructive",
      });
    }

    let costPrice, sellingPrice;
    if (isNaN(Number(itemCost)) || isNaN(Number(externalCost))) {
      return toast({
        title: "Data type mismatch.",
        variant: "destructive",
      });
    } else {
      costPrice = Number(itemCost);
      sellingPrice = Number(externalCost);
    }
    console.log(costPrice);
    console.log(sellingPrice);

    try {
      const resultAction = await dispatch(
        createNewPart({
          itemName: itemName,
          itemCode: itemCode,
          description: itemDescription,
          costPrice,
          internalSellingPrice: Number(internalCost),
          externalSellingPrice: sellingPrice,
        })
      );

      if (createNewPart.fulfilled.match(resultAction)) {
        toast({
          title: "Success",
          description: "Item successfully created.",
          className: "bg-blue-500 text-white",
        });
      } else if (createNewPart.rejected.match(resultAction)) {
        toast({ title: resultAction.error.message, variant: "destructive" });
        // The request failed
        console.error(
          "Failed to create service request:",
          resultAction.payload || resultAction.error.message
        );
      }
    } catch (error: any) {
      console.error("Error in creating service request:", error);
    }
  };
  const removeChip = (value: string) => {
    setItemWithQty(itemWithQty.filter((v) => v.item._id !== value));
  };

  useEffect(() => {
    dispatch(getAllParts());
    dispatch(getAllTransaction({}));
  }, []);

  useEffect(() => {
    setBillTotal((prev) => {
      const total = itemWithQty.reduce(
        (acc, curr) => acc + (curr.unitCost || 0) * (curr.qty || 0),
        0
      );
      return String(total);
    });
  }, [itemWithQty, setItemWithQty]);

  return (
    <div className="w-full flex flex-col overflow-y-auto overflow-x-hidden">
      <div className="flex justify-between">
        <HomeTopLeftSide />

        <div className="flex flex-col items-end gap-2 mt-4">
          {Object.keys(latestCreatedTransaction).length ? (
            <div className="flex flex-col items-end">
              <div className="grid grid-cols-1 items-center">
                <span className="text-[10px] md:text-xs md:mb-1 font-medium tracking-wide text-red-500">
                  Newest Transaction ID -{" "}
                  <span className="text-gray-600 font-extrabold tracking-wider">
                    {latestCreatedTransaction?.transactionId || ""}
                  </span>
                </span>
              </div>
              <div className="grid grid-cols-1 items-center">
                <span className="text-[10px] md:text-xs md:mb-1 font-medium tracking-wide text-red-500">
                  Created Time -{" "}
                  <span className="text-gray-600 font-extrabold tracking-wider">
                    {new Date(latestCreatedTransaction?.createdAt || "")
                      ?.toString()
                      .split("GMT")[0]
                      .trim()}
                  </span>
                </span>
              </div>
            </div>
          ) : (
            <></>
          )}
          <div className="flex items-center gap-1 md:gap-2">
            {/* New Purchase Entry */}
            <Sheet open={purchaseEntryOpen} onOpenChange={setPurchaseEntryOpen}>
              <SheetTrigger asChild>
                <button className="font-normal text-white text-[11px] md:text-xs lg:text-xs bg-[#408dfb] hover:bg-blue-500 h-auto md:h-8 lg:h-8 rounded-sm px-2 md:px-4 lg:px-4 flex items-center">
                  <span className="flex">
                    Purchase <span className="ml-1 hidden md:block">Entry</span>
                  </span>
                  <span className="text-sm md:text-base m-0 p-0 ml-1"> +</span>
                </button>
              </SheetTrigger>
              <SheetContent className="rounded-lg overflow-y-auto hide-scroll-bar scroll-on-hover">
                <SheetHeader>
                  <SheetTitle className="text-sm md:text-lg lg:text-lg text-center tracking-wide text-gray-700">
                    New Purchase
                  </SheetTitle>
                  {/* <SheetDescription className="text-xs">
                  Don't forget to mention the transaction ID here if made any
                </SheetDescription> */}
                </SheetHeader>

                <div className="grid gap-4 py-2 md:py-4 lg:py-4">
                  {/* Select Item by name */}
                  <div className="flex flex-col gap-0">
                    <span className="text-[10px] md:text-xs md:mb-1 font-medium tracking-wide text-red-500 text-left">
                      Select Item*
                    </span>

                    {/* Chips Display */}
                    <div className="flex flex-col gap-2">
                      <MultiSelectChips
                        options={allParts.map((item) => ({
                          label: item.itemName,
                          item: item,
                        }))}
                        selected={itemWithQty}
                        onChange={setItemWithQty}
                        placeholder="Select parts..."
                      />
                      <div className="space-y-2 w-full">
                        {itemWithQty.map((value) => {
                          const label =
                            allParts.find((opt) => opt._id === value.item._id)
                              ?.itemName ?? value.item.itemName;

                          return (
                            <>
                              {/* Chip (Label) */}
                              <div className="w-[50%]">
                                <Badge className="flex items-center justify-between h-8 bg-green-600">
                                  {label}
                                  <X
                                    className="h-4 w-4 cursor-pointer"
                                    onClick={() =>
                                      removeChip(value.item._id || "")
                                    }
                                  />
                                </Badge>
                              </div>
                              <div
                                key={value.item._id}
                                className="grid grid-cols-12 gap-4 items-end w-full"
                              >
                                {/* Quantity */}
                                <div className="col-span-4">
                                  <label className="text-[10px] md:text-xs text-red-500 block mb-1">
                                    QTY*
                                  </label>
                                  <Input
                                    type="number"
                                    value={value.qty || undefined}
                                    onChange={(
                                      e: ChangeEvent<HTMLInputElement>
                                    ) => {
                                      if (isNaN(Number(e.target.value))) return;
                                      setItemWithQty((prev) =>
                                        prev.map((q) =>
                                          q.item._id === value.item._id
                                            ? {
                                                ...q,
                                                qty: Number(e.target.value),
                                              }
                                            : q
                                        )
                                      );
                                    }}
                                    placeholder="Quantity"
                                    className="h-8 border border-gray-300 w-full"
                                  />
                                </div>

                                {/* Price */}
                                <div className="col-span-7">
                                  <label className="text-[10px] md:text-xs text-red-500 block mb-1">
                                    Price*
                                  </label>
                                  <Input
                                    type="number"
                                    value={value.unitCost || undefined}
                                    onChange={(
                                      e: ChangeEvent<HTMLInputElement>
                                    ) => {
                                      if (isNaN(Number(e.target.value))) return;
                                      setItemWithQty((prev) =>
                                        prev.map((q) =>
                                          q.item._id === value.item._id
                                            ? {
                                                ...q,
                                                unitCost: Number(
                                                  e.target.value
                                                ),
                                              }
                                            : q
                                        )
                                      );
                                    }}
                                    placeholder="Per unit price"
                                    className="h-8 border border-gray-300 w-full"
                                  />
                                </div>
                              </div>
                            </>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Bill No */}
                  <div className="grid grid-cols-1 items-center">
                    <span className="text-[10px] md:text-xs md:mb-1 font-medium tracking-wide text-red-500">
                      Payment Status*
                    </span>
                    <CustomSelect
                      options={Object.values(PaymentStatus).map((item) => ({
                        _id: item,
                        label: item,
                      }))}
                      selectedValue={
                        paymentStatus
                          ? {
                              _id: paymentStatus,
                              label: paymentStatus,
                            }
                          : undefined
                      }
                      onSelect={(value: CustomSelectOption) => {
                        setPaymentStatus(value._id as PaymentStatus);
                      }}
                      placeholder="Select payment status"
                      className="w-full font-normal text-xs md:text-sm lg:text-sm"
                      btnClassName="rounded-md"
                    />
                  </div>

                  {/* Purchase Date */}
                  <div className="grid grid-cols-1 items-center">
                    <span className="text-[10px] md:text-xs md:mb-1 font-medium tracking-wide text-gray-800">
                      Purchase Date
                    </span>
                    <PopoverC
                      isOpen={purchaseDateIsOpen}
                      setIsOpen={setPurchaseDateIsOpen}
                      className="w-full md:min-w-[18rem] border-2 rounded-md"
                      trigger={
                        <div className="bg-[#ffffff] h-10 rounded overflow-hidden flex items-center px-3 text-sm font-normal cursor-pointer">
                          <button className="flex items-center">
                            <CalendarIcon className="mr-2 h-4 w-4 text-gray-800" />
                            {purchaseDate ? (
                              <span className="text-gray-800">
                                {format(purchaseDate, "PPP")}
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
                        selected={purchaseDate}
                        onSelect={setPurchaseDate}
                        initialFocus
                        className="w-full md:min-w-[18rem] md:max-w-[18rem] lg:min-w-[18rem] lg:max-w-[18rem] rounded-sm overflow-hidden bg-white text-black"
                      />
                    </PopoverC>

                    <span className="text-red-400 mt-1 tracking-wide">
                      * If not selected, default date it will be today.
                    </span>
                  </div>

                  {/* Transaction ID */}
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
                    <span className="text-red-400 mt-1 tracking-wide">
                      * Don't forget to add transaction ID here, if made any
                    </span>
                  </div>

                  {/* Bill No */}
                  <div className="grid grid-cols-1 items-center">
                    <span className="text-[10px] md:text-xs md:mb-1 font-medium tracking-wide text-red-500">
                      Bill Number*
                    </span>
                    <Input
                      type="text"
                      value={billNo}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setBillNo(e.target.value)
                      }
                      placeholder="Bill No"
                      className="focus-visible:ring-0 focus-visible:outline-none col-span-3 h-10 border border-gray-300 hover:border-[#408dfb] focus:border-[#408dfb] transition duration-200 focus:ring-0 focus:outline-none focus:shadow-xl focus:shadow-[#408dfb80]"
                    />
                  </div>

                  {/* Bill No */}
                  <div className="grid grid-cols-1 items-center">
                    <span className="text-[10px] md:text-xs md:mb-1 font-medium tracking-wide text-red-500">
                      Bill Total*
                    </span>
                    <Input
                      type="text"
                      disabled
                      value={billTotal}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setBillTotal(e.target.value)
                      }
                      placeholder="Bill Total"
                      className="focus-visible:ring-0 focus-visible:outline-none col-span-3 h-10 border border-gray-300 hover:border-[#408dfb] focus:border-[#408dfb] transition duration-200 focus:ring-0 focus:outline-none focus:shadow-xl focus:shadow-[#408dfb80]"
                    />
                  </div>

                  {/* Additional Remarks */}
                  <div className="grid grid-cols-1 items-center">
                    <span className="text-[10px] md:text-xs md:mb-1 font-medium tracking-wide text-gray-700">
                      Remarks{" "}
                      <span className="text-gray-400 font-light ml-1 tracking-wide">
                        (optional)
                      </span>
                    </span>
                    <Textarea
                      value={remarks}
                      onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                        setRemarks(e.target.value)
                      }
                      placeholder="Additional remarks..."
                      className="focus-visible:ring-0 focus-visible:outline-none col-span-3 h-10 border border-gray-300 hover:border-[#408dfb] focus:border-[#408dfb] transition duration-200 focus:ring-0 focus:outline-none focus:shadow-xl focus:shadow-[#408dfb80]"
                    />
                  </div>
                </div>

                <SheetFooter className="gap-2 md:gap-1">
                  <SheetClose>
                    <button className="bg-gray-200 w-full hover:bg-gray-100 border border-gray-300 hover:border-gray-500 transition-all duration-300 font-medium px-4 h-8 rounded-sm text-xs">
                      Cancel
                    </button>
                  </SheetClose>
                  <button
                    onClick={handleNewPurchaseEntry}
                    className="bg-[#408dfb] hover:bg-blue-500 transition-all duration-300 font-medium px-4 h-8 rounded-sm text-xs text-white"
                  >
                    Save
                  </button>
                  {/* <Button type="submit">Save changes</Button> */}
                </SheetFooter>
              </SheetContent>
            </Sheet>

            {/* Add New Item */}
            <Dialog>
              <DialogTrigger asChild>
                <button className="font-normal text-white text-[11px] md:text-xs lg:text-xs bg-[#408dfb] hover:bg-blue-500 h-auto md:h-8 lg:h-8 rounded-sm px-2 md:px-4 lg:px-4 flex items-center">
                  <span className="flex">
                    <span className="mr-1 hidden md:block">New </span>Item
                  </span>
                  <span className="text-sm md:text-base m-0 p-0 ml-1"> +</span>
                </button>
              </DialogTrigger>
              <DialogContent className="rounded-lg max-w-80 sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle className="text-sm md:text-lg lg:text-lg text-center tracking-wide">
                    Create New Item
                  </DialogTitle>
                  {/* <DialogDescription>Hi</DialogDescription> */}
                </DialogHeader>
                <div className="grid gap-4 py-2 md:py-4 lg:py-4">
                  {/* Item name */}
                  <div className="md:grid grid-cols-4 md:gap-4 flex flex-col gap-0 md:items-center">
                    <span className="text-[10px] md:text-xs md:mb-1 font-medium tracking-wide text-red-500 text-right">
                      Item Name*
                    </span>
                    <Input
                      type="text"
                      value={itemName}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setItemName(e.target.value)
                      }
                      placeholder="Item Name"
                      className="focus-visible:ring-0 focus-visible:outline-none col-span-3 h-8 border border-gray-300 hover:border-[#408dfb] focus:border-[#408dfb] transition duration-200 focus:ring-0 focus:outline-none focus:shadow-xl focus:shadow-[#408dfb80]"
                    />
                  </div>

                  {/* Item Code */}
                  <div className="md:grid grid-cols-4 md:gap-4 flex flex-col gap-0 md:items-center">
                    <span className="text-[10px] md:text-xs md:mb-1 font-medium tracking-wide text-red-500 text-right">
                      Item Code*
                    </span>
                    <Input
                      type="text"
                      value={itemCode}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setItemCode(e.target.value)
                      }
                      placeholder="Item Code"
                      className="focus-visible:ring-0 focus-visible:outline-none col-span-3 h-8 border border-gray-300 hover:border-[#408dfb] focus:border-[#408dfb] transition duration-200 focus:ring-0 focus:outline-none focus:shadow-xl focus:shadow-[#408dfb80]"
                    />
                  </div>

                  {/* Item Description */}
                  <div className="md:grid grid-cols-4 md:gap-4 flex flex-col gap-0 md:items-center">
                    <span className="text-[10px] md:text-xs md:mb-1 font-medium tracking-wide text-right">
                      Item Description
                    </span>
                    <Input
                      type="text"
                      value={itemDescription}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setItemDescription(e.target.value)
                      }
                      placeholder="Description"
                      className="focus-visible:ring-0 focus-visible:outline-none col-span-3 h-8 border border-gray-300 hover:border-[#408dfb] focus:border-[#408dfb] transition duration-200 focus:ring-0 focus:outline-none focus:shadow-xl focus:shadow-[#408dfb80]"
                    />
                  </div>

                  {/* Per Unit Cost */}
                  <div className="md:grid grid-cols-4 md:gap-4 flex flex-col gap-0 md:items-center">
                    <span className="text-[10px] md:text-xs md:mb-1 font-medium tracking-wide text-red-500 text-right">
                      Purchase Cost*
                    </span>
                    <Input
                      type="number"
                      value={itemCost}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setItemCost(e.target.value)
                      }
                      placeholder="Purchase price..."
                      className="focus-visible:ring-0 focus-visible:outline-none col-span-3 h-8 border border-gray-300 hover:border-[#408dfb] focus:border-[#408dfb] transition duration-200 focus:ring-0 focus:outline-none focus:shadow-xl focus:shadow-[#408dfb80]"
                    />
                  </div>

                  {/* Internal selling price */}
                  <div className="md:grid grid-cols-4 md:gap-4 flex flex-col gap-0 md:items-center">
                    <span className="text-[10px] md:text-xs md:mb-1 font-medium tracking-wide text-red-500 text-right">
                      Internal Cost*
                    </span>
                    <Input
                      type="number"
                      value={internalCost}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setInternalCost(e.target.value)
                      }
                      placeholder="Internal selling price..."
                      className="focus-visible:ring-0 focus-visible:outline-none col-span-3 h-8 border border-gray-300 hover:border-[#408dfb] focus:border-[#408dfb] transition duration-200 focus:ring-0 focus:outline-none focus:shadow-xl focus:shadow-[#408dfb80]"
                    />
                  </div>

                  {/* Selling Price */}
                  <div className="md:grid grid-cols-4 md:gap-4 flex flex-col gap-0 md:items-center">
                    <span className="text-[10px] md:text-xs md:mb-1 font-medium tracking-wide text-red-500 text-right">
                      External Cost*
                    </span>
                    <Input
                      type="number"
                      value={externalCost}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setExternalCost(e.target.value)
                      }
                      placeholder="External selling price..."
                      className="focus-visible:ring-0 focus-visible:outline-none col-span-3 h-8 border border-gray-300 hover:border-[#408dfb] focus:border-[#408dfb] transition duration-200 focus:ring-0 focus:outline-none focus:shadow-xl focus:shadow-[#408dfb80]"
                    />
                  </div>
                </div>

                <DialogFooter className="gap-2 md:gap-1">
                  <DialogClose>
                    <button className="bg-gray-200 w-full hover:bg-gray-100 border border-gray-300 hover:border-gray-500 transition-all duration-300 font-medium px-4 h-8 rounded-sm text-xs">
                      Cancel
                    </button>
                  </DialogClose>

                  <button
                    onClick={handleCreateItem}
                    className="bg-[#408dfb] hover:bg-blue-500 transition-all duration-300 font-medium px-4 h-8 rounded-sm text-xs text-white"
                  >
                    Create
                  </button>
                  {/* <Button type="submit">Save changes</Button> */}
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <StockTabs />
      {/* <Outlet /> */}
    </div>
  );
};

export default InventoryRoot;
