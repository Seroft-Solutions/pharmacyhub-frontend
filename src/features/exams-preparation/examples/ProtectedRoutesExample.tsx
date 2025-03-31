/**
 * Protected Routes Example
 * 
 * This example demonstrates how to use the withExamPermission HOC to protect routes
 * based on user permissions.
 */
'use client'

import React from 'react';
import { withExamPermission, ExamOperation } from '@/features/exams-preparation/rbac';

/**
 * Example of a dashboard component that requires permission to view exams
 */
const AdminDashboard: React.FC = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <p className="mb-4">This page is protected and only visible to users with the VIEW_EXAMS permission.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="p-4 border rounded-md">
          <h2 className="text-lg font-medium mb-2">Recent Exams</h2>
          <p>List of recently created exams would appear here.</p>
        </div>
        
        <div className="p-4 border rounded-md">
          <h2 className="text-lg font-medium mb-2">User Activity</h2>
          <p>Overview of recent user activity would appear here.</p>
        </div>
      </div>
      
      <div className="p-4 border rounded-md">
        <h2 className="text-lg font-medium mb-2">System Status</h2>
        <p>All systems operational.</p>
      </div>
    </div>
  );
};

/**
 * Example of an exam creation page that requires permission to create exams
 */
const CreateExamPage: React.FC = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Create New Exam</h1>
      <p className="mb-4">This page is protected and only visible to users with the CREATE_EXAM permission.</p>
      
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Exam Title</label>
          <input type="text" className="w-full p-2 border rounded-md" />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea className="w-full p-2 border rounded-md" rows={3}></textarea>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
          <input type="number" min="1" className="w-full p-2 border rounded-md" />
        </div>
        
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Create Exam
        </button>
      </form>
    </div>
  );
};

/**
 * Example of an analytics page that requires permission to view analytics
 */
const AnalyticsPage: React.FC = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Exam Analytics</h1>
      <p className="mb-4">This page is protected and only visible to users with the VIEW_ANALYTICS permission.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="p-4 border rounded-md text-center">
          <div className="text-3xl font-bold text-blue-600">172</div>
          <div className="text-sm text-gray-500">Exams Taken</div>
        </div>
        
        <div className="p-4 border rounded-md text-center">
          <div className="text-3xl font-bold text-green-600">76%</div>
          <div className="text-sm text-gray-500">Average Score</div>
        </div>
        
        <div className="p-4 border rounded-md text-center">
          <div className="text-3xl font-bold text-purple-600">24</div>
          <div className="text-sm text-gray-500">Active Exams</div>
        </div>
      </div>
      
      <div className="p-4 border rounded-md">
        <h2 className="text-lg font-medium mb-2">Performance Trends</h2>
        <div className="h-64 bg-gray-100 flex items-center justify-center">
          <p className="text-gray-500">Chart would appear here</p>
        </div>
      </div>
    </div>
  );
};

// Protected components using withExamPermission HOC
export const ProtectedDashboard = withExamPermission(
  AdminDashboard,
  ExamOperation.VIEW_EXAMS
);

export const ProtectedCreateExam = withExamPermission(
  CreateExamPage,
  ExamOperation.CREATE_EXAM,
  { fallbackUrl: '/admin/exams' }
);

export const ProtectedAnalytics = withExamPermission(
  AnalyticsPage,
  ExamOperation.VIEW_ANALYTICS,
  {
    customFallback: (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Analytics Access Restricted</h1>
        <p className="mb-4">You need administrator privileges to view analytics.</p>
        <p>Please contact your administrator if you need access to this feature.</p>
      </div>
    )
  }
);

// Usage in a Next.js page file would look like:
// export default ProtectedDashboard;
// export default ProtectedCreateExam;
// export default ProtectedAnalytics;
