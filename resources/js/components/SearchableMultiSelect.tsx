import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Check, ChevronDown, Search, X } from "lucide-react";
import * as React from "react";
import { Badge } from "@/components/ui/badge";

export interface SearchableMultiSelectOption {
    value: string;
    label: string;
}

interface SearchableMultiSelectProps {
    options: SearchableMultiSelectOption[];
    value?: string[];
    onValueChange: (value: string[]) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    emptyText?: string;
    className?: string;
    disabled?: boolean;
}

export function SearchableMultiSelect({
    options,
    value = [],
    onValueChange,
    placeholder = "Pilih opsi...",
    searchPlaceholder = "Cari...",
    emptyText = "Tidak ditemukan.",
    className,
    disabled = false,
}: SearchableMultiSelectProps) {
    const [open, setOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState("");

    const filteredOptions = React.useMemo(() => {
        if (!searchQuery) return options;
        const query = searchQuery.toLowerCase();
        return options.filter((option) =>
            option.label.toLowerCase().includes(query)
        );
    }, [options, searchQuery]);

    const handleSelect = (optionValue: string) => {
        if (value.includes(optionValue)) {
            onValueChange(value.filter((v) => v !== optionValue));
        } else {
            onValueChange([...value, optionValue]);
        }
    };

    const handleRemove = (e: React.MouseEvent, optionValue: string) => {
        e.stopPropagation();
        onValueChange(value.filter((v) => v !== optionValue));
    };

    const handleClearAll = (e: React.MouseEvent) => {
        e.stopPropagation();
        onValueChange([]);
    };

    const selectedLabels = value.map(v => options.find(o => o.value === v)?.label || v);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        "w-full justify-between font-normal h-auto min-h-10 px-3 py-2",
                        value.length === 0 && "text-muted-foreground",
                        className
                    )}
                    disabled={disabled}
                >
                    <div className="flex flex-wrap gap-1 flex-1 overflow-hidden pr-2">
                        {value.length === 0 ? (
                            <span className="truncate py-0.5">{placeholder}</span>
                        ) : (
                            selectedLabels.map((label, index) => (
                                <Badge
                                    variant="secondary"
                                    key={index}
                                    className="mr-1 mb-1 font-normal"
                                >
                                    <span className="truncate max-w-[100px] sm:max-w-xs">{label}</span>
                                    <div
                                        role="button"
                                        onClick={(e) => handleRemove(e, value[index])}
                                        className="ml-1 rounded-full outline-hidden ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                    >
                                        <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                    </div>
                                </Badge>
                            ))
                        )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                        {value.length > 0 && (
                            <div
                                role="button"
                                onClick={handleClearAll}
                                className="mr-1 hover:text-foreground text-muted-foreground"
                            >
                                <X className="h-4 w-4" />
                            </div>
                        )}
                        <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                    </div>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 min-w-[200px]" align="start">
                <div className="flex items-center border-b px-3 py-2">
                    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                    <Input
                        placeholder={searchPlaceholder}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-8 border-none focus-visible:ring-0 px-0 text-sm bg-transparent"
                    />
                </div>
                <ScrollArea className="max-h-[300px] overflow-y-auto p-1">
                    {filteredOptions.length === 0 ? (
                        <div className="py-6 text-center text-sm text-muted-foreground italic">
                            {emptyText}
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {filteredOptions.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => handleSelect(option.value)}
                                    className={cn(
                                        "relative flex w-full cursor-pointer select-none items-center rounded-sm py-2 px-3 text-sm outline-none hover:bg-accent hover:text-accent-foreground transition-colors",
                                        value.includes(option.value) && "bg-accent/50 text-accent-foreground font-medium"
                                    )}
                                >
                                    <div className="flex h-4 w-4 items-center justify-center rounded-sm border border-primary mr-2 shrink-0">
                                        <Check
                                            className={cn(
                                                "h-3 w-3 text-primary",
                                                value.includes(option.value) ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                    </div>
                                    <span className="flex-1 truncate text-left text-wrap">{option.label}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </PopoverContent>
        </Popover>
    );
}
