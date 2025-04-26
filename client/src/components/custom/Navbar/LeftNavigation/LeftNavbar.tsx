import {
  ArrowLeft,
  ArrowRight,
  Drill,
  File,
  Home,
  ReceiptIndianRupee,
  ReceiptText,
  Store,
  User,
  UserCog,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./LeftNavbar.css";
import { RootState } from "@/app/store";
import { useSelector } from "react-redux";

const LeftNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // const user = useSelector((state: RootState) => state.auth.user);
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  // const user = JSON.parse(sessionStorage.getItem("user") || "{}");

  const [activeNav, setActiveNav] = useState("");
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [width, setWidth] = useState(collapsed ? "2.5rem" : "13rem");

  useEffect(() => {
    setWidth(collapsed ? "2.5rem" : "13rem");
  }, [collapsed]);

  useEffect(() => {
    const currLocation = location.pathname.split("/")[1];
    // console.log(currLocation);

    currLocation === ""
      ? setActiveNav("HOME")
      : currLocation === "inventory"
      ? setActiveNav("STOCK")
      : currLocation === "customer"
      ? setActiveNav("CUS")
      : currLocation === "service"
      ? setActiveNav("SERVICE")
      : "";
  }, [location]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      style={{ width: width, transition: "width 0.3s ease" }} // Apply transition here
      className="hide-scroll-bar min-h-screen overflow-y-auto bg-[#21263c] text-[#ffffff] font-light flex flex-col justify-between overflow-hidden"
    >
      <div className="h-full">
        <div className="w-full h-12 bg-[#181c2e] px-3 sticky top-0"></div>
        <div
          className={`${collapsed ? "px-1" : "px-2"} py-3 flex flex-col gap-1`}
        >
          {/* Home */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={`flex items-center gap-3 ${
                    collapsed ? "flex-col p-2" : "flex-row p-2"
                  } rounded-lg cursor-pointer ${
                    activeNav === "HOME"
                      ? "bg-[#408dfb] hover:bg-[#408dfb]"
                      : "hover:bg-[#181c2e]"
                  }`}
                  onClick={() => {
                    setActiveNav("HOME");
                    navigate("/");
                  }}
                >
                  <span>
                    <Home width={18} strokeWidth={1.5} />
                  </span>
                  {collapsed ? (
                    <></>
                  ) : (
                    <span
                      className={`hidden md:flex lg:flex transition-all duration-300 text-xs tracking-wider font-normal`}
                    >
                      Home
                    </span>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent
                className={`${
                  collapsed ? "block" : "hidden"
                } text-xs py-1 px-2 bg-[#181c2e] border-0 text-[#fff] tracking-wider`}
              >
                <p>Home</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Customers */}
          {user && (user.userType === "ADMIN" || user.userType === "OFFICE") ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={`flex items-center gap-3 ${
                      collapsed ? "flex-col p-2" : "flex-row p-2"
                    } rounded-lg cursor-pointer ${
                      activeNav === "CUS"
                        ? "bg-[#408dfb] hover:bg-[#408dfb]"
                        : "hover:bg-[#181c2e]"
                    }`}
                    onClick={() => {
                      setActiveNav("CUS");
                      navigate("/customer");
                    }}
                  >
                    <span>
                      <User width={18} strokeWidth={1.5} />
                    </span>

                    {collapsed ? (
                      <></>
                    ) : (
                      <span
                        className={`hidden md:flex lg:flex transition-all duration-300 text-xs tracking-wider`}
                      >
                        Customers
                      </span>
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  className={`${
                    collapsed ? "block" : "hidden"
                  } text-xs py-1 px-2 bg-[#181c2e] border-0 text-[#fff] tracking-wider`}
                >
                  <p>Customers</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <></>
          )}

          {/* Employees */}
          {user && user.userType === "ADMIN" ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={`flex items-center gap-3 ${
                      collapsed ? "flex-col p-2" : "flex-row p-2"
                    } rounded-lg cursor-pointer ${
                      activeNav === "EMP"
                        ? "bg-[#408dfb] hover:bg-[#408dfb]"
                        : "hover:bg-[#181c2e]"
                    }`}
                    onClick={() => {
                      setActiveNav("EMP");
                      navigate("/employees");
                    }}
                  >
                    <span>
                      <UserCog width={18} strokeWidth={1.5} />
                    </span>

                    {collapsed ? (
                      <></>
                    ) : (
                      <span
                        className={`hidden md:flex lg:flex transition-all duration-300 text-xs tracking-wider`}
                      >
                        Employees
                      </span>
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  className={`${
                    collapsed ? "block" : "hidden"
                  } text-xs py-1 px-2 bg-[#181c2e] border-0 text-[#fff] tracking-wider`}
                >
                  <p>Employees</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <></>
          )}

          {/* Stock */}
          {user && (user.userType === "ADMIN" || user.userType === "OFFICE") ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={`flex items-center gap-3 ${
                      collapsed ? "flex-col p-2" : "flex-row p-2"
                    } rounded-lg cursor-pointer ${
                      activeNav === "STOCK"
                        ? "bg-[#408dfb] hover:bg-[#408dfb]"
                        : "hover:bg-[#181c2e]"
                    }`}
                    onClick={() => {
                      setActiveNav("STOCK");
                      navigate("/inventory");
                    }}
                  >
                    <span>
                      <Store width={18} strokeWidth={collapsed ? 1.5 : 1.2} />
                    </span>

                    {collapsed ? (
                      <></>
                    ) : (
                      <span
                        className={`hidden md:flex lg:flex transition-all duration-300 text-xs tracking-wider`}
                      >
                        Stock
                      </span>
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  className={`${
                    collapsed ? "block" : "hidden"
                  } text-xs py-1 px-2 bg-[#181c2e] border-0 text-[#fff] tracking-wider`}
                >
                  <p>Stock</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <></>
          )}

          {/* Services */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={`flex items-center gap-3 ${
                    collapsed ? "flex-col p-2" : "flex-row p-2"
                  } rounded-lg cursor-pointer ${
                    activeNav === "SERVICE"
                      ? "bg-[#408dfb] hover:bg-[#408dfb]"
                      : "hover:bg-[#181c2e]"
                  }`}
                  onClick={() => {
                    setActiveNav("SERVICE");
                    navigate("/service");
                  }}
                >
                  <span>
                    <Drill width={18} strokeWidth={1.5} />
                  </span>

                  {collapsed ? (
                    <></>
                  ) : (
                    <span
                      className={`hidden md:flex lg:flex transition-all duration-300 text-xs tracking-wider`}
                    >
                      Services
                    </span>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent
                className={`${
                  collapsed ? "block" : "hidden"
                } text-xs py-1 px-2 bg-[#181c2e] border-0 text-[#fff] tracking-wider`}
              >
                <p>Services</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Invoices */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={`flex items-center gap-3 ${
                    collapsed ? "flex-col p-2" : "flex-row p-2"
                  } rounded-lg cursor-pointer ${
                    activeNav === "Invoices"
                      ? "bg-[#408dfb] hover:bg-[#408dfb]"
                      : "hover:bg-[#181c2e]"
                  }`}
                  onClick={() => setActiveNav("Invoices")}
                >
                  <span>
                    <File width={18} strokeWidth={1.5} />
                  </span>

                  {collapsed ? (
                    <></>
                  ) : (
                    <span
                      className={`hidden md:flex lg:flex transition-all duration-300 text-xs tracking-wider`}
                    >
                      Invoices
                    </span>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent
                className={`${
                  collapsed ? "block" : "hidden"
                } text-xs py-1 px-2 bg-[#181c2e] border-0 text-[#fff] tracking-wider`}
              >
                <p>Invoices</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Payments Recived */}
          {user && (user.userType === "ADMIN" || user.userType === "OFFICE") ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={`flex items-center gap-3 ${
                      collapsed ? "flex-col p-2" : "flex-row p-2"
                    } rounded-lg cursor-pointer ${
                      activeNav === "Payments"
                        ? "bg-[#408dfb] hover:bg-[#408dfb]"
                        : "hover:bg-[#181c2e]"
                    }`}
                    onClick={() => setActiveNav("Payments")}
                  >
                    <span>
                      <ReceiptIndianRupee width={18} strokeWidth={1.3} />
                    </span>

                    {collapsed ? (
                      <></>
                    ) : (
                      <span
                        className={`hidden md:flex lg:flex transition-all duration-300 text-xs tracking-wider`}
                      >
                        Payments{" "}
                        <span className="md:hidden lg:block ml-1">Recived</span>
                      </span>
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  className={`${
                    collapsed ? "block" : "hidden"
                  } text-xs py-1 px-2 bg-[#181c2e] border-0 text-[#fff] tracking-wider`}
                >
                  <p>Payments Recived</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <></>
          )}

          {/* Expenses */}
          {user && (user.userType === "ADMIN" || user.userType === "OFFICE") ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={`flex items-center gap-3 ${
                      collapsed ? "flex-col p-2" : "flex-row p-2"
                    } rounded-lg cursor-pointer ${
                      activeNav === "Expenses"
                        ? "bg-[#408dfb] hover:bg-[#408dfb]"
                        : "hover:bg-[#181c2e]"
                    }`}
                    onClick={() => setActiveNav("Expenses")}
                  >
                    <span>
                      <ReceiptText width={18} strokeWidth={1.5} />
                    </span>

                    {collapsed ? (
                      <></>
                    ) : (
                      <span
                        className={`hidden md:flex lg:flex transition-all duration-300 text-xs tracking-wider`}
                      >
                        Expenses
                      </span>
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  className={`${
                    collapsed ? "block" : "hidden"
                  } text-xs py-1 px-2 bg-[#181c2e] border-0 text-[#fff] tracking-wider`}
                >
                  <p>Expenses</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <></>
          )}
        </div>
      </div>
      <div
        style={{ width: width, transition: "width 0.3s ease" }}
        className="hidden md:flex lg:flex items-center justify-center h-8 bg-[#181c2e] sticky bottom-0"
        onClick={() => setCollapsed((prev) => !prev)}
      >
        {collapsed ? <ArrowRight width={20} /> : <ArrowLeft width={20} />}
      </div>
    </div>
  );
};

export default LeftNavbar;
