// ExamPaperCard.tsx
"use client";

import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExamStatusBadge } from '../atoms/ExamStatusBadge';
import { Clock, Award } from 'lucide-react';
import { formatTimeVerbose } from '../../utils';

interface ExamPaperCardProps {
  id: string;
  title: string;
  description?: string;
  questionsCount: number;
  durationMinutes: number;
  isPremium?: boolean;
  isPurchased?: boolean;
  status?: 'draft' | 'published' | 'archived' | 'completed' | 'in-progress';
  paymentStatus?: string;
  price?: number;
  className?: string;
  onClick?: () => void;
}

export const ExamPaperCard: React.FC<ExamPaperCardProps> = ({
  id,
  title,
  description,
  questionsCount,
  durationMinutes,
  isPremium = false,
  isPurchased = false,
  status = 'published',
  paymentStatus = 'PAID',
  price,
  className = '',
  onClick,
}) => {
  const getButtonContentByStatus = () => {
    if (isPremium && !isPurchased && paymentStatus !== 'PAID') {
      return `Purchase Access${price ? ` (${price}$)` : ''}`;
    }
    return 'Start Paper';
  };

  return (
    <Card className={`border shadow-sm hover:shadow-md transition-shadow max-w-sm mx-auto ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex flex-wrap gap-2 mb-2">
          {isPremium && (
            <Badge variant="premium" className="bg-blue-600">Premium</Badge>
          )}
          {isPurchased && (
            <Badge variant="outline" className="border-green-500 text-green-600">Purchased</Badge>
          )}
          <ExamStatusBadge status={status} size="sm" />
        </div>
        <CardTitle className="text-center text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 pb-4">
        {description && <p className="text-gray-600 text-sm mb-4">{description}</p>}
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center text-sm text-gray-600">
            <span className="font-medium mr-1">{questionsCount}</span> Questions
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-3.5 w-3.5 mr-1" />
            {formatTimeVerbose(durationMinutes * 60)}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button 
          onClick={onClick} 
          className="w-full"
          variant={isPremium && !isPurchased && paymentStatus !== 'PAID' ? "premium" : "default"}
        >
          {getButtonContentByStatus()}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ExamPaperCard;
