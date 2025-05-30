'use client';

import { Card } from "@/components/ui/card";
import { Medal, FileText, Award } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePastPapers } from "@/features/exams/api";
import { QueryProvider } from "@/features/core/tanstack-query-api/components/QueryProvider";
import { ExamPaperCard } from "@/features/exams/components/ExamPaperCard";
import { Exam, ExamPaperMetadata } from "@/features/exams/types/StandardTypes";

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
    router.push(`/exam/${paper.id}?type=past`);
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-4 border-b border-gray-200">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Past Papers
            </h1>
            <p className="text-gray-500 mt-1">
              Review previous exam papers to understand real examination patterns
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="h-8 w-32 bg-slate-200 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Skeleton loading grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="border border-slate-200 rounded-lg h-80 overflow-hidden flex flex-col animate-pulse">
              <div className="h-3 w-full bg-purple-200"></div>
              <div className="p-4 pb-2">
                <div className="h-6 w-24 bg-slate-200 rounded mb-3"></div>
                <div className="h-7 w-3/4 bg-slate-200 rounded mb-2"></div>
                <div className="h-4 w-5/6 bg-slate-100 rounded"></div>
              </div>
              <div className="p-4 pt-0 flex-grow space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slate-100 rounded-lg p-3 flex flex-col items-center space-y-1">
                    <div className="h-5 w-5 bg-slate-200 rounded"></div>
                    <div className="h-6 w-8 bg-slate-200 rounded"></div>
                  </div>
                  <div className="bg-slate-100 rounded-lg p-3 flex flex-col items-center space-y-1">
                    <div className="h-5 w-5 bg-slate-200 rounded"></div>
                    <div className="h-6 w-8 bg-slate-200 rounded"></div>
                  </div>
                </div>
                <div className="pt-2">
                  <div className="flex justify-between items-center mb-2">
                    <div className="h-4 w-16 bg-slate-200 rounded"></div>
                    <div className="h-6 w-20 bg-slate-200 rounded"></div>
                  </div>
                </div>
              </div>
              <div className="p-4 pt-3 border-t border-slate-200">
                <div className="flex justify-center">
                  <div className="h-8 w-28 bg-slate-200 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-4 border-b border-gray-200">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Past Papers
            </h1>
            <p className="text-gray-500 mt-1">
              Review previous exam papers to understand real examination patterns
            </p>
          </div>
        </div>
        
        <Card className="w-full p-6 bg-red-50 border-red-200 shadow-sm">
          <div className="flex flex-col items-center justify-center py-8">
            <div className="bg-red-100 p-4 rounded-full mb-4">
              <FileText className="h-16 w-16 text-red-400" />
            </div>
            <h2 className="text-2xl font-semibold text-red-700">Error Loading Papers</h2>
            <p className="text-red-600 mt-2 max-w-md text-center">
              {error instanceof Error ? error.message : 'Failed to load past papers'}
            </p>
            <Button 
              variant="outline" 
              className="mt-6 bg-white hover:bg-red-50 text-red-600 border-red-200"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Convert exams to metadata format for the card component
  const papers = pastPapers && pastPapers.length > 0 
    ? pastPapers.map(exam => convertExamToMetadata(exam))
    : [];

  // Add debugging to check what data we're getting
  console.log('Original pastPapers data:', pastPapers);
  console.log('Converted papers data:', papers);

  return (
    <main className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Past Papers
          </h1>
          <p className="text-gray-500 mt-1">
            Review previous exam papers to understand real examination patterns
          </p>
        </div>
        <div className="flex items-center mt-4 md:mt-0 space-x-2">
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 font-medium py-1.5">
            <FileText className="h-4 w-4 mr-1" />
            Past Papers
          </Badge>
          <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 font-medium py-1.5">
            <FileText className="h-4 w-4 mr-1" />
            {papers.length} Available
          </Badge>
        </div>
      </div>

      {papers.length === 0 ? (
        <Card className="w-full p-6 text-center bg-slate-50 border-dashed">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="bg-slate-100 p-4 rounded-full mb-4">
              <FileText className="h-16 w-16 text-slate-400" />
            </div>
            <h2 className="text-2xl font-semibold text-slate-700">No Past Papers Available</h2>
            <p className="text-slate-500 mt-2 max-w-md">Check back later for past papers. We're working on adding more study resources.</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
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
  // Debug the exam data structure to see what fields are available
  console.log('Converting exam data:', exam);
  
  return {
    id: exam.id,
    title: exam.title,
    description: exam.description || '',
    // Check for difficulty property before defaulting to 'hard'
    difficulty: exam.difficulty ? 
      (typeof exam.difficulty === 'string' ? exam.difficulty.toLowerCase() : 'hard') : 
      'hard',
    topics_covered: exam.tags || [],
    // Check for questionCount (from ExamPaper) or questions.length (from Exam)
    total_questions: (exam as any).questionCount || exam.questions?.length || 0,
    // Check for durationMinutes (from ExamPaper) or duration (from Exam)
    time_limit: (exam as any).durationMinutes || exam.duration || 0,
    is_premium: exam.premium || false,
    premium: exam.premium || false,
    price: exam.premium ? ((exam as any).price || 2000) : 0,
    purchased: exam.purchased || false,
    universalAccess: (exam as any).universalAccess || false,
    source: 'past',
    paymentStatus: exam.paymentStatus || 'PAID', // Default to PAID for past papers
  };
}