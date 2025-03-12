'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Container } from "@/components/layout/container";
import {
  Layers,
  Users,
  BookOpen,
  GraduationCap,
  Medal,
  FileText,
  Clock,
  BarChart,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";

export default function ExamsSummaryPage() {
  const router = useRouter();
  
  const stats = {
    availableExams: 120,
    activeUsers: 2500,
    topicsAvailable: 35,
    averageScore: 76
  };
  
  const recentlyAdded = [
    {
      id: 'new-1',
      title: '2024 Pharmacy Board Preparation Exam',
      type: 'Model Paper',
      questions: 100,
      timeLimit: 180,
      difficulty: 'hard'
    },
    {
      id: 'new-2',
      title: 'Pharmaceutical Calculations Master Class',
      type: 'Subject Paper',
      questions: 40,
      timeLimit: 60,
      difficulty: 'medium'
    },
    {
      id: 'new-3',
      title: 'Clinical Pharmacy Practice Intensive',
      type: 'Model Paper',
      questions: 75,
      timeLimit: 90,
      difficulty: 'hard'
    }
  ];
  
  const topPerforming = [
    {
      id: 'top-1',
      title: 'Pharmacology Basics',
      completions: 2354,
      avgScore: 82,
      successRate: 89
    },
    {
      id: 'top-2',
      title: 'OTC Medications',
      completions: 1987,
      avgScore: 78,
      successRate: 86
    },
    {
      id: 'top-3',
      title: 'Pharmacy Law & Ethics',
      completions: 1756,
      avgScore: 75,
      successRate: 81
    }
  ];
  
  return (
    <Container>
      <div className="py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Pharmacy Exams Hub</h1>
          <p className="text-gray-600">Comprehensive exam preparation for pharmacy professionals</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<Layers className="h-8 w-8 text-blue-500" />}
            title="Available Exams"
            value={stats.availableExams.toString()}
            description="Across all categories"
            color="blue"
          />
          
          <StatCard
            icon={<Users className="h-8 w-8 text-purple-500" />}
            title="Active Users"
            value={stats.activeUsers.toLocaleString()}
            description="Learning together"
            color="purple"
          />
          
          <StatCard
            icon={<BookOpen className="h-8 w-8 text-green-500" />}
            title="Topics Available"
            value={stats.topicsAvailable.toString()}
            description="Specialized subjects"
            color="green"
          />
          
          <StatCard
            icon={<BarChart className="h-8 w-8 text-amber-500" />}
            title="Average Score"
            value={`${stats.averageScore}%`}
            description="Community performance"
            color="amber"
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Medal className="mr-2 h-5 w-5 text-blue-600" />
                Recently Added Exams
              </CardTitle>
              <CardDescription>
                New exam papers added to our collection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentlyAdded.map((exam) => (
                  <div 
                    key={exam.id}
                    className="p-4 border rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer"
                    onClick={() => router.push(`/exam/${exam.id}`)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{exam.title}</h3>
                      <Badge variant="outline" className={
                        exam.difficulty === 'easy' ? 'bg-green-50 text-green-700 border-green-200' :
                        exam.difficulty === 'medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                        'bg-red-50 text-red-700 border-red-200'
                      }>
                        {exam.difficulty}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-1 text-gray-500" />
                        {exam.type}
                      </div>
                      <div className="flex items-center">
                        <GraduationCap className="h-4 w-4 mr-1 text-gray-500" />
                        {exam.questions} questions
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-gray-500" />
                        {exam.timeLimit} minutes
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button variant="outline" className="w-full md:w-auto" onClick={() => router.push('/exam/dashboard')}>
                Browse All Exams <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <CheckCircle2 className="mr-2 h-5 w-5 text-green-600" />
                Top Performing Exams
              </CardTitle>
              <CardDescription>
                Most popular and successful exams
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {topPerforming.map((exam) => (
                <div key={exam.id} className="border-b pb-4 last:border-0 last:pb-0">
                  <h3 className="font-medium mb-2">{exam.title}</h3>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="flex flex-col items-center p-2 bg-slate-50 rounded">
                      <span className="text-gray-500">Completions</span>
                      <span className="font-semibold">{exam.completions}</span>
                    </div>
                    <div className="flex flex-col items-center p-2 bg-slate-50 rounded">
                      <span className="text-gray-500">Avg. Score</span>
                      <span className="font-semibold">{exam.avgScore}%</span>
                    </div>
                    <div className="flex flex-col items-center p-2 bg-slate-50 rounded">
                      <span className="text-gray-500">Success</span>
                      <span className="font-semibold">{exam.successRate}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full" onClick={() => router.push('/exam/model-papers')}>
                See All Top Exams
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Study Options</CardTitle>
            <CardDescription>Choose how you want to prepare for your exams</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="guided">
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="guided">Guided Study</TabsTrigger>
                <TabsTrigger value="subject">By Subject</TabsTrigger>
                <TabsTrigger value="papers">Full Papers</TabsTrigger>
                <TabsTrigger value="custom">Custom Practice</TabsTrigger>
              </TabsList>
              
              <TabsContent value="guided">
                <div className="text-center p-6 bg-blue-50 rounded-lg border border-blue-200">
                  <GraduationCap className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Guided Study Path</h3>
                  <p className="mb-4 text-blue-700">
                    Follow a structured learning path tailored to your needs and progress at your own pace.
                  </p>
                  <Button onClick={() => router.push('/exam/dashboard')}>
                    Start Guided Path
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="subject">
                <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
                  <BookOpen className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Subject-Based Learning</h3>
                  <p className="mb-4 text-green-700">
                    Focus on specific pharmacy topics with targeted questions and comprehensive explanations.
                  </p>
                  <Button onClick={() => router.push('/exam/subject-papers')}>
                    Browse Subjects
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="papers">
                <div className="text-center p-6 bg-purple-50 rounded-lg border border-purple-200">
                  <FileText className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Full Exam Papers</h3>
                  <p className="mb-4 text-purple-700">
                    Practice with complete exam papers including past papers and model exams for comprehensive preparation.
                  </p>
                  <Button onClick={() => router.push('/exam/past-papers')}>
                    View All Papers
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="custom">
                <div className="text-center p-6 bg-amber-50 rounded-lg border border-amber-200">
                  <Medal className="h-12 w-12 text-amber-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Custom Practice</h3>
                  <p className="mb-4 text-amber-700">
                    Create your own practice sessions by selecting topics, difficulty, and time constraints.
                  </p>
                  <Button onClick={() => router.push('/exam/practice')}>
                    Create Custom Exam
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
  color: 'blue' | 'purple' | 'green' | 'amber' | 'red';
}

function StatCard({ icon, title, value, description, color }: StatCardProps) {
  const bgColor = {
    blue: 'bg-blue-50 border-blue-200',
    purple: 'bg-purple-50 border-purple-200',
    green: 'bg-green-50 border-green-200',
    amber: 'bg-amber-50 border-amber-200',
    red: 'bg-red-50 border-red-200'
  };
  
  return (
    <Card className={`${bgColor[color]}`}>
      <CardContent className="pt-6">
        <div className="flex items-center gap-4">
          <div>
            {icon}
          </div>
          <div>
            <h3 className="text-lg font-semibold">{value}</h3>
            <p className="text-sm text-gray-600">{title}</p>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">{description}</p>
      </CardContent>
    </Card>
  );
}