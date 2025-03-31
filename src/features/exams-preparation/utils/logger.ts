/**
 * Exam Logger
 * 
 * This module provides exam-specific logging functionality built on top of the core logger.
 * It adds context-specific metadata and logging methods for exam-related events.
 */
import coreLogger from '@/core/utils/logger';

// Exam-specific logger
const examLogger = {
  // Core logger methods
  error: (message: string, meta?: any) => {
    coreLogger.error(`[Exams] ${message}`, meta);
  },
  
  warn: (message: string, meta?: any) => {
    coreLogger.warn(`[Exams] ${message}`, meta);
  },
  
  info: (message: string, meta?: any) => {
    coreLogger.info(`[Exams] ${message}`, meta);
  },
  
  debug: (message: string, meta?: any) => {
    coreLogger.debug(`[Exams] ${message}`, meta);
  },
  
  trace: (message: string, meta?: any) => {
    coreLogger.trace(`[Exams] ${message}`, meta);
  },
  
  // Exam-specific logging methods
  examStarted: (examId: number, userId?: string) => {
    coreLogger.info(`[Exams] User started exam`, { examId, userId, action: 'exam_started' });
  },
  
  examCompleted: (examId: number, score: number, userId?: string) => {
    coreLogger.info(`[Exams] User completed exam`, { 
      examId, 
      userId, 
      score,
      action: 'exam_completed' 
    });
  },
  
  questionAnswered: (examId: number, questionId: number, isCorrect: boolean, userId?: string) => {
    coreLogger.debug(`[Exams] User answered question`, { 
      examId, 
      questionId, 
      isCorrect,
      userId,
      action: 'question_answered' 
    });
  },
  
  examTimerWarning: (examId: number, remainingTime: number, userId?: string) => {
    coreLogger.warn(`[Exams] Exam timer running low`, { 
      examId, 
      userId, 
      remainingTime,
      action: 'exam_timer_warning' 
    });
  },
  
  examApiError: (endpoint: string, error: any) => {
    coreLogger.error(`[Exams] API Error`, { 
      endpoint, 
      error: error?.message || error,
      action: 'exam_api_error' 
    });
  }
};

export default examLogger;
