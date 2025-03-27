"use client";

import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from '@/components/ui/badge';
import { TrendingUp } from 'lucide-react';

/**
 * PaymentStatisticsCard Component
 * Displays a single statistic card with icon, title, value, and trend
 */
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: string;
    positive?: boolean;
  };
  isLoading?: boolean;
  className?: string;
}

const PaymentStatisticsCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  isLoading,
  className = ''
}) => {
  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            <Skeleton className="h-4 w-24" />
          </CardTitle>
          <Skeleton className="h-4 w-4 rounded-full" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-16 mb-1" />
          <Skeleton className="h-3 w-20" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <TrendingUp className={`h-3 w-3 ${trend.positive ? 'text-green-500' : 'text-red-500'}`} />
            <span className={trend.positive ? 'text-green-500' : 'text-red-500'}>
              {trend.value}
            </span>
            {trend.positive ? ' increase' : ' decrease'}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentStatisticsCard;