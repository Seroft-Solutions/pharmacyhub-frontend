export type PaperType = 'model' | 'past';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface MCQPaper {
    id: string;
    type: PaperType;
    year?: number;
    version: string;
    title: string;
    description: string;
    timeLimit: number;
    totalQuestions: number;
    passingCriteria: {
        minimumQuestions: number;
        passingScore: number;
    };
    sections: MCQSection[];
    metadata: PaperMetadata;
}

export interface PaperMetadata {
    createdAt: string;
    updatedAt: string;
    difficulty: Difficulty;
    tags: string[];
    category: string;
    subCategory?: string;
}

export interface MCQSection {
    id: string;
    title: string;
    description?: string;
    questions: MCQuestion[];
}

export interface MCQuestion {
    id: string;
    questionNumber: number;
    question: string;
    options: {
        [key: string]: string;
    };
    answer: string;
    explanation: string;
    metadata: QuestionMetadata;
    stats?: QuestionStats;
}

export interface QuestionMetadata {
    difficulty: Difficulty;
    topic: string;
    subTopic?: string;
    tags: string[];
    source?: string;
    lastUpdated: string;
}

export interface QuestionStats {
    attemptCount: number;
    correctCount: number;
    averageTimeSpent: number;
}

export interface UserAnswer {
    questionId: string;
    selectedOption: string;
    timeSpent: number;
    isCorrect?: boolean;
}

export interface ExamSession {
    paperId: string;
    startTime: string;
    endTime?: string;
    answers: UserAnswer[];
    isCompleted: boolean;
    score?: number;
    timeSpent?: number;
}