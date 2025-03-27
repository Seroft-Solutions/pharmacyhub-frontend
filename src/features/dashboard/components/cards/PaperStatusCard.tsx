'use client';

import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ArrowRight, Award, FileText, BookOpen } from 'lucide-react';

interface PaperType {
  total: number;
  completed: number;
}

interface PaperStatusCardProps {
  modelPapers: PaperType;
  pastPapers: PaperType;
  subjectPapers: PaperType;
  loading?: boolean;
  onViewAll?: (paperType: string) => void;
}

export const PaperStatusCard: React.FC<PaperStatusCardProps> = ({
  modelPapers,
  pastPapers,
  subjectPapers,
  loading = false,
  onViewAll
}) => {
  const getTotalProgress = () => {
    const total = modelPapers.total + pastPapers.total + subjectPapers.total;
    const completed = modelPapers.completed + pastPapers.completed + subjectPapers.completed;
    return total > 0 ? Math.floor((completed / total) * 100) : 0;
  };

  const getProgressForType = (type: PaperType) => {
    return type.total > 0 ? Math.floor((type.completed / type.total) * 100) : 0;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Papers Status</CardTitle>
          <CardDescription>Your progress across different paper types</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <div className="space-y-2">
              <div className="h-5 w-32 bg-muted rounded animate-pulse" />
              <div className="h-3 w-full bg-muted rounded animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-5 w-32 bg-muted rounded animate-pulse" />
              <div className="h-3 w-full bg-muted rounded animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-5 w-32 bg-muted rounded animate-pulse" />
              <div className="h-3 w-full bg-muted rounded animate-pulse" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Papers Status</CardTitle>
        <CardDescription>Your progress across different paper types</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {/* Overall Progress */}
          <div className="space-y-2">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                <span className="font-medium">Overall Progress</span>
              </div>
              <span className="text-sm font-medium">{getTotalProgress()}%</span>
            </div>
            <Progress value={getTotalProgress()} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {modelPapers.completed + pastPapers.completed + subjectPapers.completed} of {modelPapers.total + pastPapers.total + subjectPapers.total} papers completed
            </p>
          </div>
          
          {/* Model Papers */}
          <div className="space-y-2">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-blue-500" />
                <span className="font-medium">Model Papers</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                className="h-6 px-2 text-xs gap-1"
                onClick={() => onViewAll?.('model')}
              >
                <span>View</span>
                <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
            <Progress value={getProgressForType(modelPapers)} className="h-2 bg-blue-100" indicatorClassName="bg-blue-500" />
            <p className="text-xs text-muted-foreground mt-1">
              {modelPapers.completed} of {modelPapers.total} model papers completed
            </p>
          </div>
          
          {/* Past Papers */}
          <div className="space-y-2">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-purple-500" />
                <span className="font-medium">Past Papers</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                className="h-6 px-2 text-xs gap-1"
                onClick={() => onViewAll?.('past')}
              >
                <span>View</span>
                <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
            <Progress value={getProgressForType(pastPapers)} className="h-2 bg-purple-100" indicatorClassName="bg-purple-500" />
            <p className="text-xs text-muted-foreground mt-1">
              {pastPapers.completed} of {pastPapers.total} past papers completed
            </p>
          </div>
          
          {/* Subject Papers */}
          <div className="space-y-2">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-emerald-500" />
                <span className="font-medium">Subject Papers</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                className="h-6 px-2 text-xs gap-1"
                onClick={() => onViewAll?.('subject')}
              >
                <span>View</span>
                <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
            <Progress value={getProgressForType(subjectPapers)} className="h-2 bg-emerald-100" indicatorClassName="bg-emerald-500" />
            <p className="text-xs text-muted-foreground mt-1">
              {subjectPapers.completed} of {subjectPapers.total} subject papers completed
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaperStatusCard;