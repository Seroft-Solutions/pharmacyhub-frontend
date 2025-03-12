'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Medal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useModelPapers } from "@/features/exams/api/hooks/useExamApi";
import { QueryProvider } from "@/features/tanstack-query-api/components/QueryProvider";
import { ExamPaperCard } from "@/features/exams/ui/ExamPaperCard";
import { ExamPaperMetadata } from "@/features/exams/model/standardTypes";
import { adaptToExamPaperMetadata } from "@/features/exams/api/adapter";
import { Spinner } from "@/components/ui/spinner";

export default function ModelPapersPage() {
  return (
    <QueryProvider>
      <ModelPapersContent />
    </QueryProvider>
  );
}

function ModelPapersContent() {
  const { data: modelPapers, isLoading, error } = useModelPapers();
  const router = useRouter();

  const handleStartPaper = (paper: ExamPaperMetadata) => {
    router.push(`/exam/${paper.id}`);
  };

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center">
          <Spinner className="h-12 w-12 text-primary" />
          <p className="mt-4 text-gray-600">Loading model papers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Model Papers
        </h1>
        <Card className="w-full p-6 text-center bg-red-50">
          <div className="flex flex-col items-center justify-center py-8">
            <Medal className="h-12 w-12 text-red-400 mb-4" />
            <h2 className="text-xl font-semibold text-red-700">Error Loading Papers</h2>
            <p className="text-red-600 mt-2">
              {error instanceof Error ? error.message : 'Failed to load model papers'}
            </p>
          </div>
        </Card>
      </div>
    );
  }

  // Fallback to mock data if API doesn't return any papers
  const papers = modelPapers && modelPapers.length > 0 
    ? modelPapers.map(paper => adaptToExamPaperMetadata(paper))
    : getStaticModelPapers();

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Model Papers
      </h1>

      {papers.length === 0 ? (
        <Card className="w-full p-6 text-center">
          <div className="flex flex-col items-center justify-center py-12">
            <Medal className="h-12 w-12 text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-700">No Model Papers Available</h2>
            <p className="text-gray-500 mt-2">Check back later for new model papers.</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {papers.map((paper) => (
            <ExamPaperCard
              key={paper.id}
              paper={paper}
              onStart={handleStartPaper}
            />
          ))}
        </div>
      )}
    </main>
  );
}

// Fallback function to get static model papers if API fails
function getStaticModelPapers(): ExamPaperMetadata[] {
  return [
    {
      id: 'mp-001',
      title: 'Pharmacology Basics 2024',
      description: 'Comprehensive review of basic pharmacology principles',
      difficulty: 'easy',
      topics_covered: ['Basic Pharmacology', 'Drug Classification', 'Mechanisms of Action'],
      total_questions: 50,
      time_limit: 60,
      is_premium: false,
      source: 'model'
    },
    {
      id: 'mp-002',
      title: 'Clinical Pharmacy Practice',
      description: 'Advanced clinical pharmacy scenarios and case studies',
      difficulty: 'hard',
      topics_covered: ['Patient Care', 'Clinical Decision Making', 'Therapeutic Management'],
      total_questions: 75,
      time_limit: 90,
      is_premium: true,
      source: 'model'
    },
    {
      id: 'mp-003',
      title: 'Pharmaceutical Calculations',
      description: 'Essential calculations for pharmacy practice',
      difficulty: 'medium',
      topics_covered: ['Dosage Calculations', 'Concentration Calculations', 'Compounding'],
      total_questions: 40,
      time_limit: 60,
      is_premium: false,
      source: 'model'
    },
  ];
}