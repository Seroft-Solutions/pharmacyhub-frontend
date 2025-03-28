/**
 * Query Key Utilities
 * 
 * This module provides utilities for creating and managing TanStack Query keys.
 */
import { QueryKey } from '@tanstack/react-query';

/**
 * Type-safe utility for building query keys
 */
export const createQueryKeys = <T extends Record<string, (...args: any[]) => QueryKey>>(keys: T) => keys;

/**
 * Standard query key factory for common entity types
 */
export const apiQueryKeys = {
  auth: {
    user: () => ['auth', 'user'],
    session: () => ['auth', 'session'],
    login: () => ['auth', 'login'],
    register: () => ['auth', 'register'],
  },
  users: {
    all: () => ['users'],
    list: (filters?: any) => ['users', 'list', filters],
    detail: (id: string | number) => ['users', 'detail', id],
    profile: () => ['users', 'profile'],
    settings: () => ['users', 'settings'],
  },
  exams: {
    all: () => ['exams'],
    list: (filters?: any) => ['exams', 'list', filters],
    detail: (id: string | number) => ['exams', 'detail', id],
    questions: (examId: string | number) => ['exams', 'questions', examId],
    results: (examId: string | number, userId?: string) => 
      userId ? ['exams', examId, 'results', userId] : ['exams', examId, 'results'],
  },
  progress: {
    user: (userId?: string) => ['progress', 'user', userId],
    exam: (examId: string | number) => ['progress', 'exam', examId],
    detail: (userId: string, examId: string) => ['progress', 'detail', userId, examId],
    statistics: (userId?: string) => ['progress', 'statistics', userId],
  },
  dashboard: {
    stats: () => ['dashboard', 'stats'],
    timeline: (period: string) => ['dashboard', 'timeline', period],
    recommendations: () => ['dashboard', 'recommendations'],
  },
};
