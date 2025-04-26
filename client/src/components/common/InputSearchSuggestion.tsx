import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "./InputSearchSuggestion.css";
// import {config} from "dotenv";
// import { useTableState } from "@/context/TableContext";
import { cn } from "@/lib/utils";
import {
  Customer,
  Employee,
  Stock,
  Transaction,
  User,
} from "@/types/schemaTypes";
import { AppDispatch, RootState } from "@/app/store";
import { useDispatch } from "react-redux";
import { getAllCustomers } from "@/features/customer/customerSlice";
import {
  getAllEmployees,
  getAllTechnicians,
} from "@/features/employee/employeeSlice";
// import { getAllItems } from "@/features/inventory/inventorySliceFunctions";
import { getAllUsers } from "@/features/user/userSlice";
import { useSelector } from "react-redux";
import { Input } from "../ui/input";
import { getAllTransaction } from "@/features/transaction/transactionSlice";
// (customer, employee, inventory, technician, user)

interface InputSearchSuggestionProps {
  mainDivClass?: string;
  inputClass?: string;
  suggestionsMainDivClass?: string;
  suggestionItemsClass?: string;
  name: string;
  placeholder: string;
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  selectedCus?: React.Dispatch<React.SetStateAction<Partial<Customer>>>;
  selectedEmp?: React.Dispatch<React.SetStateAction<Partial<Employee>>>;
  selectedUser?: React.Dispatch<React.SetStateAction<Partial<User>>>;
  // id?: number;
}

function InputSearchSuggestion({
  mainDivClass,
  inputClass,
  suggestionsMainDivClass,
  suggestionItemsClass,
  inputValue,
  setInputValue,
  selectedCus,
  selectedEmp,
  name,
  placeholder,
}: // id,
InputSearchSuggestionProps) {
  const dispatch: AppDispatch = useDispatch();

  const customers: Customer[] = useSelector(
    (state: RootState) => state.customers.customers
  );
  const employees: Employee[] = useSelector(
    (state: RootState) => state.employees.employees
  );
  const officeEmp: Employee[] = useSelector(
    (state: RootState) => state.employees.officeEmp
  );
  const technicians: Employee[] = useSelector(
    (state: RootState) => state.employees.technicians
  );
  const items: Stock[] = useSelector((state: RootState) => state.stock.stock);
  const users: User[] = useSelector((state: RootState) => state.users.users);
  const transactions: Transaction[] = useSelector(
    (state: RootState) => state.transactions.transactions
  );

  const [selectedSuggestion, setSelectedSuggestion] = useState<
    Customer | Employee | Stock | User | Transaction | null
  >(null);

  const [suggestions, setSuggestions] = useState<
    Customer[] | Employee[] | Stock[] | User[] | Transaction[]
  >(
    name === "customer"
      ? customers
      : name === "employee"
      ? employees
      : name === "officeEmp"
      ? officeEmp
      : name === "technician"
      ? technicians
      : name === "inventory"
      ? items
      : name === "user"
      ? users
      : name === "transaction"
      ? transactions
      : []
  );

  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInputValue(value);
      setSelectedSuggestion(null);

      let filteredData:
        | Customer[]
        | Employee[]
        | User[]
        | Stock[]
        | Transaction[] = [];

      if (name === "customer") {
        filteredData = customers.filter((item): item is Customer =>
          (item as Customer).name?.toLowerCase().includes(value.toLowerCase())
        );
      } else if (name === "employee") {
        filteredData = employees.filter((item): item is Employee =>
          (item as Employee).name?.toLowerCase().includes(value.toLowerCase())
        );
      } else if (name === "officeEmp") {
        filteredData = officeEmp.filter((item): item is Employee =>
          (item as Employee).name?.toLowerCase().includes(value.toLowerCase())
        );
      } else if (name === "technician") {
        filteredData = technicians.filter((item): item is Employee =>
          (item as Employee).name?.toLowerCase().includes(value.toLowerCase())
        );
      } else if (name === "inventory") {
        filteredData = items.filter((item): item is Stock =>
          (item as Stock).itemName?.toLowerCase().includes(value.toLowerCase())
        );
      } else if (name === "user") {
        filteredData = users.filter((item): item is User =>
          (item as User).displayName
            ?.toLowerCase()
            .includes(value.toLowerCase())
        );
      } else if (name === "transaction") {
        filteredData = transactions.filter((item): item is Transaction =>
          (item as Transaction).transactionId
            ?.toLowerCase()
            .includes(value.toLowerCase())
        );
      }

      setSuggestions(filteredData);
    },
    [customers, employees, technicians, items, users, transactions, name]
  );

  const handleKeyDown = useCallback(
    (
      e: React.KeyboardEvent,
      suggestion: Customer | Employee | Stock | User | Transaction | {}
    ) => {
      const currentFocus = document.activeElement as HTMLElement;

      if (inputValue === "" || !suggestions.length) return;

      let propertyValue: string = "";

      if (name === "customer") {
        propertyValue = (suggestion as Customer).name;
      } else if (
        name === "employee" ||
        name === "technician" ||
        name === "officeEmp"
      ) {
        propertyValue = (suggestion as Employee).name;
      } else if (name === "inventory") {
        propertyValue = (suggestion as Stock).itemName;
      } else if (name === "user") {
        propertyValue = (suggestion as User).displayName;
      } else if (name === "transaction") {
        propertyValue = (suggestion as Transaction).transactionId;
      }

      if (
        e.key === "ArrowUp" &&
        currentFocus.classList.contains("suggestion")
      ) {
        e.preventDefault();
        const previousSuggestion =
          currentFocus.previousElementSibling as HTMLElement;
        previousSuggestion
          ? previousSuggestion.focus()
          : inputRef.current?.focus();
      } else if (e.key === "ArrowDown" && suggestions.length > 0) {
        if (currentFocus.classList.contains("search-input")) {
          e.preventDefault();
          const suggestionToFocus =
            suggestionsRef.current?.querySelectorAll(".suggestion");
          (suggestionToFocus?.[0] as HTMLElement)?.focus();
        } else if (currentFocus.classList.contains("suggestion")) {
          e.preventDefault();
          const nextSuggestion = currentFocus.nextElementSibling as HTMLElement;
          nextSuggestion ? nextSuggestion.focus() : "";
        }
      } else if (e.key === "Enter") {
        e.preventDefault();
        setInputValue(propertyValue || "");
        setSelectedSuggestion(
          name === "customer"
            ? (suggestion as Customer)
            : name === "technician"
            ? (suggestion as Employee)
            : name === "employee"
            ? (suggestion as Employee)
            : name === "officeEmp"
            ? (suggestion as Employee)
            : name === "user"
            ? (suggestion as User)
            : name === "transaction"
            ? (suggestion as Transaction)
            : null
        );
        setSuggestions([]); // Close suggestions after selection
      }
    },
    [inputValue, suggestions, setInputValue, setSelectedSuggestion, name]
  );

  const handleSuggestionClick = useCallback(
    (suggestion: Customer | Employee | Stock | User | Transaction) => {
      let propertyValue: string = "";

      if (name === "customer") {
        propertyValue = (suggestion as Customer).name;
      } else if (name === "employee") {
        propertyValue = (suggestion as Employee).name;
      } else if (name === "officeEmp") {
        propertyValue = (suggestion as Employee).name;
      } else if (name === "technician") {
        propertyValue = (suggestion as Employee).name;
      } else if (name === "inventory") {
        propertyValue = (suggestion as Stock).itemName;
      } else if (name === "user") {
        propertyValue = (suggestion as User).displayName;
      } else if (name === "transaction") {
        propertyValue = (suggestion as Transaction).transactionId;
      }

      setInputValue(propertyValue || "");
      setSelectedSuggestion(suggestion);
      setSuggestions([]);
      inputRef.current?.focus();
    },
    []
  );

  useEffect(() => {
    name === "customer"
      ? dispatch(getAllCustomers())
      : name === "employee"
      ? dispatch(getAllEmployees())
      : name === "officeEmp"
      ? dispatch(getAllEmployees())
      : name === "technician"
      ? dispatch(getAllTechnicians())
      : name === "user"
      ? dispatch(getAllUsers())
      : name === "transaction"
      ? dispatch(getAllTransaction({}))
      : "";
    // : name === "inventory"
    // ? dispatch(getAllItems())
  }, [name]);

  useLayoutEffect(() => {
    let rowToFocus =
      document.querySelectorAll<HTMLInputElement>(".search-input");
    if (rowToFocus.length > 0) {
      rowToFocus[rowToFocus.length - 1].focus();
    }
    if (name === "customer" && selectedCus)
      selectedCus(selectedSuggestion as Customer);
    if (name === "technician" && selectedEmp)
      selectedEmp(selectedSuggestion as Employee);
    if (name === "employee" && selectedEmp)
      selectedEmp(selectedSuggestion as Employee);
    if (name === "officeEmp" && selectedEmp)
      selectedEmp(selectedSuggestion as Employee);
    if (name === "transaction" && selectedEmp)
      selectedEmp(selectedSuggestion as Transaction);
  }, [selectedSuggestion]);

  const handleClickOutside = useCallback(
    (e: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setSuggestions([]);
      }
    },
    [setSuggestions]
  );

  useEffect(() => {
    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [handleClickOutside]);

  const memoizedSuggestions = useMemo(() => suggestions || [], [suggestions]);

  return (
    <div
      id={name + Date.now().toString()}
      className={cn("search-box", mainDivClass)}
    >
      <Input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={(e) => handleKeyDown(e, selectedSuggestion || {})}
        placeholder={placeholder}
        className={cn(
          "search-input w-full border border-gray-300 hover:border-[#408dfb] focus:border-[#408dfb] transition duration-200 focus:ring-0 focus:outline-none focus:shadow-lg focus:shadow-[#408dfb80]",
          inputClass
        )}
        ref={inputRef}
        id={suggestions[0]?._id?.toString() || Date.now().toString() + name}
      />
      {inputValue && suggestions.length > 0 ? (
        <div
          className={cn(
            `suggestions_container rounded top-11 ${
              !suggestions.length && "w-0"
            }`,
            suggestionsMainDivClass
          )}
          ref={suggestionsRef}
        >
          <div className="suggestions">
            {memoizedSuggestions.map((suggestion, index) => (
              <div
                key={index + Date.now().toString()}
                className={cn(
                  `suggestion ${
                    selectedSuggestion === suggestion ? "selected" : ""
                  }`,
                  suggestionItemsClass
                )}
                onClick={() => handleSuggestionClick(suggestion)}
                onKeyDown={(e) => {
                  handleKeyDown(e, suggestion);
                }}
                tabIndex={0}
              >
                {name === "customer"
                  ? (suggestion as Customer).name
                  : name === "employee"
                  ? (suggestion as Employee).name
                  : name === "officeEmp"
                  ? (suggestion as Employee).name
                  : name === "technician"
                  ? (suggestion as Employee).name
                  : name === "user"
                  ? (suggestion as User).displayName
                  : name === "inventory"
                  ? (suggestion as Stock).itemName
                  : name === "transaction"
                  ? (suggestion as Transaction).transactionId
                  : ""}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default InputSearchSuggestion;
