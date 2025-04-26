import * as React from "react";
import { useSelector } from "react-redux";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { Customer } from "@/types/schemaTypes";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { AppDispatch, RootState } from "@/app/store";
import { useDispatch } from "react-redux";
import { getAllCustomers } from "@/features/customer/customerSlice";

// Optional: Helper for formatting dates
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const columns: ColumnDef<Partial<Customer>>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "mobile",
    header: "Mobile Number",
  },
  //   {
  //     accessorKey: "email",
  //     header: "Email",
  //   },
  {
    accessorKey: "customerType",
    header: "Type",
  },
  {
    accessorKey: "pincode",
    header: "Pincode",
  },
  {
    accessorKey: "serialNo",
    header: "Serial No.",
  },
  {
    accessorKey: "model",
    header: "Model",
  },
  {
    accessorKey: "installationDate",
    header: "Installation",
    cell: ({ row }) => formatDate(`${row.original?.installationDate}`),
  },
  {
    accessorKey: "lastServiceDate",
    header: "Last Service",
    cell: ({ row }) =>
      row.original.lastServiceDate
        ? formatDate(row.original.lastServiceDate.toString())
        : "—",
  },
  {
    accessorKey: "nextServiceDate",
    header: "Next Service",
    cell: ({ row }) =>
      row.original.nextServiceDate
        ? formatDate(row.original.nextServiceDate.toString())
        : "—",
  },
];

type CustomerTableProps = {
  handleSelectedCustomerUpdate: (customer: Partial<Customer>) => void;
};

export const CustomerTable: React.FC<CustomerTableProps> = ({
  handleSelectedCustomerUpdate,
}) => {
  const { toast } = useToast();
  // const user = useSelector((state: RootState) => state.auth.user);
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  const dispatch: AppDispatch = useDispatch();

  const customers = useSelector(
    (state: RootState) => state.customers.customers
  );
  //   const totalPages = useSelector(
  //     (state: RootState) => state.customers.totalPages
  //   );
  const getCustomerError = useSelector(
    (state: RootState) => state.customers.error
  );

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  // const [pageIndex, setPageIndex] = React.useState(0);
  // const [pageSize, setPageSize] = React.useState(10); // match backend

  //   React.useEffect(() => {
  //     if (user.userType === "CUSTOMER") {
  //     } else if (user.userType === "TECHNICIAN") {
  //     } else dispatch(getAllCustomers());
  //   }, []);

  React.useEffect(() => {
    if (user.userType !== "CUSTOMER" && user.userType !== "TECHNICIAN") {
      dispatch(getAllCustomers());
      // { page: pageIndex + 1, limit: pageSize }
    }
  }, []);
  // }, [pageIndex, pageSize]);

  React.useEffect(() => {
    if (getCustomerError)
      toast({ title: getCustomerError, variant: "destructive" });
  }, [getCustomerError]);

  const table = useReactTable({
    data: customers,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    // manualPagination: true,
    // pageCount: totalPages,
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter names..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-center">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  className="cursor-pointer"
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => handleSelectedCustomerUpdate(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-center">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            // onClick={() => setPageIndex((prev) => Math.max(prev - 1, 0))}
            // disabled={pageIndex === 0}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            // onClick={() => setPageIndex((prev) => prev + 1)}
            // disabled={pageIndex + 1 >= totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CustomerTable;

// const data: Partial<Customer>[] = [
//   {
//     _id: "m5gr84i9",
//     name: "asd asdasd asdasd sdasddf sadasd",
//     mobile: "4498498416165",
//     // email: "ken99@example.com",
//     pincode: "",
//     model: "",
//     serialNo: "",
//     installationDate: new Date(),
//     lastServiceDate: new Date(),
//     nextServiceDate: new Date(),
//     customerType: CustomerType.EXTENDED_WARRANTY,
//   },
//   {
//     _id: "3u1reuv4",
//     name: "",
//     mobile: "49898484456",
//     // email: "ken99@example.com",
//     pincode: "",
//     model: "",
//     serialNo: "",
//     installationDate: new Date(),
//     lastServiceDate: new Date(),
//     nextServiceDate: new Date(),
//     customerType: CustomerType.AMC,
//   },
//   {
//     _id: "derv1ws0",
//     name: "",
//     mobile: "7946621565",
//     // email: "ken99@example.com",
//     pincode: "",
//     model: "",
//     serialNo: "",
//     installationDate: new Date(),
//     lastServiceDate: new Date(),
//     nextServiceDate: new Date(),
//     customerType: CustomerType.AMC,
//   },
//   {
//     _id: "5kma53ae",
//     name: "",
//     mobile: "987965165",
//     // email: "ken99@example.com",
//     pincode: "",
//     model: "",
//     serialNo: "",
//     installationDate: new Date(),
//     lastServiceDate: new Date(),
//     nextServiceDate: new Date(),
//     customerType: CustomerType.AMC,
//   },
//   {
//     _id: "bhqecj4p",
//     name: "",
//     mobile: "98791616165",
//     // email: "ken99@example.com",
//     pincode: "",
//     model: "",
//     serialNo: "",
//     installationDate: new Date(),
//     lastServiceDate: new Date(),
//     nextServiceDate: new Date(),
//     customerType: CustomerType.AMC,
//   },
// ];
