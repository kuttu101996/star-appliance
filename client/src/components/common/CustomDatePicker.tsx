import React, { useState, useCallback } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isToday,
  isSameDay,
} from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DatePickerProps = {
  value?: Date;
  onChange?: (date: Date) => void;
  className?: string;
  minDate?: Date;
  maxDate?: Date;
};

const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  className,
  minDate,
  maxDate,
}) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(value || new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(value);

  const handleDateSelect = useCallback(
    (date: Date) => {
      // Check date constraints
      if ((minDate && date < minDate) || (maxDate && date > maxDate)) {
        return;
      }

      setSelectedDate(date);
      onChange?.(date);
    },
    [minDate, maxDate, onChange]
  );

  const navigateMonth = useCallback((direction: "next" | "prev") => {
    setCurrentMonth((prev) =>
      direction === "next" ? addMonths(prev, 1) : subMonths(prev, 1)
    );
  }, []);

  const renderDaysOfWeek = (): JSX.Element => {
    const days: string[] = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    return (
      <div className="grid grid-cols-7 text-xs text-gray-500 font-semibold mb-2">
        {days.map((day) => (
          <div key={day} className="text-center">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCalendarDays = (): JSX.Element => {
    const monthStart: Date = startOfMonth(currentMonth);
    const monthEnd: Date = endOfMonth(currentMonth);
    const days: Date[] = eachDayOfInterval({
      start: monthStart,
      end: monthEnd,
    });

    return (
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const isOutOfRange =
            (minDate && day < minDate) || (maxDate && day > maxDate);

          const isSelectedDay = selectedDate
            ? isSameDay(day, selectedDate)
            : false;

          return (
            <button
              key={day.toISOString()}
              type="button"
              onClick={() => handleDateSelect(day)}
              disabled={isOutOfRange}
              className={cn(
                "text-sm rounded-md py-1 transition-colors duration-200",
                isToday(day) && "bg-blue-100 text-blue-600 font-bold",
                isSelectedDay && "bg-blue-500 text-white hover:bg-blue-600",
                !isOutOfRange && "hover:bg-gray-100",
                isOutOfRange && "text-gray-300 cursor-not-allowed opacity-50"
              )}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !selectedDate && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedDate ? (
            format(selectedDate, "PPP")
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-4 space-y-4">
          {/* Month Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth("prev")}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm font-medium">
              {format(currentMonth, "MMMM yyyy")}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth("next")}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Calendar Grid */}
          <div>
            {renderDaysOfWeek()}
            {renderCalendarDays()}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
