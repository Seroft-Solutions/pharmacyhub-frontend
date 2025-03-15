'use client';

import { usePublishedExams } from '../hooks/useExamQueries';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';

export function ExamList() {
  const { data: exams, isLoading, error, refetch } = usePublishedExams();
  const router = useRouter();

  const handleStartExam = (examId: number) => {
    router.push(`/exams/${examId}`);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle><Skeleton className="h-6 w-3/4" /></CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full mb-2" />
              <div className="flex gap-2 mt-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-16" />
              </div>
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 p-4 rounded-md border border-red-300 text-red-800">
        <h3 className="font-bold">Error loading exams</h3>
        <p>{error instanceof Error ? error.message : 'An unknown error occurred'}</p>
        <Button 
          variant="outline" 
          className="mt-2"
          onClick={() => refetch()}
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (!exams || exams.length === 0) {
    return (
      <Card className="w-full text-center p-6">
        <CardHeader>
          <CardTitle>No Exams Available</CardTitle>
        </CardHeader>
        <CardContent>
          <p>There are currently no published exams available.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {exams.map((exam) => (
        <Card key={exam.id} className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{exam.title}</span>
              <Badge variant="outline">{exam.duration} min</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-sm text-gray-600 mb-4">{exam.description}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              <Badge variant="secondary">{exam.questions?.length || 'N/A'} Questions</Badge>
              <Badge variant="secondary">Score: {exam.passingScore}/{exam.maxScore}</Badge>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={() => handleStartExam(exam.id)}
            >
              Start Exam
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}