"use client"

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Exam, PaperType } from '../../types';

interface ExamMetadataProps {
  exam: Exam;
}

/**
 * Component to display metadata for exams based on paper type
 */
export const ExamMetadata: React.FC<ExamMetadataProps> = ({ exam }) => {
  const extractMetadata = () => {
    if (!exam?.tags) return {};
    
    const metadata: Record<string, string> = {};
    
    exam.tags.forEach(tag => {
      if (tag?.includes(':')) {
        const [key, value] = tag.split(':');
        metadata[key] = value;
      }
    });
    
    return metadata;
  };

  const metadata = extractMetadata();
  const paperType = exam.tags?.find(tag => 
    Object.values(PaperType).includes(tag as PaperType)
  ) as PaperType || PaperType.PRACTICE;
  
  // Create type-specific metadata display
  switch (paperType) {
    case PaperType.PRACTICE:
      return (
        <div className="flex flex-wrap gap-1">
          {metadata.focusArea && (
            <Badge variant="outline" className="text-xs">
              Focus: {metadata.focusArea}
            </Badge>
          )}
          {metadata.skillLevel && (
            <Badge variant="outline" className="text-xs">
              Level: {metadata.skillLevel}
            </Badge>
          )}
        </div>
      );
    
    case PaperType.MODEL:
      return (
        <div className="flex flex-wrap gap-1">
          {metadata.creator && (
            <Badge variant="outline" className="text-xs">
              Creator: {metadata.creator}
            </Badge>
          )}
          {metadata.difficulty && (
            <Badge variant="outline" className="text-xs">
              Difficulty: {metadata.difficulty}
            </Badge>
          )}
        </div>
      );
    
    case PaperType.PAST:
      return (
        <div className="flex flex-wrap gap-1">
          {metadata.year && (
            <Badge variant="outline" className="text-xs">
              Year: {metadata.year}
            </Badge>
          )}
          {metadata.institution && (
            <Badge variant="outline" className="text-xs">
              Institution: {metadata.institution}
            </Badge>
          )}
          {metadata.month && (
            <Badge variant="outline" className="text-xs">
              Month: {metadata.month}
            </Badge>
          )}
        </div>
      );
    
    case PaperType.SUBJECT:
      return (
        <div className="flex flex-wrap gap-1">
          {metadata.subject && (
            <Badge variant="outline" className="text-xs">
              Subject: {metadata.subject}
            </Badge>
          )}
          {metadata.topic && (
            <Badge variant="outline" className="text-xs">
              Topic: {metadata.topic}
            </Badge>
          )}
          {metadata.academicLevel && (
            <Badge variant="outline" className="text-xs">
              Level: {metadata.academicLevel}
            </Badge>
          )}
        </div>
      );
    
    default:
      return null;
  }
};
