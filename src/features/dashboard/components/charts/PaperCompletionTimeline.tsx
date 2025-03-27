'use client';

import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

interface PaperCompletionDataItem {
  month: string;
  model: number;
  past: number;
  subject: number;
}

interface PaperCompletionTimelineProps {
  data: PaperCompletionDataItem[];
  loading?: boolean;
  height?: number;
  className?: string;
}

export const PaperCompletionTimeline: React.FC<PaperCompletionTimelineProps> = ({
  data,
  loading = false,
  height = 300,
  className = '',
}) => {
  // If loading, show a skeleton UI
  if (loading) {
    return (
      <div className={`h-[${height}px] animate-pulse bg-muted rounded-md ${className}`}></div>
    );
  }

  // If no data, show empty state
  if (!data || data.length === 0) {
    return (
      <div className={`h-[${height}px] flex flex-col items-center justify-center text-center ${className}`}>
        <div className="text-lg font-medium">No Data Available</div>
        <p className="text-sm text-muted-foreground mt-1">
          Complete more papers to see your timeline
        </p>
      </div>
    );
  }

  return (
    <div className={className} style={{ width: '100%', height: `${height}px` }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="model" name="Model Papers" fill="#3b82f6" />
          <Bar dataKey="past" name="Past Papers" fill="#8b5cf6" />
          <Bar dataKey="subject" name="Subject Papers" fill="#10b981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PaperCompletionTimeline;