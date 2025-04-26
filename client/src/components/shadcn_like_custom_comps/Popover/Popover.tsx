// src/components/Popover.tsx

import { cn } from "@/lib/utils";
import { useState, useRef, useEffect, ReactNode } from "react";

interface PopoverProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  trigger: ReactNode;
  children: ReactNode;
  className?: string;
}

export function PopoverC({
  isOpen,
  setIsOpen,
  trigger,
  children,
  className,
}: PopoverProps) {
  const [isCompOpen, setIsCompOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={cn("relative", className)} ref={popoverRef}>
      <div onClick={() => setIsOpen((prev) => !prev)}>{trigger}</div>
      {isOpen && <div className="absolute mt-2 w-full z-50">{children}</div>}
    </div>
  );
}
