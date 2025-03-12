import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Medal, BookOpen } from "lucide-react";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { SimpleExamsSidebar } from "@/components/dashboard/SimpleExamsSidebar";

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

export default function ExamDashboardPage() {
  const calculateOverallProgress = () => {
    const totalPapers = paperCategories.reduce((sum, category) => sum + category.totalPapers, 0);
    const completedPapers = paperCategories.reduce((sum, category) => sum + category.completedPapers, 0);
    return (completedPapers / totalPapers) * 100;
  };

  return (
    <div className="flex">
      <SimpleExamsSidebar />
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Exams Preparation Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {paperCategories.map((category) => (
            <Link 
              key={category.name} 
              href={category.href} 
              className="hover:scale-[1.02] transition-transform"
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                  <category.icon className="h-8 w-8 text-blue-600" />
                  <CardTitle>{category.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">
                      Progress
                    </span>
                    <span className="text-sm font-semibold">
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

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Overall Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Progress 
                value={calculateOverallProgress()} 
                className="h-4 flex-grow" 
              />
              <span className="text-sm font-semibold">
                {calculateOverallProgress().toFixed(1)}%
              </span>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}