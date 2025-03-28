"use client"

import React, { useState } from 'react';
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
  ListTodoIcon,
  Trash2Icon,
  Settings2Icon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ExamStatusBadge } from './ExamStatusBadge';
import { ExamMetadata } from './ExamMetadata';
import { Exam, PaperType, ExamStatus } from '../../types';
import { ExamOperationGuard } from '../guards/ExamGuard';
import { ExamOperation } from '../../hooks/useExamFeatureAccess';
import { getPaperTypeLabel } from '../../utils/paperTypeUtils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useApiMutation } from '../../../core/app-api-handler';
import { useQueryClient } from '@tanstack/react-query';

interface ExamsTableProps {
  exams: Exam[];
  canEditExams: boolean;
}

/**
 * Component for displaying a table of exams
 */
export const ExamsTable: React.FC<ExamsTableProps> = ({ exams, canEditExams }) => {
  const router = useRouter();
  const [examToDelete, setExamToDelete] = useState<Exam | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const queryClient = useQueryClient();
  
  // Create mutations
  const { mutate: deleteExam, isPending: deleteInProgress } = useApiMutation<any, any>(
    (examId) => `/api/v1/exams/${examId}`,
    {
      method: 'DELETE',
      requiresAuth: true,
      onSuccess: () => {
        // Invalidate exams queries
        queryClient.invalidateQueries({ queryKey: ['exams'] });
        setIsDeleteDialogOpen(false);
        setExamToDelete(null);
      },
      onError: (error) => {
        console.error('Failed to delete exam:', error);
      }
    }
  );
  
  const { mutate: updateExamStatus, isPending: patchInProgress } = useApiMutation<any, any>(
    (examId) => `/api/v1/exams/${examId}`,
    {
      method: 'PATCH',
      requiresAuth: true,
      onSuccess: () => {
        // Invalidate exams queries
        queryClient.invalidateQueries({ queryKey: ['exams'] });
      },
      onError: (error) => {
        console.error('Failed to update exam status:', error);
      }
    }
  );

  // Handle navigating to questions editor
  const handleEditQuestions = (examId: number) => {
    if (canEditExams) {
      router.push(`/admin/exams/${examId}/questions`);
    }
  };
  
  // Handle navigating to metadata editor
  const handleEditMetadata = (examId: number) => {
    if (canEditExams) {
      router.push(`/admin/exams/${examId}/edit`);
    }
  };
  
  // Handle delete button click
  const handleDeleteClick = (exam: Exam) => {
    setExamToDelete(exam);
    setIsDeleteDialogOpen(true);
  };
  
  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    if (!examToDelete || !examToDelete.id) return;
    deleteExam(examToDelete.id);
  };
  
  // Handle delete cancel
  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setExamToDelete(null);
  };
  
  // Handle status change
  const handleStatusChange = (exam: Exam, newStatus: ExamStatus) => {
    // Only proceed if status is actually changing and id exists
    if (exam.status === newStatus || !exam.id) return;
    
    // Call the mutation with exam ID and status data
    updateExamStatus({
      id: exam.id,
      data: { status: newStatus }
    });
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
    <>
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
              
              // Ensure we have the question count - if it's a number, use that,
              // if it's an array, use the length, or default to 0
              let questionCount = 0;
              if (exam.questions) {
                if (Array.isArray(exam.questions)) {
                  questionCount = exam.questions.length;
                } else if (typeof exam.questions === 'number') {
                  questionCount = exam.questions;
                }
              }
              
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
                  <TableCell>{questionCount}</TableCell>
                  <TableCell>{exam.duration} min</TableCell>
                  <TableCell>
                    <ExamOperationGuard operation={ExamOperation.EDIT}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 px-2">
                            <ExamStatusBadge status={exam.status} className="cursor-pointer" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleStatusChange(exam, 'DRAFT')}
                            className={exam.status === 'DRAFT' ? 'bg-primary/10' : ''}
                          >
                            <ExamStatusBadge status="DRAFT" className="cursor-pointer" />
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleStatusChange(exam, 'PUBLISHED')}
                            className={exam.status === 'PUBLISHED' ? 'bg-primary/10' : ''}
                          >
                            <ExamStatusBadge status="PUBLISHED" className="cursor-pointer" />
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleStatusChange(exam, 'ARCHIVED')}
                            className={exam.status === 'ARCHIVED' ? 'bg-primary/10' : ''}
                          >
                            <ExamStatusBadge status="ARCHIVED" className="cursor-pointer" />
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </ExamOperationGuard>
                    
                    {/* For users without edit permissions, just show the badge */}
                    <ExamOperationGuard 
                      operation={ExamOperation.EDIT} 
                      fallback={<ExamStatusBadge status={exam.status} />}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <ExamOperationGuard operation={ExamOperation.EDIT}>
                      <div className="flex justify-end space-x-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditQuestions(exam.id)}
                                className="h-8 px-2"
                              >
                                <EditIcon className="h-4 w-4 mr-1"/>
                                <span className="hidden sm:inline">Questions</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Edit exam questions</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditMetadata(exam.id)}
                                className="h-8 px-2"
                              >
                                <Settings2Icon className="h-4 w-4 mr-1"/>
                                <span className="hidden sm:inline">Metadata</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Edit exam metadata</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteClick(exam)}
                                className="h-8 px-2 text-destructive hover:text-destructive hover:border-destructive"
                              >
                                <Trash2Icon className="h-4 w-4 mr-1"/>
                                <span className="hidden sm:inline">Delete</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Delete this exam</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </ExamOperationGuard>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog 
        open={isDeleteDialogOpen} 
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Exam</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{examToDelete?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteCancel} disabled={deleteInProgress}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm} 
              className="bg-destructive hover:bg-destructive/90"
              disabled={deleteInProgress}
            >
              {deleteInProgress ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};