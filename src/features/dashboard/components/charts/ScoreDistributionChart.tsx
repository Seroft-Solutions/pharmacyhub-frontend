'use client';

import React from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Legend,
  Tooltip
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

// Sample data structure - will be replaced with real data in the hook
interface ScoreRangeData {
  name: string;
  value: number;
  color: string;
}

interface ScoreDistributionChartProps {
  data: ScoreRangeData[];
  loading?: boolean;
  className?: string;
}

/**
 * ScoreDistributionChart - A pie chart showing distribution of exam scores
 */
export const ScoreDistributionChart: React.FC<ScoreDistributionChartProps> = ({
  data,
  loading = false,
  className = '',
}) => {
  // If loading, show a skeleton UI
  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Score Distribution</CardTitle>
          <CardDescription>Breakdown of your exam scores</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] animate-pulse bg-muted rounded-md"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Score Distribution</CardTitle>
        <CardDescription>Breakdown of your exam scores</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${value} exams`, 'Count']}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScoreDistributionChart;
