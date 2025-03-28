'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Medal, BookOpen, Clock } from "lucide-react";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { useExamStats } from "@/features/exams/api/UseExamApi";
import { QueryProvider } from "@/features/core/app-api-handler/components/QueryProvider";
import { Spinner } from "@/components/ui/spinner";

export default function ExamDashboardPage() {
  return (
    <QueryProvider>
      <DashboardContent />
    </QueryProvider>
  );
}

function DashboardContent() {
  const { data: examStats, isLoading } = useExamStats();

  // Static categories for now
  const paperCategories = [
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

  const calculateOverallProgress = () => {
    const totalPapers = paperCategories.reduce((sum, category) => sum + category.totalPapers, 0);
    const completedPapers = paperCategories.reduce((sum, category) => sum + category.completedPapers, 0);
    return (completedPapers / totalPapers) * 100;
  };

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center">
          <Spinner className="h-12 w-12 text-primary" />
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="p-6">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card>
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

        <Card>
          <CardHeader>
            <CardTitle>Exam Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Papers</p>
                  <p className="text-lg font-semibold">{examStats?.totalPapers || paperCategories.reduce((sum, cat) => sum + cat.totalPapers, 0)}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <Clock className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Avg. Duration</p>
                  <p className="text-lg font-semibold">{examStats?.avgDuration || 60} mins</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="bg-purple-100 p-3 rounded-full">
                  <Medal className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Completion Rate</p>
                  <p className="text-lg font-semibold">{examStats?.completionRate || 75}%</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="bg-yellow-100 p-3 rounded-full">
                  <BookOpen className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active Users</p>
                  <p className="text-lg font-semibold">{examStats?.activeUsers || 2500}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}