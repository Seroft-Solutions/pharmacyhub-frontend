import React from 'react';
import { ReviewMode } from '@/features/exams/components/review/ReviewMode';
import { useExamStore } from '@/features/exams/store/examStore';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { examService } from '@/features/exams';

interface ReviewPageProps {
    params: Promise<{
        id: string;
    }>;
}

export async function generateMetadata({ params }: ReviewPageProps): Promise<Metadata> {
    const { id } = await params;
    const paper = await examService.getExamById(parseInt(id));
    
    return {
        title: `Review ${paper.title} | PharmacyHub`,
        description: `Review your answers and explanations for ${paper.title}`,
    };
}

export default async function ReviewPage({ params }: ReviewPageProps) {
    // Get the paper and exam state
    const { id } = await params;
    const paper = await examService.getExamById(parseInt(id)).catch(() => null);
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
