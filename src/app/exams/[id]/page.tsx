'use client';

import React from 'react';
import { McqExamLayout } from '@/features/exams/ui/mcq/McqExamLayout';

// Page component with params passed directly as props from Next.js
export default function ExamPage({ params }: { params: { id: string } }) {
  // Parse the ID from params
  const examId = parseInt(params.id);
  
  if (isNaN(examId)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-lg">
          <h1 className="text-2xl font-bold mb-4">Invalid Exam ID</h1>
          <p className="text-gray-600 mb-6">
            The exam ID provided is not valid. Please select a valid exam.
          </p>
          <a 
            href="/exams" 
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Return to Exams
          </a>
        </div>
      </div>
    );
  }

  return <McqExamLayout examId={examId} />;
}
