'use client';

import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Medal, BookOpen, Award, ArrowLeft, Sparkles } from 'lucide-react';
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { QueryProvider } from "@/features/core/tanstack-query-api/components/QueryProvider";
import { useSubjectPapers } from "@/features/exams/api";
import { ExamPaperCard } from "@/features/exams/components/ExamPaperCard";
import { ExamPaper, ExamPaperMetadata } from "@/features/exams/types/StandardTypes";
import { SubjectCard } from "@/features/exams/components/common/SubjectCard";
import { extractSubjectFromTags, getSubjects, groupPapersBySubject } from "@/features/exams/utils/subject";

export default function SubjectPapersPage() {
  return (
    <QueryProvider>
      <SubjectPapersContent />
    </QueryProvider>
  );
}

function SubjectPapersContent() {
  const { data: subjectPapers, isLoading, error } = useSubjectPapers();
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const router = useRouter();

  const handleStartPaper = (paper: ExamPaperMetadata) => {
    router.push(`/exam/${paper.id}`);
  };

  const handleSubjectClick = (subject: string) => {
    setSelectedSubject(subject);
  };

  const handleBackToSubjects = () => {
    setSelectedSubject(null);
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-4 border-b border-gray-200">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Subject Papers
            </h1>
            <p className="text-gray-500 mt-1">
              {selectedSubject 
                ? `Practice with ${selectedSubject}-specific papers to strengthen your knowledge`
                : 'Select a subject to explore topic-specific practice papers'}
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
              <div className="h-3 w-full bg-emerald-200"></div>
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
              Subject Papers
            </h1>
            <p className="text-gray-500 mt-1">
              Practice with subject-specific papers to strengthen your knowledge
            </p>
          </div>
        </div>
        
        <Card className="w-full p-6 bg-red-50 border-red-200 shadow-sm">
          <div className="flex flex-col items-center justify-center py-8">
            <div className="bg-red-100 p-4 rounded-full mb-4">
              <BookOpen className="h-16 w-16 text-red-400" />
            </div>
            <h2 className="text-2xl font-semibold text-red-700">Error Loading Papers</h2>
            <p className="text-red-600 mt-2 max-w-md text-center">
              {error instanceof Error ? error.message : 'Failed to load subject papers'}
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
  const papers = subjectPapers && subjectPapers.length > 0 
    ? subjectPapers.map(exam => convertExamToMetadata(exam))
    : [];

  // Group papers by subject
  const papersBySubject = groupPapersBySubject(subjectPapers || []);
  
  // Get unique subjects with counts
  const subjects = getSubjects(subjectPapers || []);

  return (
    <main className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            {selectedSubject ? `${selectedSubject} Papers` : 'Subject Papers'}
          </h1>
          <p className="text-gray-500 mt-1">
            {selectedSubject
              ? `Practice with ${selectedSubject}-specific papers to strengthen your knowledge`
              : 'Select a subject to explore topic-specific practice papers'}
          </p>
        </div>
        <div className="flex items-center mt-4 md:mt-0 space-x-2">
          {selectedSubject ? (
            <Button 
              variant="outline" 
              onClick={handleBackToSubjects}
              className="bg-white hover:bg-slate-50 flex items-center gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Subjects
            </Button>
          ) : (
            <>
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 font-medium py-1.5">
                <BookOpen className="h-4 w-4 mr-1" />
                Subject Papers
              </Badge>
              <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 font-medium py-1.5">
                <Sparkles className="h-4 w-4 mr-1" />
                {subjects.length} {subjects.length === 1 ? 'Subject' : 'Subjects'}
              </Badge>
            </>
          )}
        </div>
      </div>

      {/* No papers or no subjects case */}
      {papers.length === 0 ? (
        <Card className="w-full p-6 text-center bg-slate-50 border-dashed">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="bg-slate-100 p-4 rounded-full mb-4">
              <BookOpen className="h-16 w-16 text-slate-400" />
            </div>
            <h2 className="text-2xl font-semibold text-slate-700">No Subject Papers Available</h2>
            <p className="text-slate-500 mt-2 max-w-md">Check back later for subject papers. We're working on adding more study resources.</p>
          </div>
        </Card>
      ) : selectedSubject ? (
        // Show papers for selected subject
        <div>
          {papersBySubject[selectedSubject]?.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {papersBySubject[selectedSubject].map(paper => (
                <ExamPaperCard
                  key={paper.id}
                  paper={convertExamToMetadata(paper)}
                  onStart={handleStartPaper}
                />
              ))}
            </div>
          ) : (
            // No papers for this subject
            <Card className="w-full p-6 text-center bg-slate-50 border-dashed">
              <div className="flex flex-col items-center justify-center py-12">
                <div className="bg-slate-100 p-4 rounded-full mb-4">
                  <BookOpen className="h-16 w-16 text-slate-400" />
                </div>
                <h2 className="text-2xl font-semibold text-slate-700">No Papers Available for {selectedSubject}</h2>
                <p className="text-slate-500 mt-2 max-w-md">Check back later for {selectedSubject} papers. We're working on adding more study resources.</p>
                <Button 
                  variant="outline" 
                  onClick={handleBackToSubjects}
                  className="mt-6 bg-white hover:bg-slate-50"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to Subjects
                </Button>
              </div>
            </Card>
          )}
        </div>
      ) : (
        // Show subject cards
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {subjects.map(subject => (
            <SubjectCard
              key={subject.name}
              subject={subject.name}
              count={subject.count}
              onClick={() => handleSubjectClick(subject.name)}
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
    price: exam.price || 0,
    purchased: exam.purchased || false, // Include purchased status
    universalAccess: exam.universalAccess || false, // Include universal access status
    source: 'subject',
    paymentStatus: exam.paymentStatus || 'PAID' // Default to PAID for subject papers
  };
}