'use client';

import { Card } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import { QueryProvider } from "@/features/core/tanstack-query-api/components/QueryProvider";
import { useSubjectPapers } from "@/features/exams/api";
import { ExamPaperCard } from "@/features/exams/components/ExamPaperCard";
import { ExamPaper, ExamPaperMetadata } from "@/features/exams/types/StandardTypes";
import { Spinner } from "@/components/ui/spinner";

export default function SubjectPapersPage() {
  return (
    <QueryProvider>
      <SubjectPapersContent />
    </QueryProvider>
  );
}

function SubjectPapersContent() {
  const { data: subjectPapers, isLoading, error } = useSubjectPapers();
  const router = useRouter();

  const handleStartPaper = (paper: ExamPaperMetadata) => {
    router.push(`/exam/${paper.id}`);
  };

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center">
          <Spinner className="h-12 w-12 text-primary" />
          <p className="mt-4 text-gray-600">Loading subject papers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Subject Papers
        </h1>
        <Card className="w-full p-6 text-center bg-red-50">
          <div className="flex flex-col items-center justify-center py-8">
            <BookOpen className="h-12 w-12 text-red-400 mb-4" />
            <h2 className="text-xl font-semibold text-red-700">Error Loading Papers</h2>
            <p className="text-red-600 mt-2">
              {error instanceof Error ? error.message : 'Failed to load subject papers'}
            </p>
          </div>
        </Card>
      </div>
    );
  }

  // Convert exams to metadata format for the card component
  const papers = subjectPapers && subjectPapers.length > 0 
    ? subjectPapers.map(exam => convertExamToMetadata(exam))
    : [];

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Subject Papers
      </h1>

      {papers.length === 0 ? (
        <Card className="w-full p-6 text-center">
          <div className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-700">No Subject Papers Available</h2>
            <p className="text-gray-500 mt-2">Check back later for subject papers.</p>
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
function convertExamToMetadata(exam: ExamPaper): ExamPaperMetadata {
  return {
    id: exam.id,
    title: exam.title,
    description: exam.description || '',
    difficulty: exam.difficulty ? exam.difficulty.toLowerCase() : 'medium', // Convert from MEDIUM to medium, with safe default
    topics_covered: exam.tags || [],
    total_questions: exam.questionCount,
    time_limit: exam.durationMinutes,
    is_premium: exam.premium,
    premium: exam.premium,
    price: exam.premium ? 2000 : 0, // Fixed price of PKR 2,000 for premium papers
    purchased: exam.purchased || false, // Include purchased status
    source: 'subject'
  };
}