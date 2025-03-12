'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2, CheckCircle2 } from 'lucide-react';
import { useExam, useStartExamMutation } from '../api/hooks/useExamApi';
import { McqExamLayout } from './mcq/McqExamLayout';
import { examService } from '../api/core/examService';
import { useMcqExamStore } from '../store/mcqExamStore';
import { Exam, ExamAttempt } from '../model/standardTypes';
import { Spinner } from '@/components/ui/spinner';

interface ExamContainerProps {
  examId: number;
  userId: string;
  onExit: () => void;
}

export const ExamContainer: React.FC<ExamContainerProps> = ({ 
  examId, 
  userId,
  onExit
}) => {
  const [showStartDialog, setShowStartDialog] = useState<boolean>(false);
  const [examStarted, setExamStarted] = useState<boolean>(false);
  const [currentAttempt, setCurrentAttempt] = useState<ExamAttempt | null>(null);
  const [isStarting, setIsStarting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const { 
    data: exam,
    isLoading: isExamLoading,
    error: examError
  } = useExam(examId);
  
  // Reset store when component unmounts
  useEffect(() => {
    return () => {
      useMcqExamStore.getState().resetExam();
    };
  }, []);
  
  const handleStartExam = async () => {
    setIsStarting(true);
    setError(null);
    
    try {
      // Start the exam and get attempt
      const attempt = await examService.startExam(examId);
      setCurrentAttempt(attempt);
      
      // Initialize Zustand store with exam data
      if (exam) {
        const examStore = useMcqExamStore.getState();
        await examStore.fetchExamById(examId);
        await examStore.startExam(examId);
      }
      
      setExamStarted(true);
    } catch (err) {
      console.error('Failed to start exam:', err);
      setError(err instanceof Error ? err.message : 'Failed to start exam. Please try again.');
    } finally {
      setIsStarting(false);
      setShowStartDialog(false);
    }
  };
  
  if (isExamLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Spinner className="w-12 h-12 text-primary mb-4" />
        <p className="text-lg">Loading exam...</p>
      </div>
    );
  }
  
  if (examError || !exam) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-red-50 text-red-600 p-6 rounded-lg max-w-lg text-center shadow-md">
          <h2 className="text-xl font-bold mb-4">Error</h2>
          <p className="mb-4">
            {examError instanceof Error 
              ? examError.message 
              : 'Failed to load exam. The exam may not exist or you may not have access.'}
          </p>
          <Button 
            className="mt-4 bg-red-600 hover:bg-red-700 text-white" 
            onClick={onExit}
          >
            Return to Exams
          </Button>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-red-50 text-red-600 p-6 rounded-lg max-w-lg text-center shadow-md">
          <h2 className="text-xl font-bold mb-4">Error Starting Exam</h2>
          <p className="mb-4">{error}</p>
          <Button 
            className="mt-4" 
            onClick={() => setError(null)}
          >
            Try Again
          </Button>
          <Button 
            className="mt-4 ml-4" 
            variant="outline"
            onClick={onExit}
          >
            Return to Exams
          </Button>
        </div>
      </div>
    );
  }
  
  if (examStarted && exam) {
    return <McqExamLayout examId={examId} />;
  }
  
  return (
    <div className="max-w-3xl mx-auto py-8">
      <Card className="border-2 border-gray-200">
        <CardHeader className="bg-gray-50">
          <CardTitle className="text-2xl">{exam.title}</CardTitle>
          <CardDescription>{exam.description}</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Total Questions</span>
              <span className="text-lg font-semibold">{exam.questions?.length || 'Not specified'}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Time Limit</span>
              <span className="text-lg font-semibold">{exam.duration} minutes</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Total Marks</span>
              <span className="text-lg font-semibold">{exam.totalMarks}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Passing Score</span>
              <span className="text-lg font-semibold">{exam.passingMarks} ({(exam.passingMarks / exam.totalMarks * 100).toFixed(0)}%)</span>
            </div>
          </div>
          
          <div className="rounded-md border p-4">
            <h3 className="font-medium mb-2">Instructions</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-start">
                <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                <span>Read each question carefully and select the best answer.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                <span>You can flag questions to review later.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                <span>The timer will begin as soon as you start the exam.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                <span>Results will be available immediately after submission.</span>
              </li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="bg-gray-50 flex justify-between">
          <Button variant="outline" onClick={onExit}>
            Back to Exams
          </Button>
          <Button onClick={() => setShowStartDialog(true)}>
            Begin Exam
          </Button>
        </CardFooter>
      </Card>
      
      <AlertDialog open={showStartDialog} onOpenChange={setShowStartDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Start Exam?</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to start "{exam.title}". This exam has a time limit of {exam.duration} minutes.
              The timer will begin immediately after you start. Are you ready to begin?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleStartExam} disabled={isStarting}>
              {isStarting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Starting...
                </>
              ) : (
                'Start Exam'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};