// import React, { ChangeEvent, useState } from "react";
// import "../../../../App.css";
// import {
//   Table,
//   TableBody,
//   //   TableCaption,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { CustomSelectOption, Employee, Stock } from "@/types/schemaTypes";
// import {
//   ColumnDef,
//   ColumnFiltersState,
//   SortingState,
//   VisibilityState,
//   flexRender,
//   getCoreRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   useReactTable,
// } from "@tanstack/react-table";
// import { Button } from "@/components/ui/button";
// import { AppDispatch, RootState } from "@/app/store";
// import { useSelector } from "react-redux";
// import { useToast } from "@/hooks/use-toast";
// import { useDispatch } from "react-redux";
// import {
//   getAllMainStock,
//   internalStockMovement,
// } from "@/features/stock/skockSlice";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   StockMovFromLocation,
//   StockMovToLocation,
//   TransactionAmountType,
//   TransactionMethods,
//   TransactionStatus,
//   TransactionType,
// } from "@/types/enumTypes";
// import CustomSelect from "../../CustomSelect/CustomSelect";
// import { Input } from "@/components/ui/input";
// import InputSearchSuggestion from "@/components/common/InputSearchSuggestion";
// import { PopoverC } from "@/components/shadcn_like_custom_comps/Popover/Popover";
// import { CalendarIcon } from "lucide-react";
// import { format } from "date-fns";
// import { Calendar } from "@/components/ui/calendar";
// import {
//   Sheet,
//   SheetClose,
//   SheetContent,
//   SheetDescription,
//   SheetFooter,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from "@/components/ui/sheet";

// const stockMovementFromOptions = [
//   { _id: StockMovFromLocation.MAIN, label: StockMovFromLocation.MAIN },
//   { _id: StockMovFromLocation.PURCHASE, label: StockMovFromLocation.PURCHASE },
// ];

// const MainStock: React.FC = () => {
//   const { toast } = useToast();
//   const dispatch: AppDispatch = useDispatch();
//   const mainStock = useSelector((state: RootState) => state.stock.mainStock);
//   const stockError = useSelector((state: RootState) => state.stock.error);
//   const [movementDialog, setMovementDialog] = useState(false);
//   const [selectedItem, setSelectedItem] = useState<Partial<Stock>>();

//   const [selectedMovementFrom, setSelectedMovementFrom] =
//     useState<StockMovFromLocation>();
//   const [moveQty, setMoveQty] = useState("");

//   const [transactionMade, setTransactionMade] = useState<boolean>(false);
//   const [transactionMadeBy, setTransactionMadeBy] = useState<Partial<Employee>>(
//     {}
//   );
//   const [transactionMadeByName, setTransactionMadeByName] =
//     useState<string>("");
//   const [paidTo, setPaidTo] = useState<string>("");
//   const [transactionDateIsOpen, setTransactionDateIsOpen] =
//     useState<boolean>(false);
//   const [transactionDate, setTransactionDate] = useState<Date | undefined>();
//   const [amount, setAmount] = useState<string>("");
//   const [transactionMethod, setTransactionMethod] =
//     useState<TransactionMethods>();
//   const [transactionStatus, setTransactionStatus] =
//     useState<TransactionStatus>();
//   const [transactionType, setTransactionType] = useState<TransactionType>();

//   const columns: ColumnDef<Partial<Stock>>[] = [
//     {
//       accessorKey: "partId.itemCode",
//       header: "Item Code",
//       cell: ({ row }) => {
//         const itemCode = row.original.partId?.itemCode;
//         return <span className="font-semibold">{itemCode}</span>;
//       },
//     },
//     {
//       accessorKey: "partId.itemName",
//       header: "Item Name",
//       cell: ({ row }) => {
//         const itemName = row.original.partId?.itemName;
//         return <span className="font-semibold">{itemName}</span>;
//       },
//     },
//     {
//       accessorKey: "partId.costPrice",
//       header: "Cost Price",
//       cell: ({ row }) => {
//         const costP = row.original.partId?.costPrice;
//         return <span className="font-semibold">{costP?.toFixed(2)}</span>;
//       },
//     },
//     {
//       accessorKey: "partId.externalSellingPrice",
//       header: "Sell Price",
//       cell: ({ row }) => {
//         const sellPrice = row.original.partId?.externalSellingPrice;

//         return <span className="font-semibold">{sellPrice?.toFixed(2)}</span>;
//       },
//     },
//     {
//       accessorKey: "quantity",
//       header: "Qty",
//       cell: ({ row }) => {
//         const quantity = row.getValue<number>("quantity");

//         let textColor = "text-green-600";
//         if (quantity < 9) {
//           textColor = "text-red-600";
//         } else if (quantity >= 9 && quantity < 50) {
//           textColor = "text-orange-500";
//         }

//         return <span className={`font-semibold ${textColor}`}>{quantity}</span>;
//       },
//     },
//     {
//       id: "select",
//       cell: ({ row }) => (
//         <Button
//           onClick={() => {
//             setSelectedItem(row.original);
//             setMovementDialog(true);
//           }}
//         >
//           Move
//         </Button>
//       ),
//       enableSorting: false,
//       enableHiding: false,
//     },
//   ];

//   const [sorting, setSorting] = React.useState<SortingState>([]);
//   const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
//     []
//   );
//   const [columnVisibility, setColumnVisibility] =
//     React.useState<VisibilityState>({});
//   const [rowSelection, setRowSelection] = React.useState({});

//   const table = useReactTable({
//     data: mainStock,
//     columns,
//     enableRowSelection: true, // 👈 Enable row selection
//     onSortingChange: setSorting,
//     onColumnFiltersChange: setColumnFilters,
//     getCoreRowModel: getCoreRowModel(),
//     // manualPagination: true,
//     // pageCount: totalPages,
//     getPaginationRowModel: getPaginationRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     onColumnVisibilityChange: setColumnVisibility,
//     onRowSelectionChange: setRowSelection,
//     state: {
//       sorting,
//       columnFilters,
//       columnVisibility,
//       rowSelection,
//     },
//   });

//   const handleInternalMove = async () => {
//     if (!moveQty)
//       return toast({
//         title: "Please add quantity",
//         variant: "destructive",
//       });

//     try {
//       const resultAction = await dispatch(
//         internalStockMovement({
//           partId: selectedItem?.partId?._id || "",
//           fromLocation: StockMovFromLocation.MAIN,
//           toLocation: StockMovToLocation.OFFICE,
//           quantity: Number(moveQty),
//         })
//       );

//       if (internalStockMovement.fulfilled.match(resultAction)) {
//         return toast({
//           title: "Successfully moved to office stock.",
//           className: "bg-blue-500 text-white",
//         });
//       }
//     } catch (error) {}
//   };

//   React.useEffect(() => {
//     dispatch(getAllMainStock());
//   }, []);

//   React.useEffect(() => {
//     if (stockError) toast({ title: stockError, variant: "destructive" });
//   }, [stockError]);

//   return (
//     <div className="w-full">
//       <div className="rounded-md border overflow-y-auto scroll-on-hover">
//         <Sheet open={movementDialog} onOpenChange={setMovementDialog}>
//           <SheetTrigger></SheetTrigger>

//           <SheetContent className="overflow-y-auto scroll-on-hover rounded-lg sm:max-w-[525px] py-4 m-0 gap-0">
//             <SheetHeader className="p-0 m-0">
//               <SheetTitle className="text-sm md:text-lg lg:text-lg text-center tracking-wide p-0 m-0">
//                 Stock Movement
//               </SheetTitle>
//             </SheetHeader>
//             <div className="grid gap-2 py-2 md:py-4 lg:py-4">
//               <div className="grid grid-cols-1 items-center">
//                 <span className="text-[10px] md:text-xs md:mb-1 font-medium tracking-wide text-red-500">
//                   Move From *
//                 </span>
//                 <CustomSelect
//                   options={stockMovementFromOptions}
//                   selectedValue={{
//                     _id: selectedMovementFrom || "",
//                     label: selectedMovementFrom || "",
//                   }}
//                   onSelect={(value: CustomSelectOption) => {
//                     if (transactionMade) setTransactionMade(false);
//                     setSelectedMovementFrom(value._id as StockMovFromLocation);
//                   }}
//                   placeholder="Select status"
//                   className="w-full font-normal text-xs md:text-sm lg:text-sm"
//                 />
//               </div>

//               {selectedMovementFrom === StockMovFromLocation.PURCHASE ? (
//                 <div>
//                   <div className="items-center">
//                     <span className="flex items-center gap-2 text-[10px] md:text-xs md:mb-1 font-medium tracking-wide text-red-500">
//                       <Input
//                         type="checkbox"
//                         checked={transactionMade}
//                         onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
//                           setTransactionMade(e.target.checked)
//                         }
//                         className="w-4 font-normal text-xs md:text-sm lg:text-sm"
//                       />
//                       Please check this if you made any transaction *
//                     </span>
//                   </div>
//                   {transactionMade ? (
//                     <div className="grid gap-2">
//                       <div className="grid grid-cols-1 items-center">
//                         <span className="text-[10px] md:text-xs md:mb-1 font-medium tracking-wide text-red-500">
//                           Amount Type * -{" "}
//                           <span className="text-gray-600 font-extrabold tracking-wider">
//                             {TransactionAmountType.DEBIT}
//                           </span>
//                         </span>
//                       </div>
//                       <div className="grid grid-cols-1 items-center">
//                         <span className="text-[10px] md:text-xs md:mb-1 font-medium tracking-wide text-red-500">
//                           Transaction Date *
//                         </span>
//                         <PopoverC
//                           isOpen={transactionDateIsOpen}
//                           setIsOpen={setTransactionDateIsOpen}
//                           className="w-full md:min-w-[18rem] border-2 rounded-md"
//                           trigger={
//                             <div className="bg-[#ffffff] h-10 rounded overflow-hidden flex items-center px-3 text-sm font-normal cursor-pointer">
//                               <button className="flex items-center">
//                                 <CalendarIcon className="mr-2 h-4 w-4 text-gray-800" />
//                                 {transactionDate ? (
//                                   <span className="text-gray-800">
//                                     {format(transactionDate, "PPP")}
//                                   </span>
//                                 ) : (
//                                   <span className="text-gray-800">
//                                     Pick a date
//                                   </span>
//                                 )}
//                               </button>
//                             </div>
//                           }
//                         >
//                           <Calendar
//                             mode="single"
//                             selected={transactionDate}
//                             onSelect={setTransactionDate}
//                             initialFocus
//                             className="w-full md:min-w-[18rem] md:max-w-[18rem] lg:min-w-[18rem] lg:max-w-[18rem] rounded-sm overflow-hidden bg-white text-black"
//                           />
//                         </PopoverC>
//                       </div>
//                       <div className="grid grid-cols-1 items-center">
//                         <span className="text-[10px] md:text-xs md:mb-1 font-medium tracking-wide text-red-500">
//                           Paid By *
//                         </span>
//                         <InputSearchSuggestion
//                           inputClass="text-start border bg-gray-50 text-gray-800 border rounded-md h-10 px-3 text-sm font-normal"
//                           suggestionItemsClass="text-black text-sm"
//                           placeholder="Select who made the payment"
//                           inputValue={transactionMadeByName}
//                           setInputValue={setTransactionMadeByName}
//                           selectedEmp={setTransactionMadeBy}
//                           name="employee"
//                         />
//                       </div>
//                       <div className="grid grid-cols-1 items-center">
//                         <span className="text-[10px] md:text-xs md:mb-1 font-medium tracking-wide text-red-500">
//                           Transaction Type *
//                         </span>
//                         <CustomSelect
//                           options={Object.values(TransactionType).map(
//                             (item) => ({ _id: item, label: item })
//                           )}
//                           selectedValue={{
//                             _id: transactionType || "",
//                             label: transactionType || "",
//                           }}
//                           onSelect={(value: CustomSelectOption) => {
//                             setTransactionType(value._id as TransactionType);
//                           }}
//                           placeholder="Select status"
//                           className="w-full font-normal text-xs md:text-sm lg:text-sm rounded-md"
//                           btnClassName="rounded-md"
//                         />
//                       </div>
//                       <div className="grid grid-cols-1 items-center">
//                         <span className="text-[10px] md:text-xs md:mb-1 font-medium tracking-wide text-red-500">
//                           Transaction Method *
//                         </span>
//                         <CustomSelect
//                           options={Object.values(TransactionMethods).map(
//                             (item) => ({ _id: item, label: item })
//                           )}
//                           selectedValue={{
//                             _id: transactionMethod || "",
//                             label: transactionMethod || "",
//                           }}
//                           onSelect={(value: CustomSelectOption) => {
//                             setTransactionMethod(
//                               value._id as TransactionMethods
//                             );
//                           }}
//                           placeholder="Select status"
//                           className="w-full font-normal text-xs md:text-sm lg:text-sm"
//                           btnClassName="rounded-md"
//                         />
//                       </div>
//                       <div className="grid grid-cols-1 items-center">
//                         <span className="text-[10px] md:text-xs md:mb-1 font-medium tracking-wide text-red-500">
//                           Transaction Status *
//                         </span>
//                         <CustomSelect
//                           options={Object.values(TransactionStatus).map(
//                             (item) => ({ _id: item, label: item })
//                           )}
//                           selectedValue={{
//                             _id: transactionStatus || "",
//                             label: transactionStatus || "",
//                           }}
//                           onSelect={(value: CustomSelectOption) => {
//                             setTransactionStatus(
//                               value._id as TransactionStatus
//                             );
//                           }}
//                           placeholder="Select status"
//                           className="w-full font-normal text-xs md:text-sm lg:text-sm"
//                           btnClassName="rounded-md"
//                         />
//                       </div>
//                       <div className="grid grid-cols-1 items-center">
//                         <span className="text-[10px] md:text-xs md:mb-1 font-medium tracking-wide text-red-500">
//                           Paid To *
//                         </span>
//                         <Input
//                           value={paidTo}
//                           onChange={(e: ChangeEvent<HTMLInputElement>) =>
//                             setPaidTo(e.target.value)
//                           }
//                           placeholder="Enter reciver name..."
//                           className="w-full font-normal text-xs md:text-sm lg:text-sm"
//                         />
//                       </div>
//                       <div className="grid grid-cols-1 items-center">
//                         <span className="text-[10px] md:text-xs md:mb-1 font-medium tracking-wide text-red-500">
//                           Amount *
//                         </span>
//                         <Input
//                           value={amount}
//                           onChange={(e: ChangeEvent<HTMLInputElement>) => {
//                             if (isNaN(Number(e.target.value))) return;
//                             setAmount(e.target.value);
//                           }}
//                           placeholder="Enter reciver name..."
//                           className="w-full font-normal text-xs md:text-sm lg:text-sm"
//                         />
//                       </div>
//                     </div>
//                   ) : (
//                     <></>
//                   )}
//                 </div>
//               ) : selectedMovementFrom === StockMovFromLocation.MAIN ? (
//                 <>
//                   <div className="grid grid-cols-1 items-center">
//                     <span className="text-[10px] md:text-xs md:mb-1 font-medium tracking-wide text-red-500">
//                       Move To *
//                     </span>
//                     <Input
//                       value={"OFFICE"}
//                       placeholder=""
//                       className="w-full font-normal text-xs md:text-sm lg:text-sm"
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
//                 </>
//               ) : (
//                 <></>
//               )}
//             </div>

//             <SheetFooter className="gap-2 md:gap-1">
//               <SheetClose>
//                 <button className="bg-gray-200 w-full hover:bg-gray-100 border border-gray-300 hover:border-gray-500 transition-all duration-300 font-medium px-4 h-8 rounded-sm text-xs">
//                   Cancel
//                 </button>
//               </SheetClose>
//               <button
//                 onClick={() => {
//                   if (selectedMovementFrom === StockMovFromLocation.MAIN)
//                     handleInternalMove();
//                 }}
//                 className="bg-[#408dfb] hover:bg-blue-500 transition-all duration-300 font-medium px-4 h-8 rounded-sm text-xs text-white"
//               >
//                 {transactionMade ? "Create Transaction" : "Save"}
//               </button>
//             </SheetFooter>
//           </SheetContent>
//         </Sheet>
//         <Table>
//           <TableHeader>
//             {table.getHeaderGroups().map((headerGroup) => (
//               <TableRow key={headerGroup.id}>
//                 {headerGroup.headers.map((header) => {
//                   return (
//                     <TableHead key={header.id} className="text-center">
//                       {header.isPlaceholder
//                         ? null
//                         : flexRender(
//                             header.column.columnDef.header,
//                             header.getContext()
//                           )}
//                     </TableHead>
//                   );
//                 })}
//               </TableRow>
//             ))}
//           </TableHeader>
//           <TableBody>
//             {table.getRowModel().rows?.length ? (
//               table.getRowModel().rows.map((row) => (
//                 <TableRow
//                   className="cursor-pointer"
//                   key={row.id}
//                   data-state={row.getIsSelected() && "selected"}
//                   //   onClick={() => handleSelectedCustomerUpdate(row.original)}
//                 >
//                   {row.getVisibleCells().map((cell) => (
//                     <TableCell key={cell.id} className="text-center">
//                       {flexRender(
//                         cell.column.columnDef.cell,
//                         cell.getContext()
//                       )}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell
//                   colSpan={columns.length}
//                   className="h-24 text-center"
//                 >
//                   No results.
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </div>
//     </div>
//   );
// };

// export default MainStock;
