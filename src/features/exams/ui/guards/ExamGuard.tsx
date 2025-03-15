'use client';

import React from 'react';
import { FeatureGuard, OperationGuard } from '@/features/rbac/components/FeatureGuard';
import { ExamOperation } from '../../hooks/useExamFeatureAccess';

// Constants
const EXAMS_FEATURE = 'exams';

interface ExamGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireAll?: boolean;
  redirectTo?: string;
  showLoading?: boolean;
}

/**
 * Guard component to restrict access to exam feature
 */
export function ExamGuard({
  children,
  fallback = null,
  redirectTo,
  showLoading,
}: ExamGuardProps) {
  return (
    <FeatureGuard
      featureCode={EXAMS_FEATURE}
      fallback={fallback}
      redirectTo={redirectTo}
      showLoading={showLoading}
    >
      {children}
    </FeatureGuard>
  );
}

interface ExamOperationGuardProps {
  operation: ExamOperation;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
  showLoading?: boolean;
}

/**
 * Guard component to restrict access based on exam operations
 */
export function ExamOperationGuard({
  operation,
  children,
  fallback = null,
  redirectTo,
  showLoading,
}: ExamOperationGuardProps) {
  return (
    <OperationGuard
      featureCode={EXAMS_FEATURE}
      operation={operation}
      fallback={fallback}
      redirectTo={redirectTo}
      showLoading={showLoading}
    >
      {children}
    </OperationGuard>
  );
}

/**
 * Guard for viewing exams
 */
export function ViewExamsGuard({ children, fallback = null }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <ExamOperationGuard operation={ExamOperation.VIEW} fallback={fallback}>
      {children}
    </ExamOperationGuard>
  );
}

/**
 * Guard for taking exams
 */
export function TakeExamsGuard({ children, fallback = null }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <ExamOperationGuard operation={ExamOperation.TAKE} fallback={fallback}>
      {children}
    </ExamOperationGuard>
  );
}

/**
 * Guard for creating/editing exams
 */
export function ManageExamsGuard({ children, fallback = null }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <FeatureGuard
      featureCode={EXAMS_FEATURE}
      operation={ExamOperation.CREATE}
      fallback={fallback}
    >
      {children}
    </FeatureGuard>
  );
}

/**
 * Guard for exam admin operations
 */
export function ExamAdminGuard({ children, fallback = null }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <FeatureGuard
      featureCode={[
        `${EXAMS_FEATURE}`,
        `admin`,
      ]}
      requireAll={false}
      fallback={fallback}
    >
      {children}
    </FeatureGuard>
  );
}
