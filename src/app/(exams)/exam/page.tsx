import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Medal, BookOpen } from "lucide-react";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { useMobileStore, selectIsMobile } from '../../../features/core/app-mobile-handler';

interface PaperCategory {
  name: string;
  href: string;
  icon: React.ComponentType<{className?: string}>;
  totalPapers: number;
  completedPapers: number;
}

const paperCategories: PaperCategory[] = [
  {
    name: 'Past Papers',
    href: '/exam/past-papers',
    icon: FileText,
    totalPapers: 50,
    completedPapers: 15
  },
  {
    name: 'Model Papers',
    href: '/exam/model-papers',
    icon: Medal,
    totalPapers: 30,
    completedPapers: 10
  },
  {
    name: 'Subject Papers',
    href: '/exam/subject-papers',
    icon: BookOpen,
    totalPapers: 40,
    completedPapers: 20
  }
];

export default function ExamPage() {
  const calculateOverallProgress = () => {
    const totalPapers = paperCategories.reduce((sum, category) => sum + category.totalPapers, 0);
    const completedPapers = paperCategories.reduce((sum, category) => sum + category.completedPapers, 0);
    return (completedPapers / totalPapers) * 100;
  };

  // Client component workaround for 'use client' directive in Next.js
  // This is a server component, so we'll use conditional CSS classes instead
  // and the component will adapt when hydrated on the client

  return (
    <main className="p-3 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">
        Exams
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {paperCategories.map((category) => (
          <Link 
            key={category.name} 
            href={category.href} 
            className="hover:scale-[1.02] transition-transform"
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center space-x-4 pb-2 p-3 sm:p-6 sm:pb-2">
                <category.icon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                <CardTitle className="text-base sm:text-lg">{category.name}</CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-6 pt-2 sm:pt-2">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs sm:text-sm text-gray-600">
                    Progress
                  </span>
                  <span className="text-xs sm:text-sm font-semibold">
                    {category.completedPapers} / {category.totalPapers}
                  </span>
                </div>
                <Progress 
                  value={(category.completedPapers / category.totalPapers) * 100} 
                  className="h-2"
                />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="mt-4 sm:mt-6">
        <CardHeader className="p-3 sm:p-6">
          <CardTitle className="text-base sm:text-lg">Overall Progress</CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-6 pt-2 sm:pt-2">
          <div className="flex items-center space-x-4">
            <Progress 
              value={calculateOverallProgress()} 
              className="h-3 sm:h-4 flex-grow" 
            />
            <span className="text-xs sm:text-sm font-semibold">
              {calculateOverallProgress().toFixed(1)}%
            </span>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}