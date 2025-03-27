'use client';

import React from 'react';
import { 
  BookOpen, 
  Award, 
  Clock, 
  Activity,
  Check,
  Hourglass,
  Crown
} from 'lucide-react';
import StatsCard from './StatsCard';

interface StatsOverviewGridProps {
  totalPapers: number;
  completedExams: number;
  inProgressExams: number;
  averageScore: number;
  totalTimeSpent: number; // in minutes
  isPremium: boolean;
  loading?: boolean;
  className?: string;
}

/**
 * StatsOverviewGrid - A grid of stat cards showing key metrics
 */
export const StatsOverviewGrid: React.FC<StatsOverviewGridProps> = ({
  totalPapers,
  completedExams,
  inProgressExams,
  averageScore,
  totalTimeSpent,
  isPremium,
  loading = false,
  className = '',
}) => {
  const hoursSpent = Math.floor(totalTimeSpent / 60);
  const minutesSpent = totalTimeSpent % 60;

  return (
    <div className={`grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${className}`}>
      <StatsCard
        title="Total Papers"
        value={totalPapers}
        icon={BookOpen}
        loading={loading}
        trend={{
          value: 5,
          label: "from last month",
          positive: true
        }}
      />
      <StatsCard
        title="Completed Exams"
        value={completedExams}
        icon={Check}
        variant="success"
        loading={loading}
        trend={{
          value: 12,
          label: "increase",
          positive: true
        }}
      />
      <StatsCard
        title="In Progress"
        value={inProgressExams}
        icon={Hourglass}
        variant="warning"
        loading={loading}
      />
      <StatsCard
        title="Average Score"
        value={`${averageScore.toFixed(1)}%`}
        icon={Award}
        variant={averageScore >= 70 ? "success" : averageScore >= 50 ? "warning" : "danger"}
        loading={loading}
        trend={{
          value: 2.5,
          label: "improvement",
          positive: true
        }}
      />
      <StatsCard
        title="Study Time"
        value={`${hoursSpent}h ${minutesSpent}m`}
        icon={Clock}
        loading={loading}
        trend={{
          value: 10,
          label: "more than last week",
          positive: true
        }}
      />
      <StatsCard
        title="Active Streak"
        value="5 days"
        icon={Activity}
        loading={loading}
      />
      <StatsCard
        title="Account Status"
        value={isPremium ? "Premium" : "Free"}
        icon={Crown}
        variant={isPremium ? "primary" : "default"}
        description={isPremium ? "Premium member" : "Upgrade for more features"}
        loading={loading}
      />
    </div>
  );
};

export default StatsOverviewGrid;