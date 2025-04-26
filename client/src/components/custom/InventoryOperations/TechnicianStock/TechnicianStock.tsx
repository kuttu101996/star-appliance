import React, { useEffect, useState } from "react";
import { Employee, Stock } from "@/types/schemaTypes";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store";
import { useDispatch } from "react-redux";
import { getAllTechnicians } from "@/features/employee/employeeSlice";
import { formatCustomerName } from "../../ServiceOperations/ServiceRequests/ServiceRequests";
import { Badge } from "@/components/ui/badge";
import StockTable from "../StockTable";
import { useToast } from "@/hooks/use-toast";
import { getAllTechnicianStock } from "@/features/technician/technicianSlice";

const getDueBadgeClass = (due: number) => {
  if (!due) return "bg-green-500 hover:bg-violet-400";
  if (due < 500) return "bg-green-500 hover:bg-violet-400";
  if (due < 1000) return "bg-orange-500 hover:bg-orange-400";
  return "bg-red-500 hover:bg-red-400";
};

const TechnicianStock: React.FC = () => {
  const { toast } = useToast();
  const dispatch: AppDispatch = useDispatch();
  const technicianStock = useSelector(
    (state: RootState) => state.technicians.technicianStock
  );
  const stockError = useSelector((state: RootState) => state.stock.error);
  const technicians = useSelector(
    (state: RootState) => state.employees.technicians
  );

  const [technicianWiseStock, setTechnicianWiseStock] = useState<
    Record<string, Stock[]>
  >({});
  const [technicianTotalDue, setTechnicianTotalDue] = useState<
    Record<string, number>
  >({});

  useEffect(() => {
    dispatch(getAllTechnicians());
    dispatch(getAllTechnicianStock());
  }, []);

  useEffect(() => {
    if (stockError) toast({ title: stockError, variant: "destructive" });
  }, [stockError]);

  useEffect(() => {
    if (!technicians.length) return;
    if (!technicianStock.length) return;

    const stockSegregation: Record<string, Stock[]> = {};
    const technicianWiseDueCalc: Record<string, number> = {};

    technicianStock.forEach((stock) => {
      const techId = stock.technicianId || "unassigned";
      if (!stockSegregation[techId]) {
        stockSegregation[techId] = [];
      }
      technicianWiseDueCalc[techId] =
        stock.quantity * stock.partId?.externalSellingPrice;

      stockSegregation[techId].push(stock);
    });

    setTechnicianTotalDue(technicianWiseDueCalc);
    setTechnicianWiseStock(stockSegregation);
  }, [technicians, technicianStock]);

  return (
    <div className="w-full">
      <Accordion
        type="single"
        collapsible
        className="w-full lg:grid lg:grid-cols-1"
      >
        {technicians.length ? (
          technicians.map((item: Employee) => (
            <AccordionItem
              value={item._id}
              key={item._id}
              className="bg-gray-50 px-4"
            >
              <AccordionTrigger className="hover:no-underline w-full text-[#408dfb]">
                <div className="flex items-center justify-between w-11/12 pl-0 md:pl-2 lg:pl-2">
                  <div className="flex flex-col items-start">
                    <span className="text-base md:text-2xl lg:text-xl text-[#408dfb]">
                      {formatCustomerName(item?.name)}
                    </span>
                    <span className="flex text-gray-400 text-[10px] md:text-xs lg:text-xs">
                      <span className="hidden md:flex lg:flex">
                        Mobile
                        <span className="md:pl-1 lg:pl-1 md:pr-2 lg:pr-2">
                          {" "}
                          :
                        </span>{" "}
                      </span>
                      <span>{`${item.mobile || ""}`}</span>
                    </span>
                  </div>

                  <div className="flex flex-col md:flex-row lg:flex-row gap-1 md:gap-2 lg:gap-2">
                    <div>
                      <Badge
                        className={`text-[10px] md:text-xs lg:text-xs font-normal bg-green-600 hover:bg-green-500 ${getDueBadgeClass(
                          technicianTotalDue[item._id]
                        )}`}
                      >
                        Due : {technicianTotalDue[item._id] || 0}
                      </Badge>
                    </div>
                  </div>
                </div>
              </AccordionTrigger>

              {/*  */}
              <AccordionContent className="text-xs md:text-[11px] lg:text-xs rounded-sm py-2 md:py-4 lg:py-4">
                <div className="rounded-md border">
                  <StockTable stock={technicianWiseStock[item._id] || []} />
                </div>
              </AccordionContent>
            </AccordionItem>
          ))
        ) : (
          <>
            {technicianWiseStock["unassigned"]?.length > 0 && (
              <AccordionItem value="unassigned" key="unassigned">
                <AccordionTrigger>Unassigned Technician</AccordionTrigger>
                <AccordionContent>
                  <StockTable stock={technicianWiseStock["unassigned"]} />
                </AccordionContent>
              </AccordionItem>
            )}
          </>
        )}
      </Accordion>
    </div>
  );
};

export default TechnicianStock;
