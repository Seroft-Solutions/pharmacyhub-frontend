"use client"

import React, { useState, useEffect } from 'react';
import { PermissionGuard, AnyPermissionGuard } from '@/features/rbac/ui';
import { ExamPermission } from '@/features/exams/constants/permissions';
import { useExamPermissions } from '@/features/exams/hooks/useExamPermissions';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  ArrowLeft, 
  Edit, 
  AlertCircle, 
  CheckCircle, 
  FileText,
  Search
} from 'lucide-react';
import { Exam, Question } from '../../types/StandardTypes';
import { examServiceAdapter } from '../../api/adapter';
import McqEditor from './McqEditor';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from '@/components/ui/input';

interface ExamQuestionsProps {
  examId: number;
}

/**
 * Component for managing exam questions
 * Requires both exams:edit and exams:manage-questions permissions
 */
const ExamQuestions: React.FC<ExamQuestionsProps> = ({ examId }) => {
  const router = useRouter();
  const { hasPermission } = useExamPermissions();
  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [questionsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch exam data
  useEffect(() => {
    const fetchExam = async () => {
      try {
        setLoading(true);
        setError(null);
        const examData = await examServiceAdapter.getExamById(examId);
        setExam(examData);
      } catch (err) {
        console.error('Error fetching exam:', err);
        setError(`Failed to load exam: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchExam();
  }, [examId]);

  // Get current questions (with filtering and pagination)
  const getCurrentQuestions = () => {
    if (!exam?.questions) return [];
    
    // Filter questions based on search term
    const filteredQuestions = searchTerm 
      ? exam.questions.filter(q => 
          q.text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.options?.some(o => o.text?.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (q.explanation && q.explanation.toLowerCase().includes(searchTerm.toLowerCase()))
        )
      : exam.questions;
    
    // Paginate filtered questions
    const indexOfLastQuestion = currentPage * questionsPerPage;
    const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
    
    return filteredQuestions.slice(indexOfFirstQuestion, indexOfLastQuestion);
  };

  // Calculate total pages
  const getTotalPages = () => {
    if (!exam?.questions) return 0;
    
    const filteredQuestions = searchTerm 
      ? exam.questions.filter(q => 
          q.text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.options?.some(o => o.text?.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (q.explanation && q.explanation.toLowerCase().includes(searchTerm.toLowerCase()))
        )
      : exam.questions;
    
    return Math.ceil(filteredQuestions.length / questionsPerPage);
  };

  // Handle question edit button click
  const handleEditQuestion = (question: Question) => {
    // Check if the user has permission to manage questions
    if (!hasPermission(ExamPermission.MANAGE_QUESTIONS)) {
      setError('You do not have permission to edit questions');
      return;
    }
    setEditingQuestion(question);
    setIsEditorOpen(true);
  };

  // Handle editor close
  const handleEditorClose = () => {
    setIsEditorOpen(false);
    setEditingQuestion(null);
  };

  // Handle question save
  const handleSaveQuestion = async (editedQuestion: Question) => {
    // Check if the user has permission to manage questions
    if (!hasPermission(ExamPermission.MANAGE_QUESTIONS)) {
      setError('You do not have permission to edit questions');
      throw new Error('Permission denied');
    }
    try {
      if (!exam) return;
      
      // Call the API to update the question
      await examServiceAdapter.updateQuestion(examId, editedQuestion.id, editedQuestion);
      
      // Update the question in the local state
      const updatedQuestions = exam.questions?.map(q => 
        q.id === editedQuestion.id ? editedQuestion : q
      ) || [];
      
      // Create updated exam object
      const updatedExam = {
        ...exam,
        questions: updatedQuestions
      };
      
      // Update local state
      setExam(updatedExam);
      setSuccess(`Question #${editedQuestion.questionNumber} updated successfully`);
      
      // Clear success message after a few seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
      
      return;
    } catch (err) {
      console.error('Error saving question:', err);
      setError(`Failed to save question: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw err;
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  // Handle back button click
  const handleBack = () => {
    router.push('/admin/exams/manage');
  };

  // Function to safely truncate text
  const truncateText = (text?: string, maxLength: number = 80) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
    <AnyPermissionGuard
      permissions={[ExamPermission.EDIT_EXAM, ExamPermission.MANAGE_QUESTIONS]}
      fallback={
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You need permission to edit exams or manage questions to access this page.
          </AlertDescription>
        </Alert>
      }
    >
      <Card>
        <CardContent className="p-8">
          <div className="flex justify-center">
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-slate-200 rounded"></div>
                  <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </AnyPermissionGuard>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <div className="mt-4 flex justify-center">
            <Button onClick={handleBack} className="mr-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Exams
            </Button>
            <Button onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!exam) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4"/>
          <h3 className="text-lg font-medium mb-2">Exam not found</h3>
          <p className="text-muted-foreground mb-4">
            The exam you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Exams
          </Button>
        </CardContent>
      </Card>
    );
  }

  const currentQuestions = getCurrentQuestions();
  const totalPages = getTotalPages();

  return (
    <AnyPermissionGuard
      permissions={[ExamPermission.EDIT_EXAM, ExamPermission.MANAGE_QUESTIONS]}
      fallback={
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You need permission to edit exams or manage questions to access this page.
          </AlertDescription>
        </Alert>
      }
    >
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Exams
        </Button>
      </div>

      <Card>
        <CardHeader className="bg-primary-50 dark:bg-primary-950/50">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5"/>
            {exam.title} - Questions
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6">
          {success && (
            <Alert variant="success" className="mb-4">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
          
          {(!exam.questions || exam.questions.length === 0) ? (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4"/>
              <h3 className="text-lg font-medium mb-2">No questions found</h3>
              <p className="text-muted-foreground">
                This exam doesn't have any questions yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Search input */}
              <div className="mb-4 relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search questions..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="pl-10"
                />
              </div>
              
              {/* Questions table */}
              <div className="overflow-x-auto border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">No.</TableHead>
                      <TableHead>Question</TableHead>
                      <TableHead>Correct Answer</TableHead>
                      <TableHead className="w-20 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentQuestions.map((question) => {
                      // Get the correct answer text safely
                      const correctAnswerOption = question.options?.find(o => 
                        o.label === question.correctAnswer
                      );
                      
                      return (
                        <TableRow key={question.id}>
                          <TableCell className="font-medium">{question.questionNumber}</TableCell>
                          <TableCell className="max-w-md">
                            {truncateText(question.text)}
                          </TableCell>
                          <TableCell>
                            {question.correctAnswer ? (
                              <>
                                <span className="font-medium">{question.correctAnswer}:</span>
                                <span className="ml-1">
                                  {truncateText(correctAnswerOption?.text, 40)}
                                </span>
                              </>
                            ) : (
                              <span className="text-muted-foreground italic">Not set</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <PermissionGuard permission={ExamPermission.MANAGE_QUESTIONS}>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditQuestion(question)}
                                className="h-8 w-8 p-0"
                                title="Edit question"
                              >
                                <Edit className="h-4 w-4"/>
                                <span className="sr-only">Edit</span>
                              </Button>
                            </PermissionGuard>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination className="mt-4">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage > 1) handlePageChange(currentPage - 1);
                        }}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(page => (
                        page === 1 || 
                        page === totalPages || 
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ))
                      .map((page, index, array) => {
                        // Add ellipsis
                        if (index > 0 && array[index - 1] !== page - 1) {
                          return (
                            <React.Fragment key={`ellipsis-${page}`}>
                              <PaginationItem>
                                <PaginationEllipsis />
                              </PaginationItem>
                              <PaginationItem>
                                <PaginationLink 
                                  href="#" 
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handlePageChange(page);
                                  }}
                                  isActive={currentPage === page}
                                >
                                  {page}
                                </PaginationLink>
                              </PaginationItem>
                            </React.Fragment>
                          );
                        }
                        
                        return (
                          <PaginationItem key={page}>
                            <PaginationLink 
                              href="#" 
                              onClick={(e) => {
                                e.preventDefault();
                                handlePageChange(page);
                              }}
                              isActive={currentPage === page}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}
                    
                    <PaginationItem>
                      <PaginationNext 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage < totalPages) handlePageChange(currentPage + 1);
                        }}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Question Editor Dialog */}
      <McqEditor
        question={editingQuestion}
        isOpen={isEditorOpen}
        onClose={handleEditorClose}
        onSave={handleSaveQuestion}
      />
    </div>
    </AnyPermissionGuard>
  );
};

export default ExamQuestions;