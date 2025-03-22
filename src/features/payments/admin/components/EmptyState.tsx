"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon, CheckCircle2, AlertTriangle, Search } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  action?: {
    label: string;
    onClick: () => void;
  };
  variant?: 'default' | 'search' | 'success' | 'warning';
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: Icon,
  action,
  variant = 'default'
}) => {
  // Define styling based on variant
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          iconColor: 'text-green-500',
          titleColor: 'text-green-900',
          descColor: 'text-green-700',
          icon: CheckCircle2
        };
      case 'warning':
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          iconColor: 'text-amber-500',
          titleColor: 'text-amber-900',
          descColor: 'text-amber-700',
          icon: AlertTriangle
        };
      case 'search':
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          iconColor: 'text-gray-500',
          titleColor: 'text-gray-900',
          descColor: 'text-gray-700',
          icon: Search
        };
      default:
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          iconColor: 'text-blue-500',
          titleColor: 'text-blue-900',
          descColor: 'text-blue-700',
          icon: Icon
        };
    }
  };

  const styles = getVariantStyles();
  const IconComponent = Icon || styles.icon;

  return (
    <Card className={`${styles.bg} ${styles.border} shadow-none border`}>
      <CardContent className="flex flex-col items-center justify-center text-center p-8 space-y-4">
        <div className={`rounded-full p-3 ${styles.bg}`}>
          <IconComponent className={`h-8 w-8 ${styles.iconColor}`} />
        </div>
        <h3 className={`text-xl font-semibold ${styles.titleColor}`}>{title}</h3>
        <p className={`text-sm ${styles.descColor} max-w-md`}>{description}</p>
        {action && (
          <Button 
            onClick={action.onClick} 
            variant="outline" 
            className="mt-4"
          >
            {action.label}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default EmptyState;