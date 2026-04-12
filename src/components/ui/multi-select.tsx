import * as React from "react";
import { X, ChevronsUpDown } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandInput,
  CommandSeparator,
} from "@/components/ui/command";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";


export interface Option {
  label: string;
  value: string;
}

interface MultiSelectProps {
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
}

export default function MultiSelect({
  options = [],
  selected = [],
  onChange,
  placeholder = "Tanlang...",
  className,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  // Safely ensure selected is an array
  const safeSelected = Array.isArray(selected) ? selected : [];

  const filteredOptions = options.filter(option => 
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleOption = (optionValue: string) => {
    const newSelected = safeSelected.includes(optionValue)
      ? safeSelected.filter((v) => v !== optionValue)
      : [...safeSelected, optionValue];
    onChange(newSelected);
  };

  return (
    <Popover open={open} onOpenChange={setOpen} modal={false}>

      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "flex min-h-[40px] w-full h-auto items-center justify-between px-3 py-2 text-sm font-normal bg-white hover:bg-white border-gray-200 focus:ring-2 focus:ring-blue-500",
            className
          )}
        >
          <div className="flex flex-wrap gap-1 items-center max-w-[90%]">
            {safeSelected.length > 0 ? (
              safeSelected.map((val) => {
                const option = options.find((o) => o.value === val);
                return (
                  <Badge
                    key={val}
                    variant="secondary"
                    className="flex items-center gap-1 bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100 py-0.5 px-2 transition-colors"
                  >
                    {option?.label || val}
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-blue-900"
                      onPointerDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleOption(val);
                      }}
                    />
                  </Badge>
                );
              })
            ) : (
              <span className="text-gray-400">{placeholder}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {safeSelected.length > 0 && (
              <X
                className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-pointer"
                onPointerDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onChange([]);
                }}
              />
            )}
            <ChevronsUpDown className="h-4 w-4 text-gray-400 shrink-0" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[var(--radix-popover-trigger-width)] p-0" 
        align="start"
      >
        <Command shouldFilter={false} className="flex flex-col border-none">
          <CommandInput 
            placeholder="Qidirish..." 
            className="h-9 border-none focus:ring-0" 
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          
          <div className="max-h-64 overflow-auto p-1 border-t">
            {filteredOptions.length === 0 && (
              <div className="py-6 text-center text-sm text-gray-500">
                Topilmadi.
              </div>
            )}
            {filteredOptions.map((option) => {
              const isSelected = safeSelected.includes(option.value);
              return (
                <div
                  key={option.value}
                  onPointerDown={(e) => {
                    // Using onPointerDown to handle selection reliably vs onClick
                    e.preventDefault();
                    e.stopPropagation();
                    toggleOption(option.value);
                  }}
                  className={cn(
                    "relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-blue-50 hover:text-blue-700",
                    isSelected ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700"
                  )}
                >
                  <Checkbox
                    checked={isSelected}
                    className="mr-2 pointer-events-none"
                  />
                  <span className="flex-1">
                    {option.label}
                  </span>
                </div>
              );
            })}
          </div>

          {safeSelected.length > 0 && (
            <>
              <CommandSeparator />
              <div className="p-1">
                <Button
                  variant="ghost"
                  className="w-full justify-center text-red-500 hover:text-red-700 hover:bg-red-50 h-9 text-sm font-medium transition-colors"
                  onPointerDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onChange([]);
                  }}
                >
                  Hammasini tozalash
                </Button>
              </div>
            </>
          )}
        </Command>
      </PopoverContent>

    </Popover>
  );
}

