'use client';

import React, { useState, useCallback } from 'react';
import { useDashboardData } from '../api/hooks/useDashboardData';
import { useRouter } from 'next/navigation';

// UI Components
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

// Icons
import { 
  LayoutDashboard, 
  Award, 
  TrendingUp, 
  Clock,
  AlertCircle,
  ChevronRight,
  CheckCircle2,
  Crown,
  Clock3,
  Lock,
  ArrowRight
} from 'lucide-react';

// Custom Components
import TimeFilter from './filters/TimeFilter';
// StatsOverviewGrid and ExamPerformanceChart removed as they're redundant
// import ExamPerformanceChart from './charts/ExamPerformanceChart';
import ScoreDistributionChart from './charts/ScoreDistributionChart';
// StudyTimeChart removed as it's not used
import RecentExamsTable from './tables/RecentExamsTable';
import SubjectPerformanceRadar from './charts/SubjectPerformanceRadar';
import RecentActivityTimeline from './cards/RecentActivityTimeline';

// Loading fallback for charts
const ChartSkeleton = () => (
  <div className="w-full h-[300px] animate-pulse bg-gray-100 rounded-lg"></div>
);

// Error boundary component for charts
const ChartErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  
  if (hasError) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center border border-red-200 bg-red-50 rounded-lg">
        <div className="text-center p-4">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-600 font-medium">Failed to load chart</p>
          <button 
            onClick={() => setHasError(false)}
            className="mt-2 px-3 py-1 text-sm text-red-600 border border-red-300 rounded-md hover:bg-red-100"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  return <>{children}</>;
};

export function DashboardOverview() {
  const router = useRouter();
  const { 
    dashboardData, 
    isLoading, 
    timeFilter, 
    setTimeFilter 
  } = useDashboardData();

  // Helper functions for handling premium status and payment status
  const getCardBackgroundByStatus = (paymentStatus?: string, isPremium?: boolean) => {
    if (!isPremium) return "bg-gray-50 border-gray-100";
    
    switch (paymentStatus) {
      case 'PAID':
        return "bg-yellow-50 border-yellow-100";
      case 'PENDING':
        return "bg-blue-50 border-blue-100";
      case 'FAILED':
        return "bg-red-50 border-red-100";
      default:
        return "bg-yellow-50 border-yellow-100";
    }
  };

  const getIconBackgroundByStatus = (paymentStatus?: string, isPremium?: boolean) => {
    if (!isPremium) return 'bg-gray-100';
    
    switch (paymentStatus) {
      case 'PAID':
        return 'bg-yellow-100';
      case 'PENDING':
        return 'bg-blue-100';
      case 'FAILED':
        return 'bg-red-100';
      default:
        return 'bg-yellow-100';
    }
  };

  const getTextColorByStatus = (paymentStatus?: string, isPremium?: boolean) => {
    if (!isPremium) return 'text-gray-500';
    
    switch (paymentStatus) {
      case 'PAID':
        return 'text-yellow-600';
      case 'PENDING':
        return 'text-blue-600';
      case 'FAILED':
        return 'text-red-600';
      default:
        return 'text-yellow-600';
    }
  };

  const getStatusIcon = (paymentStatus?: string, isPremium?: boolean) => {
    if (!isPremium) {
      return <Crown className="h-5 w-5 text-gray-400" />;
    }
    
    switch (paymentStatus) {
      case 'PAID':
        return <Crown className="h-5 w-5 text-yellow-600" />;
      case 'PENDING':
        return <Clock3 className="h-5 w-5 text-blue-600" />;
      case 'FAILED':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Crown className="h-5 w-5 text-yellow-600" />;
    }
  };

  const getAccountStatusText = (paymentStatus?: string, isPremium?: boolean) => {
    if (!isPremium) return 'Free Account';
    
    switch (paymentStatus) {
      case 'PAID':
        return 'Premium';
      case 'PENDING':
        return 'Premium (Pending)';
      case 'FAILED':
        return 'Premium (Failed)';
      default:
        return 'Premium';
    }
  };

  const renderAccountStatusContent = (premium?: any) => {
    if (!premium?.isPremium) {
      return (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => router.push('/premium')} 
          className="mt-1 text-xs py-1 h-7"
        >
          Upgrade
        </Button>
      );
    }
    
    switch (premium?.paymentStatus) {
      case 'PAID':
        return (
          <p className="text-yellow-700">
            Until {new Date(premium?.expiryDate).toLocaleDateString()}
          </p>
        );
      case 'PENDING':
        return (
          <p className="text-blue-700 text-xs">
            Your payment is being processed
          </p>
        );
      case 'FAILED':
        return (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => router.push('/premium/payment')} 
            className="mt-1 text-xs py-1 h-7 text-red-600 border-red-300"
          >
            Retry Payment
          </Button>
        );
      default:
        return (
          <p className="text-yellow-700">
            Until {new Date(premium?.expiryDate).toLocaleDateString()}
          </p>
        );
    }
  };

  // Navigation functions using useCallback for better performance
  const handleViewResult = useCallback((attemptId) => {
    router.push(`/exams/results/${attemptId}`);
  }, [router]);

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Dashboard Header with Key Stats */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Here&apos;s an overview of your progress.
            </p>
          </div>
          <TimeFilter
            value={timeFilter}
            onChange={setTimeFilter}
          />
        </div>
        
        {/* Key Stats Cards - Always Visible */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
          <Card className="bg-blue-50 border-blue-100">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                <Award className="h-5 w-5 text-blue-600" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-blue-600">Total Papers</p>
                {isLoading ? (
                  <div className="h-6 w-16 bg-blue-100 animate-pulse rounded mx-auto"></div>
                ) : (
                  <p className="text-2xl font-bold text-blue-700">{dashboardData?.examStats?.totalPapers || 0}</p>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-green-50 border-green-100">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mb-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-green-600">Completed</p>
                {isLoading ? (
                  <div className="h-6 w-16 bg-green-100 animate-pulse rounded mx-auto"></div>
                ) : (
                  <p className="text-2xl font-bold text-green-700">{dashboardData?.progress?.completedExams || 0}</p>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-purple-50 border-purple-100">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-purple-600">Avg. Score</p>
                {isLoading ? (
                  <div className="h-6 w-16 bg-purple-100 animate-pulse rounded mx-auto"></div>
                ) : (
                  <p className="text-2xl font-bold text-purple-700">{dashboardData?.progress?.averageScore || 0}%</p>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card className={getCardBackgroundByStatus(dashboardData?.premium?.paymentStatus, dashboardData?.premium?.isPremium)}>
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <div className={`w-10 h-10 rounded-full ${getIconBackgroundByStatus(dashboardData?.premium?.paymentStatus, dashboardData?.premium?.isPremium)} flex items-center justify-center mb-2`}>
                {getStatusIcon(dashboardData?.premium?.paymentStatus, dashboardData?.premium?.isPremium)}
              </div>
              <div className="space-y-1">
                {/* Status Badge */}
                {dashboardData?.premium?.paymentStatus === 'PENDING' && (
                  <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300 flex items-center gap-1 text-xs mb-1">
                    <Clock3 className="h-3 w-3 text-blue-600" />
                    Waiting for approval
                  </Badge>
                )}
                {dashboardData?.premium?.paymentStatus === 'FAILED' && (
                  <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300 flex items-center gap-1 text-xs mb-1">
                    <AlertCircle className="h-3 w-3 text-red-600" />
                    Payment failed
                  </Badge>
                )}
                
                {/* Account Status */}
                <p className={`text-sm font-medium ${getTextColorByStatus(dashboardData?.premium?.paymentStatus, dashboardData?.premium?.isPremium)}`}>
                  {getAccountStatusText(dashboardData?.premium?.paymentStatus, dashboardData?.premium?.isPremium)}
                </p>
                
                {isLoading ? (
                  <div className="h-6 w-16 bg-yellow-100 animate-pulse rounded mx-auto"></div>
                ) : (
                  <div className="text-sm font-bold">
                    {renderAccountStatusContent(dashboardData?.premium)}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Single Overview Tab only */}
      <Tabs defaultValue="overview" value="overview" className="space-y-6">
        <TabsList className="mb-4 grid grid-cols-1 md:inline-flex">
          <TabsTrigger value="overview" className="flex items-center gap-1">
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab Content */}
        <TabsContent value="overview" className="space-y-6">
          {/* Stats Overview Grid removed as it duplicates information already in top cards */}
          {/* This removes duplication of fields between the top cards and overview section */}

          {/* Top Charts - Exam Performance chart removed as requested */}
          <div className="grid grid-cols-1 gap-6">
            {dashboardData?.analytics?.recentActivities && dashboardData.analytics.recentActivities.length > 0 ? (
              <RecentActivityTimeline 
                loading={isLoading}
                activities={dashboardData.analytics.recentActivities}
              />
            ) : null}
          </div>
          
          {/* Charts moved from Performance tab */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dashboardData?.analytics?.scoreDistribution && dashboardData.analytics.scoreDistribution.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>Score Distribution</CardTitle>
                  <CardDescription>Breakdown of your scores</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScoreDistributionChart
                    data={dashboardData.analytics.scoreDistribution}
                    loading={isLoading}
                    height={300}
                  />
                </CardContent>
              </Card>
            ) : null}
            
            {dashboardData?.analytics?.subjectPerformance && dashboardData.analytics.subjectPerformance.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>Subject Performance</CardTitle>
                  <CardDescription>Your strengths by subject area</CardDescription>
                </CardHeader>
                <CardContent>
                  <SubjectPerformanceRadar
                    data={dashboardData.analytics.subjectPerformance}
                    loading={isLoading}
                    height={300}
                  />
                </CardContent>
              </Card>
            ) : null}
          </div>

          <Separator className="my-6" />

          {/* Recent Exams */}
          {dashboardData?.analytics?.recentExams && dashboardData.analytics.recentExams.length > 0 ? (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl">Recent Exam Attempts</CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => router.push('/exams')}
                  className="text-muted-foreground flex items-center"
                >
                  <span>View All</span>
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardHeader>
              <CardContent>
                <RecentExamsTable
                  attempts={dashboardData.analytics.recentExams}
                  loading={isLoading}
                  onViewResult={handleViewResult}
                />
              </CardContent>
            </Card>
          ) : null}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default DashboardOverview;