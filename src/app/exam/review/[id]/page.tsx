import React from 'react';
import { ReviewMode } from '@/features/exams/ui/review/ReviewMode';
import { examService } from '@/features/exams/api/examService';
import { useExamStore } from '@/features/exams/store/examStore';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface ReviewPageProps {
    params: {
        id: string;
    };
}

export async function generateMetadata({ params }: ReviewPageProps): Promise<Metadata> {
    const paper = await examService.getPaper(params.id);
    
    return {
        title: `Review ${paper.title} | PharmacyHub`,
        description: `Review your answers and explanations for ${paper.title}`,
    };
}

export default async function ReviewPage({ params }: ReviewPageProps) {
    // Get the paper and exam state
    const paper = await examService.getPaper(params.id).catch(() => null);
    const examState = useExamStore.getState();

    // If paper doesn't exist or exam state is empty, show 404
    if (!paper || !examState.answers) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <ReviewMode paper={paper} answers={examState.answers} />
        </div>
    );
}