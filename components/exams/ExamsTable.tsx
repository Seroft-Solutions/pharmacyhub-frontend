"use client"

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  BookOpenIcon, 
  CalendarIcon, 
  EditIcon, 
  FileTextIcon, 
  GraduationCapIcon, 
  ListTodoIcon 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ExamStatusBadge } from './ExamStatusBadge';
import { ExamMetadata } from './ExamMetadata';
import { Exam, PaperType } from '../../types';
import { ExamOperationGuard, ExamOperation } from '../../ui/guards/ExamGuard';
import { getPaperTypeLabel } from '../../utils/paperTypeUtils';

interface ExamsTableProps {
  exams: Exam[];
  canEditExams: boolean;
}

/**
 * Component for displaying a table of exams
 */
export const ExamsTable: React.FC<ExamsTableProps> = ({ exams, canEditExams }) => {
  const router = useRouter();

  // Handle exam view/edit
  const handleEditExam = (examId: number) => {
    if (canEditExams) {
      router.push(`/admin/exams/${examId}/questions`);
    }
  };

  // Function to safely truncate text
  const truncateText = (text?: string, maxLength: number = 60) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Get paper type icon
  const getPaperTypeIcon = (paperType?: string) => {
    if (!paperType) {
      return <FileTextIcon className="h-4 w-4" />;
    }
    
    switch (paperType) {
      case PaperType.PRACTICE:
        return <ListTodoIcon className="h-4 w-4" />;
      case PaperType.MODEL:
        return <BookOpenIcon className="h-4 w-4" />;
      case PaperType.PAST:
        return <CalendarIcon className="h-4 w-4" />;
      case PaperType.SUBJECT:
        return <GraduationCapIcon className="h-4 w-4" />;
      default:
        return <FileTextIcon className="h-4 w-4" />;
    }
  };

  if (exams.length === 0) {
    return (
      <div className="text-center py-8">
        <FileTextIcon className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4"/>
        <h3 className="text-lg font-medium mb-2">No exams found</h3>
        <p className="text-muted-foreground mb-4">
          No exams match your search criteria or are available in this category.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Metadata</TableHead>
            <TableHead>Questions</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {exams.map(exam => {
            // Get paper type
            const paperType = exam?.tags?.find(tag =>
              tag && ['MODEL', 'PAST', 'SUBJECT', 'PRACTICE'].includes(tag.toUpperCase())
            ) || PaperType.PRACTICE;
            
            // Get paper type icon
            const paperTypeIcon = getPaperTypeIcon(paperType);
            
            return (
              <TableRow key={exam.id}>
                <TableCell className="font-medium">{exam.title}</TableCell>
                <TableCell>{truncateText(exam.description)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {paperTypeIcon}
                    <span className="ml-1">{getPaperTypeLabel(paperType)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <ExamMetadata exam={exam} />
                </TableCell>
                <TableCell>{exam.questions?.length || 0}</TableCell>
                <TableCell>{exam.duration} min</TableCell>
                <TableCell><ExamStatusBadge status={exam.status} /></TableCell>
                <TableCell className="text-right">
                  <ExamOperationGuard operation={ExamOperation.EDIT}>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditExam(exam.id)}
                            className="h-8 px-2"
                          >
                            <EditIcon className="h-4 w-4 mr-1"/>
                            <span className="hidden sm:inline">Edit</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit questions and metadata</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </ExamOperationGuard>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
