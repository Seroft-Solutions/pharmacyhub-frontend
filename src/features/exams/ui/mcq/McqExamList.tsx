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
  Loader2,
  RefreshCcw,
  AlertTriangle
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
import { useAuth } from '@/shared/auth';

export const McqExamList: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Debug log for authentication state
  useEffect(() => {
    console.log('Auth state:', { isAuthenticated, authLoading, user });
    
    // Debug tokens in localStorage
    const authToken = localStorage.getItem('auth_token');
    const accessToken = localStorage.getItem('access_token');
    const tokenExpiry = localStorage.getItem('token_expiry');
    
    console.log('Tokens:', { 
      authToken: authToken ? `${authToken.substring(0, 10)}...` : null,
      accessToken: accessToken ? `${accessToken.substring(0, 10)}...` : null,
      tokenExpiry
    });
  }, [isAuthenticated, authLoading, user]);

  // Fetch exams effect with retry mechanism
  useEffect(() => {
    const fetchExams = async () => {
      if (authLoading) {
        console.log('Auth is still loading, waiting...');
        return;
      }
      
      try {
        console.log('Attempting to fetch exams...');
        setLoading(true);
        setError(null);
        setDebugInfo(null);
        setSuccessMessage(null);
        
        const publishedExams = await examService.getPublishedExams();
        console.log('Exams fetched successfully:', publishedExams.length);
        setExams(publishedExams);
        setLoading(false);
        
        // Show success message on retry success
        if (retryCount > 0) {
          setSuccessMessage('Exam data has been refreshed successfully');
          // Clear success message after 3 seconds
          setTimeout(() => setSuccessMessage(null), 3000);
        }
      } catch (err) {
        console.error('Failed to load exams:', err);
        
        const errorMsg = err instanceof Error ? err.message : 'Failed to load exams. Please try again later.';
        console.log('Setting error message:', errorMsg);
        setError(errorMsg);
        
        // Store debug info
        setDebugInfo({
          error: err,
          apiUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
          endpoint: '/v1/exams/published',
          auth: isAuthenticated,
          timestamp: new Date().toISOString()
        });
        
        setLoading(false);
      }
    };

    fetchExams();
  }, [isAuthenticated, authLoading, retryCount]);

  const handleStartExam = (examId: number) => {
    router.push(`/exam/${examId}`);
  };
  
  const handleRetry = () => {
    console.log('Retrying exam fetch...');
    setRetryCount(prev => prev + 1);
  };
  
  const handleLogin = () => {
    console.log('Redirecting to login page...');
    // Save the current URL to redirect back after login
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('redirectAfterLogin', '/exam');
    }
    router.push('/login');
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

  if (authLoading || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
        <span className="text-lg">{authLoading ? 'Checking authentication...' : 'Loading exams...'}</span>
        <p className="text-sm text-muted-foreground mt-2">
          This may take a moment. Please wait.
        </p>
      </div>
    );
  }

  if (error) {
    const isCorsError = error.toString().includes('CORS');
    const isAuthError = error.toString().includes('403') || 
                        error.toString().includes('401') || 
                        error.toString().includes('Forbidden') || 
                        error.toString().includes('Unauthorized');
    
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-red-50 text-red-600 p-6 rounded-lg max-w-lg text-center shadow-md">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p className="mb-4">{error.toString()}</p>
          <div className="space-y-2">
            <Button className="w-full" onClick={handleRetry}>
              <RefreshCcw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            <p className="text-xs text-red-500 mt-2">
              Server Status: {navigator.onLine ? 'Your internet connection appears to be working.' : 'You appear to be offline.'}
            </p>
            <details className="mt-4 text-left">
              <summary className="cursor-pointer text-sm">Troubleshooting Steps</summary>
              <ul className="list-disc pl-5 mt-2 text-sm">
                <li>Make sure the backend server is running at {process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api'}</li>
                <li>Check that published exams exist in the database</li>
                <li>Check browser console for detailed network errors</li>
                {isCorsError && (
                  <li>If CORS errors persist, verify your SecurityConfig.java CORS settings allow <code>{window.location.origin}</code></li>
                )}
              </ul>
            </details>
            
            {debugInfo && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm">Debug Information</summary>
                <pre className="text-xs mt-2 p-2 bg-gray-100 rounded overflow-auto">
                  {JSON.stringify(debugInfo, null, 2)}
                </pre>
              </details>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-8">
      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 text-green-600 p-4 rounded-lg mb-4 flex items-center shadow-sm">
          <CheckCircle2 className="h-5 w-5 mr-2" />
          {successMessage}
        </div>
      )}
      
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
            <p className="text-sm text-muted-foreground mb-4">
              Try adjusting your search or filter settings
            </p>
            <Button variant="outline" onClick={handleRetry}>
              <RefreshCcw className="mr-2 h-4 w-4" />
              Refresh Exams
            </Button>
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
