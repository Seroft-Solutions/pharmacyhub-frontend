'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/layout/container';
import { QueryProvider } from '@/features/tanstack-query-api/components/QueryProvider';
import { ExamContainer } from '@/features/exams/components/ExamContainer';
import { useExam } from '@/features/exams/api/UseExamApi';
import { Spinner } from '@/components/ui/spinner';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ExamPageProps {
  params: {
    id: string;
  };
}

export default function ExamPage({ params }: ExamPageProps) {
  return (
    <QueryProvider>
      <ExamPageContent id={params.id} />
    </QueryProvider>
  );
}

function ExamPageContent({ id }: { id: string }) {
  const router = useRouter();
  const examId = parseInt(id, 10);
  
  // In a real application, you would get the user ID from authentication context
  const userId = "current-user-id"; // This should come from auth context
  
  // Handle invalid exam ID
  if (isNaN(examId)) {
    return (
      <Container>
        <div className="my-8 text-center">
          <Card className="max-w-lg mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Invalid Exam ID</h1>
            <p className="text-gray-600 mb-4">The exam ID provided is not valid.</p>
            <Button onClick={() => router.push('/exam/dashboard')}>
              Return to Dashboard
            </Button>
          </Card>
        </div>
      </Container>
    );
  }
  
  const handleExit = () => {
    router.push('/exam/dashboard');
  };
  
  return (
    <Container>
      <div className="my-8">
        <ExamContainer
          examId={examId}
          userId={userId}
          onExit={handleExit}
        />
      </div>
    </Container>
  );
}