'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Award, Clock, Activity } from 'lucide-react';
import StatsCard from './StatsCard';

interface ExamStatsCardProps {
  totalPapers: number;
  completedExams: number;
  averageScore: number;
  totalTimeSpent: number; // in minutes
  loading?: boolean;
  className?: string;
}

/**
 * ExamStatsCard - A component for displaying exam-related statistics
 */
export const ExamStatsCard: React.FC<ExamStatsCardProps> = ({
  totalPapers,
  completedExams,
  averageScore,
  totalTimeSpent,
  loading = false,
  className = '',
}) => {
  const hoursSpent = Math.floor(totalTimeSpent / 60);
  const minutesSpent = totalTimeSpent % 60;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Exam Statistics</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <StatsCard
          title="Total Papers"
          value={totalPapers}
          icon={BookOpen}
          loading={loading}
        />
        <StatsCard
          title="Completed Exams"
          value={completedExams}
          icon={Activity}
          loading={loading}
        />
        <StatsCard
          title="Average Score"
          value={`${averageScore.toFixed(1)}%`}
          icon={Award}
          variant="success"
          loading={loading}
        />
        <StatsCard
          title="Total Study Time"
          value={`${hoursSpent}h ${minutesSpent}m`}
          icon={Clock}
          loading={loading}
        />
      </CardContent>
    </Card>
  );
};

export default ExamStatsCard;
