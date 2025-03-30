/**
 * Exam Calculator Utilities
 * 
 * This module provides calculation utilities for exam scores, statistics,
 * and other exam-related metrics.
 */

import { Question, ExamAnswer, ExamResult, ExamAttempt } from '../types/models/exam';
import { findCorrectAnswerLabel, normalizeToLabel, areAnswersEqual } from './answerUtils';

/**
 * Calculate the score for an exam attempt
 * 
 * @param questions Array of questions in the exam
 * @param answers User's answers mapped by question ID
 * @returns The calculated score information
 */
export function calculateExamScore(
  questions: Question[],
  answers: Record<number, ExamAnswer>
): {
  score: number;
  totalPoints: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unanswered: number;
  percentage: number;
  passed: boolean;
  passingScore: number;
} {
  let score = 0;
  let totalPoints = 0;
  let correctAnswers = 0;
  let incorrectAnswers = 0;
  let unanswered = 0;
  
  // Sum up points for all questions
  for (const question of questions) {
    totalPoints += question.pointValue;
    
    const answer = answers[question.id];
    
    // If no answer, count as unanswered
    if (!answer || !answer.selectedOptions || answer.selectedOptions.length === 0) {
      unanswered++;
      continue;
    }
    
    // Check if the answer is correct
    if (answer.isCorrect) {
      score += question.pointValue;
      correctAnswers++;
    } else {
      incorrectAnswers++;
    }
  }
  
  // Calculate percentage and passing status
  const percentage = totalPoints > 0 ? (score / totalPoints) * 100 : 0;
  const passingScore = 70; // This could come from the exam settings
  const passed = percentage >= passingScore;
  
  return {
    score,
    totalPoints,
    correctAnswers,
    incorrectAnswers,
    unanswered,
    percentage,
    passed,
    passingScore
  };
}

/**
 * Format an exam result into a standardized result object
 * 
 * @param attempt The exam attempt
 * @param questions The exam questions
 * @returns A formatted exam result
 */
export function formatExamResult(
  attempt: ExamAttempt,
  questions: Question[]
): ExamResult {
  const {
    score,
    totalPoints,
    correctAnswers,
    incorrectAnswers,
    unanswered,
    percentage,
    passed
  } = calculateExamScore(questions, attempt.answers || {});
  
  // Calculate time spent
  const startTime = new Date(attempt.startedAt).getTime();
  const endTime = attempt.completedAt
    ? new Date(attempt.completedAt).getTime()
    : Date.now();
  const timeSpent = Math.round((endTime - startTime) / 1000); // in seconds
  
  return {
    attemptId: attempt.id,
    examId: attempt.examId,
    userId: attempt.userId,
    totalQuestions: questions.length,
    answeredQuestions: correctAnswers + incorrectAnswers,
    correctAnswers,
    score,
    percentage,
    passed,
    timeSpent,
    completedAt: attempt.completedAt || new Date().toISOString()
  };
}

/**
 * Calculate statistics for exam attempts
 * 
 * @param attempts Array of exam attempts
 * @returns Statistics about the attempts
 */
export function calculateExamStatistics(attempts: ExamAttempt[]): {
  totalAttempts: number;
  completedAttempts: number;
  passedAttempts: number;
  averageScore: number;
  averageTimeSpent: number;
  bestScore: number;
} {
  if (!attempts || attempts.length === 0) {
    return {
      totalAttempts: 0,
      completedAttempts: 0,
      passedAttempts: 0,
      averageScore: 0,
      averageTimeSpent: 0,
      bestScore: 0
    };
  }
  
  const completedAttempts = attempts.filter(a => a.completedAt);
  
  const passedAttempts = completedAttempts.filter(
    a => a.percentage && a.percentage >= 70
  );
  
  // Calculate average score from completed attempts
  const totalScore = completedAttempts.reduce(
    (sum, attempt) => sum + (attempt.percentage || 0),
    0
  );
  const averageScore = completedAttempts.length > 0
    ? totalScore / completedAttempts.length
    : 0;
  
  // Calculate best score
  const bestScore = completedAttempts.length > 0
    ? Math.max(...completedAttempts.map(a => a.percentage || 0))
    : 0;
  
  // Calculate average time spent
  const totalTimeSpent = completedAttempts.reduce(
    (sum, attempt) => {
      let timeSpent = 0;
      if (attempt.timeSpent) {
        timeSpent = attempt.timeSpent;
      } else if (attempt.startedAt && attempt.completedAt) {
        const start = new Date(attempt.startedAt).getTime();
        const end = new Date(attempt.completedAt).getTime();
        timeSpent = Math.round((end - start) / 1000);
      }
      return sum + timeSpent;
    },
    0
  );
  
  const averageTimeSpent = completedAttempts.length > 0
    ? totalTimeSpent / completedAttempts.length
    : 0;
  
  return {
    totalAttempts: attempts.length,
    completedAttempts: completedAttempts.length,
    passedAttempts: passedAttempts.length,
    averageScore,
    averageTimeSpent,
    bestScore
  };
}

/**
 * Check if a specific answer is correct
 * 
 * @param question The question
 * @param answer The user's answer
 * @returns Whether the answer is correct
 */
export function isAnswerCorrect(
  question: Question,
  answer: string | string[] | null
): boolean {
  if (!answer) return false;
  
  // For single-choice questions
  if (!Array.isArray(answer) && typeof answer === 'string') {
    const correctLabel = findCorrectAnswerLabel(question);
    return areAnswersEqual(answer, correctLabel);
  }
  
  // For multiple-choice questions
  if (Array.isArray(answer) && Array.isArray(question.correctAnswers)) {
    if (answer.length !== question.correctAnswers.length) return false;
    
    // Check if every selected answer is correct
    return answer.every(ans => 
      question.correctAnswers!.some(correct => 
        areAnswersEqual(ans, correct)
      )
    );
  }
  
  return false;
}
