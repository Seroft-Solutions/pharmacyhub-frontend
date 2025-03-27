'use client';

import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { 
  Activity,
  Award,
  BookOpen,
  Clock,
  FileText,
  Crown,
  CreditCard
} from 'lucide-react';
import { format, formatDistance } from 'date-fns';

interface ActivityItem {
  id: string;
  type: string;
  title: string;
  timestamp: string;
  details?: Record<string, any>;
}

interface RecentActivityTimelineProps {
  activities: ActivityItem[];
  loading?: boolean;
  className?: string;
}

export const RecentActivityTimeline: React.FC<RecentActivityTimelineProps> = ({
  activities,
  loading = false,
  className = ''
}) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'exam_completed':
        return <Award className="h-5 w-5 text-blue-500" />;
      case 'exam_started':
        return <BookOpen className="h-5 w-5 text-green-500" />;
      case 'paper_purchased':
        return <FileText className="h-5 w-5 text-purple-500" />;
      case 'premium_subscription':
        return <Crown className="h-5 w-5 text-yellow-500" />;
      case 'payment':
        return <CreditCard className="h-5 w-5 text-emerald-500" />;
      default:
        return <Activity className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const formatTimeAgo = (timestamp: string) => {
    try {
      return formatDistance(new Date(timestamp), new Date(), { addSuffix: true });
    } catch (e) {
      return 'recently';
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest activities and progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                  <div className="h-3 w-1/2 bg-muted rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your latest activities and progress</CardDescription>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Clock className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium">No Recent Activity</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Your recent activities will appear here.
            </p>
          </div>
        ) : (
          <div className="relative space-y-6">
            {/* Timeline line */}
            <div className="absolute left-5 top-0 bottom-0 w-[2px] bg-border -ml-[1px]" />
            
            {activities.map((activity, index) => (
              <div key={activity.id} className="flex gap-4 relative">
                {/* Icon */}
                <div className="z-10 flex items-center justify-center w-10 h-10 rounded-full bg-card border border-border shadow">
                  {getActivityIcon(activity.type)}
                </div>
                
                {/* Content */}
                <div className="flex-1 pt-1">
                  <h4 className="font-medium">{activity.title}</h4>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-muted-foreground">
                      {formatTimeAgo(activity.timestamp)}
                    </p>
                    {activity.details && activity.type === 'exam_completed' && (
                      <div className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                        Score: {activity.details.score}/{activity.details.totalMarks}
                      </div>
                    )}
                    {activity.details && activity.type === 'premium_subscription' && (
                      <div className="text-xs font-medium bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">
                        {activity.details.validity}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivityTimeline;