/**
 * API Adapters Utility
 * 
 * This file contains utility functions for adapting API responses to the expected frontend data structure.
 * It ensures consistent mapping between backend and frontend data models.
 */

import { 
  Exam, 
  Question, 
  Option, 
  ExamAttempt, 
  ExamResult 
} from '../types';

/**
 * Transforms exam data from API response to match frontend Exam type
 * 
 * @param data API response data that may have different property names
 * @returns Properly structured Exam object
 */
export function adaptExamData(data: any): Exam | null {
  if (!data) return null;
  
  console.log("Adapting exam data:", data);
  
  // Extract core data, handling nested structure if needed
  const examData = data.data || data;
  
  // Map properties, handling different property names
  return {
    id: examData.id,
    title: examData.title || '',
    description: examData.description || '',
    duration: examData.duration || examData.time_limit || 0,
    totalMarks: examData.totalMarks || examData.total_marks || 0,
    passingMarks: examData.passingMarks || examData.passing_marks || 0,
    status: examData.status || 'DRAFT',
    tags: examData.tags || [],
    // Adapt questions if present
    questions: examData.questions ? examData.questions.map(adaptQuestionData) : []
  };
}

/**
 * Transforms question data from API response to match frontend Question type
 * 
 * @param data API response data that may have different property names
 * @returns Properly structured Question object
 */
export function adaptQuestionData(data: any): Question {
  if (!data) {
    console.warn("Received empty question data");
    return {
      id: 0,
      questionNumber: 0,
      text: '',
      options: [],
      marks: 0
    };
  }
  
  return {
    id: data.id,
    questionNumber: data.questionNumber || 0,
    // Handle different field names for question text
    text: data.text || data.questionText || '',
    // Handle different field names for options
    options: data.options ? data.options.map(adaptOptionData) : [],
    explanation: data.explanation || '',
    marks: data.marks || data.points || 1,
    correctAnswer: data.correctAnswer
  };
}

/**
 * Transforms option data from API response to match frontend Option type
 * 
 * @param data API response data that may have different property names
 * @returns Properly structured Option object
 */
export function adaptOptionData(data: any): Option {
  if (!data) {
    console.warn("Received empty option data");
    return {
      id: 0,
      label: '',
      text: ''
    };
  }
  
  return {
    id: data.id,
    // Handle different field names for label
    label: data.label || data.optionKey || '',
    // Handle different field names for text
    text: data.text || data.optionText || '',
    isCorrect: data.isCorrect
  };
}

/**
 * Transforms exam attempt data from API response to match frontend ExamAttempt type
 * 
 * @param data API response data
 * @returns Properly structured ExamAttempt object
 */
export function adaptExamAttemptData(data: any): ExamAttempt | null {
  if (!data) return null;
  
  // Extract core data, handling nested structure if needed
  const attemptData = data.data || data;
  
  return {
    id: attemptData.id,
    examId: attemptData.examId,
    userId: attemptData.userId,
    startTime: attemptData.startTime,
    endTime: attemptData.endTime,
    status: attemptData.status,
    answers: attemptData.answers
  };
}

/**
 * Transforms array of exams from API response
 * 
 * @param data API response that may contain an array or wrapped array
 * @returns Array of properly structured Exam objects
 */
export function adaptExamsArray(data: any): Exam[] {
  if (!data) return [];
  
  // Handle different response structures
  let examsArray: any[] = [];
  
  if (Array.isArray(data)) {
    examsArray = data;
  } else if (data.data && Array.isArray(data.data)) {
    examsArray = data.data;
  } else if (data.date && Array.isArray(data.date)) {
    examsArray = data.date;
  } else {
    console.warn("Unexpected exam list format:", data);
    return [];
  }
  
  // Map each exam through the adapter
  return examsArray.map(examData => adaptExamData(examData)).filter(Boolean) as Exam[];
}

/**
 * Transforms array of questions from API response
 * 
 * @param data API response that may contain an array or wrapped array
 * @returns Array of properly structured Question objects
 */
export function adaptQuestionsArray(data: any): Question[] {
  if (!data) return [];
  
  // Handle different response structures
  let questionsArray: any[] = [];
  
  if (Array.isArray(data)) {
    questionsArray = data;
  } else if (data.data && Array.isArray(data.data)) {
    questionsArray = data.data;
  } else {
    console.warn("Unexpected questions list format:", data);
    return [];
  }
  
  // Map each question through the adapter
  return questionsArray.map(adaptQuestionData);
}
