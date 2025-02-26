import { Exam, ExamStatus, ExamAttempt, UserAnswer, ExamResult } from '../model/mcqTypes';
import { logger } from '@/shared/lib/logger';
import { adaptBackendExam, BackendExam } from './adapter';

const API_URL = '/api/exams';

// Use browser-friendly fetch instead of axios to avoid Node.js dependencies
export const examService = {
  // Get all exams
  async getAllExams(): Promise<Exam[]> {
    try {
      logger.info('Fetching all exams');
      
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const backendExams: BackendExam[] = await response.json();
      const exams = backendExams.map(adaptBackendExam);
      
      return exams;
    } catch (error) {
      logger.error('Failed to fetch all exams', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  },

  // Get published exams only
  async getPublishedExams(): Promise<Exam[]> {
    try {
      logger.info('Fetching published exams');
      
      const response = await fetch(`${API_URL}/published`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const backendExams: BackendExam[] = await response.json();
      const exams = backendExams.map(adaptBackendExam);
      
      return exams;
    } catch (error) {
      logger.error('Failed to fetch published exams', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  },

  // Get exam by ID
  async getExamById(id: number): Promise<Exam> {
    try {
      logger.info('Fetching exam by ID', { examId: id });
      
      const response = await fetch(`${API_URL}/${id}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const backendExam: BackendExam = await response.json();
      const exam = adaptBackendExam(backendExam);
      
      return exam;
    } catch (error) {
      logger.error(`Failed to fetch exam with ID ${id}`, {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  },

  // Start an exam attempt
  async startExam(examId: number): Promise<ExamAttempt> {
    try {
      logger.info('Starting exam attempt', { examId });
      
      const response = await fetch(`${API_URL}/${examId}/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      logger.error(`Failed to start exam with ID ${examId}`, {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  },

  // Submit an exam attempt
  async submitExam(attemptId: number, answers: UserAnswer[]): Promise<ExamResult> {
    try {
      logger.info('Submitting exam attempt', { attemptId, answersCount: answers.length });
      
      const response = await fetch(`${API_URL}/attempts/${attemptId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers })
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      logger.error(`Failed to submit exam attempt`, {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  },

  // Get exams by status
  async getExamsByStatus(status: ExamStatus): Promise<Exam[]> {
    try {
      logger.info('Fetching exams by status', { status });
      
      const response = await fetch(`${API_URL}/status/${status}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const backendExams: BackendExam[] = await response.json();
      const exams = backendExams.map(adaptBackendExam);
      
      return exams;
    } catch (error) {
      logger.error(`Failed to fetch exams with status ${status}`, {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }
};
