'use client';

import React from 'react';
import McqExamResults from '@/features/exams/ui/mcq/McqExamResults';

export default function ExamResultsPage() {
  return (
    <main className="min-h-screen bg-muted/10">
      <McqExamResults />
    </main>
  );
}
