import React from 'react';
import { NumericFormat, NumericFormatProps } from 'react-number-format';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

interface MoneyInputProps extends NumericFormatProps {
    className?: string;
}

/**
 * MoneyInput component
 * - Automatically adds thousand separators ('.')
 * - Uses ',' as decimal separator
 * - Prevents negative numbers by default
 * - Renders looking exactly like a shadcn/ui Input
 */
const MoneyInput = React.forwardRef<HTMLInputElement, MoneyInputProps>(
    ({ className, ...props }, ref) => {
        return (
            <NumericFormat
                {...props}
                getInputRef={ref}
                thousandSeparator="."
                decimalSeparator=","
                allowNegative={false} // Prevent negative numbers
                customInput={Input} // Use our existing UI Input component
                className={cn("text-left font-mono", className)}
            />
        );
    }
);

MoneyInput.displayName = "MoneyInput";

export default MoneyInput;
