import React from 'react';
import { Metadata } from 'next';
import JsonExamUploader from '@/features/exams/components/admin/JsonExamUploader';
import ExamsList from '@/features/exams/components/admin/ExamsList';

export const metadata: Metadata = {
  title: 'Admin | Exam Management - PharmacyHub',
  description: 'Upload and manage MCQ exams for PharmacyHub',
};

/**
 * Admin page for managing exams
 */
export default function AdminExamsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2">Exam Management</h1>
      <p className="text-muted-foreground mb-8">
        Create and manage exams by uploading JSON files with MCQ content.
      </p>
      
      <div className="grid grid-cols-1 gap-8">
        <JsonExamUploader />
        
        <ExamsList />
      </div>
    </div>
  );
}
