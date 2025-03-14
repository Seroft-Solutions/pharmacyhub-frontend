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

// Import permission guards and hooks
import { PermissionGuard, AnyPermissionGuard, AllPermissionsGuard } from '@/features/rbac/ui';
import { ExamPermission } from '@/features/exams/constants/permissions';
import { useExamPermissions } from '@/features/exams/hooks/useExamPermissions';

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
 * This component demonstrates best practices for permission checks and API calls
 * including:
 * - Using PermissionGuard components for UI access control
 * - Using useExamPermissions hook for permission checks
 * - Using TanStack Query API hooks for data fetching
 */
const ExamDashboard: React.FC = () => {
  // Use the custom hook for exam-specific permissions
  const { 
    canViewExams, 
    canManageExams, 
    canAccessAnalytics, 
    hasPermission 
  } = useExamPermissions();

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
      {/* Main content is wrapped in a PermissionGuard to check basic access */}
      <PermissionGuard 
        permission={ExamPermission.VIEW_EXAMS}
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
          <PermissionGuard permission={ExamPermission.VIEW_ANALYTICS}>
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
          </PermissionGuard>

          {/* Example using AnyPermissionGuard with multiple permissions */}
          <AnyPermissionGuard 
            permissions={[
              ExamPermission.CREATE_EXAM, 
              ExamPermission.EDIT_EXAM, 
              ExamPermission.DELETE_EXAM
            ]}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Admin</div>
                <p className="text-xs text-muted-foreground">
                  <Badge variant="outline" className="mr-1">
                    {hasPermission(ExamPermission.CREATE_EXAM) ? 'Create' : ''}
                  </Badge>
                  <Badge variant="outline" className="mr-1">
                    {hasPermission(ExamPermission.EDIT_EXAM) ? 'Edit' : ''}
                  </Badge>
                  <Badge variant="outline">
                    {hasPermission(ExamPermission.DELETE_EXAM) ? 'Delete' : ''}
                  </Badge>
                </p>
              </CardContent>
            </Card>
          </AnyPermissionGuard>
        </div>

        {/* Tabs for different sections of exam management */}
        <Tabs defaultValue="exams" className="space-y-4">
          <TabsList>
            <TabsTrigger value="exams" className="flex items-center gap-2">
              <FileTextIcon className="h-4 w-4" />
              <span>Exams</span>
            </TabsTrigger>
            
            {/* Only show upload tab for users with create permission */}
            <PermissionGuard permission={ExamPermission.CREATE_EXAM}>
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <PlusCircleIcon className="h-4 w-4" />
                <span>Upload</span>
              </TabsTrigger>
            </PermissionGuard>
            
            {/* Only show analytics tab for users with analytics permission */}
            <PermissionGuard permission={ExamPermission.VIEW_ANALYTICS}>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3Icon className="h-4 w-4" />
                <span>Analytics</span>
              </TabsTrigger>
            </PermissionGuard>
            
            {/* Example with AllPermissionsGuard requiring multiple permissions */}
            <AllPermissionsGuard 
              permissions={[
                ExamPermission.PUBLISH_EXAM, 
                ExamPermission.UNPUBLISH_EXAM
              ]}
            >
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <SettingsIcon className="h-4 w-4" />
                <span>Settings</span>
              </TabsTrigger>
            </AllPermissionsGuard>
          </TabsList>
          
          <TabsContent value="exams" className="space-y-4">
            <ExamsList />
          </TabsContent>
          
          <TabsContent value="upload" className="space-y-4">
            <PermissionGuard permission={ExamPermission.CREATE_EXAM}>
              <JsonExamUploader />
            </PermissionGuard>
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-4">
            <PermissionGuard permission={ExamPermission.VIEW_ANALYTICS}>
              <Card>
                <CardHeader>
                  <CardTitle>Exam Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Analytics dashboard would be implemented here</p>
                </CardContent>
              </Card>
            </PermissionGuard>
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4">
            <AllPermissionsGuard 
              permissions={[
                ExamPermission.PUBLISH_EXAM, 
                ExamPermission.UNPUBLISH_EXAM
              ]}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Exam Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Settings dashboard would be implemented here</p>
                </CardContent>
              </Card>
            </AllPermissionsGuard>
          </TabsContent>
        </Tabs>
      </PermissionGuard>
    </div>
  );
};

export default ExamDashboard;
