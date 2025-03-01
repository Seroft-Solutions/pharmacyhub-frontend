'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/layout/container';
import { ExamContainer } from '@/features/exams/ui/ExamContainer';
import { Button } from '@/components/ui/button';
import { QueryProvider } from '@/features/tanstack-query-api/components/QueryProvider';

interface ExamPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ExamPage({ params }: ExamPageProps) {
  const router = useRouter();
  const { id } = React.use(params);
  const examId = parseInt(id, 10);
  
  // In a real application, you would get the user ID from authentication context
  const userId = "current-user-id"; // This should come from auth context
  
  const handleExit = () => {
    router.push('/exams');
  };
  
  if (isNaN(examId)) {
    return (
      <Container>
        <div className="my-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Invalid Exam ID</h1>
          <p className="text-gray-600 mb-4">The exam ID provided is not valid.</p>
          <Button 
            onClick={() => router.push('/exams')}
          >
            Return to Exams
          </Button>
        </div>
      </Container>
    );
  }
  
  return (
    <QueryProvider>
      <Container>
        <div className="my-8">
          <ExamContainer
            examId={examId}
            userId={userId}
            onExit={handleExit}
          />
        </div>
      </Container>
    </QueryProvider>
  );
}
