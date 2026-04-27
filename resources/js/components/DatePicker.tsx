import React, { useState, useEffect, useRef } from 'react';
import { PatternFormat } from 'react-number-format';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { CalendarIcon } from 'lucide-react';
import { format, parse, isValid } from 'date-fns';

interface DatePickerProps {
    value?: string; // Expects YYYY-MM-DD
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    error?: boolean;
    disabled?: boolean;
    max?: string; // Expects YYYY-MM-DD
}

/**
 * DatePicker component
 * - Enforces dd/mm/yyyy display format
 * - Handles internal YYYY-MM-DD state
 * - Uses react-number-format for masking
 * - Includes a flying native datepicker trigger
 * - Premium look and feel
 */
const DatePicker = ({
    value = '',
    onChange,
    placeholder = 'DD/MM/YYYY',
    className,
    error,
    disabled,
    max
}: DatePickerProps) => {
    const [displayValue, setDisplayValue] = useState('');
    const nativeInputRef = useRef<HTMLInputElement>(null);

    // Sync internal YYYY-MM-DD to display DD/MM/YYYY
    useEffect(() => {
        if (value) {
            try {
                const date = parse(value, 'yyyy-MM-dd', new Date());
                if (isValid(date)) {
                    setDisplayValue(format(date, 'dd/MM/yyyy'));
                } else {
                    setDisplayValue('');
                }
            } catch (e) {
                setDisplayValue('');
            }
        } else {
            setDisplayValue('');
        }
    }, [value]);

    const handleValueChange = (values: any) => {
        const { formattedValue } = values;
        setDisplayValue(formattedValue);

        // If complete (DD/MM/YYYY is 10 chars), convert to YYYY-MM-DD and notify parent
        if (formattedValue.length === 10) {
            try {
                const date = parse(formattedValue, 'dd/MM/yyyy', new Date());
                if (isValid(date)) {
                    onChange(format(date, 'yyyy-MM-dd'));
                }
            } catch (e) {
                // Invalid date, don't update parent yet or handle error
            }
        } else if (formattedValue === '') {
            onChange('');
        }
    };

    const handleNativeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value; // yyyy-mm-dd
        if (newValue) {
            onChange(newValue);
        }
    };

    const triggerPicker = () => {
        if (disabled) return;
        // @ts-ignore - showPicker is a newer API, types might be missing
        if (nativeInputRef.current?.showPicker) {
            // @ts-ignore
            nativeInputRef.current.showPicker();
        } else {
            nativeInputRef.current?.click();
        }
    };

    return (
        <div className="relative group">
            {/* Hidden native input to trigger the "flying" picker */}
            <input
                ref={nativeInputRef}
                type="date"
                value={value || ''}
                onChange={handleNativeChange}
                className="absolute inset-0 opacity-0 -z-10 pointer-events-none"
                tabIndex={-1}
                disabled={disabled}
                max={max}
            />

            <PatternFormat
                format="##/##/####"
                mask="_"
                value={displayValue}
                onValueChange={handleValueChange}
                placeholder={placeholder}
                disabled={disabled}
                customInput={Input}
                className={cn(
                    "pl-10 pr-10",
                    error && "border-red-500",
                    className
                )}
            />

            {/* Left Calendar Icon - Just visual */}
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none group-focus-within:text-primary transition-colors">
                <CalendarIcon className="h-4 w-4" />
            </div>

            {/* Right Trigger Button - This opens the "flying" picker */}
            {!disabled && (
                <button
                    type="button"
                    onClick={triggerPicker}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors p-1 rounded-md hover:bg-muted"
                    title="Pilih Tanggal"
                >
                    <CalendarIcon className="h-4 w-4" />
                </button>
            )}
        </div>
    );
};

export default DatePicker;
