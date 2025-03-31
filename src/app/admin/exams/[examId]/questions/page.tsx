"use client"

import React, {use} from 'react';
import {ExamQuestions} from "@/features/exams/components/admin";
import { ExamOperationGuard } from '@/features/exams-preparation/rbac';
import { ExamOperation } from '@/features/exams-preparation/rbac/types';

interface ExamQuestionsPageProps {
  params: Promise<{ examId: string }>;
}

/**
 * Page for viewing and editing questions in an exam
 */
export default function ExamQuestionsPage({params}: ExamQuestionsPageProps) {
  // Unwrap params Promise using React.use()
  const resolvedParams = use(params);
  const examId = parseInt(resolvedParams.examId);

  if (isNaN(examId)) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <h1 className="text-2xl font-bold mb-6">Invalid Exam ID</h1>
          <p>The exam ID provided is not valid.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <ExamOperationGuard 
        operation={ExamOperation.MANAGE_QUESTIONS}
        fallback={
          <div className="py-6">
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
              <div className="flex items-center">
                <div className="py-1">
                  <svg className="h-6 w-6 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold">Access Denied</p>
                  <p className="text-sm">You need permission to edit exams or manage questions to access this page.</p>
                </div>
              </div>
            </div>
          </div>
        }
      >
        <div className="py-6">
          <h1 className="text-2xl font-bold mb-6">Exam Questions</h1>
          <ExamQuestions examId={examId}/>
        </div>
      </ExamOperationGuard>
    </div>
  );
}