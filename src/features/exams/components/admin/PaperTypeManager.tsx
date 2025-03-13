"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpenIcon, CalendarIcon, GraduationCapIcon, ListTodoIcon } from 'lucide-react';
import { PaperType } from '../../types/StandardTypes';
import { getPaperTypeDescription } from '../../utils/paperTypeUtils';
import JsonExamUploader from './JsonExamUploader';

/**
 * Component for managing different paper types
 */
const PaperTypeManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>(PaperType.PRACTICE);

  return (
    <Card className="shadow-md">
      <CardHeader className="bg-primary-50 dark:bg-primary-950/50">
        <CardTitle className="text-xl">Paper Type Management</CardTitle>
        <CardDescription>
          Upload and manage different types of exam papers while maintaining consistent MCQ structure.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6">
        <Tabs defaultValue={PaperType.PRACTICE} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value={PaperType.PRACTICE} className="flex items-center gap-2">
              <ListTodoIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Practice</span>
            </TabsTrigger>
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
              {activeTab === PaperType.PRACTICE && 'Practice Papers'}
              {activeTab === PaperType.MODEL && 'Model Papers'}
              {activeTab === PaperType.PAST && 'Past Papers'}
              {activeTab === PaperType.SUBJECT && 'Subject Papers'}
            </h3>
            <p className="text-muted-foreground">
              {getPaperTypeDescription(activeTab)}
            </p>
          </div>

          {/* Use one instance of JsonExamUploader for all tabs with the active tab setting the default paper type */}
          <JsonExamUploader defaultPaperType={activeTab} />
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PaperTypeManager;