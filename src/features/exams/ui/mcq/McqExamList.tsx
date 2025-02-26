'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Star,
  CheckCircle2,
  BookOpen,
  Clock,
  BarChart,
  Users,
  Loader2
} from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

import { examService } from '../../api/examService';
import { Exam } from '../../model/mcqTypes';

export const McqExamList: React.FC = () => {
  const router = useRouter();
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string | null>(null);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        setLoading(true);
        const publishedExams = await examService.getPublishedExams();
        setExams(publishedExams);
        setLoading(false);
      } catch (err) {
        setError('Failed to load exams. Please try again later.');
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  const handleStartExam = (examId: number) => {
    router.push(`/exams/${examId}`);
  };

  // Filter exams based on search term and difficulty
  const filteredExams = exams.filter(exam => {
    const matchesSearch = 
      searchTerm === '' || 
      exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDifficulty = 
      difficultyFilter === null || 
      difficultyFilter === 'all';
    
    return matchesSearch && matchesDifficulty;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading exams...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg max-w-lg text-center">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error}</p>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center md:space-y-0">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Pharmacy Exams</h1>
          <p className="text-muted-foreground">
            Test your knowledge with our comprehensive pharmacy exams
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search by title or description" 
              className="pl-10 w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select 
            onValueChange={(value) => 
              setDifficultyFilter(value === 'all' ? null : value)
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Difficulties</SelectItem>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: BookOpen, label: 'Total Exams', value: exams.length },
          { icon: Clock, label: 'Avg. Duration', value: `${Math.round(exams.reduce((acc, exam) => acc + exam.duration, 0) / exams.length || 0)} mins` },
          { icon: BarChart, label: 'Avg. Passing Score', value: `${Math.round(exams.reduce((acc, exam) => acc + exam.passingMarks, 0) / exams.length || 0)}%` },
          { icon: Users, label: 'Active Users', value: '1.2k' }
        ].map((stat, idx) => (
          <Card key={idx} className="bg-gradient-to-br from-white to-gray-50">
            <CardContent className="flex items-center p-4">
              <div className="mr-4 rounded-lg bg-primary/10 p-2">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </p>
                <p className="text-xl font-bold">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Exams List */}
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Available Exams</h2>
        <p className="text-muted-foreground">Choose an exam to start practicing</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExams.length > 0 ? (
          filteredExams.map(exam => (
            <Card key={exam.id} className="overflow-hidden transition-all hover:shadow-md">
              <CardHeader className="pb-3">
                <CardTitle>{exam.title}</CardTitle>
                <CardDescription>{exam.description}</CardDescription>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>{exam.duration} mins</span>
                    </div>
                    <div className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>{exam.questions?.length || 0} questions</span>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Passing Score</span>
                      <span className="font-medium">{exam.passingMarks}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Marks</span>
                      <span className="font-medium">{exam.totalMarks}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full"
                  onClick={() => handleStartExam(exam.id)}
                >
                  Start Exam
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No exams found</p>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or filter settings
            </p>
          </div>
        )}
      </div>

      {/* Premium Banner */}
      <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-0 overflow-hidden relative">
        <div className="absolute inset-0 bg-grid-white/10" />
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="h-6 w-6 text-yellow-500" />
            <span>Premium Practice Exams</span>
          </CardTitle>
          <CardDescription className="text-base">
            Get access to all premium exam content with detailed explanations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-6">
            <ul className="space-y-3">
              {[
                "Unlimited access to all exam types",
                "Detailed answer explanations",
                "Performance analytics and progress tracking",
                "Custom study plans based on your results"
              ].map((benefit, index) => (
                <li key={index} className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 mr-2 text-green-600 flex-shrink-0" />
                  <span className="text-sm">{benefit}</span>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-center sm:justify-end">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg"
                onClick={() => router.push('/pricing')}
              >
                Upgrade to Premium
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
