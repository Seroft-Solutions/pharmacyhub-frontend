"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  CheckCircleIcon,
  ClipboardListIcon,
  Loader2Icon,
  AlertTriangleIcon,
  Clock8Icon,
  Play as PlayIcon,
  DollarSignIcon,
  ChevronUp,
  BookOpenIcon,
  GraduationCapIcon,
  LockIcon
} from 'lucide-react';
import { NetworkStatusIndicator } from '../common/NetworkStatusIndicator';
import { InfoIcon, AlertCircleIcon } from 'lucide-react';
import { useMobileStore, selectIsMobile } from '../../../core/app-mobile-handler';
import { usePremiumExamInfo } from '@/features/payments/premium/components/PremiumExamInfoProvider';

/**
 * ExamStartScreen - Simplified component with enhanced header
 * Now uses the PremiumExamInfoProvider context
 */
export const ExamStartScreen = ({
  exam,
  isStarting,
  isOnline,
  startError,
  handleStartExam,
  examType
}) => {
  const isMobile = useMobileStore(selectIsMobile);
  
  // Get premium info from context instead of props
  const { isPremium} = usePremiumExamInfo();

  // Normal start screen for non-premium or premium with access
  return (
    <div className="w-full bg-white">
      {/* Enhanced Header with Title */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 text-white p-5 rounded-b-lg shadow-md relative overflow-hidden">
        {/* Decorative element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mt-12 -mr-12"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full -ml-8 -mb-8"></div>

        <div className="flex items-center">
          <GraduationCapIcon className="h-7 w-7 mr-3" />
          <div>
            <h1 className="text-2xl font-bold">
              {exam.title}
            </h1>
            <div className="mt-1 flex items-center">
              {isPremium && (
                <div className="inline-flex items-center px-2 py-1 rounded-full bg-amber-400 text-white text-xs font-medium mr-2">
                  <DollarSignIcon className="h-3 w-3 mr-1" />
                  Premium
                </div>
              )}
              <div className="text-sm opacity-90">Enhance your knowledge with our expertly curated questions</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 text-center py-3 border-b">
        <div className="flex flex-col items-center">
          <Clock8Icon className="h-5 w-5 text-blue-600 mb-1" />
          <div className="text-xs text-gray-500 mb-0.5">Duration</div>
          <div className="text-sm font-medium">{exam.duration || exam.durationMinutes || 60} min</div>
        </div>
        
        <div className="flex flex-col items-center">
          <ClipboardListIcon className="h-5 w-5 text-green-600 mb-1" />
          <div className="text-xs text-gray-500 mb-0.5">Questions</div>
          <div className="text-sm font-medium">{exam.questions?.length || exam.questionCount || 7}</div>
        </div>
        
        <div className="flex flex-col items-center">
          <CheckCircleIcon className="h-5 w-5 text-blue-600 mb-1" />
          <div className="text-xs text-gray-500 mb-0.5">Total Marks</div>
          <div className="text-sm font-medium">{exam.totalMarks || 7}</div>
        </div>
        
        <div className="flex flex-col items-center">
          <AlertTriangleIcon className="h-5 w-5 text-amber-600 mb-1" />
          <div className="text-xs text-gray-500 mb-0.5">Passing</div>
          <div className="text-sm font-medium">{exam.passingMarks || 5}</div>
        </div>
      </div>

      {/* Instructions Section */}
      <div className="m-2">
        <div className="bg-blue-50 rounded-md">
          <div className="flex items-center justify-between px-4 py-2 text-blue-800 font-medium">
            Instructions
            <ChevronUp className="h-4 w-4 text-blue-600" />
          </div>
          
          <div className="px-4 py-3">
            <ul className="space-y-2">
              <li className="flex items-start">
                <div className="h-2.5 w-2.5 bg-blue-400 opacity-80 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                <span className="text-sm text-blue-700">Read each question carefully before answering.</span>
              </li>
              <li className="flex items-start">
                <div className="h-2.5 w-2.5 bg-blue-400 opacity-80 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                <span className="text-sm text-blue-700">You can flag questions to review later.</span>
              </li>
              <li className="flex items-start">
                <div className="h-2.5 w-2.5 bg-blue-400 opacity-80 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                <span className="text-sm text-blue-700">Once the time is up, the exam will be submitted automatically.</span>
              </li>
              <li className="flex items-start">
                <div className="h-2.5 w-2.5 bg-blue-400 opacity-80 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                <span className="text-sm text-blue-700">You can review all your answers before final submission.</span>
              </li>
              <li className="flex items-start">
                <div className="h-2.5 w-2.5 bg-blue-400 opacity-80 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                <span className="text-sm text-blue-700">You must click the "Start Exam" button to begin.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Disclaimer Section - Conditional based on exam type */}
      {examType && (
        <div className="px-2 my-3">
          <div className={`rounded-md p-3 ${examType === 'past' ? 'bg-amber-50' : 'bg-gray-50'}`}>
            <div className="flex items-start">
              <AlertCircleIcon className={`h-5 w-5 mt-0.5 mr-2 flex-shrink-0 ${examType === 'past' ? 'text-amber-500' : 'text-gray-500'}`} />
              <div>
                <h3 className={`text-sm font-medium mb-1 ${examType === 'past' ? 'text-amber-800' : 'text-gray-800'}`}>
                  Disclaimer:
                </h3>
                <div className={`text-sm ${examType === 'past' ? 'text-amber-700' : 'text-gray-600'}`}>
                  {examType === 'past' ? (
                    <p>
                      Past papers have been compiled from various sources. Some questions were incomplete or only partially available, 
                      so we formulated answer choices to create meaningful MCQs while ensuring the original question remained unchanged. 
                      This collection is intended to provide insight into the types of questions that appeared in previous exams. 
                      You will understand the approach as you solve them. These papers serve as a reference to help you familiarize 
                      yourself with past exam patterns.
                    </p>
                  ) : (
                    <ul className="space-y-1">
                      <li>While we strive for accuracy (99%+), errors may still occur.</li>
                      <li>Readers are encouraged to verify information from standard references.</li>
                      <li>Use at your own discretion; feedback for corrections is welcome.</li>
                      <li>No legal claims shall arise from reliance on this content.</li>
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Start Button */}
      <div className="px-2 my-3">
        <Button
          onClick={handleStartExam}
          disabled={isStarting || !isOnline}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
        >
          {isStarting ? (
            <span className="flex items-center justify-center">
              <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
              Starting...
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <PlayIcon className="h-4 w-4 mr-2" />
              Start Exam
            </span>
          )}
        </Button>
      </div>

      {/* Error Message */}
      {startError && (
        <div className="fixed bottom-16 left-1/2 transform -translate-x-1/2 z-10">
          <div className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-full shadow-lg">
            <AlertTriangleIcon className="h-5 w-5" />
            <span className="font-medium text-sm">1 error</span>
            <button className="ml-2 text-white">
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};