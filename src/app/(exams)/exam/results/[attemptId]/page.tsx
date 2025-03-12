'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useExamResult } from '@/features/exams/api/hooks/useExamApi';
import { QueryProvider } from '@/features/tanstack-query-api/components/QueryProvider';
import { Container } from '@/components/layout/container';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { ExamResults } from '@/features/exams/ui/results/ExamResults';
import { ExamReview } from '@/features/exams/ui/review/ExamReview';
import { Card } from '@/components/ui/card';
import { getStaticExamResult } from '@/features/exams/mock/staticResults';

interface ResultsPageProps {
  params: {
    attemptId: string;
  };
}

export default function ResultsPage({ params }: ResultsPageProps) {
  return (
    <QueryProvider>
      <ExamResultsContent attemptId={params.attemptId} />
    </QueryProvider>
  );
}

function ExamResultsContent({ attemptId }: { attemptId: string }) {
  const [showReview, setShowReview] = useState(false);
  const router = useRouter();
  const attemptIdNumber = parseInt(attemptId, 10);
  
  // Use API data if available, otherwise fallback to mock data
  const { 
    data: examResult, 
    isLoading, 
    error 
  } = useExamResult(attemptIdNumber);
  
  // Fallback to static data if API fails or for development
  const result = examResult || getStaticExamResult();
  
  const handleBackToDashboard = () => {
    router.push('/exam/dashboard');
  };
  
  const handleTryAgain = () => {
    if (result) {
      router.push(`/exam/${result.examId}`);
    } else {
      router.push('/exam/dashboard');
    }
  };
  
  if (isLoading) {
    return (
      <Container>
        <div className="py-12 flex justify-center">
          <div className="text-center">
            <Spinner size="lg" className="mb-4" />
            <p className="text-gray-600">Loading your exam results...</p>
          </div>
        </div>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container>
        <div className="py-12">
          <Card className="max-w-lg mx-auto p-6 text-center">
            <h2 className="text-xl font-bold text-red-600 mb-4">Error Loading Results</h2>
            <p className="mb-6">
              {error instanceof Error 
                ? error.message 
                : 'Failed to load exam results. Please try again.'}
            </p>
            <Button onClick={handleBackToDashboard}>Return to Dashboard</Button>
          </Card>
        </div>
      </Container>
    );
  }
  
  if (!result) {
    return (
      <Container>
        <div className="py-12">
          <Card className="max-w-lg mx-auto p-6 text-center">
            <h2 className="text-xl font-bold mb-4">Results Not Found</h2>
            <p className="mb-6">
              We couldn't find the exam results you're looking for. The attempt may have been deleted or may not exist.
            </p>
            <Button onClick={handleBackToDashboard}>Return to Dashboard</Button>
          </Card>
        </div>
      </Container>
    );
  }
  
  return (
    <Container>
      {showReview ? (
        <ExamReview 
          result={result}
          onBack={() => setShowReview(false)}
          onFinish={handleBackToDashboard}
        />
      ) : (
        <ExamResults 
          result={result}
          onReview={() => setShowReview(true)}
          onTryAgain={handleTryAgain}
          onBackToDashboard={handleBackToDashboard}
        />
      )}
    </Container>
  );
}