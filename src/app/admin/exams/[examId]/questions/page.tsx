"use client"

import React, {use} from 'react';
import {ExamQuestions} from "@/features/exams";

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
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-6">Exam Questions</h1>
        <ExamQuestions examId={examId}/>
      </div>
    </div>
  );
}