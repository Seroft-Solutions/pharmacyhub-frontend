/**
 * Data Transformers
 * 
 * This module provides utilities for transforming data between backend and frontend formats.
 * It handles the differences in property names and structure between API responses and
 * what our components expect.
 */

import { Exam, ExamPaper, PaperType, Difficulty, Question, Option } from '../types/StandardTypes';

/**
 * Transforms backend exam data to frontend ExamPaper format
 * 
 * @param data The raw data from the API which could be in various formats
 * @returns An array of ExamPaper objects formatted for the frontend
 */
export function transformExamsToPapers(data: any): ExamPaper[] {
  // Handle the case where response is wrapped in a data property
  const exams = data?.data || data;
  
  // If data is null/undefined or not an array, return empty array
  if (!exams || !Array.isArray(exams)) {
    console.warn('No exams data found or data is not an array', { data });
    return [];
  }
  
  return exams.map(transformExamToPaper);
}

/**
 * Transforms a single exam object to ExamPaper format
 * 
 * @param exam The raw exam data from the API
 * @returns An ExamPaper object formatted for the frontend
 */
export function transformExamToPaper(exam: any): ExamPaper {
  // Default values in case properties are missing
  const defaultType = PaperType.MODEL;
  const defaultDifficulty = Difficulty.MEDIUM;
  
  // Handle the case where some nested property might be null or missing
  const questions = exam.questions || [];
  const tags = exam.tags || [];
  
  return {
    id: exam.id,
    title: exam.title || 'Untitled Paper',
    description: exam.description || '',
    // Map difficulty or use default if missing
    difficulty: exam.difficulty?.toUpperCase() || defaultDifficulty,
    // Use questionCount if available, or questions.length, or 0
    questionCount: exam.questionCount || questions.length || 0,
    // Use durationMinutes if available, or duration, or default to 60
    durationMinutes: exam.durationMinutes || exam.duration || 60,
    // Use tags if available, or default to empty array
    tags: Array.isArray(tags) ? tags : [],
    // Use premium flag if available, or default to false
    premium: exam.premium || exam.isPremium || false,
    // Set these to reasonable defaults if not present
    attemptCount: exam.attemptCount || 0,
    successRatePercent: exam.successRatePercent || 0,
    lastUpdatedDate: exam.lastUpdatedDate || exam.updatedAt || new Date().toISOString(),
    // Use type if available, or default to MODEL
    type: exam.type?.toUpperCase() || defaultType,
    // Reference to the original exam if needed
    examId: exam.examId || exam.id
  };
}

/**
 * Transforms option format between frontend and backend
 * 
 * @param option The option object from API or direct backend response
 * @returns Normalized Option object for frontend
 */
export function normalizeOption(option: any): Option {
  return {
    id: option.id || 0,
    label: option.label || option.optionKey || option.option_key || '',
    text: option.text || option.optionText || option.option_text || '',
    isCorrect: option.isCorrect ?? option.is_correct ?? false
  };
}

/**
 * Transforms question format between frontend and backend
 * 
 * @param question The question object from API or direct backend response
 * @returns Normalized Question object for frontend
 */
export function normalizeQuestion(question: any): Question {
  const options = question.options || [];
  
  return {
    id: question.id || 0,
    questionNumber: question.questionNumber || question.question_number || 0,
    text: question.text || question.questionText || question.question_text || '',
    options: Array.isArray(options) 
      ? options.map(normalizeOption) 
      : [],
    correctAnswer: question.correctAnswer || question.correct_answer || '',
    explanation: question.explanation || '',
    marks: question.marks || question.points || 1
  };
}

/**
 * Transforms an exam from backend format to frontend format
 * 
 * @param examData The exam data from the API
 * @returns Normalized Exam object for frontend
 */
export function normalizeExam(examData: any): Exam {
  // Handle the case where response is wrapped in a data property
  const exam = examData?.data || examData;
  
  if (!exam) {
    console.warn('No exam data found', { examData });
    return {} as Exam;
  }
  
  const questions = exam.questions || [];
  
  return {
    id: exam.id,
    title: exam.title || 'Untitled Exam',
    description: exam.description || '',
    duration: exam.duration || 60,
    totalMarks: exam.totalMarks || exam.total_marks || 100,
    passingMarks: exam.passingMarks || exam.passing_marks || 60,
    status: exam.status || 'PUBLISHED',
    questions: Array.isArray(questions) 
      ? questions.map(normalizeQuestion)
      : []
  };
}

export default {
  transformExamsToPapers,
  transformExamToPaper,
  normalizeOption,
  normalizeQuestion,
  normalizeExam
};
