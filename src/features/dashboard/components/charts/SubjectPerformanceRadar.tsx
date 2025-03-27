'use client';

import React from 'react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer, 
  Tooltip 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface SubjectPerformanceItem {
  subject: string;
  score: number;
}

interface SubjectPerformanceRadarProps {
  data: SubjectPerformanceItem[];
  loading?: boolean;
  height?: number;
  className?: string;
}

export const SubjectPerformanceRadar: React.FC<SubjectPerformanceRadarProps> = ({
  data,
  loading = false,
  height = 300,
  className = '',
}) => {
  // If loading, show a skeleton UI
  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Subject Performance</CardTitle>
          <CardDescription>Your strengths by subject area</CardDescription>
        </CardHeader>
        <CardContent>
          <div className={`h-[${height}px] animate-pulse bg-muted rounded-md`}></div>
        </CardContent>
      </Card>
    );
  }

  // If no data, show empty state
  if (!data || data.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Subject Performance</CardTitle>
          <CardDescription>Your strengths by subject area</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <div className="text-lg font-medium">No Data Available</div>
          <p className="text-sm text-muted-foreground mt-1">
            Take more exams to see your subject performance
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={className}>
      <div style={{ width: '100%', height: `${height}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid stroke="#e2e8f0" />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fill: '#64748b', fontSize: 12 }}
            />
            <PolarRadiusAxis 
              angle={30} 
              domain={[0, 100]} 
              tick={{ fill: '#64748b' }}
              stroke="#cbd5e1"
            />
            <Radar
              name="Score"
              dataKey="score"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.6}
            />
            <Tooltip
              formatter={(value) => [`${value}%`, 'Score']}
              labelFormatter={(label) => `Subject: ${label}`}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SubjectPerformanceRadar;