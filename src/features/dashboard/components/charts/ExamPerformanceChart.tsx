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
  ResponsiveContainer,
  LabelList
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileText } from 'lucide-react';

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
  height?: number;
}

/**
 * ExamPerformanceChart - A bar chart showing exam performance over time
 */
export const ExamPerformanceChart: React.FC<ExamPerformanceChartProps> = ({
  data,
  loading = false,
  className = '',
  height = 300,
}) => {
  // Handle empty data
  const hasValidData = Array.isArray(data) && data.length > 0;
  
  // If loading or no data is available, show appropriate UI
  if (loading) {
    return (
      <div className={`h-[${height}px] w-full animate-pulse bg-muted rounded-md`}></div>
    );
  }
  
  if (!hasValidData) {
    return (
      <div className={`h-[${height}px] w-full flex items-center justify-center border border-dashed border-muted-foreground rounded-md`}>
        <div className="text-center p-4">
          <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">No exam data available</p>
        </div>
      </div>
    );
  }

  // Custom colors for better visualization
  const yourScoreColor = "#4f46e5"; // Indigo
  const averageScoreColor = "#10b981"; // Emerald
  
  return (
    <div className={`h-[${height}px] w-full`}>
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
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis 
            dataKey="name" 
            axisLine={{ stroke: '#cbd5e1' }}
            tick={{ fill: '#64748b', fontSize: 12 }}
          />
          <YAxis 
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
            axisLine={{ stroke: '#cbd5e1' }}
            tick={{ fill: '#64748b', fontSize: 12 }}
          />
          <Tooltip 
            formatter={(value) => [`${value}%`, 'Score']}
            labelFormatter={(label) => `Exam: ${label}`}
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '6px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
            }}
          />
          <Legend 
            wrapperStyle={{ paddingTop: 10 }}
            iconType="circle"
          />
          <Bar 
            dataKey="score" 
            name="Your Score" 
            fill={yourScoreColor}
            radius={[4, 4, 0, 0]}
            barSize={30}
            animationDuration={1000}
            animationEasing="ease-in-out"
          >
            {/* Animate bars on hover */}
            {/* Commented out LabelList temporarily until we resolve the issue */}
            {/* <LabelList dataKey="score" position="top" formatter={(value) => `${value}%`} fill="#4f46e5" /> */}
          </Bar>
          <Bar 
            dataKey="average" 
            name="Average Score" 
            fill={averageScoreColor}
            radius={[4, 4, 0, 0]}
            barSize={30}
            animationDuration={1000}
            animationDelay={300}
            animationEasing="ease-in-out"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExamPerformanceChart;
