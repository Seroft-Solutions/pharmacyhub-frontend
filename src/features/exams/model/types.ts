export interface ExamPaperMetadata {
  id: string;
  title: string;
  description: string;
  source: 'model' | 'past';
  difficulty: 'easy' | 'medium' | 'hard';
  topics_covered: string[];
  total_questions: number;
  time_limit: number;
  is_premium: boolean;
}

export interface ExamPaperProgress {
  paperId: string;
  completed: boolean;
  score?: number;
  last_attempted?: Date;
}

export interface UserExamProgress {
  completedPapers: string[];
  premium_access: boolean;
  papers_progress: ExamPaperProgress[];
}

export interface ExamPaperCardProps {
  paper: ExamPaperMetadata;
  progress?: ExamPaperProgress;
  onStart: (paper: ExamPaperMetadata) => void;
}