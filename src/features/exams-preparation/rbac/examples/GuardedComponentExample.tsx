/**
 * Example: Guarded Component with RBAC
 * 
 * This example demonstrates how to protect entire components using
 * the ExamOperationGuard. This ensures that the component is only
 * rendered for users who have the necessary permissions.
 */

import React from 'react';
import { ExamOperationGuard } from '../guards/ExamOperationGuard';
import { ExamOperation } from '../types';
import { Card, CardHeader, CardTitle, CardContent } from '@/core/ui/atoms';
import { Button } from '@/core/ui/atoms';

interface ExamStatisticsProps {
  examId: number;
  totalAttempts: number;
  averageScore: number;
  passRate: number;
}

/**
 * A component showing advanced statistics for an exam
 * Only visible to users with proper admin permissions
 */
export const ExamStatistics: React.FC<ExamStatisticsProps> = ({
  examId,
  totalAttempts,
  averageScore,
  passRate,
}) => {
  const handleExportClick = () => {
    console.log('Exporting statistics...');
    // Export logic here
  };

  // Wrap the entire component in a guard to ensure only authorized users can see it
  return (
    <ExamOperationGuard 
      operation={ExamOperation.VIEW_ANALYTICS}
      options={{ context: { examId } }}
      fallback={
        <Card>
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <p>You don't have permission to view detailed statistics.</p>
          </CardContent>
        </Card>
      }
    >
      <Card>
        <CardHeader>
          <CardTitle>Exam Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-label">Total Attempts</div>
              <div className="stat-value">{totalAttempts}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Average Score</div>
              <div className="stat-value">{averageScore.toFixed(1)}%</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Pass Rate</div>
              <div className="stat-value">{passRate.toFixed(1)}%</div>
            </div>
          </div>
          
          {/* Nested permission check for export functionality */}
          <ExamOperationGuard 
            operation={ExamOperation.EXPORT_ANALYTICS}
            renderNothing={true}
          >
            <div className="mt-4">
              <Button onClick={handleExportClick} variant="secondary">
                Export Statistics
              </Button>
            </div>
          </ExamOperationGuard>
        </CardContent>
      </Card>
    </ExamOperationGuard>
  );
};

/**
 * Example usage:
 * 
 * ```tsx
 * <ExamStatistics
 *   examId={123}
 *   totalAttempts={42}
 *   averageScore={78.5}
 *   passRate={82.3}
 * />
 * ```
 * 
 * This component will only be visible to users with the VIEW_ANALYTICS permission.
 * Additionally, the Export button will only be visible to users with EXPORT_ANALYTICS permission.
 */