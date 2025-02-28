// src/features/exams/api/examService.ts
import { createApiService } from '@/shared/api/apiFactory';
import { 
  Exam, 
  ExamAttempt, 
  UserAnswer, 
  ExamResult,
  FlaggedQuestion,
  ExamStats
} from '../model/mcqTypes';

// Create API service for exams feature
const examApiService = createApiService<Exam>('/api/v1/exams', {
  requiresAuth: true,
  errorHandler: (error) => {
    // Custom error handling for exam-specific errors
    if (error instanceof Error) {
      if (error.message.includes('401')) {
        return new Error('Your session has expired. Please log in again to continue.');
      }
      if (error.message.includes('403')) {
        return new Error('You do not have permission to access this exam.');
      }
    }
    return error instanceof Error ? error : new Error(String(error));
  },
});

export const examApi = {
  // Core exam endpoints
  getAllExams: () => examApiService.get<Exam[]>(''),
  
  getPublishedExams: () => examApiService.get<Exam[]>('/published', {
    requiresAuth: false // Override to allow public access
  }),
  
  getExamsByStatus: (status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED') => 
    examApiService.get<Exam[]>(`/status/${status}`),
  
  getExamById: (examId: number) => examApiService.get<Exam>(`/${examId}`),
  
  // Questions
  getExamQuestions: (examId: number) => examApiService.get<Question[]>(`/${examId}/questions`),
  
  // Exam attempts
  startExam: (examId: number, userId: string) => 
    examApiService.post<ExamAttempt>(`/${examId}/start`, { userId }),
  
  saveAnswer: (attemptId: number, answer: UserAnswer) => 
    examApiService.post<ExamAttempt>(`/attempts/${attemptId}/answers`, answer),
  
  submitExam: (attemptId: number, answers: UserAnswer[]) => 
    examApiService.post<ExamResult>(`/attempts/${attemptId}/submit`, { answers }),
  
  // Results
  getExamResult: (attemptId: number) => 
    examApiService.get<ExamResult>(`/attempts/${attemptId}/result`),
  
  getUserAttempts: (userId: string) => 
    examApiService.get<ExamAttempt[]>(`/attempts/user/${userId}`),
  
  getExamAttemptsByUser: (examId: number, userId: string) => 
    examApiService.get<ExamAttempt[]>(`/${examId}/attempts?userId=${userId}`),
  
  // Flagging
  flagQuestion: (attemptId: number, questionId: number) => 
    examApiService.post<ExamAttempt>(`/attempts/${attemptId}/flag/${questionId}`),
  
  unflagQuestion: (attemptId: number, questionId: number) => 
    examApiService.delete<ExamAttempt>(`/attempts/${attemptId}/flag/${questionId}`),
  
  getFlaggedQuestions: (attemptId: number) => 
    examApiService.get<FlaggedQuestion[]>(`/attempts/${attemptId}/flags`),
  
  // Statistics
  getExamStats: () => examApiService.get<ExamStats>('/stats')
};

// Export both the raw service and the configured API
export { examApiService };
export default examApi;
