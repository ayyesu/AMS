import React from 'react';
import {Input} from '../ui/input';
import {Search} from 'lucide-react';

interface TableSearchInputProps {
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onClear?: () => void;
}

export default function TableSearchInput({
    placeholder,
    value,
    onChange,
    onClear,
}: TableSearchInputProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e);
        if (e.target.value === '' && onClear) {
            onClear();
        }
    };

    return (
        <div className='relative'>
            <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
            <Input
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
                className='pl-8'
            />
        </div>
    );
}
