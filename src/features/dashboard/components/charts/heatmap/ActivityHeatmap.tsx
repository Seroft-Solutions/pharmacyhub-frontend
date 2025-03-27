'use client';

import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface ActivityDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4; // 0 = no activity, 4 = highest activity
}

interface ActivityHeatmapProps {
  data: ActivityDay[];
  loading?: boolean;
  title?: string;
  description?: string;
  className?: string;
}

/**
 * ActivityHeatmap - A GitHub-style activity heatmap showing study or exam activity patterns
 */
export function ActivityHeatmap({
  data,
  loading = false,
  title = 'Activity Heatmap',
  description = 'Your study and exam activity patterns',
  className
}: ActivityHeatmapProps) {
  // Generate heatmap data for a full year if not provided
  const heatmapData = useMemo(() => {
    if (loading) {
      return Array(52 * 7).fill(0).map((_, i) => ({
        date: new Date(Date.now() - (51 * 7 + 6 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        count: 0,
        level: 0
      }));
    }
    
    if (!data || data.length === 0) {
      // Generate a year of sparse random data
      return Array(52 * 7).fill(0).map((_, i) => {
        const date = new Date(Date.now() - (51 * 7 + 6 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const rand = Math.random();
        let level = 0;
        let count = 0;
        
        // Make most days empty, with occasional activity
        if (rand > 0.85) {
          count = Math.floor(Math.random() * 5) + 1;
          if (count <= 1) level = 1;
          else if (count <= 2) level = 2;
          else if (count <= 4) level = 3;
          else level = 4;
        }
        
        return { date, count, level: level as 0 | 1 | 2 | 3 | 4 };
      });
    }
    
    return data;
  }, [data, loading]);
  
  // Generate weeks (columns)
  const weeks = useMemo(() => {
    return Array(52).fill(0).map((_, weekIndex) => {
      return Array(7).fill(0).map((_, dayIndex) => {
        const dataIndex = weekIndex * 7 + dayIndex;
        return dataIndex < heatmapData.length ? heatmapData[dataIndex] : null;
      }).filter(Boolean);
    });
  }, [heatmapData]);
  
  // Day labels (Mon, Tue, etc.)
  const dayLabels = ['Mon', '', 'Wed', '', 'Fri', '', 'Sun'];
  
  // Month labels
  const monthLabels = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const result: { month: string, position: number }[] = [];
    
    let currentMonth = -1;
    weeks.forEach((week, index) => {
      const firstDay = week[0];
      if (firstDay) {
        const month = new Date(firstDay.date).getMonth();
        if (month !== currentMonth) {
          result.push({ month: months[month], position: index });
          currentMonth = month;
        }
      }
    });
    
    return result;
  }, [weeks]);
  
  // Activity level colors
  const getLevelColor = (level: number) => {
    switch (level) {
      case 0: return 'bg-gray-100 dark:bg-gray-800';
      case 1: return 'bg-green-100 dark:bg-green-900';
      case 2: return 'bg-green-300 dark:bg-green-700';
      case 3: return 'bg-green-500 dark:bg-green-500';
      case 4: return 'bg-green-700 dark:bg-green-300';
      default: return 'bg-gray-100 dark:bg-gray-800';
    }
  };
  
  // Format date in a human-readable way
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Generate loading skeleton
  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
          </CardTitle>
          <CardDescription>
            <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-1">
            <div className="flex">
              {Array(12).fill(0).map((_, i) => (
                <div key={i} className="text-xs text-muted-foreground h-4 w-8 mx-auto animate-pulse bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
            <div className="flex h-[124px] gap-1">
              <div className="flex flex-col justify-between h-full py-1">
                {dayLabels.map((day, i) => (
                  <div key={i} className="text-xs text-muted-foreground h-3 w-6 animate-pulse bg-gray-200 dark:bg-gray-700 rounded"></div>
                ))}
              </div>
              <div className="flex-1 grid grid-cols-52 gap-1">
                {Array(52).fill(0).map((_, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-1">
                    {Array(7).fill(0).map((_, dayIndex) => (
                      <div
                        key={dayIndex}
                        className="h-3 w-3 rounded-sm animate-pulse bg-gray-200 dark:bg-gray-700"
                      ></div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-1 overflow-x-auto pb-2">
          <div className="flex">
            <div className="w-6"></div> {/* Spacer for day labels */}
            <div className="flex-1 flex">
              {monthLabels.map(({ month, position }, i) => (
                <div 
                  key={i} 
                  className="text-xs text-muted-foreground absolute"
                  style={{ 
                    left: `calc(${position / 52 * 100}% + ${position}px + 26px)`,
                    transformOrigin: 'left',
                  }}
                >
                  {month}
                </div>
              ))}
            </div>
          </div>
          <div className="h-4"></div> {/* Space for month labels */}
          <div className="flex gap-2">
            <div className="flex flex-col justify-between h-full py-1">
              {dayLabels.map((day, i) => (
                <div key={i} className="text-xs text-muted-foreground h-3 flex items-center">
                  {day}
                </div>
              ))}
            </div>
            <div className="flex-1 flex gap-1 overflow-x-auto pb-2">
              <TooltipProvider>
                {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-1">
                    {Array(7).fill(0).map((_, dayIndex) => {
                      const day = week[dayIndex];
                      if (!day) return <div key={dayIndex} className="h-3 w-3"></div>;
                      
                      return (
                        <Tooltip key={dayIndex}>
                          <TooltipTrigger asChild>
                            <div
                              className={cn(
                                "h-3 w-3 rounded-sm",
                                getLevelColor(day.level),
                                day.count > 0 ? "cursor-pointer" : ""
                              )}
                            ></div>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="text-xs p-2">
                            <div className="font-medium">{formatDate(day.date)}</div>
                            <div>
                              {day.count} {day.count === 1 ? 'activity' : 'activities'}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </div>
                ))}
              </TooltipProvider>
            </div>
          </div>
          <div className="flex justify-end items-center gap-2 mt-2">
            <div className="text-xs text-muted-foreground">Less</div>
            {[0, 1, 2, 3, 4].map((level) => (
              <div 
                key={level}
                className={cn("h-3 w-3 rounded-sm", getLevelColor(level))}
              ></div>
            ))}
            <div className="text-xs text-muted-foreground">More</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ActivityHeatmap;