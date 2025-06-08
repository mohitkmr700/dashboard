"use client";

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface DateTimeInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const DateTimeInput = forwardRef<HTMLInputElement, DateTimeInputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            type="datetime-local"
            ref={ref}
            className={cn(
              "w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md",
              "bg-white dark:bg-black text-black dark:text-white",
              "focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400",
              "appearance-none",
              "[&::-webkit-calendar-picker-indicator]:bg-white dark:[&::-webkit-calendar-picker-indicator]:bg-black",
              "[&::-webkit-calendar-picker-indicator]:p-2",
              "[&::-webkit-calendar-picker-indicator]:rounded",
              "[&::-webkit-calendar-picker-indicator]:hover:bg-gray-100 dark:[&::-webkit-calendar-picker-indicator]:hover:bg-gray-900",
              "[&::-webkit-calendar-picker-indicator]:cursor-pointer",
              "[&::-webkit-datetime-edit]:text-black dark:[&::-webkit-datetime-edit]:text-white",
              "[&::-webkit-datetime-edit-fields-wrapper]:text-black dark:[&::-webkit-datetime-edit-fields-wrapper]:text-white",
              "[&::-webkit-datetime-edit-text]:text-gray-500 dark:[&::-webkit-datetime-edit-text]:text-gray-400",
              "[&::-webkit-datetime-edit-hour-field]:text-black dark:[&::-webkit-datetime-edit-hour-field]:text-white",
              "[&::-webkit-datetime-edit-minute-field]:text-black dark:[&::-webkit-datetime-edit-minute-field]:text-white",
              "[&::-webkit-datetime-edit-day-field]:text-black dark:[&::-webkit-datetime-edit-day-field]:text-white",
              "[&::-webkit-datetime-edit-month-field]:text-black dark:[&::-webkit-datetime-edit-month-field]:text-white",
              "[&::-webkit-datetime-edit-year-field]:text-black dark:[&::-webkit-datetime-edit-year-field]:text-white",
              error && "border-red-500 dark:border-red-500",
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-500 dark:text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

DateTimeInput.displayName = "DateTimeInput";

export { DateTimeInput }; 