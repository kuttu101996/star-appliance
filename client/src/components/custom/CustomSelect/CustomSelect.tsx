import { cn } from "@/lib/utils";
import { CustomSelectOption } from "@/types/schemaTypes";
// import { ServiceType } from "@/types/schemaTypes";
import { useCallback, useEffect, useRef, useState } from "react";

interface SelectProps {
  options: CustomSelectOption[];
  selectedValue?: CustomSelectOption;
  onSelect: (value: CustomSelectOption) => void;
  placeholder?: string;
  className?: string;
  btnClassName?: string;
}

const CustomSelect: React.FC<SelectProps> = ({
  options,
  selectedValue,
  onSelect,
  placeholder = "Select an option",
  className,
  btnClassName,
}) => {
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const [hoveredIndex, setHoveredIndex] = useState<number>(-1);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        setIsOpen(true);
        setHoveredIndex(0);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        setHoveredIndex((prev) => (prev < options.length - 1 ? prev + 1 : 0));
        e.preventDefault();
        break;
      case "ArrowUp":
        setHoveredIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1));
        e.preventDefault();
        break;
      case "Enter":
        if (hoveredIndex >= 0 && hoveredIndex < options.length) {
          handleSelect(options[hoveredIndex]);
        }
        e.preventDefault();
        break;
      case "Escape":
        setIsOpen(false);
        break;
    }
  };

  // Reset hovered index when dropdown is opened or closed
  // useEffect(() => {
  //   if (isOpen) setHoveredIndex(0);
  //   else setHoveredIndex(-1);
  // }, [isOpen]);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
    setHoveredIndex(-1);
  };

  const handleClickOutside = useCallback(
    (e: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target as Node)
      ) {
        if (isOpen) setIsOpen(false);
        setHoveredIndex(-1); // Reset hovered index when closing the dropdown
      }
    },
    [isOpen]
  );

  useEffect(() => {
    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [handleClickOutside]);

  // Handle option select
  const handleSelect = (value: CustomSelectOption) => {
    onSelect(value);
    setIsOpen(false); // Close dropdown after selection
  };

  return (
    <div
      className={cn(
        "relative inline-block w-64 bg-gray-50 text-gray-800 font-normal rounded-sm",
        className
      )}
    >
      <div
        onClick={toggleDropdown}
        ref={suggestionsRef}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        className={cn(
          "w-full border flex items-center justify-between border-gray-300 rounded-sm shadow-sm px-2 md:px-3 lg:px-3 h-10 text-left hover:border-blue-400 focus:border-blue-400 transition duration-200 focus:ring-0 focus:outline-none focus:shadow-md focus:shadow-[#408dfb80]",
          btnClassName
        )}
      >
        <span>
          {selectedValue ? (
            options.find((opt) => opt._id === selectedValue._id)?.label
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}
        </span>
        <span className="float-right">
          <svg
            className={`w-4 h-4 md:w-5 md:h-5 text-gray-500 transform transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </span>
      </div>

      {/* Options dropdown */}
      {isOpen && (
        <ul className="absolute z-10 mt-1 w-full border border-gray-300 bg-gray-50 rounded-lg shadow-lg max-h-40 overflow-auto p-1">
          {options.length === 0 ? (
            <li className="px-4 py-2 text-gray-500">No options available</li>
          ) : (
            options.map((option, index) => (
              <li
                key={option._id}
                onClick={() => handleSelect(option)}
                // className={`px-4 h-8 flex items-center cursor-pointer text-gray-800 hover:bg-blue-100 hover:text-gray-800 font-normal rounded-md ${
                //   selectedValue?._id === option._id
                //     ? "bg-[#408dfb] text-white"
                //     : ""
                // }`}
                className={cn(
                  "px-4 h-8 flex items-center cursor-pointer font-normal rounded-md hover:bg-[#cacaff] hover:text-gray-800",
                  selectedValue?._id === option._id &&
                    "bg-[#7d7dc7] text-white",
                  hoveredIndex === index && "bg-[#cacaff] text-gray-800"
                )}
              >
                {option.label}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;
