import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Parts } from "@/types/schemaTypes";

type Option = {
  label: string;
  item: Partial<Parts>;
};

type MultiSelectChipsProps = {
  options: Option[];
  placeholder?: string;
  selected: { item: Partial<Parts>; qty: number; unitCost: number }[];
  onChange: (
    values: { item: Partial<Parts>; qty: number; unitCost: number }[]
  ) => void;
};

const MultiSelectChips: React.FC<MultiSelectChipsProps> = ({
  options,
  placeholder = "Select...",
  selected,
  onChange,
}) => {
  const isSelected = (item: Partial<Parts>) => {
    return selected.some((s) => s.item._id === item._id);
  };

  const toggleOption = (item: Partial<Parts>) => {
    const exists = selected.find((s) => s.item._id === item._id);
    if (exists) {
      onChange(selected.filter((s) => s.item._id !== item._id));
    } else {
      onChange([...selected, { item, qty: 0, unitCost: 0 }]); // default qty = 1
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="h-10 w-full rounded-md focus-visible:ring-0 focus-visible:outline-none col-span-3 border border-gray-300 hover:border-[#408dfb] focus:border-[#408dfb] transition duration-200 focus:ring-0 focus:outline-none focus:shadow-xl focus:shadow-[#408dfb80]">
          {selected.length === 0 ? (
            <span className="text-muted-foreground text-[14px]">
              {placeholder}
            </span>
          ) : (
            <span className="text-muted-foreground text-[14px]">
              {placeholder}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="max-h-60 overflow-auto font-normal text-xs md:text-sm lg:text-sm text-gray-700 p-0">
        <div className="flex flex-col">
          {options.map((option) => (
            <label
              key={option.item._id}
              className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-4 py-3 rounded-md"
            >
              <Checkbox
                checked={isSelected(option.item)}
                onCheckedChange={() => toggleOption(option.item)}
                className={`font-normal text-xs md:text-sm lg:text-sm ${
                  isSelected(option.item) ? "text-blue-600" : ""
                }`}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default MultiSelectChips;
