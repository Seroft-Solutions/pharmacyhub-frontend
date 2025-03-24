"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  CheckCircleIcon,
  ClipboardListIcon,
  Loader2Icon,
  AlertTriangleIcon,
  Clock8Icon,
  Play as PlayIcon,
  DollarSignIcon
} from 'lucide-react';
import { NetworkStatusIndicator } from '../common/NetworkStatusIndicator';
import { useMobileStore, selectIsMobile } from '@/features/core/mobile-support';

// Import responsive styles
import '@/features/exams/styles/exam-responsive.css';

/**
 * ExamStartScreen - Responsive component for displaying exam information before starting
 *
 * This component shows exam metadata and instructions with proper responsiveness
 * for both mobile and desktop views.
 */
export const ExamStartScreen = ({
  exam,
  premiumInfo,
  isStarting,
  isOnline,
  startError,
  handleStartExam
}) => {
  const isMobile = useMobileStore(selectIsMobile);

  return (
    <Card className="exam-start-card w-full shadow-lg border-t-4 border-t-blue-500 rounded-xl overflow-hidden">
      <CardHeader className={`pb-3 border-b bg-gradient-to-r from-blue-50 to-white ${isMobile ? 'px-4 py-4' : 'px-6 py-5'}`}>
        <div className="flex justify-between items-center">
          <CardTitle className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-blue-700`}>
            {exam.title}
            {premiumInfo?.premium && (
              <Badge variant="secondary" className="ml-2 bg-gradient-to-r from-amber-300 to-amber-500 text-white">
                <DollarSignIcon className="h-3 w-3 mr-1" />
                Premium
              </Badge>
            )}
          </CardTitle>
          <NetworkStatusIndicator />
        </div>
      </CardHeader>

      <CardContent className={`pt-6 pb-6 ${isMobile ? 'px-4' : 'px-6'}`}>
        <div className={`space-y-${isMobile ? '5' : '6'}`}>

          {/* Exam Stats - Responsive Grid */}
          <div className="exam-stats-grid bg-gradient-to-r from-blue-50 to-white p-4 rounded-xl shadow-sm border border-blue-100">
            {/* Duration */}
            <div className="exam-stats-item flex items-center space-x-3">
              <div className={`bg-blue-100 p-${isMobile ? '2' : '3'} rounded-full`}>
                <Clock8Icon className={`${isMobile ? 'h-6 w-6' : 'h-8 w-8'} text-blue-600`} />
              </div>
              <div>
                <h3 className={`${isMobile ? 'text-xs' : 'text-sm'} font-semibold text-gray-500`}>Duration</h3>
                <p className={`${isMobile ? 'text-lg' : 'text-xl'} font-medium`}>{exam.duration || exam.durationMinutes || 60} minutes</p>
              </div>
            </div>

            {/* Questions */}
            <div className="exam-stats-item flex items-center space-x-3">
              <div className={`bg-green-100 p-${isMobile ? '2' : '3'} rounded-full`}>
                <ClipboardListIcon className={`${isMobile ? 'h-6 w-6' : 'h-8 w-8'} text-green-600`} />
              </div>
              <div>
                <h3 className={`${isMobile ? 'text-xs' : 'text-sm'} font-semibold text-gray-500`}>Questions</h3>
                <p className={`${isMobile ? 'text-lg' : 'text-xl'} font-medium`}>{exam.questions?.length || exam.questionCount || 7}</p>
              </div>
            </div>

            {/* Total Marks */}
            <div className="exam-stats-item flex items-center space-x-3">
              <div className={`bg-indigo-100 p-${isMobile ? '2' : '3'} rounded-full`}>
                <CheckCircleIcon className={`${isMobile ? 'h-6 w-6' : 'h-8 w-8'} text-indigo-600`} />
              </div>
              <div>
                <h3 className={`${isMobile ? 'text-xs' : 'text-sm'} font-semibold text-gray-500`}>Total Marks</h3>
                <p className={`${isMobile ? 'text-lg' : 'text-xl'} font-medium`}>{exam.totalMarks || 7}</p>
              </div>
            </div>

            {/* Passing Marks */}
            <div className="exam-stats-item flex items-center space-x-3">
              <div className={`bg-amber-100 p-${isMobile ? '2' : '3'} rounded-full`}>
                <AlertTriangleIcon className={`${isMobile ? 'h-6 w-6' : 'h-8 w-8'} text-amber-600`} />
              </div>
              <div>
                <h3 className={`${isMobile ? 'text-xs' : 'text-sm'} font-semibold text-gray-500`}>Passing Marks</h3>
                <p className={`${isMobile ? 'text-lg' : 'text-xl'} font-medium`}>{exam.passingMarks || 5}</p>
              </div>
            </div>
          </div>

          {/* Instructions - Adjusted for Mobile */}
          <div className="exam-instructions bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg shadow-sm">
            <h3 className="text-blue-800 font-medium mb-3">Instructions:</h3>
            <ul className="list-disc list-inside text-blue-700 space-y-1.5">
              <li>Read each question carefully before answering.</li>
              <li>You can flag questions to review later.</li>
              <li>Once the time is up, the exam will be submitted automatically.</li>
              <li>You can review all your answers before final submission.</li>
              <li>You must click the "Start Exam" button to begin.</li>
            </ul>
          </div>

          {/* Offline Warning */}
          {!isOnline && (
            <Alert variant="warning" className="bg-amber-50 border-amber-200">
              <AlertTriangleIcon className="h-4 w-4" />
              <AlertTitle>Limited connectivity</AlertTitle>
              <AlertDescription>
                You are currently offline. Your progress will be saved locally, but you need an internet connection to submit the exam.
              </AlertDescription>
            </Alert>
          )}

          {/* Start Button - Responsive Sizing */}
          <Button
            onClick={handleStartExam}
            disabled={isStarting || !isOnline}
            className="exam-button w-full bg-blue-600 hover:bg-blue-700 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-1 rounded-lg"
            size="default"
          >
            {isStarting ? (
              <span className="flex items-center justify-center">
                <Loader2Icon className="h-5 w-5 mr-2 animate-spin" />
                Starting...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <PlayIcon className="h-5 w-5 mr-2" />
                Start Exam
              </span>
            )}
          </Button>

          {/* Error Display */}
          {startError && (
            <Alert variant="destructive">
              <AlertDescription>
                {startError instanceof Error ? startError.message : 'Failed to start exam'}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
};