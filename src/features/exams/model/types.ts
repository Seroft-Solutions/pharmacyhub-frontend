export type PaperType = 'model' | 'past';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface MCQPaper {
    id: string;
    metadata: PaperMetadata;
    content: PaperContent;
}

export interface PaperMetadata {
    format_version: string;
    created_at: string;
    last_updated: string;
    tags: string[];
    topics_covered: string[];
    difficulty: Difficulty;
    source: string;
    author: string;
}

export interface PaperContent {
    title: string;
    description: string;
    time_limit: number;
    total_questions: number;
    passing_criteria: {
        minimum_questions: number;
        passing_score: number;
    };
    sections: MCQSection[];
}

export interface MCQSection {
    id: string;
    title: string;
    questions: MCQuestion[];
}

export interface MCQuestion {
    id: string;
    metadata: QuestionMetadata;
    content: QuestionContent;
    statistics: QuestionStatistics;
}

export interface QuestionMetadata {
    created_at: string;
    last_updated: string;
    difficulty: Difficulty;
    estimated_time: number;
    topics: {
        primary: string;
        secondary?: string;
    };
}

export interface QuestionContent {
    question_text: string;
    question_type: 'single_choice';
    options: {
        [key: string]: string;
    };
    correct_answer: string;
    explanation: {
        detailed: string;
        key_points: string[];
        references?: string[];
    };
}

export interface QuestionStatistics {
    attempts: number;
    success_rate: number;
    average_time: number;
    difficulty_rating: number;
    discrimination_index?: number;
}

// Types for user interactions with exams
export interface UserAnswer {
    question_id: string;
    selected_option: string;
    time_spent: number;
    is_correct?: boolean;
}

export interface ExamSession {
    paper_id: string;
    start_time: string;
    end_time?: string;
    answers: UserAnswer[];
    is_completed: boolean;
    score?: number;
    time_spent?: number;
}