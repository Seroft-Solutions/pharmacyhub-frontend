import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDebounce } from '@/hooks/useDebounce';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DebouncedSelectProps {
    options: { id: string | number; name: string }[];
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
}

export const DebouncedSelect = ({
                                                                               options = [],
                                                                               value,
                                                                               onChange,
                                                                               placeholder
                                                                           }: DebouncedSelectProps) => {
    const [search, setSearch] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const debouncedSearch = useDebounce(search, 300);
    const inputRef = useRef<HTMLInputElement>(null);

    const filteredOptions = useMemo(() =>
            options.filter(option =>
                (option?.name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                    option?.firstName?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                    option?.lastName?.toLowerCase().includes(debouncedSearch.toLowerCase())) ?? false
            ),
        [options, debouncedSearch]
    );

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const handleSelect = (selectedValue: string) => {
        onChange(selectedValue);
        setSearch('');
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <Select
                open={isOpen}
                onOpenChange={setIsOpen}
                value={value}
                onValueChange={handleSelect}
            >
                <SelectTrigger onClick={() => setIsOpen(true)}>
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    <Input
                        ref={inputRef}
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="mb-2"
                        onKeyDown={(e) => e.stopPropagation()}
                    />
                    <ScrollArea className="h-[200px]">
                        {filteredOptions.map((option) => (
                            <SelectItem key={option.id} value={option.id.toString()}>
                                {option.name || `${option.firstName} ${option.lastName}`.trim()}
                            </SelectItem>
                        ))}
                    </ScrollArea>
                </SelectContent>
            </Select>
        </div>
    );
};
