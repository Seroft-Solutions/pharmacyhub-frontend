"use client"

import React from 'react';
import { Input } from '@/components/ui/input';
import { FileTextIcon } from 'lucide-react';

interface ExamsSearchProps {
  searchTerm: string;
  onSearch: (value: string) => void;
}

/**
 * Component for searching exams
 */
export const ExamsSearch: React.FC<ExamsSearchProps> = ({ searchTerm, onSearch }) => {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  return (
    <div className="relative w-full max-w-md">
      <Input
        placeholder="Search exams..."
        value={searchTerm}
        onChange={handleSearch}
        className="pl-10"
      />
      <FileTextIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
    </div>
  );
};
