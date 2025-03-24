"use client";

import React from 'react';
import { SessionFilterOptions } from '../../types';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { format } from 'date-fns';

interface SessionFiltersProps {
  filters: SessionFilterOptions;
  onFilterChange: (filters: SessionFilterOptions) => void;
}

export const SessionFilters: React.FC<SessionFiltersProps> = ({ 
  filters, 
  onFilterChange 
}) => {
  // Handle active filter change
  const handleActiveChange = (checked: boolean) => {
    onFilterChange({
      ...filters,
      active: checked
    });
  };
  
  // Handle suspicious filter change
  const handleSuspiciousChange = (checked: boolean) => {
    onFilterChange({
      ...filters,
      suspicious: checked
    });
  };
  
  // Handle date range change
  const handleDateRangeChange = (range: { from: Date, to: Date } | undefined) => {
    if (range) {
      onFilterChange({
        ...filters,
        fromDate: format(range.from, 'yyyy-MM-dd'),
        toDate: format(range.to, 'yyyy-MM-dd')
      });
    } else {
      // Clear date range
      const { fromDate, toDate, ...restFilters } = filters;
      onFilterChange(restFilters);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="active-filter" className="flex items-center gap-2">
              Active Sessions Only
            </Label>
            <Switch
              id="active-filter"
              checked={!!filters.active}
              onCheckedChange={handleActiveChange}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="suspicious-filter" className="flex items-center gap-2">
              Suspicious Activity
            </Label>
            <Switch
              id="suspicious-filter"
              checked={!!filters.suspicious}
              onCheckedChange={handleSuspiciousChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Date Range</Label>
            <DateRangePicker
              from={filters.fromDate ? new Date(filters.fromDate) : undefined}
              to={filters.toDate ? new Date(filters.toDate) : undefined}
              onSelect={handleDateRangeChange}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SessionFilters;
