"use client"

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3Icon, 
  ClipboardListIcon, 
  FileTextIcon, 
  InfoIcon, 
  PlusCircleIcon, 
  SettingsIcon, 
  UsersIcon 
} from 'lucide-react';

// Import new feature-based guards
import { 
  ExamGuard, 
  ExamOperationGuard, 
  ViewExamsGuard, 
  ManageExamsGuard 
} from '@/features/exams/ui/guards/ExamGuard';
import { ExamOperation, useExamFeatureAccess } from '@/features/exams/hooks/useExamFeatureAccess';

// Import API hooks for data fetching
import { 
  examApiHooks, 
  useExamStats, 
  useAllPapers
} from '@/features/exams/api/hooks';

// Import components
import ExamsList from './ExamsList';
import JsonExamUploader from './JsonExamUploader';

/**
 * ExamDashboard Component
 * 
 * This component demonstrates best practices for feature-based access control:
 * - Using ExamGuard components for UI access control
 * - Using useExamFeatureAccess hook for operation-level checks
 * - Using TanStack Query API hooks for data fetching
 */
const ExamDashboard: React.FC = () => {
  // Use the feature access hook for exam-specific permissions
  const { 
    canViewExams, 
    canManageExams, 
    canViewAnalytics, 
    canCreateExams,
    canEditExams,
    canDeleteExams,
    canPublishExams,
    canUnpublishExams,
    checkExamOperation
  } = useExamFeatureAccess();

  // Use TanStack Query API hooks for data fetching
  const examsQuery = examApiHooks.useList();
  const statsQuery = useExamStats();
  const papersQuery = useAllPapers();

  // Calculate summary statistics
  const totalExams = examsQuery.data?.length || 0;
  const totalPapers = papersQuery.data?.length || 0;
  const statsData = statsQuery.data || { totalAttempts: 0, averageScore: 0 };

  return (
    <div className="space-y-6">
      {/* Main content is wrapped in ExamGuard to check feature access */}
      <ExamGuard
        fallback={
          <Alert variant="destructive">
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>
              You don't have permission to view exam management features.
            </AlertDescription>
          </Alert>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Statistics Cards */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Exams</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalExams}</div>
              <p className="text-xs text-muted-foreground">
                {examsQuery.isLoading ? 'Loading...' : `${totalPapers} papers available`}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Attempts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statsData.totalAttempts}</div>
              <p className="text-xs text-muted-foreground">
                {statsQuery.isLoading ? 'Loading...' : 'From all users'}
              </p>
            </CardContent>
          </Card>

          {/* Analytics Card - Only visible to users with analytics permission */}
          <ExamOperationGuard operation={ExamOperation.VIEW_ANALYTICS}>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statsData.averageScore?.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">
                  {statsQuery.isLoading ? 'Loading...' : 'Across all exams'}
                </p>
              </CardContent>
            </Card>
          </ExamOperationGuard>

          {/* Management Card - Example using feature operation checks */}
          {canManageExams && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Admin</div>
                <p className="text-xs text-muted-foreground">
                  <Badge variant="outline" className="mr-1">
                    {canCreateExams ? 'Create' : ''}
                  </Badge>
                  <Badge variant="outline" className="mr-1">
                    {canEditExams ? 'Edit' : ''}
                  </Badge>
                  <Badge variant="outline">
                    {canDeleteExams ? 'Delete' : ''}
                  </Badge>
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Tabs for different sections of exam management */}
        <Tabs defaultValue="exams" className="space-y-4">
          <TabsList>
            <TabsTrigger value="exams" className="flex items-center gap-2">
              <FileTextIcon className="h-4 w-4" />
              <span>Exams</span>
            </TabsTrigger>
            
            {/* Only show upload tab for users with create permission */}
            {canCreateExams && (
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <PlusCircleIcon className="h-4 w-4" />
                <span>Upload</span>
              </TabsTrigger>
            )}
            
            {/* Only show analytics tab for users with analytics permission */}
            {canViewAnalytics && (
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3Icon className="h-4 w-4" />
                <span>Analytics</span>
              </TabsTrigger>
            )}
            
            {/* Only show settings tab for users with publish permissions */}
            {canPublishExams && canUnpublishExams && (
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <SettingsIcon className="h-4 w-4" />
                <span>Settings</span>
              </TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="exams" className="space-y-4">
            <ExamsList />
          </TabsContent>
          
          <TabsContent value="upload" className="space-y-4">
            <ExamOperationGuard operation={ExamOperation.CREATE}>
              <JsonExamUploader />
            </ExamOperationGuard>
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-4">
            <ExamOperationGuard operation={ExamOperation.VIEW_ANALYTICS}>
              <Card>
                <CardHeader>
                  <CardTitle>Exam Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Analytics dashboard would be implemented here</p>
                </CardContent>
              </Card>
            </ExamOperationGuard>
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4">
            {/* Example using multiple operation checks */}
            {canPublishExams && canUnpublishExams && (
              <Card>
                <CardHeader>
                  <CardTitle>Exam Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Settings dashboard would be implemented here</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </ExamGuard>
    </div>
  );
};

export default ExamDashboard;
