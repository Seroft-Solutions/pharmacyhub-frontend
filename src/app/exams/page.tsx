'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/layout/container';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import { usePublishedExams } from '@/features/exams/hooks/useExamQueries';
import { Skeleton } from '@/components/ui/skeleton';

export default function ExamsPage() {
  const router = useRouter();
  const { data: exams, isLoading, error } = usePublishedExams();
  
  const handleStartExam = (examId: number) => {
    router.push(`/exam/${examId}`);
  };
  
  if (isLoading) {
    return (
      <Container>
        <div className="my-8">
          <h1 className="text-3xl font-bold mb-8">Available Exams</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-7 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container>
        <div className="my-8">
          <h1 className="text-3xl font-bold mb-4">Error</h1>
          <p className="text-red-600">
            {error instanceof Error ? error.message : 'Failed to load exams'}
          </p>
          <Button 
            onClick={() => window.location.reload()}
            className="mt-4"
          >
            Try Again
          </Button>
        </div>
      </Container>
    );
  }
  
  return (
    <Container>
      <div className="my-8">
        <h1 className="text-3xl font-bold mb-8">Available Exams</h1>
        
        {exams && exams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exams.map((exam) => (
              <Card key={exam.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle>{exam.title}</CardTitle>
                  <CardDescription>{exam.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-sm text-gray-600">{exam.duration} minutes</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">
                        {exam.totalMarks} marks
                      </Badge>
                      <Badge variant="outline">
                        Pass: {exam.passingMarks}
                      </Badge>
                      {exam.questions?.length && (
                        <Badge variant="outline">
                          {exam.questions.length} questions
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={() => handleStartExam(exam.id)} 
                    className="w-full"
                  >
                    Start Exam
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <h2 className="text-xl font-semibold mb-2">No Exams Available</h2>
            <p className="text-gray-600">
              There are currently no published exams available. Please check back later.
            </p>
          </div>
        )}
      </div>
    </Container>
  );
}
