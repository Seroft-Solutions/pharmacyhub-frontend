export type ExamStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctOption: number;
}

export interface Exam {
  id: number;
  title: string;
  description: string;
  status: ExamStatus;
  questions?: Question[];
  duration: number; // in minutes
  passingScore: number;
  maxScore: number;
  createdAt: string;
  updatedAt: string;
}

export interface ExamAttempt {
  id: number;
  examId: number;
  userId: number;
  startTime: string;
  endTime?: string;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED';
}

export interface UserAnswer {
  questionId: number;
  selectedOption: number;
}

export interface ExamResult {
  attemptId: number;
  examId: number;
  score: number;
  isPassed: boolean;
  completedAt: string;
  answers: Array<{
    questionId: number;
    selectedOption: number;
    isCorrect: boolean;
  }>;
}
