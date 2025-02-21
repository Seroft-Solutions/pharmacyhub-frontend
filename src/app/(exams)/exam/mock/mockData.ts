export interface ExamPaper {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  totalQuestions: number;
  duration: number; // in minutes
  topics: string[];
  isPremium: boolean;
  attempts: number;
  successRate: number;
  lastUpdated: string;
}

export const mockModelPapers: ExamPaper[] = [
  {
    id: 'mp-001',
    title: 'Pharmacology Basics 2024',
    description: 'Comprehensive review of basic pharmacology principles',
    difficulty: 'easy',
    totalQuestions: 50,
    duration: 60,
    topics: ['Basic Pharmacology', 'Drug Classification', 'Mechanisms of Action'],
    isPremium: false,
    attempts: 1250,
    successRate: 78,
    lastUpdated: '2024-02-15'
  },
  {
    id: 'mp-002',
    title: 'Clinical Pharmacy Practice',
    description: 'Advanced clinical pharmacy scenarios and case studies',
    difficulty: 'hard',
    totalQuestions: 75,
    duration: 90,
    topics: ['Patient Care', 'Clinical Decision Making', 'Therapeutic Management'],
    isPremium: true,
    attempts: 850,
    successRate: 65,
    lastUpdated: '2024-02-18'
  },
  {
    id: 'mp-003',
    title: 'Pharmaceutical Calculations',
    description: 'Essential calculations for pharmacy practice',
    difficulty: 'medium',
    totalQuestions: 40,
    duration: 60,
    topics: ['Dosage Calculations', 'Concentration Calculations', 'Compounding'],
    isPremium: false,
    attempts: 2000,
    successRate: 72,
    lastUpdated: '2024-02-10'
  },
  {
    id: 'mp-004',
    title: 'Pharmacy Law & Ethics',
    description: 'Latest updates on pharmacy regulations and ethical practices',
    difficulty: 'medium',
    totalQuestions: 60,
    duration: 75,
    topics: ['Pharmacy Laws', 'Professional Ethics', 'Regulatory Compliance'],
    isPremium: true,
    attempts: 1500,
    successRate: 70,
    lastUpdated: '2024-02-20'
  }
];

export const mockPastPapers: ExamPaper[] = [
  {
    id: 'pp-001',
    title: '2023 Board Exam Paper 1',
    description: 'Official board examination from 2023',
    difficulty: 'hard',
    totalQuestions: 100,
    duration: 180,
    topics: ['Comprehensive', 'Clinical Practice', 'Pharmacy Management'],
    isPremium: true,
    attempts: 3000,
    successRate: 68,
    lastUpdated: '2023-12-01'
  },
  {
    id: 'pp-002',
    title: '2023 Board Exam Paper 2',
    description: 'Second paper from 2023 board examination',
    difficulty: 'hard',
    totalQuestions: 100,
    duration: 180,
    topics: ['Drug Therapy', 'Patient Care', 'Pharmacy Operations'],
    isPremium: true,
    attempts: 2800,
    successRate: 65,
    lastUpdated: '2023-12-01'
  }
];

export interface ExamStats {
  totalPapers: number;
  avgDuration: number;
  completionRate: number;
  activeUsers: number;
}

export const mockStats: ExamStats = {
  totalPapers: mockModelPapers.length + mockPastPapers.length,
  avgDuration: 180,
  completionRate: 75,
  activeUsers: 2500
};