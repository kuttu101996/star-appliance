import React, { ChangeEvent, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  //   TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Stock } from "@/types/schemaTypes";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { AppDispatch, RootState } from "@/app/store";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  // assignStockTechnician,
  getAllMainStock,
  getAllOfficeStock,
  internalStockMovement,
} from "@/features/stock/skockSlice";
import { InternalMovement } from "@/types/enumTypes";
import { Input } from "@/components/ui/input";
import { ArrowRightLeft } from "lucide-react";

const OfficeStock: React.FC = () => {
  const { toast } = useToast();
  const dispatch: AppDispatch = useDispatch();
  const officeStock = useSelector(
    (state: RootState) => state.stock.officeStock
  );
  const mainStock = useSelector((state: RootState) => state.stock.mainStock);
  const stockError = useSelector((state: RootState) => state.stock.error);

  const [selectedItem, setSelectedItem] = useState<Partial<Stock> | null>(null);
  const [selectedMovementFrom, setSelectedMovementFrom] =
    useState<InternalMovement>(InternalMovement.MAIN);
  const [selectedMovementTo, setSelectedMovementTo] =
    useState<InternalMovement>(InternalMovement.OFFICE);
  const [moveQty, setMoveQty] = useState("");
  const [movementDialog, setMovementDialog] = useState(false);

  // const [assignTo, setAssignTo] = useState<Partial<Employee>>({});
  // const [assignToName, setAssignToName] = useState("");
  // const [assignDateIsOpen, setAssignDateIsOpen] = useState<boolean>(false);
  // const [assignDate, setAssignDate] = useState<Date | undefined>();
  // const [assignRemarks, setAssignRemarks] = useState("");

  const handleInternalMove = async () => {
    if (!moveQty)
      return toast({
        title: "Please add quantity",
        variant: "destructive",
      });

    try {
      const resultAction = await dispatch(
        internalStockMovement({
          partId: selectedItem?.partId?._id || "",
          fromLocation: selectedMovementFrom,
          toLocation: selectedMovementTo,
          quantity: Number(moveQty),
        })
      );

      if (internalStockMovement.fulfilled.match(resultAction)) {
        return toast({
          title: "Success ✅",
          description: "Successfully moved to office stock.",
          className: "bg-blue-500 text-white",
        });
      } else if (internalStockMovement.rejected.match(resultAction)) {
        return toast({
          title: resultAction.error.message,
          description: resultAction.payload,
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

  // const handleAssignTechnician = async () => {
  //   if (!moveQty)
  //     return toast({
  //       title: "Please add quantity",
  //       variant: "destructive",
  //     });

  //   if (!assignTo || !assignTo._id)
  //     return toast({
  //       title: "Please select assignee.",
  //       variant: "destructive",
  //     });

  //   try {
  //     const resultAction = await dispatch(
  //       assignStockTechnician({
  //         partId: selectedItem?.partId?._id || "",
  //         fromLocation: StockMovFromLocation.OFFICE,
  //         technicianId: assignTo._id,
  //         movementDate: assignDate || new Date(),
  //         remarks: assignRemarks,
  //         quantity: Number(moveQty),
  //       })
  //     );

  //     if (assignStockTechnician.fulfilled.match(resultAction)) {
  //       return toast({
  //         title: "Successfully moved to office stock.",
  //         className: "bg-blue-500 text-white",
  //       });
  //     }
  //   } catch (error) {
  //     return toast({
  //       title: error instanceof Error ? error.message : "Something went wrong",
  //       variant: "destructive",
  //     });
  //   }
  // };

  React.useEffect(() => {
    dispatch(getAllOfficeStock());
    dispatch(getAllMainStock());
  }, []);

  const [finalStock, setFinalStock] = useState<
    Record<string, Stock & { mainStock: number }>
  >({});
  React.useEffect(() => {
    const finalState: Record<string, Stock & { mainStock: number }> = {};

    if (officeStock) {
      officeStock.forEach((item) => {
        finalState[item.partId._id] = { ...item, ["mainStock"]: 0 };
      });
    }
    if (mainStock) {
      mainStock.forEach((item) => {
        if (finalState[item.partId._id])
          finalState[item.partId._id]["mainStock"] = item.quantity;
        else {
          // Initialize the object first
          finalState[item.partId._id] = {
            ...item,
            mainStock: item.quantity,
            quantity: 0,
          };
        }
      });
    }

    setFinalStock(finalState);
  }, [officeStock, mainStock]);

  React.useEffect(() => {
    if (stockError) toast({ title: stockError, variant: "destructive" });
  }, [stockError]);

  return (
    <div>
      <Table className="relative">
        <TableCaption>Stock list of all items.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Item Code</TableHead>
            <TableHead className="px-1">Item Name</TableHead>
            <TableHead className="text-center">Main Stock</TableHead>
            <TableHead className="text-center"></TableHead>
            <TableHead className="text-center">Office Stock</TableHead>

            <TableHead className="text-center">Cost</TableHead>
            <TableHead className="text-center">Internal Rate</TableHead>
            <TableHead className="text-center">External Rate</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.values(finalStock).length &&
            Object.values(finalStock).map((item) => (
              <TableRow
                key={item.partId?.itemCode}
                className="w-full font-medium"
              >
                <TableCell className="py-3 min-w-20">
                  {item.partId?.itemCode}
                </TableCell>

                <TableCell className="py-3 px-1">
                  {item.partId?.itemName}
                </TableCell>

                <TableCell className="text-center py-3">
                  {item.mainStock}
                </TableCell>

                <TableCell className="p-0">
                  <Dialog
                    open={movementDialog}
                    onOpenChange={setMovementDialog}
                  >
                    <DialogTrigger
                      asChild
                      onClick={() => setSelectedItem(item)}
                    >
                      <div className="flex items-center justify-center">
                        <ArrowRightLeft
                          strokeWidth={2}
                          width={18}
                          className="cursor-pointer text-blue-500 hidden md:block lg:block"
                        />
                        <ArrowRightLeft
                          strokeWidth={2}
                          width={14}
                          className="cursor-pointer text-blue-500 block md:hidden lg:hidden"
                        />
                      </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-[325px]">
                      <div className="flex flex-col gap-4 py-4">
                        <div className="flex items-center w-full justify-between">
                          <div className="flex flex-col">
                            <span className="text-[10px]">From</span>
                            <div className="text-gray-700 text-sm font-medium w-20">
                              {selectedMovementFrom}
                            </div>
                          </div>

                          <div
                            className="cursor-pointer"
                            onClick={() => {
                              let temp = selectedMovementTo;
                              setSelectedMovementTo(selectedMovementFrom);
                              setSelectedMovementFrom(temp);
                            }}
                          >
                            <ArrowRightLeft
                              strokeWidth={2.5}
                              width={16}
                              className="text-blue-500"
                            />
                          </div>

                          <div className="flex flex-col">
                            <span className="text-[10px] text-right">To</span>
                            <div className="text-gray-700 text-sm font-medium w-20 text-right">
                              {selectedMovementTo}
                            </div>
                          </div>
                        </div>

                        <div>
                          <Input
                            placeholder="Enter quantity"
                            type="number"
                            value={moveQty}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                              setMoveQty(e.target.value)
                            }
                          />
                        </div>
                      </div>
                      <DialogFooter className="gap-2 md:gap-0">
                        <DialogClose>
                          <button className="bg-gray-200 px-3 py-1 rounded w-full">
                            Close
                          </button>
                        </DialogClose>
                        <button
                          onClick={() => handleInternalMove()}
                          className="bg-blue-500 text-white px-3 py-1 rounded"
                        >
                          Save
                        </button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </TableCell>

                <TableCell className="text-center py-3 relative">
                  {item.quantity}
                </TableCell>

                <TableCell className="text-center py-3">
                  {/* {item.partId?.costPrice} */}
                  {item.partId?.costPrice?.toFixed(2)}
                </TableCell>

                <TableCell className="text-center py-3">
                  {item.partId?.internalSellingPrice?.toFixed(2)}
                  {/* {!item.sellingPrice?.toString().includes(".") ? ".00" : ""} */}
                </TableCell>

                <TableCell className="text-center py-3">
                  {item.partId?.externalSellingPrice?.toFixed(2)}
                  {/* {!item.sellingPrice?.toString().includes(".") ? ".00" : ""} */}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default OfficeStock;

// return (
//   <div className="w-full">
//     <div className="rounded-md border">
//       <Dialog open={movementDialog} onOpenChange={setMovementDialog}>
//         <DialogTrigger></DialogTrigger>

//         <DialogContent className="rounded-lg sm:max-w-[425px] min-h-64 py-4 m-0 gap-0">
//           <DialogHeader className="p-0 m-0">
//             <DialogTitle className="text-sm md:text-lg lg:text-lg text-center tracking-wide p-0 m-0">
//               Stock Movement
//             </DialogTitle>
//           </DialogHeader>
//           <div className="grid gap-2 py-2 md:py-4 lg:py-4">
//             <div className="grid grid-cols-1 items-center">
//               <span className="text-[10px] md:text-xs md:mb-1 font-medium tracking-wide text-red-500">
//                 Move From *
//               </span>
//               <CustomSelect
//                 options={stockMovementFromOfcOptions}
//                 selectedValue={
//                   selectedMovementFrom
//                     ? {
//                         _id: selectedMovementFrom,
//                         label: selectedMovementFrom,
//                       }
//                     : undefined
//                 }
//                 onSelect={(value: CustomSelectOption) => {
//                   if (value._id === StockMovFromLocation.TECHNICIAN)
//                     setSelectedMovementTo(StockMovToLocation.OFFICE);
//                   else setSelectedMovementTo(undefined);
//                   // if (transactionMade) setTransactionMade(false);
//                   setSelectedMovementFrom(value._id as StockMovFromLocation);
//                 }}
//                 placeholder="Move From..."
//                 className="w-full font-normal text-xs md:text-sm lg:text-sm"
//               />
//             </div>

//             {selectedMovementFrom ? (
//               selectedMovementFrom === StockMovFromLocation.TECHNICIAN ? (
//                 <div className="grid grid-cols-1 items-center">
//                   <span className="text-[10px] md:text-xs md:mb-1 font-medium tracking-wide text-red-500">
//                     Move To *
//                   </span>
//                   <Input
//                     value={selectedMovementTo}
//                     placeholder=""
//                     className="w-full font-normal text-xs md:text-sm lg:text-sm"
//                   />
//                 </div>
//               ) : (
//                 <div className="grid grid-cols-1 items-center">
//                   <span className="text-[10px] md:text-xs md:mb-1 font-medium tracking-wide text-red-500">
//                     Move To *
//                   </span>
//                   <CustomSelect
//                     options={stockMovementToOfcOptions}
//                     selectedValue={
//                       selectedMovementTo
//                         ? {
//                             _id: selectedMovementTo,
//                             label: selectedMovementTo,
//                           }
//                         : undefined
//                     }
//                     onSelect={(value: CustomSelectOption) => {
//                       // if (value._id === StockMovToLocation.SALE)
//                       //   setTransactionMade(true);
//                       // else if (transactionMade) setTransactionMade(false);
//                       setSelectedMovementTo(value._id as StockMovToLocation);
//                     }}
//                     placeholder="Move To..."
//                     className="w-full font-normal text-xs md:text-sm lg:text-sm"
//                   />
//                 </div>
//               )
//             ) : (
//               <></>
//             )}

//             {selectedMovementFrom ? (
//               selectedMovementFrom === StockMovFromLocation.OFFICE &&
//               selectedMovementTo === StockMovToLocation.TECHNICIAN ? (
//                 <>
//                   <div className="grid grid-cols-1 items-center">
//                     <span className="text-[10px] md:text-xs md:mb-1 font-medium tracking-wide text-red-500">
//                       Transaction Date *
//                     </span>
//                     <PopoverC
//                       isOpen={assignDateIsOpen}
//                       setIsOpen={setAssignDateIsOpen}
//                       className="w-full md:min-w-[18rem] border-2 rounded-md"
//                       trigger={
//                         <div className="bg-[#ffffff] h-10 rounded overflow-hidden flex items-center px-3 text-sm font-normal cursor-pointer">
//                           <button className="flex items-center">
//                             <CalendarIcon className="mr-2 h-4 w-4 text-gray-800" />
//                             {assignDate ? (
//                               <span className="text-gray-800">
//                                 {format(assignDate, "PPP")}
//                               </span>
//                             ) : (
//                               <span className="text-gray-800">Pick a date</span>
//                             )}
//                           </button>
//                         </div>
//                       }
//                     >
//                       <Calendar
//                         mode="single"
//                         selected={assignDate}
//                         onSelect={setAssignDate}
//                         initialFocus
//                         className="w-full md:min-w-[18rem] md:max-w-[18rem] lg:min-w-[18rem] lg:max-w-[18rem] rounded-sm overflow-hidden bg-white text-black"
//                       />
//                     </PopoverC>
//                   </div>
//                   <div className="grid grid-cols-1 items-center">
//                     <span className="text-[10px] md:text-xs md:mb-1 font-medium tracking-wide text-red-500">
//                       Assign To *
//                     </span>
//                     <InputSearchSuggestion
//                       inputClass="text-start border bg-gray-50 text-gray-800 border rounded-md h-10 px-3 text-sm font-normal"
//                       suggestionItemsClass="text-black text-sm"
//                       placeholder="Select technician"
//                       inputValue={assignToName}
//                       setInputValue={setAssignToName}
//                       selectedEmp={setAssignTo}
//                       name="technician"
//                     />
//                   </div>
//                   <div className="grid grid-cols-1 items-center">
//                     <span className="text-[10px] md:text-xs md:mb-1 font-medium tracking-wide text-red-500">
//                       Qty *
//                     </span>
//                     <Input
//                       value={moveQty}
//                       onChange={(e: ChangeEvent<HTMLInputElement>) => {
//                         if (isNaN(Number(e.target.value))) return;
//                         setMoveQty(e.target.value);
//                       }}
//                       placeholder="Enter quantity"
//                       className="w-full font-normal text-xs md:text-sm lg:text-sm"
//                     />
//                   </div>
//                   <div className="grid grid-cols-1 items-center">
//                     <span className="text-[10px] md:text-xs md:mb-1 font-medium tracking-wide text-gray-700">
//                       Remarks{" "}
//                       <span className="text-gray-400 font-light ml-1 tracking-wide">
//                         (optional)
//                       </span>
//                     </span>
//                     <Input
//                       value={assignRemarks}
//                       onChange={(e: ChangeEvent<HTMLInputElement>) => {
//                         setAssignRemarks(e.target.value);
//                       }}
//                       placeholder="Any remarks want to add..."
//                       className="w-full font-normal text-xs md:text-sm lg:text-sm"
//                     />
//                   </div>
//                 </>
//               ) : selectedMovementFrom === StockMovFromLocation.TECHNICIAN ? (
//                 <>
//                   <div className="grid grid-cols-1 items-center">
//                     <span className="text-[10px] md:text-xs md:mb-1 font-medium tracking-wide text-red-500">
//                       Qty *
//                     </span>
//                     <Input
//                       value={moveQty}
//                       onChange={(e: ChangeEvent<HTMLInputElement>) => {
//                         if (isNaN(Number(e.target.value))) return;
//                         setMoveQty(e.target.value);
//                       }}
//                       placeholder="Enter quantity"
//                       className="w-full font-normal text-xs md:text-sm lg:text-sm"
//                     />
//                   </div>
//                   <div className="grid grid-cols-1 items-center">
//                     <span className="text-[10px] md:text-xs md:mb-1 font-medium tracking-wide text-gray-700">
//                       Transaction ID{" "}
//                       <span className="text-gray-400 font-light ml-1 tracking-wide">
//                         (optional)
//                       </span>
//                     </span>
//                     {/* <Input
//                                       value={transactionId}
//                                       onChange={(e: ChangeEvent<HTMLInputElement>) => {
//                                         if (transactionIdCreated) return;
//                                         setTransactionId(e.target.value);
//                                       }}
//                                       placeholder="Transaction ID if made any..."
//                                       className="w-full font-normal text-xs md:text-sm lg:text-sm"
//                                     /> */}
//                     <InputSearchSuggestion
//                       inputClass="text-start border bg-gray-50 text-gray-800 border rounded-md h-10 px-3 text-sm font-normal"
//                       suggestionItemsClass="text-black text-sm"
//                       placeholder="Select transaction id..."
//                       inputValue={transactionId}
//                       setInputValue={setTransactionId}
//                       selectedEmp={() => {}}
//                       name={"transaction"}
//                     />
//                   </div>
//                 </>
//               ) : (
//                 <></>
//               )
//             ) : (
//               <></>
//             )}
//           </div>

//           <DialogFooter className="gap-2 md:gap-1 flex items-center">
//             <DialogClose>
//               <button className="bg-gray-200 w-full hover:bg-gray-100 border border-gray-300 hover:border-gray-500 transition-all duration-300 font-medium px-4 h-8 rounded-sm text-xs">
//                 Cancel
//               </button>
//             </DialogClose>
//             <button
//               onClick={() => {
//                 if (
//                   selectedMovementFrom === StockMovFromLocation.OFFICE &&
//                   selectedMovementTo === StockMovToLocation.MAIN
//                 )
//                   handleInternalMove();
//                 else if (
//                   selectedMovementFrom === StockMovFromLocation.OFFICE &&
//                   selectedMovementTo === StockMovToLocation.TECHNICIAN
//                 )
//                   handleAssignTechnician();
//               }}
//               className="bg-[#408dfb] hover:bg-blue-500 transition-all duration-300 font-medium px-4 h-8 rounded-sm text-xs text-white"
//             >
//               {
//                 // transactionMade ? "Create Transaction" :
//                 "Save"
//               }
//             </button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//       <Table>
//         <TableHeader>
//           {table.getHeaderGroups().map((headerGroup) => (
//             <TableRow key={headerGroup.id}>
//               {headerGroup.headers.map((header) => {
//                 return (
//                   <TableHead key={header.id} className="text-center">
//                     {header.isPlaceholder
//                       ? null
//                       : flexRender(
//                           header.column.columnDef.header,
//                           header.getContext()
//                         )}
//                   </TableHead>
//                 );
//               })}
//             </TableRow>
//           ))}
//         </TableHeader>
//         <TableBody>
//           {table.getRowModel().rows?.length ? (
//             table.getRowModel().rows.map((row) => (
//               <TableRow
//                 className="cursor-pointer"
//                 key={row.id}
//                 data-state={row.getIsSelected() && "selected"}
//                 //   onClick={() => handleSelectedCustomerUpdate(row.original)}
//               >
//                 {row.getVisibleCells().map((cell) => (
//                   <TableCell key={cell.id} className="text-center">
//                     {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                   </TableCell>
//                 ))}
//               </TableRow>
//             ))
//           ) : (
//             <TableRow>
//               <TableCell colSpan={columns.length} className="h-24 text-center">
//                 No results.
//               </TableCell>
//             </TableRow>
//           )}
//         </TableBody>
//       </Table>
//     </div>
//   </div>
// );

//   const handleMainStockMovement = async (item: Stock) => {
//     if (
//       !quantity ||
//       (from === "Main" && Number(quantity) > item.mainStockQty) ||
//       (from === "Office" && Number(quantity) > item.officeStockQty)
//     ) {
//       return toast({ title: "Invalid Quantity", variant: "destructive" });
//     }

//     try {
//       const resultAction = await dispatch(
//         officeMovement({
//           itemName: item.itemName,
//           id: item.id,
//           sourceLocation: from,
//           destination: to,
//           quantity: Number(quantity),
//         })
//       );

//       if (officeMovement.fulfilled.match(resultAction)) {
//         toast({
//           title: "Success",
//           description: "Item moved successfully",
//           className: "bg-blue-500 text-white",
//         });
//       }
//     } catch (error: any) {
//       console.error("Error in creating service request:", error);
//     }
//   };

// <TableCell className="max-w-80 lg:max-w-28 py-3 shrink-0">
//   <div className="w-full flex items-center justify-end gap-1 lg:gap-2">
//     <Assign item={item}>
//       <button
//         className="h-4 md:h-5 lg:h-6 text-white rounded px-2 py-[1px] bg-green-500 text-[12px]"
//         onClick={() => {}}
//       >
//         <span className="tracking-normal">Assign</span>
//       </button>
//     </Assign>

//     <Return>
//       <button
//         className="h-4 md:h-5 lg:h-6 text-white rounded px-2 py-[1px] bg-orange-500 text-[12px]"
//         onClick={() => {}}
//       >
//         <span className="tracking-normal">Return</span>
//       </button>
//     </Return>

//     <Sell>
//       <button
//         className="h-4 md:h-5 lg:h-6 text-white rounded px-2 py-[1px] bg-red-500 text-[12px]"
//         onClick={() => {}}
//       >
//         <span className="tracking-normal">Sell</span>
//       </button>
//     </Sell>
//   </div>
// </TableCell>;
