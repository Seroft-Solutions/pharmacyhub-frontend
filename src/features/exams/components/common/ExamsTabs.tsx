"use client"

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpenIcon, 
  CalendarIcon, 
  FileTextIcon, 
  GraduationCapIcon, 
  ListTodoIcon 
} from 'lucide-react';
import { PaperType } from '../../types';

interface ExamsTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  renderContent: (tab: string) => React.ReactNode;
  countByType: (type: string) => number;
}

/**
 * Component for displaying exam type tabs
 */
export const ExamsTabs: React.FC<ExamsTabsProps> = ({ 
  activeTab, 
  onTabChange, 
  renderContent,
  countByType
}) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange}>
      <TabsList className="mb-6">
        <TabsTrigger value="all" className="flex items-center gap-2">
          <FileTextIcon className="h-4 w-4" />
          <span>All</span>
          <Badge variant="secondary" className="ml-1">
            {countByType('all')}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value={PaperType.PRACTICE} className="flex items-center gap-2">
          <ListTodoIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Practice</span>
          <Badge variant="secondary" className="ml-1">
            {countByType(PaperType.PRACTICE)}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value={PaperType.MODEL} className="flex items-center gap-2">
          <BookOpenIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Model</span>
          <Badge variant="secondary" className="ml-1">
            {countByType(PaperType.MODEL)}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value={PaperType.PAST} className="flex items-center gap-2">
          <CalendarIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Past</span>
          <Badge variant="secondary" className="ml-1">
            {countByType(PaperType.PAST)}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value={PaperType.SUBJECT} className="flex items-center gap-2">
          <GraduationCapIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Subject</span>
          <Badge variant="secondary" className="ml-1">
            {countByType(PaperType.SUBJECT)}
          </Badge>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="all">
        {renderContent("all")}
      </TabsContent>

      <TabsContent value={PaperType.PRACTICE}>
        {renderContent(PaperType.PRACTICE)}
      </TabsContent>

      <TabsContent value={PaperType.MODEL}>
        {renderContent(PaperType.MODEL)}
      </TabsContent>

      <TabsContent value={PaperType.PAST}>
        {renderContent(PaperType.PAST)}
      </TabsContent>

      <TabsContent value={PaperType.SUBJECT}>
        {renderContent(PaperType.SUBJECT)}
      </TabsContent>
    </Tabs>
  );
};
