'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/layout/container';
import ExamContainer from '@/features/exams/components/ExamContainer';
import { useExam } from '@/features/exams/api/UseExamApi';
import { Spinner } from '@/components/ui/spinner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExamPageContainer } from '@/features/exams/components/layout/ExamPageContainer';
import { ReloadInterceptor, disableNativeReloadDialog } from '@/core/navigation';

interface ExamPageProps {
  params: {
    id: string;
  };
  searchParams: {
    type?: string;
  };
}

export default function ExamPage({ params, searchParams }: ExamPageProps) {
  // Unwrap params using React.use() before accessing properties
  const resolvedParams = React.use(params);
  const resolvedSearchParams = React.use(searchParams);
  
  // Disable all native reload dialogs and ensure order of priority
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Ensure the default reload behavior is completely suppressed
    const blockAllReloads = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      e.returnValue = '';
      return '';
    };
    
    // Add with highest priority
    window.addEventListener('beforeunload', blockAllReloads, { capture: true, passive: false });
    
    // Then set up our custom dialog handler
    const cleanup = disableNativeReloadDialog();
    
    return () => {
      window.removeEventListener('beforeunload', blockAllReloads, { capture: true, passive: false });
      cleanup && cleanup();
    };
  }, []);
  
  return (
    <ReloadInterceptor>
      <ExamPageContent id={resolvedParams.id} examType={resolvedSearchParams.type} />
    </ReloadInterceptor>
  );
}

function ExamPageContent({ id, examType }: { id: string, examType?: string }) {
  const router = useRouter();
  const examId = parseInt(id, 10);
  
  // Get exam data
  const { data: exam, isLoading, error } = useExam(examId);
  
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
      <div className="w-full max-w-5xl mx-auto">
        <ExamPageContainer examId={examId} userId={userId}>
          <ExamContainer
            examId={examId}
            userId={userId}
            onExit={handleExit}
            showTimer={true}
            examType={examType as 'past' | 'model' | 'subject'}
          />
        </ExamPageContainer>
      </div>
    </Container>
  );
}