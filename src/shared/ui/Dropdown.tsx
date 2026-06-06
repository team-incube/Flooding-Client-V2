"use client";

import { useEffect, useRef, useState } from "react";

export interface DropdownOption<T extends string> {
  label: string;
  value: T;
}

interface DropdownProps<T extends string> {
  options: DropdownOption<T>[];
  selectedValue: T | null;
  onSelect: (value: T) => void;
  triggerLabel: string;
  triggerClassName: string;
  disabled?: boolean;
  align?: "end" | "stretch";
}

const alignStyles = {
  end: "right-0",
  stretch: "inset-x-0",
} as const;

export function Dropdown<T extends string>({
  options,
  selectedValue,
  onSelect,
  triggerLabel,
  triggerClassName,
  disabled = false,
  align = "end",
}: DropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = () => {
    if (disabled) return;
    setIsOpen((prev) => !prev);
  };

  const handleSelect = (value: T) => {
    onSelect(value);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={`flex items-center gap-1 transition-colors ${triggerClassName}`}
      >
        <span>{triggerLabel}</span>
        <span className={`transition-transform ${isOpen ? "rotate-180" : ""}`}>
          ▼
        </span>
      </button>

      {isOpen && !disabled && (
        <div
          className={`bg-background-surface border-sub-3 absolute top-full z-50 mt-2 min-w-32 rounded-lg border shadow-lg ${alignStyles[align]}`}
        >
          <div className="py-2">
            {options.map((option) => {
              const active = selectedValue === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={`text-caption-1 w-full cursor-pointer px-4 py-2 text-left transition-colors ${
                    active
                      ? "text-p-1 bg-surface font-medium"
                      : "text-main-text hover:bg-surface"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
