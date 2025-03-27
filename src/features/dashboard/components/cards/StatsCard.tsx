'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    label: string;
    positive?: boolean;
  };
  loading?: boolean;
  className?: string;
  variant?: 'default' | 'outline' | 'primary' | 'success' | 'warning' | 'danger';
}

/**
 * StatsCard - A reusable card component for displaying statistics
 */
export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
  loading = false,
  className = '',
  variant = 'default',
}) => {
  // Variant-based styles
  const variantStyles = {
    default: 'bg-card',
    outline: 'bg-background border-2',
    primary: 'bg-primary/10 border-primary/20',
    success: 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900/30',
    warning: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-900/30',
    danger: 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-900/30',
  };

  const iconStyles = {
    default: 'text-muted-foreground',
    outline: 'text-foreground',
    primary: 'text-primary',
    success: 'text-green-600 dark:text-green-400',
    warning: 'text-yellow-600 dark:text-yellow-400',
    danger: 'text-red-600 dark:text-red-400',
  };

  return (
    <Card 
      className={`${variantStyles[variant]} border ${className}`}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && <Icon className={`h-4 w-4 ${iconStyles[variant]}`} />}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-9 w-24 animate-pulse rounded bg-muted"></div>
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
        {(description || trend) && (
          <div className="mt-2 flex items-center text-xs text-muted-foreground">
            {trend && (
              <span
                className={`mr-1 rounded-full px-1 ${
                  trend.positive 
                    ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400' 
                    : 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                }`}
              >
                {trend.positive ? '+' : ''}{trend.value}%
              </span>
            )}
            {description}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard;
