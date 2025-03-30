/**
 * Utility types and type guards for the exams feature
 */

import { Question, QuestionType, ExamAnswer } from '../models/exam';

/**
 * Helper types
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

export type ExamAnswerMap = Record<number, ExamAnswer>;

/**
 * Type guards
 */
export function isMultipleChoiceQuestion(question: Question): boolean {
  return question.type === 'multipleChoice';
}

export function isSingleChoiceQuestion(question: Question): boolean {
  return question.type === 'singleChoice';
}

export function isTextQuestion(question: Question): boolean {
  return question.type === 'shortAnswer';
}

export function isTrueFalseQuestion(question: Question): boolean {
  return question.type === 'trueFalse';
}

export function isMatchingQuestion(question: Question): boolean {
  return question.type === 'matching';
}

/**
 * Utility type functions
 */
export function getDefaultAnswerForQuestion(question: Question): Partial<ExamAnswer> {
  return {
    questionId: question.id,
    selectedOptions: question.type === 'multipleChoice' || question.type === 'singleChoice' || question.type === 'matching' ? [] : undefined,
    textAnswer: question.type === 'shortAnswer' ? '' : undefined,
  };
}

export function isAnswerComplete(question: Question, answer?: Partial<ExamAnswer>): boolean {
  if (!answer) return false;
  
  switch (question.type) {
    case 'multipleChoice':
      return !!answer.selectedOptions && answer.selectedOptions.length > 0;
    case 'singleChoice':
    case 'trueFalse':
      return !!answer.selectedOptions && answer.selectedOptions.length === 1;
    case 'shortAnswer':
      return !!answer.textAnswer && answer.textAnswer.trim().length > 0;
    case 'matching':
      return !!answer.selectedOptions && 
            answer.selectedOptions.length === question.options?.length;
    default:
      return false;
  }
}

/**
 * Type-safe event handler types
 */
export type ExamChangeHandler = (examId: number) => void;
export type QuestionChangeHandler = (questionId: number) => void;
export type AnswerChangeHandler = (questionId: number, answer: Partial<ExamAnswer>) => void;
