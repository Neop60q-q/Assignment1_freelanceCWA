'use client';
import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';


// Sameple usage with datgabase save integration:
// <SimpleTextBox
//   label="Enter your Question:"
//   placeholder="Enter text..."
//   storageKey="question_stage_1"
//   onSave={async (value) => {
//     // Save to your database
//     await saveToDatabase(value);
//   }}
// />

interface SimpleTextBoxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  className?: string;
  storageKey?: string;  // Unique key for storing the value
  onSave?: (value: string) => Promise<void>; // For database integration
}

const SimpleTextBox = React.forwardRef<HTMLInputElement, SimpleTextBoxProps>(
  ({ className, label, error, storageKey, onSave, onChange, value: propValue, ...props }, ref) => {
    const [value, setValue] = React.useState(propValue || '');

    // Load saved value from localStorage on component mount
    useEffect(() => {
      if (storageKey) {
        const savedValue = localStorage.getItem(storageKey);
        if (savedValue) {
          setValue(savedValue);
        }
      }
    }, [storageKey]);

    // Handle changes with storage
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setValue(newValue);
      
      // Save to localStorage if storageKey is provided
      if (storageKey) {
        localStorage.setItem(storageKey, newValue);
      }

      // Call original onChange if provided
      if (onChange) {
        onChange(e);
      }
    };
    return (
      <div className="w-full">
        {label && (
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block">
            {label}
          </label>
        )}
        <input
          type="text"
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors",
            "placeholder:text-muted-foreground",
            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-destructive focus-visible:ring-destructive",
            className
          )}
          ref={ref}
          value={value}
          onChange={handleChange}
          {...props}
        />

        {error && (
          <p className="text-sm text-destructive mt-1">{error}</p>
        )}

        {/* Optional save button if onSave is provided */}
        {onSave && (
          <button
            onClick={async () => {
              try {
                await onSave(value as string);
                console.log('Value saved successfully');
              } catch (error) {
                console.error('Error saving value:', error);
              }
            }}
            className="mt-2 px-3 py-1 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Save
          </button>
        )}
      </div>
    );
  }
);

SimpleTextBox.displayName = 'SimpleTextBox';

export default SimpleTextBox;