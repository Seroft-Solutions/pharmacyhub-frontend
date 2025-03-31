/**
 * Conditional Content Example
 * 
 * This example demonstrates how to use the ConditionalContent component
 * to conditionally render UI elements based on user permissions.
 */
'use client'

import React from 'react';
import { Button } from '@/components/ui/button';
import { ConditionalContent } from '@/features/exams-preparation/rbac/guards';
import { ExamOperation } from '@/features/exams-preparation/rbac/types';
import { useGuardedCallback } from '@/features/exams-preparation/rbac';

/**
 * ExamHeader Component with Permission-Based UI
 * Shows different UI elements based on the user's permissions
 */
export const ExamHeaderWithPermissions: React.FC<{ examId: string }> = ({ examId }) => {
  const handlePublish = useGuardedCallback(
    ExamOperation.PUBLISH_EXAM,
    () => {
      console.log('Publishing exam:', examId);
      // API call to publish the exam
    },
    { context: { examId }, showNotification: true }
  );

  const handleDelete = useGuardedCallback(
    ExamOperation.DELETE_EXAM,
    () => {
      console.log('Deleting exam:', examId);
      // API call to delete the exam
    },
    { context: { examId }, showNotification: true }
  );

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Example Exam</h1>
          <p className="text-gray-600">A demonstration of conditional content rendering</p>
        </div>
        
        {/* Action buttons based on permissions */}
        <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
          {/* Everyone can view the exam */}
          <Button variant="outline">
            View
          </Button>

          {/* Only users with TAKE_EXAM permission can start the exam */}
          <ConditionalContent operation={ExamOperation.TAKE_EXAM}>
            <Button variant="primary">
              Start Exam
            </Button>
          </ConditionalContent>

          {/* Only users with EDIT_EXAM permission can edit */}
          <ConditionalContent 
            operation={ExamOperation.EDIT_EXAM}
            options={{ context: { examId } }}
          >
            <Button variant="secondary">
              Edit
            </Button>
          </ConditionalContent>

          {/* Only users with PUBLISH_EXAM permission can publish */}
          <ConditionalContent 
            operation={ExamOperation.PUBLISH_EXAM}
            options={{ context: { examId } }}
          >
            <Button onClick={handlePublish} variant="secondary">
              Publish
            </Button>
          </ConditionalContent>

          {/* Only users with DELETE_EXAM permission can delete */}
          <ConditionalContent 
            operation={ExamOperation.DELETE_EXAM}
            options={{ context: { examId } }}
          >
            <Button 
              onClick={handleDelete} 
              variant="destructive"
            >
              Delete
            </Button>
          </ConditionalContent>
        </div>
      </div>

      {/* Statistics section only visible to users with analytics permission */}
      <ConditionalContent 
        operation={ExamOperation.VIEW_ANALYTICS}
        fallback={
          <div className="p-4 border rounded-md bg-gray-50">
            <p className="text-sm text-gray-500">Statistics are only visible to administrators.</p>
          </div>
        }
      >
        <div className="p-4 border rounded-md">
          <h2 className="text-lg font-medium mb-4">Exam Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-blue-50 rounded-md text-center">
              <div className="text-2xl font-bold text-blue-600">87</div>
              <div className="text-sm text-gray-500">Total Attempts</div>
            </div>
            <div className="p-3 bg-green-50 rounded-md text-center">
              <div className="text-2xl font-bold text-green-600">72%</div>
              <div className="text-sm text-gray-500">Average Score</div>
            </div>
            <div className="p-3 bg-purple-50 rounded-md text-center">
              <div className="text-2xl font-bold text-purple-600">42</div>
              <div className="text-sm text-gray-500">Active Users</div>
            </div>
          </div>
        </div>
      </ConditionalContent>

      {/* Admin panel only visible to users with multiple admin permissions */}
      <ConditionalContent 
        operation={ExamOperation.MANAGE_QUESTIONS}
        options={{ context: { examId } }}
      >
        <div className="mt-6 p-4 border rounded-md border-orange-200 bg-orange-50">
          <h2 className="text-lg font-medium mb-2 text-orange-800">Admin Panel</h2>
          <p className="mb-4 text-orange-700">This section is only visible to administrators.</p>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Manage Questions
            </Button>
            
            <ConditionalContent operation={ExamOperation.MANAGE_PAYMENTS}>
              <Button variant="outline" size="sm">
                Payment Settings
              </Button>
            </ConditionalContent>
          </div>
        </div>
      </ConditionalContent>
    </div>
  );
};

export default ExamHeaderWithPermissions;
