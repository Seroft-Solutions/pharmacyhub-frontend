/**
 * Component Types
 * 
 * This file defines common types used by the exam components.
 */

export interface Question {
  id: number;
  questionNumber?: number;
  text: string;
  options: Option[];
  correctAnswer?: string;
  explanation?: string;
  marks?: number;
}

export interface Option {
  id?: number;
  label: string;
  text: string;
  isCorrect?: boolean;
}

export interface UserAnswer {
  questionId: number;
  selectedOption: number;
  timeSpent?: number;
}

export interface QuestionProps {
  questionId: number;
  questionText: string;
  options: Option[];
  selectedOption?: number;
  correctOption?: number;
  explanation?: string;
  showCorrectAnswer?: boolean;
  onOptionSelect?: (questionId: number, optionIndex: number) => void;
}
