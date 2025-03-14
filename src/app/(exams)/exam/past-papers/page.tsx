'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePastPapers } from "@/features/exams/api";
import { QueryProvider } from "@/features/tanstack-query-api/components/QueryProvider";
import { ExamPaperCard } from "@/features/exams/ui/ExamPaperCard";
import { Exam, ExamPaperMetadata } from "@/features/exams/types/StandardTypes";
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

  // Convert exams to metadata format for the card component
  const papers = pastPapers && pastPapers.length > 0 
    ? pastPapers.map(exam => convertExamToMetadata(exam))
    : [];

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

// Helper function to convert Exam to ExamPaperMetadata format
function convertExamToMetadata(exam: Exam): ExamPaperMetadata {
  return {
    id: exam.id,
    title: exam.title,
    description: exam.description || '',
    difficulty: 'hard', // Default for past papers
    topics_covered: exam.tags || [],
    total_questions: exam.questions?.length || 0,
    time_limit: exam.duration || 0,
    is_premium: true, // Default for past papers as they're typically premium
    source: 'past'
  };
}