/* eslint-disable react-hooks/set-state-in-effect */
"use client"

import React, { useState, useEffect } from 'react'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { FilterX, Funnel } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { format } from 'date-fns';
// import { Popover,PopoverContent, PopoverTrigger } from './ui/popover'

function ColumnFilter({ label, value, onChange, placeholder, type = "text" }) {

  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value || "");

  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  const handleApply = () => {
    onChange(inputValue);
    setOpen(false);
  };

  const handleClear = () => {
    setInputValue("");
    onChange("");
    setOpen(false);
  };
  return (
    <div className="flex items-center gap-1">
      {label}
      {value ? (
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 p-1 text-primary"
          onClick={handleClear}
        >
          <FilterX className="h-4 w-4" />
        </Button>
      ) : (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6 p-1">
              <Funnel className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-52">
            {type === "date" ? (
              <Input
                type="date"
                placeholder={placeholder}
                value={inputValue}
                onChange={(e) =>
                  setInputValue(format(new Date(e.target.value), "yyyy-MM-dd"))
                }
                className="mb-2"
              />
            ) : type === "text" ? (
              <Input
                placeholder={placeholder}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="mb-2"
              />
            ) : null}

            <Button onClick={handleApply} className="w-full" size="sm">
              Apply
            </Button>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}

export default ColumnFilter