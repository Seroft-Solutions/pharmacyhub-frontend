'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye, Award, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ExamAttempt {
  id: number;
  examId: number;
  examTitle: string;
  score: number;
  totalMarks: number;
  isPassed: boolean;
  completedAt: string;
  timeSpent: number; // in minutes
}

interface RecentExamsTableProps {
  attempts: ExamAttempt[];
  loading?: boolean;
  className?: string;
  onViewResult: (attemptId: number) => void;
}

/**
 * RecentExamsTable - A component for displaying recent exam attempts
 */
export const RecentExamsTable: React.FC<RecentExamsTableProps> = ({
  attempts,
  loading = false,
  className = '',
  onViewResult,
}) => {
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date);
  };

  // Format time spent for display
  const formatTimeSpent = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  // If loading, show a skeleton UI
  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Recent Exams</CardTitle>
          <CardDescription>Your latest exam attempts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] animate-pulse bg-muted rounded-md"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Recent Exams</CardTitle>
        <CardDescription>Your latest exam attempts</CardDescription>
      </CardHeader>
      <CardContent>
        {attempts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Award className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium">No Exams Attempted Yet</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Start taking exams to see your results here.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Exam</TableHead>
                <TableHead>Score</TableHead>
                <TableHead className="hidden md:table-cell">Time Spent</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead className="hidden sm:table-cell">Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attempts.map((attempt) => (
                <TableRow key={attempt.id}>
                  <TableCell className="font-medium">{attempt.examTitle}</TableCell>
                  <TableCell>
                    {attempt.score}/{attempt.totalMarks}
                    <span className="ml-1 text-xs text-muted-foreground">
                      ({((attempt.score / attempt.totalMarks) * 100).toFixed(1)}%)
                    </span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center">
                      <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
                      {formatTimeSpent(attempt.timeSpent)}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{formatDate(attempt.completedAt)}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {attempt.isPassed ? (
                      <Badge variant="success">Passed</Badge>
                    ) : (
                      <Badge variant="destructive">Failed</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewResult(attempt.id)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      <span className="hidden sm:inline">View</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentExamsTable;
