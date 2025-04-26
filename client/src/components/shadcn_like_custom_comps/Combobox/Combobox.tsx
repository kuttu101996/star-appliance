// src/components/Combobox.tsx

import { ReactNode, useState } from "react";
import { PopoverC } from "../Popover/Popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
} from "../Command/Command";

interface ComboboxProps<T> {
  trigger: ReactNode;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  options: T[];
  onSelect: (item: T) => void;
  renderOption: (item: T) => ReactNode;
  placeholder?: string;
  noResultText?: string;
}

function Combobox<T>({
  trigger,
  isOpen,
  setIsOpen,
  options,
  onSelect,
  renderOption,
  placeholder = "Search...",
  noResultText = "No results found",
}: ComboboxProps<T>) {
  const [search, setSearch] = useState("");

  const filteredOptions = options.filter((option) => {
    const renderedOption = renderOption(option);
    return (
      renderedOption &&
      renderedOption.toString().toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <PopoverC isOpen={isOpen} setIsOpen={setIsOpen} trigger={trigger}>
      <Command>
        <CommandInput
          className="text-gray-800 font-normal text-sm"
          placeholder={placeholder}
          onValueChange={(value) => setSearch(value)}
        />
        <CommandList>
          {filteredOptions.length === 0 ? (
            <CommandEmpty className="bg-[#ffffff] text-gray-800 font-normal text-sm">
              {noResultText}
            </CommandEmpty>
          ) : (
            filteredOptions.map((item, index) => (
              <CommandItem
                className="bg-[#ffffff] text-gray-800 font-normal text-sm"
                key={index}
                onSelect={() => {
                  onSelect(item);
                  setSearch(""); // Reset search after selection
                }}
              >
                {renderOption(item)}
              </CommandItem>
            ))
          )}
        </CommandList>
      </Command>
    </PopoverC>
  );
}

export default Combobox;
