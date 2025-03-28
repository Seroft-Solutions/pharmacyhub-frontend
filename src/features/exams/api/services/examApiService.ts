/**
 * Exam API Service
 * 
 * This service provides methods for interacting with the exam API.
 * It's designed for use in non-React environments like Zustand stores.
 */
import { 
  createExtendedApiService, 
  apiClient, 
  ApiResponse 
} from '../../../core/app-api-handler';
import { EXAM_ENDPOINTS } from '../constants';
import type {
  Exam,
  ExamPaper,
  ExamAttempt,
  Question,
  UserAnswer,
  ExamResult,
  FlaggedQuestion,
  ExamStats,
  ExamStatus
} from '../../types';

/**
 * Utility function to ensure IDs are properly converted to long integers
 * This is important because the Java backend expects Long type parameters
 */
const toLongId = (id: number | string): string => {
  // Parse the ID to an integer and convert back to string to ensure valid long format
  return String(parseInt(id.toString()));
};

/**
 * Extended API service for exams
 * This provides a consistent API interface for exam operations
 */
export const examApiService = createExtendedApiService<Exam, {
  // Exam operations
  getAllExams: () => Promise<ApiResponse<Exam[]>>;
  getPublishedExams: () => Promise<ApiResponse<Exam[]>>;
  getExamById: (examId: number) => Promise<ApiResponse<Exam>>;
  getExamsByStatus: (status: ExamStatus) => Promise<ApiResponse<Exam[]>>;
  createExam: (exam: Partial<Exam>) => Promise<ApiResponse<Exam>>;
  updateExam: (examId: number, exam: Partial<Exam>) => Promise<ApiResponse<Exam>>;
  deleteExam: (examId: number) => Promise<ApiResponse<void>>;
  publishExam: (examId: number) => Promise<ApiResponse<Exam>>;
  archiveExam: (examId: number) => Promise<ApiResponse<Exam>>;
  
  // Paper operations
  getAllPapers: () => Promise<ApiResponse<ExamPaper[]>>;
  getModelPapers: () => Promise<ApiResponse<ExamPaper[]>>;
  getPastPapers: () => Promise<ApiResponse<ExamPaper[]>>;
  getSubjectPapers: () => Promise<ApiResponse<ExamPaper[]>>;
  getPracticePapers: () => Promise<ApiResponse<ExamPaper[]>>;
  getPaperById: (id: number) => Promise<ApiResponse<ExamPaper>>;
  
  // Question operations
  getExamQuestions: (examId: number) => Promise<ApiResponse<Question[]>>;
  updateQuestion: (examId: number, questionId: number, question: Partial<Question>) => Promise<ApiResponse<Question>>;
  deleteQuestion: (examId: number, questionId: number) => Promise<ApiResponse<void>>;
  
  // Attempt operations
  getUserExamAttempts: () => Promise<ApiResponse<ExamAttempt[]>>;
  getUserExamAttemptsForExam: (examId: number) => Promise<ApiResponse<ExamAttempt[]>>;
  getExamAttempt: (attemptId: number) => Promise<ApiResponse<ExamAttempt>>;
  getExamResult: (attemptId: number) => Promise<ApiResponse<ExamResult>>;
  getFlaggedQuestions: (attemptId: number) => Promise<ApiResponse<FlaggedQuestion[]>>;
  
  // Exam participation operations
  startExam: (examId: number) => Promise<ApiResponse<ExamAttempt>>;
  answerQuestion: (attemptId: number, questionId: number, selectedOption: number) => Promise<ApiResponse<void>>;
  flagQuestion: (attemptId: number, questionId: number) => Promise<ApiResponse<void>>;
  unflagQuestion: (attemptId: number, questionId: number) => Promise<ApiResponse<void>>;
  submitExam: (attemptId: number, answers?: UserAnswer[]) => Promise<ApiResponse<ExamResult>>;
  
  // Statistics
  getExamStats: () => Promise<ApiResponse<ExamStats>>;
  
  // File operations
  uploadJson: (data: any) => Promise<ApiResponse<Exam>>;
}>(
  EXAM_ENDPOINTS.list,
  {
    // Exam operations
    getAllExams: async () => {
      return await apiClient.get<Exam[]>(EXAM_ENDPOINTS.list);
    },
    
    getPublishedExams: async () => {
      return await apiClient.get<Exam[]>(EXAM_ENDPOINTS.published);
    },
    
    getExamById: async (examId) => {
      return await apiClient.get<Exam>(EXAM_ENDPOINTS.detail.replace(':id', toLongId(examId)));
    },
    
    getExamsByStatus: async (status) => {
      return await apiClient.get<Exam[]>(EXAM_ENDPOINTS.byStatus.replace(':status', status.toString()));
    },
    
    createExam: async (exam) => {
      return await apiClient.post<Exam>(EXAM_ENDPOINTS.create, exam);
    },
    
    updateExam: async (examId, exam) => {
      return await apiClient.put<Exam>(EXAM_ENDPOINTS.update.replace(':id', toLongId(examId)), exam);
    },
    
    deleteExam: async (examId) => {
      return await apiClient.delete<void>(EXAM_ENDPOINTS.delete.replace(':id', toLongId(examId)));
    },
    
    publishExam: async (examId) => {
      return await apiClient.post<Exam>(EXAM_ENDPOINTS.publishExam.replace(':id', toLongId(examId)));
    },
    
    archiveExam: async (examId) => {
      return await apiClient.post<Exam>(EXAM_ENDPOINTS.archiveExam.replace(':id', toLongId(examId)));
    },
    
    // Paper operations
    getAllPapers: async () => {
      return await apiClient.get<ExamPaper[]>(EXAM_ENDPOINTS.papers);
    },
    
    getModelPapers: async () => {
      return await apiClient.get<ExamPaper[]>(EXAM_ENDPOINTS.modelPapers);
    },
    
    getPastPapers: async () => {
      return await apiClient.get<ExamPaper[]>(EXAM_ENDPOINTS.pastPapers);
    },
    
    getSubjectPapers: async () => {
      return await apiClient.get<ExamPaper[]>(EXAM_ENDPOINTS.subjectPapers);
    },
    
    getPracticePapers: async () => {
      return await apiClient.get<ExamPaper[]>(EXAM_ENDPOINTS.practicePapers);
    },
    
    getPaperById: async (id) => {
      return await apiClient.get<ExamPaper>(EXAM_ENDPOINTS.paperDetail.replace(':id', toLongId(id)));
    },
    
    // Question operations
    getExamQuestions: async (examId) => {
      return await apiClient.get<Question[]>(EXAM_ENDPOINTS.questions.replace(':examId', toLongId(examId)));
    },
    
    updateQuestion: async (examId, questionId, question) => {
      return await apiClient.put<Question>(
        EXAM_ENDPOINTS.updateQuestion
          .replace(':examId', toLongId(examId))
          .replace(':questionId', toLongId(questionId)),
        question
      );
    },
    
    deleteQuestion: async (examId, questionId) => {
      return await apiClient.delete<void>(
        EXAM_ENDPOINTS.deleteQuestion
          .replace(':examId', toLongId(examId))
          .replace(':questionId', toLongId(questionId))
      );
    },
    
    // Attempt operations
    getUserExamAttempts: async () => {
      return await apiClient.get<ExamAttempt[]>(EXAM_ENDPOINTS.userAttempts);
    },
    
    getUserExamAttemptsForExam: async (examId) => {
      return await apiClient.get<ExamAttempt[]>(EXAM_ENDPOINTS.attemptsByExam.replace(':id', toLongId(examId)));
    },
    
    getExamAttempt: async (attemptId) => {
      return await apiClient.get<ExamAttempt>(EXAM_ENDPOINTS.attemptDetail.replace(':id', toLongId(attemptId)));
    },
    
    getExamResult: async (attemptId) => {
      return await apiClient.get<ExamResult>(EXAM_ENDPOINTS.attemptResult.replace(':id', toLongId(attemptId)));
    },
    
    getFlaggedQuestions: async (attemptId) => {
      return await apiClient.get<FlaggedQuestion[]>(EXAM_ENDPOINTS.flaggedQuestions.replace(':id', toLongId(attemptId)));
    },
    
    // Exam participation operations
    startExam: async (examId) => {
      return await apiClient.post<ExamAttempt>(EXAM_ENDPOINTS.startExam.replace(':id', toLongId(examId)));
    },
    
    answerQuestion: async (attemptId, questionId, selectedOption) => {
      return await apiClient.post<void>(
        EXAM_ENDPOINTS.answerQuestion
          .replace(':attemptId', toLongId(attemptId))
          .replace(':questionId', toLongId(questionId)),
        { selectedOption }
      );
    },
    
    flagQuestion: async (attemptId, questionId) => {
      return await apiClient.post<void>(
        EXAM_ENDPOINTS.flagQuestion
          .replace(':attemptId', toLongId(attemptId))
          .replace(':questionId', toLongId(questionId))
      );
    },
    
    unflagQuestion: async (attemptId, questionId) => {
      return await apiClient.delete<void>(
        EXAM_ENDPOINTS.unflagQuestion
          .replace(':attemptId', toLongId(attemptId))
          .replace(':questionId', toLongId(questionId))
      );
    },
    
    submitExam: async (attemptId, answers) => {
      return await apiClient.post<ExamResult>(
        EXAM_ENDPOINTS.submitExam.replace(':id', toLongId(attemptId)),
        answers ? { answers } : undefined
      );
    },
    
    // Statistics
    getExamStats: async () => {
      return await apiClient.get<ExamStats>(EXAM_ENDPOINTS.examStats);
    },
    
    // File operations
    uploadJson: async (data) => {
      return await apiClient.post<Exam>(EXAM_ENDPOINTS.uploadJson, data);
    }
  }
);

export default examApiService;
