// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogFooter,
//   DialogTrigger,
// } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Assign } from "./InventoryFeatures/Assign";
import { Return } from "./InventoryFeatures/Return";
import { Sell } from "./InventoryFeatures/Sell";
import { Stock } from "@/types/schemaTypes";

export interface StockTableProps {
  stock: Stock[];
}

const StockTable: React.FC<StockTableProps> = ({ stock }) => {
  return (
    <div>
      {" "}
      <Table className="relative">
        <TableCaption>Stock list of all items.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Item Code</TableHead>
            <TableHead>Item Name</TableHead>
            {/* <TableHead className="text-center">Last Pay Date</TableHead>
            <TableHead className="text-center">Last Pay Amount</TableHead> */}
            <TableHead>Qty</TableHead>
            <TableHead>Cost</TableHead>
            <TableHead>Rate</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stock?.length &&
            stock.map((item) => (
              <TableRow
                key={item.partId.itemCode}
                className="w-full font-medium"
              >
                <TableCell>{item.partId.itemCode}</TableCell>

                <TableCell>{item.partId.itemName}</TableCell>

                {/* <TableCell className="text-center">
                  {item.partId.itemName}
                </TableCell>
                <TableCell className="text-center">
                  {item.partId.itemName}
                </TableCell> */}

                <TableCell>{item.quantity}</TableCell>

                <TableCell>
                  {item.partId.costPrice}
                  {!item.partId.costPrice?.toString().includes(".")
                    ? ".00"
                    : ""}
                </TableCell>

                <TableCell>
                  {item.partId.externalSellingPrice}
                  {!item.partId.externalSellingPrice?.toString().includes(".")
                    ? ".00"
                    : ""}
                </TableCell>

                <TableCell className="max-w-80 lg:max-w-28 py-3 shrink-0">
                  <div className="w-full flex items-center justify-end gap-1 lg:gap-2">
                    <Assign item={item}>
                      <button
                        className="h-4 md:h-5 lg:h-6 text-white rounded px-2 py-[1px] bg-blue-500 hover:bg-blue-600 text-[12px]"
                        // onClick={() => {}}
                      >
                        <span className="tracking-normal">Assign</span>
                      </button>
                    </Assign>

                    <Return item={item}>
                      <button
                        className="h-4 md:h-5 lg:h-6 text-white rounded px-2 py-[1px] bg-orange-500 hover:bg-orange-600 text-[12px]"
                        onClick={() => {}}
                      >
                        <span className="tracking-normal">Return</span>
                      </button>
                    </Return>

                    <Sell item={item}>
                      <button
                        className="h-4 md:h-5 lg:h-6 text-white rounded px-2 py-[1px] bg-green-500 hover:bg-green-600 text-[12px]"
                        onClick={() => {}}
                      >
                        <span className="tracking-normal">Sell</span>
                      </button>
                    </Sell>
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default StockTable;
