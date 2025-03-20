import React from 'react';
import { ReviewMode } from '@/features/exams/components/review/ReviewMode';
import { useExamStore } from '@/features/exams/store/examStore';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { examService } from '@/features/exams';

// @ts-ignore - Next.js type issues
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const { id } = params;
    const paper = await examService.getExamById(parseInt(id));
    
    return {
        title: `Review ${paper.title} | PharmacyHub`,
        description: `Review your answers and explanations for ${paper.title}`,
    };
}

// @ts-ignore - Next.js type issues
export default async function ReviewPage({ params }: { params: { id: string } }) {
    // Get the paper and exam state
    const { id } = params;
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
