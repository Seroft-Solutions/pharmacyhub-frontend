'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { HelpCircle } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

interface MilestoneProps extends React.HTMLAttributes<HTMLDivElement> {
  date: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  status?: 'completed' | 'current' | 'upcoming';
}

/**
 * Milestone - A component to display a milestone in a timeline
 */
export function Milestone({
  date,
  title,
  description,
  icon,
  status = 'completed',
  className,
  ...props
}: MilestoneProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-2 p-2 rounded-md border",
        status === 'completed' && "border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/50",
        status === 'current' && "border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/50",
        status === 'upcoming' && "border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/50",
        className
      )}
      {...props}
    >
      <div className="flex-shrink-0 mt-0.5">
        {icon || (
          <div 
            className={cn(
              "w-5 h-5 rounded-full flex items-center justify-center text-white text-xs",
              status === 'completed' && "bg-amber-500",
              status === 'current' && "bg-blue-500",
              status === 'upcoming' && "bg-gray-400"
            )}
          >
            {status === 'completed' ? '✓' : status === 'current' ? '!' : '•'}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <div className="text-xs font-medium text-muted-foreground">{date}</div>
          {description && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[200px] text-xs">
                  {description}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <div className="text-sm font-medium truncate">{title}</div>
      </div>
    </div>
  );
}

export default Milestone;