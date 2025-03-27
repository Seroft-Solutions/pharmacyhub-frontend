'use client';

import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { TimeFilter as TimeFilterType } from '../../api/hooks/useDashboardData';

interface TimeFilterProps {
  value: TimeFilterType;
  onChange: (value: TimeFilterType) => void;
  className?: string;
}

/**
 * TimeFilter - A component for filtering dashboard data by time period
 */
export const TimeFilter: React.FC<TimeFilterProps> = ({
  value,
  onChange,
  className = '',
}) => {
  const handleValueChange = (newValue: string) => {
    onChange(newValue as TimeFilterType);
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <span className="text-sm text-muted-foreground">Time period:</span>
      <Select
        value={value}
        onValueChange={handleValueChange}
      >
        <SelectTrigger className="w-[130px] h-8">
          <SelectValue placeholder="Select period" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="week">Last 7 days</SelectItem>
          <SelectItem value="month">Last 30 days</SelectItem>
          <SelectItem value="year">Last year</SelectItem>
          <SelectItem value="all">All time</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default TimeFilter;
