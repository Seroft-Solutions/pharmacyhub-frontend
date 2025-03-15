"use client"

import React, { useState, useEffect } from 'react';
import { useExamFeatureAccess, ExamOperation } from '../../hooks/useExamFeatureAccess';
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
  Trash2, 
  AlertCircle, 
  CheckCircle, 
  FileText,
  Search
} from 'lucide-react';
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
import { Exam, Question } from '../../types/StandardTypes';
import { examStoreAdapter } from '../../api/services/examStoreAdapter';
import { McqEditor } from './McqEditor';
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
export const ExamQuestions: React.FC<ExamQuestionsProps> = ({ examId }) => {
  const router = useRouter();
  const { canManageQuestions } = useExamFeatureAccess();
  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<Question | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
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
        
        // Log process to debug
        console.log(`Fetching exam with ID ${examId}...`);
        
        // Always use the actual API call to get real data
        const examData = await examStoreAdapter.getExamById(examId);
        
        if (!examData) {
          throw new Error('No exam data returned from API');
        }
        
        console.log('Raw exam data from API:', examData);
        
        // Transform the API response to match expected frontend structure
        const transformedExam = transformExamData(examData);
        
        console.log('Transformed exam data:', transformedExam);
        setExam(transformedExam);
      } catch (err) {
        console.error('Error fetching exam:', err);
        setError(`Failed to load exam: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchExam();
  }, [examId]);
  
  // Transform exam data from API format to frontend format
  const transformExamData = (examData: any): Exam => {
    // Create a deep copy of the exam data
    // Check if the data is nested in a 'data' property
    const dataToTransform = examData.data ? examData.data : examData;
    
    console.log('Data to transform:', dataToTransform);
    
    const transformedExam = { ...dataToTransform };
    
    // Handle array of questions directly (for getExamQuestions API)
    if (Array.isArray(dataToTransform)) {
      console.log('Handling array of questions directly');
      return {
        id: examId,
        title: 'Exam Questions',
        description: '',
        status: 'PUBLISHED',
        duration: 0,
        totalMarks: 0,
        passingMarks: 0,
        questions: dataToTransform.map(transformQuestion)
      } as Exam;
    }
    
    // Check if questions array exists
    if (dataToTransform.questions && Array.isArray(dataToTransform.questions)) {
      console.log(`Found ${dataToTransform.questions.length} questions in exam data`);
      transformedExam.questions = dataToTransform.questions.map(transformQuestion);
    } else if (dataToTransform.q && Array.isArray(dataToTransform.q)) {
      // Some APIs might use 'q' as shorthand for questions
      console.log(`Found ${dataToTransform.q.length} questions under 'q' property`);
      transformedExam.questions = dataToTransform.q.map(transformQuestion);
    } else {
      // Ensure questions property exists even if empty
      console.log('No questions found in exam data, using empty array');
      transformedExam.questions = [];
    }
    
    return transformedExam as Exam;
  };
  
  // Helper function to transform a single question
  const transformQuestion = (question: any): Question => {
    console.log('Transforming question:', question);
    
    const transformedQuestion: Question = {
      id: question.id,
      questionNumber: question.questionNumber || 0,
      // Map questionText to text or use existing text property
      text: question.questionText || question.text || '',
      // Default empty array if options don't exist
      options: [],
      // Map other properties
      correctAnswer: question.correctAnswer || '',
      explanation: question.explanation || '',
      marks: question.marks || question.points || 0
    };
    
    // Transform options if they exist
    if (question.options && Array.isArray(question.options)) {
      transformedQuestion.options = question.options.map((option: any) => ({
        id: option.id,
        // Map optionKey to label or use existing label property
        label: option.optionKey || option.label || '',
        // Map optionText to text or use existing text property
        text: option.optionText || option.text || '',
        isCorrect: option.isCorrect || false
      }));
    }
    
    return transformedQuestion;
  };

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
    if (!canManageQuestions) {
      setError('You do not have permission to edit questions');
      return;
    }
    setEditingQuestion(question);
    setIsEditorOpen(true);
  };

  // Handle question delete button click
  const handleDeleteQuestion = (question: Question) => {
    // Check if the user has permission to manage questions
    if (!canManageQuestions) {
      setError('You do not have permission to delete questions');
      return;
    }
    setQuestionToDelete(question);
    setIsDeleteDialogOpen(true);
  };

  // Handle editor close
  const handleEditorClose = () => {
    setIsEditorOpen(false);
    setEditingQuestion(null);
  };
  
  // Handle delete confirmation
  const handleConfirmDelete = async () => {
    if (!questionToDelete || !exam) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Call the API to delete the question
      await examStoreAdapter.deleteQuestion(examId, questionToDelete.id);
      
      // Update the questions in the local state
      const updatedQuestions = exam.questions?.filter(q => q.id !== questionToDelete.id) || [];
      
      // Create updated exam object
      const updatedExam = {
        ...exam,
        questions: updatedQuestions
      };
      
      // Update local state
      setExam(transformExamData(updatedExam));
      setSuccess(`Question #${questionToDelete.questionNumber} deleted successfully`);
      
      // Close the dialog
      setIsDeleteDialogOpen(false);
      setQuestionToDelete(null);
      
      // Reset to first page if current page is now empty
      const filteredQuestions = searchTerm 
        ? updatedQuestions.filter(q => 
            q.text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            q.options?.some(o => o.text?.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (q.explanation && q.explanation.toLowerCase().includes(searchTerm.toLowerCase()))
          )
        : updatedQuestions;
      
      const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);
      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
      }
      
      // Clear success message after a few seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      console.error('Error deleting question:', err);
      setError(`Failed to delete question: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle delete cancel
  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setQuestionToDelete(null);
  };

  // Handle question save
  const handleSaveQuestion = async (editedQuestion: Question) => {
    // Check if the user has permission to manage questions
    if (!canManageQuestions) {
      setError('You do not have permission to edit questions');
      throw new Error('Permission denied');
    }
    try {
      if (!exam) return;
      
      // Call the API to update the question
      await examStoreAdapter.updateQuestion(examId, editedQuestion.id, editedQuestion);
      
      // Update the question in the local state
      const updatedQuestions = exam.questions?.map(q => 
        q.id === editedQuestion.id ? editedQuestion : q
      ) || [];
      
      // Create updated exam object
      const updatedExam = {
        ...exam,
        questions: updatedQuestions
      };
      
      // Update local state with transformed data
      setExam(transformExamData(updatedExam));
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
          
          {/* Debug info in development mode */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mb-4 p-3 border border-yellow-300 bg-yellow-50 rounded-md">
              <details>
                <summary className="font-medium cursor-pointer">API Debug Info</summary>
                <div className="mt-2 text-xs overflow-auto max-h-40 p-2 bg-slate-100 rounded">
                  <p>Exam ID: {examId}</p>
                  <p>Questions Count: {exam.questions?.length || 0}</p>
                  <pre>{JSON.stringify({exam}, null, 2)}</pre>
                </div>
              </details>
            </div>
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
                            {canManageQuestions && (
                              <div className="flex space-x-1">
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
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteQuestion(question)}
                                  className="h-8 w-8 p-0 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                                  title="Delete question"
                                >
                                  <Trash2 className="h-4 w-4"/>
                                  <span className="sr-only">Delete</span>
                                </Button>
                              </div>
                            )}
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
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete question #{questionToDelete?.questionNumber}. 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDelete}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
