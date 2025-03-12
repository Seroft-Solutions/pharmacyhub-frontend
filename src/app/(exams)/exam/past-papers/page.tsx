'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePastPapers } from "@/features/exams/api/hooks/useExamApi";
import { QueryProvider } from "@/features/tanstack-query-api/components/QueryProvider";
import { ExamPaperCard } from "@/features/exams/ui/ExamPaperCard";
import { ExamPaperMetadata } from "@/features/exams/model/standardTypes";
import { adaptToExamPaperMetadata } from "@/features/exams/api/adapter";
import { Spinner } from "@/components/ui/spinner";

export default function PastPapersPage() {
  return (
    <QueryProvider>
      <PastPapersContent />
    </QueryProvider>
  );
}

function PastPapersContent() {
  const { data: pastPapers, isLoading, error } = usePastPapers();
  const router = useRouter();

  const handleStartPaper = (paper: ExamPaperMetadata) => {
    router.push(`/exam/${paper.id}`);
  };

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center">
          <Spinner className="h-12 w-12 text-primary" />
          <p className="mt-4 text-gray-600">Loading past papers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Past Papers
        </h1>
        <Card className="w-full p-6 text-center bg-red-50">
          <div className="flex flex-col items-center justify-center py-8">
            <FileText className="h-12 w-12 text-red-400 mb-4" />
            <h2 className="text-xl font-semibold text-red-700">Error Loading Papers</h2>
            <p className="text-red-600 mt-2">
              {error instanceof Error ? error.message : 'Failed to load past papers'}
            </p>
          </div>
        </Card>
      </div>
    );
  }

  // Fallback to mock data if API doesn't return any papers
  const papers = pastPapers && pastPapers.length > 0 
    ? pastPapers.map(paper => adaptToExamPaperMetadata(paper))
    : getStaticPastPapers();

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Past Papers
      </h1>

      {papers.length === 0 ? (
        <Card className="w-full p-6 text-center">
          <div className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-700">No Past Papers Available</h2>
            <p className="text-gray-500 mt-2">Check back later for past papers.</p>
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

// Fallback function to get static past papers if API fails
function getStaticPastPapers(): ExamPaperMetadata[] {
  return [
    {
      id: 'pp-001',
      title: '2023 Board Exam Paper 1',
      description: 'Official board examination from 2023',
      difficulty: 'hard',
      topics_covered: ['Comprehensive', 'Clinical Practice', 'Pharmacy Management'],
      total_questions: 100,
      time_limit: 180,
      is_premium: true,
      source: 'past'
    },
    {
      id: 'pp-002',
      title: '2023 Board Exam Paper 2',
      description: 'Second paper from 2023 board examination',
      difficulty: 'hard',
      topics_covered: ['Drug Therapy', 'Patient Care', 'Pharmacy Operations'],
      total_questions: 100,
      time_limit: 180,
      is_premium: true,
      source: 'past'
    }
  ];
}