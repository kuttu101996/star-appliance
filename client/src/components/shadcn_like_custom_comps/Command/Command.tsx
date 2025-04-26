// src/components/Command.tsx

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface CommandTypes {
  children: ReactNode;
  className?: string;
}

export function Command({ children, className }: CommandTypes) {
  return (
    <div className={cn("border rounded shadow-lg bg-white", className)}>
      {children}
    </div>
  );
}

interface CommandInputTypes {
  placeholder?: string;
  onValueChange: (value: string) => void;
  className?: string;
}

export function CommandInput({
  onValueChange,
  placeholder,
  className,
}: CommandInputTypes) {
  return (
    <input
      type="text"
      className={cn("w-full px-3 py-2 border-b outline-none", className)}
      placeholder={placeholder}
      onChange={(e) => onValueChange(e.target.value)}
    />
  );
}

interface CommandListTypes {
  children: ReactNode;
  className?: string;
}

export function CommandList({ children, className }: CommandListTypes) {
  return (
    <ul className={cn("max-h-60 overflow-y-auto", className)}>{children}</ul>
  );
}

interface CommandItemTypes {
  children: ReactNode;
  onSelect: () => void;
  className?: string;
}

export function CommandItem({
  children,
  onSelect,
  className,
}: CommandItemTypes) {
  return (
    <li
      className={cn("px-3 py-2 cursor-pointer hover:bg-gray-100", className)}
      onClick={onSelect}
    >
      {children}
    </li>
  );
}

interface CommandEmptyTypes {
  children: ReactNode;
  className?: string;
}

export function CommandEmpty({ children, className }: CommandEmptyTypes) {
  return (
    <div className={cn("px-3 py-2 text-gray-500", className)}>{children}</div>
  );
}
