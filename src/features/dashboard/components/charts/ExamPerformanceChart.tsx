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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

// Sample data structure - will be replaced with real data in the hook
interface ExamPerformanceData {
  name: string;
  score: number;
  average: number;
}

interface ExamPerformanceChartProps {
  data: ExamPerformanceData[];
  loading?: boolean;
  className?: string;
}

/**
 * ExamPerformanceChart - A bar chart showing exam performance over time
 */
export const ExamPerformanceChart: React.FC<ExamPerformanceChartProps> = ({
  data,
  loading = false,
  className = '',
}) => {
  // If loading, show a skeleton UI
  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Exam Performance</CardTitle>
          <CardDescription>Your scores compared to average</CardDescription>
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
        <CardTitle>Exam Performance</CardTitle>
        <CardDescription>Your scores compared to average</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip 
                formatter={(value) => [`${value}%`, 'Score']}
                labelFormatter={(label) => `Exam: ${label}`}
              />
              <Legend />
              <Bar dataKey="score" name="Your Score" fill="#8884d8" />
              <Bar dataKey="average" name="Average Score" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExamPerformanceChart;
