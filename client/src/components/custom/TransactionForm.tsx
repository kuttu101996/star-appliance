import React, { ChangeEvent, Dispatch, SetStateAction } from "react";
import { Input } from "../ui/input";
import { Customer, CustomSelectOption, Employee } from "@/types/schemaTypes";
import {
  SellTo,
  TransactionAmountType,
  TransactionMethods,
  TransactionStatus,
  TransactionType,
} from "@/types/enumTypes";
import CustomSelect from "./CustomSelect/CustomSelect";
import InputSearchSuggestion from "../common/InputSearchSuggestion";
import { Calendar } from "../ui/calendar";
import { CalendarIcon } from "lucide-react";
import { PopoverC } from "../shadcn_like_custom_comps/Popover/Popover";
import { format } from "date-fns";

export interface TransactionFormProps {
  transactionAmtType?: TransactionAmountType;
  setTransactionAmtType: Dispatch<
    SetStateAction<TransactionAmountType | undefined>
  >;

  transactionDateIsOpen: boolean;
  setTransactionDateIsOpen: Dispatch<SetStateAction<boolean>>;

  transactionDate?: Date;
  setTransactionDate: Dispatch<SetStateAction<Date | undefined>>;

  transactionMadeByName: string;
  setTransactionMadeByName: Dispatch<SetStateAction<string>>;
  setTransactionMadeByEmp?: Dispatch<SetStateAction<Partial<Employee>>>;
  setTransactionMadeByCus?: Dispatch<SetStateAction<Partial<Customer>>>;

  transactionType?: TransactionType;
  setTransactionType: Dispatch<SetStateAction<TransactionType | undefined>>;

  transactionMethod?: TransactionMethods;
  setTransactionMethod: Dispatch<
    SetStateAction<TransactionMethods | undefined>
  >;

  transactionStatus?: TransactionStatus;
  setTransactionStatus: Dispatch<SetStateAction<TransactionStatus | undefined>>;

  amount: string;
  setAmount: Dispatch<SetStateAction<string>>;

  paidToName: string;
  setPaidToName: Dispatch<SetStateAction<string>>;
  setPaidTo: Dispatch<SetStateAction<Partial<Employee>>>;

  place?: string;
  sellTo?: SellTo;
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  transactionAmtType,
  setTransactionAmtType,
  transactionDateIsOpen,
  setTransactionDateIsOpen,
  transactionDate,
  setTransactionDate,
  transactionMadeByName,
  setTransactionMadeByName,
  setTransactionMadeByEmp,
  setTransactionMadeByCus,
  transactionType,
  setTransactionType,
  transactionMethod,
  setTransactionMethod,
  transactionStatus,
  setTransactionStatus,
  amount,
  setAmount,
  paidToName,
  setPaidToName,
  setPaidTo,
  place,
  sellTo,
}) => {
  return (
    <div className="grid gap-3">
      {/* Amount Type */}
      {place === "sale" ? (
        <div className="grid grid-cols-1 items-center mt-2">
          <span className="text-[10px] md:text-xs md:mb-1 font-medium tracking-wide text-red-500">
            Amount Type * -{" "}
            <span className="text-gray-600 font-extrabold tracking-wider">
              {TransactionAmountType.CREDIT}
            </span>
          </span>
        </div>
      ) : place === "techRtn" ? (
        <div className="grid grid-cols-1 items-center">
          <span className="text-[10px] md:text-xs md:mb-1 font-medium tracking-wide text-red-500">
            Amount Type * -{" "}
            <span className="text-gray-600 font-extrabold tracking-wider">
              {TransactionAmountType.DEBIT}
            </span>
          </span>
        </div>
      ) : place === "techSell" ? (
        <div className="grid grid-cols-1 items-center">
          <span className="text-[10px] md:text-xs md:mb-1 font-medium tracking-wide text-red-500">
            Amount Type * -{" "}
            <span className="text-gray-600 font-extrabold tracking-wider">
              {TransactionAmountType.CREDIT}
            </span>
          </span>
        </div>
      ) : (
        <div className="items-center flex justify-between">
          <span className="text-[10px] md:text-xs md:mb-1 font-medium tracking-wide text-red-500">
            Amount Type *
            {/* <span className="text-gray-600">
                            {TransactionAmountType.DEBIT}
                          </span> */}
          </span>
          <CustomSelect
            options={[
              {
                _id: TransactionAmountType.DEBIT,
                label: TransactionAmountType.DEBIT,
              },
              {
                _id: TransactionAmountType.CREDIT,
                label: TransactionAmountType.CREDIT,
              },
            ]}
            selectedValue={
              transactionAmtType
                ? { _id: transactionAmtType, label: transactionAmtType }
                : undefined
            }
            onSelect={(value: CustomSelectOption) => {
              setTransactionAmtType(value._id as TransactionAmountType);
            }}
            placeholder="Amount Type..."
            className="w-[70%] font-normal text-xs md:text-sm lg:text-sm"
          />
        </div>
      )}

      {/* Transaction Type */}
      {sellTo === SellTo.CUSTOMER || sellTo === SellTo.TECHNICIAN ? (
        <div className="grid grid-cols-1 items-center">
          <span className="text-[10px] md:text-xs md:mb-1 font-medium tracking-wide text-red-500">
            Transaction Type * -{" "}
            <span className="text-gray-600 font-extrabold tracking-wider">
              {TransactionType.SALE}
            </span>
          </span>
        </div>
      ) : place === "techRtn" ? (
        <div className="grid grid-cols-1 items-center">
          <span className="text-[10px] md:text-xs md:mb-1 font-medium tracking-wide text-red-500">
            Transaction Type * -{" "}
            <span className="text-gray-600 font-extrabold tracking-wider">
              {TransactionType.RETURN}
            </span>
          </span>
        </div>
      ) : place === "techSell" ? (
        <div className="grid grid-cols-1 items-center">
          <span className="text-[10px] md:text-xs md:mb-1 font-medium tracking-wide text-red-500">
            Transaction Type * -{" "}
            <span className="text-gray-600 font-extrabold tracking-wider">
              {TransactionType.SALE}
            </span>
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 items-center">
          <span className="text-[10px] md:text-xs md:mb-1 font-medium tracking-wide text-red-500">
            Transaction Type *
          </span>
          <CustomSelect
            options={Object.values(TransactionType).map((item) => ({
              _id: item,
              label: item,
            }))}
            selectedValue={
              transactionType
                ? { _id: transactionType, label: transactionType }
                : undefined
            }
            onSelect={(value: CustomSelectOption) => {
              setTransactionType(value._id as TransactionType);
            }}
            placeholder="Select status"
            className="w-full font-normal text-xs md:text-sm lg:text-sm rounded-md"
            btnClassName="rounded-md"
          />
        </div>
      )}

      {/*  */}
      <div className="grid grid-cols-1 items-center">
        <span className="text-[10px] md:text-xs md:mb-1 font-medium tracking-wide text-gray-800">
          Transaction Date
        </span>
        <PopoverC
          isOpen={transactionDateIsOpen}
          setIsOpen={setTransactionDateIsOpen}
          className="w-full md:min-w-[18rem] border-2 rounded-md"
          trigger={
            <div className="bg-[#ffffff] h-10 rounded overflow-hidden flex items-center px-3 text-sm font-normal cursor-pointer">
              <button className="flex items-center">
                <CalendarIcon className="mr-2 h-4 w-4 text-gray-800" />
                {transactionDate ? (
                  <span className="text-gray-800">
                    {format(transactionDate, "PPP")}
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
            selected={transactionDate}
            onSelect={setTransactionDate}
            initialFocus
            className="w-full md:min-w-[18rem] md:max-w-[18rem] lg:min-w-[18rem] lg:max-w-[18rem] rounded-sm overflow-hidden bg-white text-black"
          />
        </PopoverC>
      </div>

      {/* Payment Made By */}
      {place === "techSell" ? (
        <></>
      ) : (
        <div className="grid grid-cols-1 items-center">
          <span className="text-[10px] md:text-xs md:mb-1 font-medium tracking-wide text-red-500">
            Payment Made By *
          </span>
          {sellTo === SellTo.CUSTOMER ? (
            <InputSearchSuggestion
              inputClass="text-start border bg-gray-50 text-gray-800 border rounded-md h-10 px-3 text-sm font-normal"
              suggestionItemsClass="text-black text-sm"
              placeholder="Select who made the payment..."
              inputValue={transactionMadeByName}
              setInputValue={setTransactionMadeByName}
              selectedCus={setTransactionMadeByCus}
              name="customer"
            />
          ) : (
            <InputSearchSuggestion
              inputClass="text-start border bg-gray-50 text-gray-800 border rounded-md h-10 px-3 text-sm font-normal"
              suggestionItemsClass="text-black text-sm"
              placeholder="Select who made the payment..."
              inputValue={transactionMadeByName}
              setInputValue={setTransactionMadeByName}
              selectedEmp={setTransactionMadeByEmp}
              name={place === "techRtn" ? "employee" : "technician"}
            />
          )}
        </div>
      )}

      {/* Transaction Method */}
      <div className="grid grid-cols-1 items-center">
        <span className="text-[10px] md:text-xs md:mb-1 font-medium tracking-wide text-red-500">
          Transaction Method *
        </span>
        <CustomSelect
          options={Object.values(TransactionMethods).map((item) => ({
            _id: item,
            label: item,
          }))}
          selectedValue={
            transactionMethod
              ? {
                  _id: transactionMethod,
                  label: transactionMethod,
                }
              : undefined
          }
          onSelect={(value: CustomSelectOption) => {
            setTransactionMethod(value._id as TransactionMethods);
          }}
          placeholder="Select status"
          className="w-full font-normal text-xs md:text-sm lg:text-sm"
          btnClassName="rounded-md"
        />
      </div>

      {/*  */}
      <div className="grid grid-cols-1 items-center">
        <span className="text-[10px] md:text-xs md:mb-1 font-medium tracking-wide text-red-500">
          Transaction Status *
        </span>
        <CustomSelect
          options={Object.values(TransactionStatus).map((item) => ({
            _id: item,
            label: item,
          }))}
          selectedValue={
            transactionStatus
              ? {
                  _id: transactionStatus,
                  label: transactionStatus,
                }
              : undefined
          }
          onSelect={(value: CustomSelectOption) => {
            setTransactionStatus(value._id as TransactionStatus);
          }}
          placeholder="Select status"
          className="w-full font-normal text-xs md:text-sm lg:text-sm"
          btnClassName="rounded-md"
        />
      </div>
      {place === "techRtn" ? (
        <></>
      ) : place === "techSell" ? (
        <div className="grid grid-cols-1 items-center">
          <span className="text-[10px] md:text-xs md:mb-1 font-medium tracking-wide text-red-500">
            Paid To *
          </span>
          <InputSearchSuggestion
            inputClass="text-start border bg-gray-50 text-gray-800 border rounded-md h-10 px-3 text-sm font-normal"
            suggestionItemsClass="text-black text-sm"
            placeholder="Who collected made the payment..."
            inputValue={paidToName}
            setInputValue={setPaidToName}
            selectedEmp={setPaidTo}
            name={"officeEmp"}
          />
        </div>
      ) : sellTo &&
        (sellTo === SellTo.CUSTOMER || sellTo === SellTo.TECHNICIAN) ? (
        <div className="grid grid-cols-1 items-center">
          <span className="text-[10px] md:text-xs md:mb-1 font-medium tracking-wide text-red-500">
            Paid To *
          </span>
          <InputSearchSuggestion
            inputClass="text-start border bg-gray-50 text-gray-800 border rounded-md h-10 px-3 text-sm font-normal"
            suggestionItemsClass="text-black text-sm"
            placeholder="Who collected made the payment..."
            inputValue={paidToName}
            setInputValue={setPaidToName}
            selectedEmp={setPaidTo}
            name={"employee"}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 items-center">
          <span className="text-[10px] md:text-xs md:mb-1 font-medium tracking-wide text-red-500">
            Paid To *
          </span>
          <Input
            value={paidToName}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setPaidToName(e.target.value);
            }}
            placeholder="Enter reciver name..."
            className="w-full font-normal text-xs md:text-sm lg:text-sm"
          />
        </div>
      )}
      <div className="grid grid-cols-1 items-center">
        <span className="text-[10px] md:text-xs md:mb-1 font-medium tracking-wide text-red-500">
          Amount *
        </span>
        <Input
          value={amount}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            const regex = /^[0-9]*\.?[0-9]*$/;
            if (!regex.test(e.target.value)) return;
            setAmount(e.target.value);
          }}
          placeholder="Enter reciver name..."
          className="w-full font-normal text-xs md:text-sm lg:text-sm"
        />
      </div>
    </div>
  );
};

export default TransactionForm;
