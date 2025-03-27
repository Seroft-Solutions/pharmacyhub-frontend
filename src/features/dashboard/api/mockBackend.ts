'use client';

/**
 * Mock backend services for dashboard data
 * 
 * This provides mock implementations for the APIs that are currently returning 404 errors:
 * - /progress/{userId}
 * - /analytics/{userId}
 * - /recommendations/{userId}
 * 
 * These mock services will be used until the actual backend implementations are available.
 */

import { Progress, Analytics, Recommendation } from '@/features/exams/progress/api/progressApi';

/**
 * Generate mock progress data for a user
 */
export function getMockUserProgress(userId: string): Progress {
  return {
    completedExams: 12,
    inProgressExams: 3,
    averageScore: 74.5,
    totalTimeSpent: 1860 // in minutes (31 hours)
  };
}

/**
 * Generate mock analytics data for a user
 */
export function getMockAnalytics(userId: string, startDate?: string, endDate?: string): Analytics {
  // Create sample exam scores
  const examScores = [
    { id: 1, name: 'Pharmacology Basics', score: 85, average: 72, date: '2025-03-01' },
    { id: 2, name: 'Drug Interactions', score: 78, average: 68, date: '2025-03-05' },
    { id: 3, name: 'Pharmaceutical Chemistry', score: 92, average: 75, date: '2025-03-10' },
    { id: 4, name: 'Clinical Pharmacy', score: 65, average: 62, date: '2025-03-15' },
    { id: 5, name: 'Pharmacy Law', score: 88, average: 70, date: '2025-03-20' }
  ];
  
  // Create study hours for each day of the week
  const studyHours = [
    { date: 'Mon', hours: 2.5 },
    { date: 'Tue', hours: 1.8 },
    { date: 'Wed', hours: 3.2 },
    { date: 'Thu', hours: 1.5 },
    { date: 'Fri', hours: 2.0 },
    { date: 'Sat', hours: 4.5 },
    { date: 'Sun', hours: 3.7 }
  ];
  
  // Create time spent breakdown by subject
  const timeSpent = {
    'Pharmacology': 450,  // minutes
    'Chemistry': 360,
    'Biology': 240,
    'Physiology': 180,
    'Pathology': 210,
    'Pharmacy Practice': 420
  };
  
  return {
    examScores,
    studyHours,
    timeSpent
  };
}

/**
 * Generate mock recommendations for a user
 */
export function getMockRecommendations(userId: string): Recommendation[] {
  return [
    {
      id: '1',
      title: 'Pharmacokinetics - Advanced Concepts',
      type: 'exam',
      confidence: 0.92,
      tags: ['pharmacology', 'advanced', 'kinetics']
    },
    {
      id: '2',
      title: 'Drug Interactions in Clinical Practice',
      type: 'course',
      confidence: 0.87,
      tags: ['clinical', 'interactions', 'practice']
    },
    {
      id: '3',
      title: 'Pharmaceutical Calculations Refresher',
      type: 'exam',
      confidence: 0.78,
      tags: ['calculations', 'basic', 'practice']
    },
    {
      id: '4',
      title: 'Hospital Pharmacy Guidelines',
      type: 'resource',
      confidence: 0.65,
      tags: ['hospital', 'guidelines', 'practice']
    }
  ];
}

// Export all functions
export const mockBackend = {
  getMockUserProgress,
  getMockAnalytics,
  getMockRecommendations
};