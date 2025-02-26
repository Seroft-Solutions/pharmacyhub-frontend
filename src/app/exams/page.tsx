'use client';

import { ExamList } from '@/features/exams/ui/ExamList';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { usePermissions } from '@/hooks/usePermissions';

export default function ExamsPage() {
  const { hasPermission } = usePermissions();
  const canCreateExams = hasPermission('exams:create');
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Pharmacy Exams</h1>
      
      <Tabs defaultValue="available">
        <TabsList className="mb-6">
          <TabsTrigger value="available">Available Exams</TabsTrigger>
          <TabsTrigger value="completed">Completed Exams</TabsTrigger>
          {canCreateExams && (
            <TabsTrigger value="manage">Manage Exams</TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="available">
          <ExamList />
        </TabsContent>
        
        <TabsContent value="completed">
          <div className="text-center p-6 bg-gray-100 rounded-md">
            <p>Your exam history will appear here.</p>
          </div>
        </TabsContent>
        
        {canCreateExams && (
          <TabsContent value="manage">
            <div className="text-center p-6 bg-gray-100 rounded-md">
              <p>Exam management interface will appear here.</p>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}