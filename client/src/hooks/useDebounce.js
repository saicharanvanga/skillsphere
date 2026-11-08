import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce value changes (ideal for search inputs & live filters)
 * @param {any} value Value to debounce
 * @param {number} delay Milliseconds to wait
 * @returns {any} Debounced value
 */
export const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
