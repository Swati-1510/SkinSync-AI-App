import { useState, useEffect } from 'react';

export default function useDebounce(value, delay) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(
    () => {
      // Set a timeout to update the debounced value after the specified delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      // Return a cleanup function that will be called every time useEffect is re-called.
      // This cancels the previous timeout if the value changes before the delay.
      return () => {
        clearTimeout(handler);
      };
    },
    // Only re-call effect if value changes
    [value, delay] 
  );

  return debouncedValue;
}