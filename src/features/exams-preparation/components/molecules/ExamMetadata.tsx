// ExamMetadata.tsx
"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, HelpCircle, Award, Calendar } from 'lucide-react';
import { formatTimeVerbose } from '../../utils';

interface ExamMetadataProps {
  questionsCount: number;
  durationMinutes: number;
  passingMarks?: number;
  totalMarks?: number;
  createdAt?: string;
  updatedAt?: string;
  isPremium?: boolean;
  className?: string;
  variant?: 'default' | 'compact' | 'detailed';
}

export const ExamMetadata: React.FC<ExamMetadataProps> = ({
  questionsCount,
  durationMinutes,
  passingMarks,
  totalMarks,
  createdAt,
  updatedAt,
  isPremium = false,
  className = '',
  variant = 'default',
}) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  // Compact variant shows minimal info
  if (variant === 'compact') {
    return (
      <div className={`flex flex-wrap gap-4 text-sm text-gray-600 ${className}`}>
        <div className="flex items-center">
          <HelpCircle className="h-4 w-4 mr-1" />
          <span>{questionsCount} Questions</span>
        </div>
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          <span>{formatTimeVerbose(durationMinutes * 60)}</span>
        </div>
      </div>
    );
  }

  // Default or detailed variant
  return (
    <Card className={`shadow-sm ${className}`}>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center">
            <HelpCircle className="h-5 w-5 text-gray-500 mr-2" />
            <div>
              <div className="text-sm font-medium">Questions</div>
              <div className="text-gray-600">{questionsCount}</div>
            </div>
          </div>
          
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-gray-500 mr-2" />
            <div>
              <div className="text-sm font-medium">Duration</div>
              <div className="text-gray-600">{formatTimeVerbose(durationMinutes * 60)}</div>
            </div>
          </div>
          
          {(totalMarks || passingMarks) && (
            <div className="flex items-center">
              <Award className="h-5 w-5 text-gray-500 mr-2" />
              <div>
                <div className="text-sm font-medium">Marks</div>
                <div className="text-gray-600">
                  {passingMarks && totalMarks ? `${passingMarks}/${totalMarks}` : totalMarks || passingMarks}
                </div>
              </div>
            </div>
          )}
          
          {variant === 'detailed' && createdAt && (
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-gray-500 mr-2" />
              <div>
                <div className="text-sm font-medium">Created</div>
                <div className="text-gray-600">{formatDate(createdAt)}</div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExamMetadata;
