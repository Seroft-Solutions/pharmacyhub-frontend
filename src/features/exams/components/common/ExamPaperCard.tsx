"use client";

import React from 'react';
import { 
  Clock, 
  FileText, 
  CheckCircle2, 
  Lock, 
  TrendingUp,
  BookOpen,
  Award,
  ArrowRight,
  Tag
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ExamPaperMetadata, 
  ExamPaperProgress, 
  ExamPaperCardProps 
} from '../../types/StandardTypes';

export const ExamPaperCard: React.FC<ExamPaperCardProps> = ({ 
  paper, 
  progress, 
  onStart 
}) => {
  const difficultyVariants = {
    'easy': 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200',
    'medium': 'bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200',
    'hard': 'bg-red-100 text-red-700 border-red-200 hover:bg-red-200'
  };
  
  const paperTypeColors = {
    'model': 'bg-blue-100 text-blue-700',
    'past': 'bg-purple-100 text-purple-700',
    'subject': 'bg-emerald-100 text-emerald-700',
    'practice': 'bg-cyan-100 text-cyan-700'
  };
  
  const typeIcon = {
    'model': Award,
    'past': FileText,
    'subject': BookOpen,
    'practice': Tag
  };

  const getDifficultyVariant = () => {
    const difficulty = paper.difficulty.toLowerCase();
    return difficultyVariants[difficulty as keyof typeof difficultyVariants] || difficultyVariants.medium;
  };

  const renderDifficultyBadge = () => (
    <Badge 
      className={`${getDifficultyVariant()} px-2 py-1 font-medium`}
      variant="outline"
    >
      {paper.difficulty.charAt(0).toUpperCase() + paper.difficulty.slice(1)}
    </Badge>
  );
  
  const getPaperTypeColor = () => {
    const source = paper.source.toLowerCase();
    return paperTypeColors[source as keyof typeof paperTypeColors] || paperTypeColors.model;
  };
  
  const getPaperTypeIcon = () => {
    const source = paper.source.toLowerCase();
    const IconComponent = typeIcon[source as keyof typeof typeIcon] || typeIcon.model;
    return <IconComponent className="h-5 w-5" />;
  };

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
    <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full overflow-hidden border-t-4" style={{ borderTopColor: paper.source === 'model' ? '#3b82f6' : paper.source === 'past' ? '#8b5cf6' : paper.source === 'subject' ? '#10b981' : '#06b6d4' }}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <Badge className={`mb-2 ${getPaperTypeColor()}`}>
              <div className="flex items-center space-x-1">
                {getPaperTypeIcon()}
                <span className="ml-1">{paper.source.charAt(0).toUpperCase() + paper.source.slice(1)} Paper</span>
              </div>
            </Badge>
            <CardTitle className="text-xl line-clamp-2">{paper.title}</CardTitle>
            {paper.description && (
              <CardDescription className="mt-2 line-clamp-2">{paper.description}</CardDescription>
            )}
          </div>
          {paper.is_premium && (
            <div className="flex flex-col items-center">
              <Lock className="h-5 w-5 text-amber-500" />
              <span className="text-xs text-amber-500 font-medium mt-1">Premium</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4 flex-grow">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-slate-50">
            <FileText className="h-5 w-5 text-slate-600 mb-1" />
            <span className="text-lg font-semibold">{paper.total_questions}</span>
            <span className="text-xs text-slate-500">Questions</span>
          </div>
          <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-slate-50">
            <Clock className="h-5 w-5 text-slate-600 mb-1" />
            <span className="text-lg font-semibold">{paper.time_limit}</span>
            <span className="text-xs text-slate-500">Minutes</span>
          </div>
        </div>
        
        <div className="pt-2">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Difficulty</span>
            {renderDifficultyBadge()}
          </div>
          
          <div className="mt-4">
            <span className="text-sm font-medium mb-2 block">Topics Covered</span>
            <div className="flex flex-wrap gap-1.5">
              {paper.topics_covered.slice(0, 4).map(topic => (
                <Badge key={topic} variant="outline" className="text-xs">
                  {topic}
                </Badge>
              ))}
              {paper.topics_covered.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{paper.topics_covered.length - 4} more
                </Badge>
              )}
            </div>
          </div>
        </div>

        {progress?.score && (
          <div className="mt-3 pt-3 border-t border-slate-100">
            <div className="flex items-center text-muted-foreground justify-between">
              <span className="text-sm">Last Attempt</span>
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span className="font-medium">{progress.score}%</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-4 border-t border-slate-200">
        <div className="w-full flex justify-between items-center">
          <div className="flex items-center space-x-2">
            {renderProgressBadge()}
          </div>
          <Button 
            onClick={handleStart} 
            variant={paper.is_premium ? 'outline' : 'default'}
            className="gap-1"
          >
            {paper.is_premium ? 'Upgrade' : 'Start Paper'}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};