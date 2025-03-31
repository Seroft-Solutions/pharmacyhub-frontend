"use client"

import React, {use} from 'react';
import {PaperTypeManager} from "@/features/exams/components/admin";
import { ExamOperationGuard } from '@/features/exams-preparation/rbac';
import { ExamOperation } from '@/features/exams-preparation/rbac/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface EditExamPageProps {
  params: Promise<{ examId: string }>;
}

/**
 * Page for editing exam metadata
 */
export default function EditExamPage({params}: EditExamPageProps) {
  const router = useRouter();
  
  // Unwrap params Promise using React.use()
  const resolvedParams = use(params);
  const examId = parseInt(resolvedParams.examId);

  // Handle back button click
  const handleBack = () => {
    router.push('/admin/exams/manage');
  };

  if (isNaN(examId)) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <h1 className="text-2xl font-bold mb-6">Invalid Exam ID</h1>
          <p>The exam ID provided is not valid.</p>
          <Button onClick={handleBack} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Exams
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <ExamOperationGuard 
        operation={ExamOperation.EDIT_EXAM}
        fallback={
          <div className="py-6">
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
              <div className="flex items-center">
                <div className="py-1">
                  <AlertCircle className="h-6 w-6 mr-4" />
                </div>
                <div>
                  <p className="font-bold">Access Denied</p>
                  <p className="text-sm">You need permission to edit exams to access this page.</p>
                </div>
              </div>
            </div>
            <Button onClick={handleBack} className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Exams
            </Button>
          </div>
        }
      >
        <div className="py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Edit Exam</h1>
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Exams
            </Button>
          </div>
          <PaperTypeManager examId={examId}/>
        </div>
      </ExamOperationGuard>
    </div>
  );
}