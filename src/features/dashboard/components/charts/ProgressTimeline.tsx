'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ReferenceLine,
  Label
} from 'recharts';
import { Milestone } from '@/components/ui/milestone';
import { HelpCircle } from 'lucide-react';

interface ProgressPoint {
  date: string;
  value: number;
  milestone?: {
    title: string;
    description: string;
  };
}

interface ProgressTimelineProps {
  data: ProgressPoint[];
  height?: number;
  targetValue?: number;
  startValue?: number;
  valueLabel?: string;
  title?: string;
  description?: string;
  loading?: boolean;
}

/**
 * ProgressTimeline - A timeline chart showing progress with milestones
 */
export function ProgressTimeline({
  data,
  height = 300,
  targetValue,
  startValue = 0,
  valueLabel = 'Progress',
  title = 'Progress Timeline',
  description = 'Your progress over time with key milestones',
  loading = false
}: ProgressTimelineProps) {
  // Helper to format dates on the x-axis
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  // Find milestone points in the data
  const milestones = data.filter(point => point.milestone);
  
  // Generate loading skeleton
  if (loading) {
    return (
      <div className="w-full">
        <div className="mb-4">
          <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
          <div className="h-4 w-72 mt-1 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
        </div>
        <div className={`w-full h-[${height}px] bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg`}></div>
      </div>
    );
  }
  
  // Generate placeholder data if none provided
  const chartData = data?.length > 0 ? data : [
    { date: '2025-01-01', value: 0 },
    { date: '2025-01-15', value: 20, milestone: { title: 'Started Course', description: 'Began formal training' } },
    { date: '2025-02-01', value: 35 },
    { date: '2025-02-15', value: 45, milestone: { title: 'Mid-term Exam', description: 'Completed first assessment' } },
    { date: '2025-03-01', value: 60 },
    { date: '2025-03-15', value: 75, milestone: { title: 'Project Submission', description: 'Finished capstone project' } },
    { date: '2025-04-01', value: 85 },
    { date: '2025-04-15', value: 100, milestone: { title: 'Certification', description: 'Received final certification' } }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <ResponsiveContainer width="100%" height={height}>
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                domain={[startValue, targetValue || Math.max(...chartData.map(d => d.value), 100)]}
                tickFormatter={(value) => `${value}%`}
                tick={{ fontSize: 12 }}
              >
                <Label
                  value={valueLabel}
                  position="insideLeft"
                  angle={-90}
                  style={{ textAnchor: 'middle', fontSize: 12 }}
                />
              </YAxis>
              <Tooltip 
                formatter={(value) => [`${value}%`, valueLabel]}
                labelFormatter={(label) => formatDate(label.toString())}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
              />
              <Legend />
              
              {/* Progress line */}
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#6366f1" 
                strokeWidth={3}
                name={valueLabel}
                activeDot={{ r: 8, strokeWidth: 2 }}
              />
              
              {/* Target reference line if provided */}
              {targetValue && (
                <ReferenceLine 
                  y={targetValue} 
                  stroke="#10b981" 
                  strokeDasharray="3 3"
                >
                  <Label 
                    value="Target" 
                    position="right" 
                    style={{ fill: '#10b981', fontSize: 12 }}
                  />
                </ReferenceLine>
              )}
              
              {/* Milestone markers */}
              {milestones.map((milestone, index) => (
                <ReferenceLine
                  key={index}
                  x={milestone.date}
                  stroke="#f59e0b"
                  strokeWidth={2}
                  strokeDasharray="3 3"
                  ifOverflow="extendDomain"
                >
                  <Label
                    value={`★`}
                    position="top"
                    style={{ fill: '#f59e0b', fontSize: 16 }}
                  />
                </ReferenceLine>
              ))}
            </LineChart>
          </ResponsiveContainer>
          
          {/* Milestone legend below chart */}
          {milestones.length > 0 && (
            <div className="mt-4 space-y-2">
              <div className="text-sm font-medium">Key Milestones</div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                {milestones.map((milestone, index) => (
                  <Milestone
                    key={index}
                    date={formatDate(milestone.date)}
                    title={milestone.milestone?.title || ''}
                    description={milestone.milestone?.description || ''}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default ProgressTimeline;