import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import MainStock from "./MainStock/MainStock";
import OfficeStock from "./OfficeStock/OfficeStock";
import Movements from "./Movements/Movements";
import TechnicianStock from "./TechnicianStock/TechnicianStock";

const StockTabs = () => {
  return (
    <div className="w-full">
      <Tabs
        defaultValue="Stock"
        className="w-full justify-start mt-4 overflow-x-auto"
      >
        {/*grid w-full grid-cols-3 bg-[#21263c] text-[#ffffff] */}
        <TabsList className="bg-transparent w-full flex justify-start gap-0 md:gap-2 lg:gap-3 pb-0 text-xs md:text-sm lg:text-sm">
          {/* Main Stock */}
          {/* <TabsTrigger
            className="min-w-14 text-xs md:text-sm lg:text-sm md:min-w-24 lg:min-w-24 text-gray-700"
            value="Main Stock"
          >
            Main
            <div className="hidden md:block lg:block md:ml-1 lg:ml-1">
              Stock
            </div>
          </TabsTrigger> */}

          <TabsTrigger
            className="min-w-14 text-xs md:text-sm lg:text-sm md:min-w-24 lg:min-w-24 text-gray-700"
            value="Stock"
          >
            Office
            <div className="hidden md:block lg:block md:ml-1 lg:ml-1">
              Stock
            </div>
          </TabsTrigger>

          {/* Technician Stock */}
          <TabsTrigger
            className="min-w-14 text-xs md:text-sm lg:text-sm md:min-w-24 lg:min-w-24 text-gray-700"
            value="Technician Stock"
          >
            Tachnician{" "}
            <div className="hidden md:block lg:block md:ml-1 lg:ml-1">
              Stock
            </div>
          </TabsTrigger>

          {/* Stock Movements */}
          <TabsTrigger
            className="min-w-14 text-xs md:text-sm lg:text-sm md:min-w-24 lg:min-w-24 text-gray-700 hidden md:flex"
            value="Stock Movements"
          >
            <div className="hidden md:block lg:block md:mr-1 lg:mr-1">
              Stock
            </div>{" "}
            Movement
          </TabsTrigger>
        </TabsList>

        {/* <TabsContent className="w-full overflow-y-auto py-3" value="Main Stock">
          <MainStock />
        </TabsContent> */}

        <TabsContent className="w-full overflow-y-auto py-3" value="Stock">
          <OfficeStock />
        </TabsContent>

        <TabsContent
          className="w-full overflow-y-auto py-3"
          value="Technician Stock"
        >
          <TechnicianStock />
        </TabsContent>

        <TabsContent
          className="w-full overflow-y-auto py-3"
          value="Stock Movements"
        >
          <Movements />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StockTabs;
