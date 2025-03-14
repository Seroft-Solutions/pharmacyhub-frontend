'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import { QueryProvider } from "@/features/tanstack-query-api/components/QueryProvider";
import { ExamPaperCard } from "@/features/exams/ui/ExamPaperCard";
import { ExamPaperMetadata } from "@/features/exams/types/StandardTypes";
import { Spinner } from "@/components/ui/spinner";

export default function SubjectPapersPage() {
  return (
    <QueryProvider>
      <SubjectPapersContent />
    </QueryProvider>
  );
}

function SubjectPapersContent() {
  // Note: Subject papers API not yet implemented
  // This would use a hook like useSubjectPapers() if available
  const isLoading = false;
  const error = null;
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

  // Use static data for now until API is implemented
  const papers = getStaticSubjectPapers();

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

// Static subject papers data until API is implemented
function getStaticSubjectPapers(): ExamPaperMetadata[] {
  return [
    {
      id: 'sp-001',
      title: 'Pharmacology',
      description: 'Key concepts in pharmacology for pharmacists',
      difficulty: 'medium',
      topics_covered: ['Pharmacokinetics', 'Pharmacodynamics', 'Drug Interactions'],
      total_questions: 60,
      time_limit: 90,
      is_premium: false,
      source: 'subject'
    },
    {
      id: 'sp-002',
      title: 'Pharmaceutics',
      description: 'Essential pharmaceutics topics for pharmacists',
      difficulty: 'medium',
      topics_covered: ['Dosage Forms', 'Drug Delivery', 'Formulation'],
      total_questions: 50,
      time_limit: 75,
      is_premium: false,
      source: 'subject'
    },
    {
      id: 'sp-003',
      title: 'Medicinal Chemistry',
      description: 'Core medicinal chemistry concepts for pharmacy professionals',
      difficulty: 'hard',
      topics_covered: ['Drug Design', 'Structure-Activity Relationships', 'Synthesis'],
      total_questions: 45,
      time_limit: 90,
      is_premium: true,
      source: 'subject'
    },
    {
      id: 'sp-004',
      title: 'Pharmacy Practice',
      description: 'Professional pharmacy practice and patient care',
      difficulty: 'easy',
      topics_covered: ['Patient Counseling', 'Medication Therapy Management', 'Pharmacy Ethics'],
      total_questions: 55,
      time_limit: 60,
      is_premium: false,
      source: 'subject'
    },
    {
      id: 'sp-005',
      title: 'Pharmacognosy',
      description: 'Natural products and their pharmaceutical applications',
      difficulty: 'medium',
      topics_covered: ['Medicinal Plants', 'Natural Products', 'Herbal Medicine'],
      total_questions: 40,
      time_limit: 60,
      is_premium: true,
      source: 'subject'
    },
    {
      id: 'sp-006',
      title: 'Pharmaceutical Analysis',
      description: 'Analytical methods in pharmaceutical quality control',
      difficulty: 'hard',
      topics_covered: ['Spectroscopy', 'Chromatography', 'Quality Control'],
      total_questions: 35,
      time_limit: 90,
      is_premium: true,
      source: 'subject'
    }
  ];
}