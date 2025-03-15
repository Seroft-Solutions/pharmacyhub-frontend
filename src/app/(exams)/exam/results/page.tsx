'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  useUserExamAttempts 
} from '@/features/exams/api/hooks/useExamApi';
import { QueryProvider } from '@/features/core/tanstack-query-api/components/QueryProvider';
import { Container } from '@/components/layout/container';
import { Spinner } from '@/components/ui/spinner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ClipboardCheck, 
  FileText, 
  Clock,
  Calendar,
  Search,
  ArrowUpDown,
  ArrowRight
} from 'lucide-react';
import { formatTimeVerbose } from '@/features/exams/utils/formatTime';
import { ExamAttempt, AttemptStatus } from '@/features/exams/model/standardTypes';

export default function ResultsPage() {
  return (
    <QueryProvider>
      <ResultsContent />
    </QueryProvider>
  );
}

// Mock data for when the API isn't available
const mockAttempts: ExamAttempt[] = [
  {
    id: 123,
    examId: 456,
    userId: "user-123",
    startTime: "2023-05-15T14:30:00Z",
    endTime: "2023-05-15T15:30:00Z",
    status: AttemptStatus.COMPLETED
  },
  {
    id: 124,
    examId: 457,
    userId: "user-123",
    startTime: "2023-05-18T10:00:00Z",
    endTime: "2023-05-18T11:15:00Z",
    status: AttemptStatus.COMPLETED
  },
  {
    id: 125,
    examId: 458,
    userId: "user-123",
    startTime: "2023-05-20T16:00:00Z", 
    status: AttemptStatus.IN_PROGRESS
  }
];

const examTitles = {
  456: "Pharmacology Basics 2024",
  457: "Clinical Pharmacy Practice",
  458: "Pharmaceutical Calculations"
};

function ResultsContent() {
  const router = useRouter();
  const { 
    data: attempts, 
    isLoading, 
    error 
  } = useUserExamAttempts();
  
  // Use mock data if API fails or for development
  const userAttempts = attempts || mockAttempts;
  
  const handleViewResults = (attemptId: number) => {
    router.push(`/exam/results/${attemptId}`);
  };
  
  const getExamTitle = (examId: number) => {
    return examTitles[examId as keyof typeof examTitles] || `Exam ${examId}`;
  };
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
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
  
  return (
    <Container>
      <div className="py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">My Results</h1>
            <p className="text-gray-600">View your exam attempts and results</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2">
              <Search className="h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" className="gap-2">
              <ArrowUpDown className="h-4 w-4" />
              Sort
            </Button>
          </div>
        </div>
        
        <Card className="mb-8">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl flex items-center">
              <ClipboardCheck className="mr-2 h-5 w-5" />
              Exam Results
            </CardTitle>
            <CardDescription>
              Showing your {userAttempts.length} most recent exam attempts
            </CardDescription>
          </CardHeader>
          <CardContent>
            {userAttempts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">You haven't attempted any exams yet.</p>
                <Button onClick={() => router.push('/exam/dashboard')}>
                  Browse Exams
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Exam</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userAttempts.map((attempt) => {
                    const durationSeconds = attempt.endTime 
                      ? (new Date(attempt.endTime).getTime() - new Date(attempt.startTime).getTime()) / 1000
                      : 0;
                    
                    return (
                      <TableRow key={attempt.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-gray-400" />
                            {getExamTitle(attempt.examId)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            {formatDate(attempt.startTime)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              attempt.status === AttemptStatus.COMPLETED
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : attempt.status === AttemptStatus.IN_PROGRESS
                                ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                : "bg-red-100 text-red-800 hover:bg-red-100"
                            }
                          >
                            {attempt.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {attempt.endTime ? (
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-gray-400" />
                              {formatTimeVerbose(durationSeconds)}
                            </div>
                          ) : (
                            <span className="text-gray-500">In Progress</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {attempt.status === AttemptStatus.COMPLETED ? (
                            <Button
                              size="sm"
                              onClick={() => handleViewResults(attempt.id)}
                              className="flex items-center"
                            >
                              View Results
                              <ArrowRight className="ml-1 h-4 w-4" />
                            </Button>
                          ) : attempt.status === AttemptStatus.IN_PROGRESS ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => router.push(`/exam/${attempt.examId}`)}
                            >
                              Continue
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              disabled
                            >
                              Abandoned
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
        
        {/* Statistics Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Performance Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-50 p-4 rounded-lg flex flex-col items-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {userAttempts.filter(a => a.status === AttemptStatus.COMPLETED).length}
                </div>
                <div className="text-sm text-gray-600">Completed Exams</div>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-lg flex flex-col items-center">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  75%
                </div>
                <div className="text-sm text-gray-600">Average Score</div>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-lg flex flex-col items-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">
                  8
                </div>
                <div className="text-sm text-gray-600">Total Study Hours</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}