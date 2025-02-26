'use client';

import React from 'react';
import { McqExamLayout } from '@/features/exams/ui/mcq';

interface ExamPageProps {
    params: {
        id: string;
    };
}

export default function ExamPage({ params }: ExamPageProps) {
    const examId = parseInt(params.id, 10);
    
    if (isNaN(examId)) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="bg-red-50 text-red-600 p-4 rounded-lg max-w-lg text-center">
                    <h2 className="text-xl font-bold mb-2">Invalid Exam ID</h2>
                    <p>The exam ID provided is not valid. Please try again with a valid ID.</p>
                </div>
            </div>
        );
    }
    
    return <McqExamLayout examId={examId} />;
}
