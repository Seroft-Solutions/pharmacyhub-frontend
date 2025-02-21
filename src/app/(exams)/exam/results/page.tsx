import React from 'react';
import { ResultsView } from '@/features/exams/ui/results/ResultsView';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Exam Results | PharmacyHub',
    description: 'Review your exam performance and analyze your results',
};

export default function ResultsPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <ResultsView />
        </div>
    );
}