"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpenIcon, CalendarIcon, GraduationCapIcon, ListTodoIcon, Loader2Icon } from 'lucide-react';
import { PaperType } from '../../types/StandardTypes';
import { getPaperTypeDescription } from '../../utils/paperTypeUtils';
import { JsonExamUploader } from './JsonExamUploader';
import { useExamDetail } from '../../api/hooks/useExamApiHooks';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface PaperTypeManagerProps {
  examId?: number;
}

/**
 * Component for managing different paper types
 * Can be used for creating new exams or editing existing ones
 */
export const PaperTypeManager: React.FC<PaperTypeManagerProps> = ({ examId }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>(PaperType.MODEL);
  const isEditMode = !!examId;
  
  // Fetch exam data if in edit mode
  const { 
    data: exam, 
    isLoading, 
    error 
  } = useExamDetail(examId || 0, {
    enabled: isEditMode,
  });
  
  // Set the active tab based on the exam's paper type when data is loaded
  useEffect(() => {
    if (exam) {
      // Extract paper type from tags
      const paperType = exam.tags?.find(tag =>
        tag && ['MODEL', 'PAST', 'SUBJECT', 'PRACTICE'].includes(tag.toUpperCase())
      );
      
      if (paperType) {
        setActiveTab(paperType);
      }
    }
  }, [exam]);
  
  // Handle back button click
  const handleBack = () => {
    router.push('/admin/exams/manage');
  };

  // Render loading state
  if (isEditMode && isLoading) {
    return (
      <Card className="shadow-md">
        <CardContent className="p-8 flex justify-center items-center">
          <div className="flex flex-col items-center gap-2">
            <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
            <p>Loading exam data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Render error state
  if (isEditMode && error) {
    return (
      <Card className="shadow-md">
        <CardContent className="p-8">
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load exam data. Please try again.
            </AlertDescription>
          </Alert>
          <Button onClick={handleBack}>
            Back to Exams
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-md">
      <CardHeader className="bg-primary-50 dark:bg-primary-950/50">
        <CardTitle className="text-xl">
          {isEditMode ? 'Edit Exam' : 'Paper Type Management'}
        </CardTitle>
        <CardDescription>
          {isEditMode 
            ? 'Edit exam properties while maintaining consistent MCQ structure.' 
            : 'Upload and manage different types of exam papers while maintaining consistent MCQ structure.'}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6">
        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value={PaperType.MODEL} className="flex items-center gap-2">
              <BookOpenIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Model</span>
            </TabsTrigger>
            <TabsTrigger value={PaperType.PAST} className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Past</span>
            </TabsTrigger>
            <TabsTrigger value={PaperType.SUBJECT} className="flex items-center gap-2">
              <GraduationCapIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Subject</span>
            </TabsTrigger>
          </TabsList>

          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">
              {activeTab === PaperType.MODEL && 'Model Papers'}
              {activeTab === PaperType.PAST && 'Past Papers'}
              {activeTab === PaperType.SUBJECT && 'Subject Papers'}
            </h3>
            <p className="text-muted-foreground">
              {getPaperTypeDescription(activeTab)}
            </p>
          </div>

          {/* Pass exam data to JsonExamUploader if in edit mode */}
          <JsonExamUploader 
            defaultPaperType={activeTab} 
            editMode={isEditMode}
            examToEdit={isEditMode ? exam : undefined}
          />
        </Tabs>
      </CardContent>
    </Card>
  );
};