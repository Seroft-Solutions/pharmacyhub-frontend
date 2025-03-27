'use client';

import React, { useState } from 'react';
import { useDashboardData, TimeFilter as TimeFilterType } from '../api/hooks/useDashboardData';
import { useRouter } from 'next/navigation';

// UI Components
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

// Icons
import { 
  LayoutDashboard, 
  Award, 
  TrendingUp, 
  FileText, 
  Clock, 
  BookOpen,
  CheckCircle2,
  Crown,
  AlertCircle,
  ChevronRight 
} from 'lucide-react';

// Custom Components
import TimeFilter from './filters/TimeFilter';
import StatsOverviewGrid from './cards/StatsOverviewGrid';
import ExamPerformanceChart from './charts/ExamPerformanceChart';
import ScoreDistributionChart from './charts/ScoreDistributionChart';
import StudyTimeChart from './charts/StudyTimeChart';
import RecentExamsTable from './tables/RecentExamsTable';
import PaperStatusCard from './cards/PaperStatusCard';
import SubjectPerformanceRadar from './charts/SubjectPerformanceRadar';
import PaymentStatusCard from './cards/PaymentStatusCard';
import RecentActivityTimeline from './cards/RecentActivityTimeline';
import PaperCompletionTimeline from './charts/PaperCompletionTimeline';

/**
 * DashboardOverview - The main dashboard page component with enhanced UI/UX
 */
export function DashboardOverview() {
  const router = useRouter();
  const { dashboardData, isLoading, timeFilter, setTimeFilter } = useDashboardData();
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Function to navigate to exam result page
  const handleViewResult = (attemptId: number) => {
    router.push(`/exams/results/${attemptId}`);
  };

  // Function to navigate to premium upgrade page
  const handleUpgrade = () => {
    router.push('/payments/premium');
  };

  // Function to navigate to papers page
  const handleViewAllPapers = (paperType: string) => {
    switch (paperType) {
      case 'model':
        router.push('/exam/model-papers');
        break;
      case 'past':
        router.push('/exam/past-papers');
        break;
      case 'subject':
        router.push('/exam/subject-papers');
        break;
      default:
        router.push('/exams');
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Dashboard Header */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your progress.
          </p>
        </div>
        <TimeFilter
          value={timeFilter}
          onChange={setTimeFilter}
        />
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="mb-4 grid grid-cols-4 md:inline-flex">
          <TabsTrigger value="overview" className="flex items-center gap-1">
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Performance</span>
          </TabsTrigger>
          <TabsTrigger value="papers" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Papers</span>
          </TabsTrigger>
          <TabsTrigger value="premium" className="flex items-center gap-1">
            <Crown className="h-4 w-4" />
            <span className="hidden sm:inline">Premium</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab Content */}
        <TabsContent value="overview" className="space-y-6">
          {/* Stats Overview Grid */}
          <StatsOverviewGrid 
            loading={isLoading}
            totalPapers={dashboardData.examStats.totalPapers}
            completedExams={dashboardData.progress.completedExams}
            inProgressExams={dashboardData.progress.inProgressExams}
            averageScore={dashboardData.progress.averageScore}
            totalTimeSpent={dashboardData.progress.totalTimeSpent}
            isPremium={dashboardData.premium.isPremium}
          />

          <Separator className="my-6" />

          {/* Top Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Exam Performance</CardTitle>
                <CardDescription>Your scores compared to average</CardDescription>
              </CardHeader>
              <CardContent>
                <ExamPerformanceChart
                  data={dashboardData.analytics.examScores}
                  loading={isLoading}
                />
              </CardContent>
            </Card>
            
            <RecentActivityTimeline 
              loading={isLoading}
              activities={dashboardData.analytics.recentActivities || []}
            />
          </div>

          <Separator className="my-6" />

          {/* Recent Exams */}
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
                attempts={dashboardData.analytics.recentExams || []}
                loading={isLoading}
                onViewResult={handleViewResult}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab Content */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Performance Trend</CardTitle>
                <CardDescription>Your exam scores over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ExamPerformanceChart
                  data={dashboardData.analytics.examScores}
                  loading={isLoading}
                  height={300}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Score Distribution</CardTitle>
                <CardDescription>Breakdown of your scores</CardDescription>
              </CardHeader>
              <CardContent>
                <ScoreDistributionChart
                  data={dashboardData.analytics.scoreDistribution || []}
                  loading={isLoading}
                  height={300}
                />
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Study Time</CardTitle>
                <CardDescription>Hours spent studying by day</CardDescription>
              </CardHeader>
              <CardContent>
                <StudyTimeChart
                  data={dashboardData.analytics.studyHours || []}
                  loading={isLoading}
                  height={300}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Subject Performance</CardTitle>
                <CardDescription>Your strengths by subject area</CardDescription>
              </CardHeader>
              <CardContent>
                <SubjectPerformanceRadar
                  data={dashboardData.analytics.subjectPerformance || []}
                  loading={isLoading}
                  height={300}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Papers Tab Content */}
        <TabsContent value="papers" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PaperStatusCard
              modelPapers={{
                total: dashboardData.analytics.paperCounts?.model?.total || 0,
                completed: dashboardData.analytics.paperCounts?.model?.completed || 0
              }}
              pastPapers={{
                total: dashboardData.analytics.paperCounts?.past?.total || 0,
                completed: dashboardData.analytics.paperCounts?.past?.completed || 0
              }}
              subjectPapers={{
                total: dashboardData.analytics.paperCounts?.subject?.total || 0,
                completed: dashboardData.analytics.paperCounts?.subject?.completed || 0
              }}
              loading={isLoading}
              onViewAll={handleViewAllPapers}
            />
            
            <Card>
              <CardHeader>
                <CardTitle>Paper Completion Timeline</CardTitle>
                <CardDescription>Your progress over time</CardDescription>
              </CardHeader>
              <CardContent>
                <PaperCompletionTimeline
                  data={dashboardData.analytics.paperCompletionTimeline || []}
                  loading={isLoading}
                  height={300}
                />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl">Recent Papers</CardTitle>
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
              <p className="text-muted-foreground text-sm mb-6">
                Your recently attempted papers across all categories
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[...dashboardData.papers.model.slice(0, 1), 
                   ...dashboardData.papers.past.slice(0, 1), 
                   ...dashboardData.papers.subject.slice(0, 1)].map((paper, idx) => (
                  <Card key={idx} className="shadow-sm hover:shadow transition-shadow">
                    <CardHeader className="p-4 pb-2">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <CardTitle className="text-sm font-medium line-clamp-1">{paper.title || 'Paper Title'}</CardTitle>
                          <CardDescription className="text-xs line-clamp-1">
                            {paper.source?.toUpperCase() || 'MODEL'} PAPER
                          </CardDescription>
                        </div>
                        <div className={`h-6 w-6 rounded-full flex items-center justify-center text-white
                          ${paper.source === 'model' ? 'bg-blue-500' : 
                            paper.source === 'past' ? 'bg-purple-500' : 'bg-emerald-500'}`}>
                          {paper.source === 'model' ? 
                            <Award className="h-3 w-3" /> : 
                            paper.source === 'past' ? 
                            <FileText className="h-3 w-3" /> : 
                            <BookOpen className="h-3 w-3" />}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-1 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1">
                          <FileText className="h-3 w-3 text-muted-foreground" />
                          <span>{paper.total_questions || paper.questionCount || 0} Questions</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span>{paper.time_limit || paper.durationMinutes || 0} Minutes</span>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        className="w-full mt-1 text-xs"
                        onClick={() => router.push(`/exam/${paper.id}`)}
                      >
                        Start Paper
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Premium Tab Content */}
        <TabsContent value="premium" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Premium Status</CardTitle>
                <CardDescription>Your current membership details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-6 px-4 space-y-4">
                  {dashboardData.premium.isPremium ? (
                    <>
                      <div className="w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center mb-2">
                        <Crown className="h-10 w-10 text-yellow-600" />
                      </div>
                      <h3 className="text-2xl font-bold">Premium Member</h3>
                      <div className="text-muted-foreground">
                        Your premium membership is active until{' '}
                        <span className="font-medium text-foreground">
                          {dashboardData.premium.expiryDate}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-3 justify-center mt-4">
                        <div className="bg-green-50 text-green-700 px-3 py-1.5 rounded-md flex items-center">
                          <CheckCircle2 className="h-4 w-4 mr-1.5" />
                          All Premium Papers
                        </div>
                        <div className="bg-green-50 text-green-700 px-3 py-1.5 rounded-md flex items-center">
                          <CheckCircle2 className="h-4 w-4 mr-1.5" />
                          Advanced Analytics
                        </div>
                        <div className="bg-green-50 text-green-700 px-3 py-1.5 rounded-md flex items-center">
                          <CheckCircle2 className="h-4 w-4 mr-1.5" />
                          Personalized Study Plan
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                        <Crown className="h-10 w-10 text-gray-400" />
                      </div>
                      <h3 className="text-2xl font-bold">Free Account</h3>
                      <div className="text-muted-foreground">
                        Upgrade to Premium for full access to all features
                      </div>
                      <div className="flex flex-wrap gap-3 justify-center mt-4">
                        <div className="bg-gray-50 text-gray-500 px-3 py-1.5 rounded-md flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1.5" />
                          Limited Paper Access
                        </div>
                        <div className="bg-gray-50 text-gray-500 px-3 py-1.5 rounded-md flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1.5" />
                          Basic Analytics
                        </div>
                      </div>
                      <Button 
                        onClick={handleUpgrade}
                        className="mt-6 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                      >
                        Upgrade to Premium
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Premium Papers</CardTitle>
                <CardDescription>Available premium content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-md">
                    <div className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">Model Papers</span>
                    </div>
                    <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">
                      {dashboardData.papers.model.filter(p => p.premium).length} Available
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-md">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-purple-600" />
                      <span className="font-medium">Past Papers</span>
                    </div>
                    <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-200">
                      {dashboardData.papers.past.filter(p => p.premium).length} Available
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-md">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-emerald-600" />
                      <span className="font-medium">Subject Papers</span>
                    </div>
                    <Badge variant="outline" className="bg-emerald-100 text-emerald-700 border-emerald-200">
                      {dashboardData.papers.subject.filter(p => p.premium).length} Available
                    </Badge>
                  </div>

                  {!dashboardData.premium.isPremium && (
                    <Button
                      variant="outline"
                      className="w-full mt-4"
                      onClick={handleUpgrade}
                    >
                      <Crown className="h-4 w-4 mr-2" />
                      Unlock Premium Papers
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Benefits Comparison</CardTitle>
              <CardDescription>Free vs Premium membership</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="text-left p-2 border-b">Feature</th>
                      <th className="text-center p-2 border-b">Free</th>
                      <th className="text-center p-2 border-b">Premium</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-2 border-b">Model Papers</td>
                      <td className="text-center p-2 border-b">Limited</td>
                      <td className="text-center p-2 border-b text-green-600">Unlimited</td>
                    </tr>
                    <tr>
                      <td className="p-2 border-b">Past Papers</td>
                      <td className="text-center p-2 border-b">Limited</td>
                      <td className="text-center p-2 border-b text-green-600">Unlimited</td>
                    </tr>
                    <tr>
                      <td className="p-2 border-b">Subject Papers</td>
                      <td className="text-center p-2 border-b">Limited</td>
                      <td className="text-center p-2 border-b text-green-600">Unlimited</td>
                    </tr>
                    <tr>
                      <td className="p-2 border-b">Analytics</td>
                      <td className="text-center p-2 border-b">Basic</td>
                      <td className="text-center p-2 border-b text-green-600">Advanced</td>
                    </tr>
                    <tr>
                      <td className="p-2 border-b">Performance Tracking</td>
                      <td className="text-center p-2 border-b">Basic</td>
                      <td className="text-center p-2 border-b text-green-600">Detailed</td>
                    </tr>
                    <tr>
                      <td className="p-2 border-b">Study Plan</td>
                      <td className="text-center p-2 border-b">✗</td>
                      <td className="text-center p-2 border-b text-green-600">✓</td>
                    </tr>
                    <tr>
                      <td className="p-2 border-b">Progress Reports</td>
                      <td className="text-center p-2 border-b">✗</td>
                      <td className="text-center p-2 border-b text-green-600">✓</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              {!dashboardData.premium.isPremium && (
                <div className="mt-6 flex justify-center">
                  <Button
                    size="lg"
                    onClick={handleUpgrade}
                    className="px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    <Crown className="h-5 w-5 mr-2" />
                    Upgrade Now
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default DashboardOverview;