/**
 * Exam Testing Utilities
 * 
 * This module provides testing utilities for exam components and hooks,
 * building on the core testing utilities.
 */

import React, { ReactElement } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, RenderOptions } from '@testing-library/react';

// Mock exam data generators
export const mockExam = (override = {}) => ({
  id: 123,
  title: 'Mock Exam',
  description: 'This is a mock exam for testing',
  timeLimit: 60, // minutes
  passingScore: 70,
  status: 'published',
  isPremium: false,
  createdAt: '2023-01-01T12:00:00Z',
  updatedAt: '2023-01-01T12:00:00Z',
  ...override
});

export const mockQuestion = (override = {}) => ({
  id: 456,
  examId: 123,
  text: 'What is the correct answer?',
  options: [
    { label: 'A', text: 'Option A' },
    { label: 'B', text: 'Option B' },
    { label: 'C', text: 'Option C' },
    { label: 'D', text: 'Option D' },
  ],
  correctAnswers: ['A'],
  explanation: 'A is correct because...',
  pointValue: 1,
  type: 'single',
  ...override
});

export const mockAttempt = (override = {}) => ({
  id: '789',
  examId: 123,
  userId: 'user-123',
  startedAt: '2023-01-01T12:00:00Z',
  completedAt: '2023-01-01T13:00:00Z',
  answers: {},
  score: 80,
  percentage: 80,
  passed: true,
  timeSpent: 3600, // seconds
  ...override
});

// Create a wrapper with providers for testing
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      cacheTime: 0,
      staleTime: 0,
      refetchOnWindowFocus: false,
    },
  },
});

export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) {
  const queryClient = createTestQueryClient();
  
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
  
  return render(ui, { wrapper: Wrapper, ...options });
}

// Mock URL parameter hooks
export function mockUseParams(params: Record<string, string>) {
  // Mock for useRouter's query property
  jest.mock('next/router', () => ({
    useRouter: () => ({
      query: params,
    }),
  }));
  
  // Mock for useParams in App Router
  jest.mock('next/navigation', () => ({
    useParams: () => params,
  }));
}

// Mock navigation functions
export function mockNavigation() {
  const mockRouter = {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    prefetch: jest.fn(),
    pathname: '/exams',
    query: {},
  };
  
  jest.mock('next/router', () => ({
    useRouter: () => mockRouter,
  }));
  
  return mockRouter;
}

// Create mock exam context
export function createMockExamContext(examState = {}) {
  return {
    examId: 123,
    questions: [mockQuestion(), mockQuestion({ id: 457 })],
    currentQuestionIndex: 0,
    timeRemaining: 1800, // 30 minutes
    answers: {},
    flaggedQuestions: new Set<number>(),
    visitedQuestions: new Set<number>([0]),
    isCompleted: false,
    showSummary: false,
    ...examState,
    
    // Mock actions
    answerQuestion: jest.fn(),
    toggleFlagQuestion: jest.fn(),
    navigateToQuestion: jest.fn(),
    nextQuestion: jest.fn(),
    previousQuestion: jest.fn(),
    completeExam: jest.fn(),
  };
}

export default {
  mockExam,
  mockQuestion,
  mockAttempt,
  renderWithProviders,
  mockUseParams,
  mockNavigation,
  createMockExamContext,
};
