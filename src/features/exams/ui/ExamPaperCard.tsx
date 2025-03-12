"use client";

import React from 'react';
import { 
  Clock, 
  FileText, 
  CheckCircle2, 
  Lock, 
  TrendingUp 
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ExamPaperMetadata, 
  ExamPaperProgress, 
  ExamPaperCardProps 
} from '../model/standardTypes';

export const ExamPaperCard: React.FC<ExamPaperCardProps> = ({ 
  paper, 
  progress, 
  onStart 
}) => {
  const difficultyVariants = {
    'easy': 'bg-green-50 text-green-600 border-green-200',
    'medium': 'bg-yellow-50 text-yellow-600 border-yellow-200',
    'hard': 'bg-red-50 text-red-600 border-red-200'
  };

  const getDifficultyVariant = () => {
    const difficulty = paper.difficulty.toLowerCase();
    return difficultyVariants[difficulty as keyof typeof difficultyVariants] || difficultyVariants.medium;
  };

  const renderDifficultyBadge = () => (
    <Badge 
      className={`${getDifficultyVariant()} px-2 py-1`}
      variant="outline"
    >
      {paper.difficulty.charAt(0).toUpperCase() + paper.difficulty.slice(1)}
    </Badge>
  );

  const renderProgressBadge = () => {
    if (progress?.completed) {
      return (
        <Badge variant="secondary" className="flex items-center gap-1">
          <CheckCircle2 className="h-3 w-3" />
          Completed
        </Badge>
      );
    }
    return null;
  };

  const handleStart = () => {
    onStart(paper);
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{paper.title}</CardTitle>
          {paper.is_premium && <Lock className="text-muted-foreground" />}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-muted-foreground">
              <FileText className="h-4 w-4 mr-2" />
              <span>{paper.total_questions} Questions</span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <Clock className="h-4 w-4 mr-2" />
              <span>{paper.time_limit} mins</span>
            </div>
          </div>
          {renderDifficultyBadge()}
        </div>
        
        <div className="flex flex-wrap gap-2">
          {paper.topics_covered.map(topic => (
            <Badge key={topic} variant="outline" className="text-xs">
              {topic}
            </Badge>
          ))}
        </div>

        {progress?.score && (
          <div className="flex items-center text-muted-foreground">
            <TrendingUp className="h-4 w-4 mr-2" />
            <span>Last Score: {progress.score}%</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          {renderProgressBadge()}
        </div>
        <Button 
          onClick={handleStart} 
          variant={paper.is_premium ? 'outline' : 'default'}
        >
          {paper.is_premium ? 'Upgrade' : 'Start Paper'}
        </Button>
      </CardFooter>
    </Card>
  );
};