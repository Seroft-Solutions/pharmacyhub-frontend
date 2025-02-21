import React from 'react';
import { ExamLayout } from '@/features/exams/ui/quiz/ExamLayout';
import { examService } from '@/features/exams/api/examService';
import { useExamStore } from '@/features/exams/store/examStore';

interface ExamPageProps {
    params: {
        id: string;
    };
}

export default async function ExamPage({ params }: ExamPageProps) {
    const paper = await examService.getPaper(params.id);
    
    // Initialize exam in store
    useExamStore.getState().startExam(paper);

    return <ExamLayout />;
}