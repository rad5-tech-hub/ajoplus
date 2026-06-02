import { useState, useCallback } from 'react';

interface UseFormattedCurrencyInputReturn {
  displayValue: string;
  rawValue: string;
  setValue: (raw: string) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function useFormattedCurrencyInput(
  initialValue = ''
): UseFormattedCurrencyInputReturn {
  const [rawValue, setRawValue] = useState(initialValue);

  const formatNumber = useCallback((val: string): string => {
    const digits = val.replace(/\D/g, '');
    if (!digits) return '';
    return Number(digits).toLocaleString('en-US');
  }, []);

  const setValue = useCallback((raw: string) => {
    const clean = raw.replace(/\D/g, '');
    setRawValue(clean);
  }, []);

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '');
    setRawValue(digits);
  }, []);

  const displayValue = formatNumber(rawValue);

  return { displayValue, rawValue, setValue, onChange };
}
