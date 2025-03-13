'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Medal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useModelPapers } from "@/features/exams/api/UseExamApi";
import { QueryProvider } from "@/features/tanstack-query-api/components/QueryProvider";
import { ExamPaperCard } from "@/features/exams/ui/ExamPaperCard";
import { Exam, ExamPaperMetadata } from "@/features/exams/model/standardTypes";
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

  // Convert exams to metadata format for the card component
  const papers = modelPapers && modelPapers.length > 0 
    ? modelPapers.map(exam => convertExamToMetadata(exam))
    : [];

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

// Helper function to convert Exam to ExamPaperMetadata format
function convertExamToMetadata(exam: Exam): ExamPaperMetadata {
  return {
    id: exam.id,
    title: exam.title,
    description: exam.description || '',
    difficulty: 'medium', // Default or get from tags
    topics_covered: exam.tags || [],
    total_questions: exam.questions?.length || 0,
    time_limit: exam.duration || 0,
    is_premium: false, // Default or get from a property
    source: 'model'
  };
}