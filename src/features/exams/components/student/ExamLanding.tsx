"use client";

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Star,
  CheckCircle2,
  BookOpen,
  Clock,
  BarChart,
  Users
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
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';

import { ExamPaperCard } from './ExamPaperCard';
import { 
  ExamPaperMetadata, 
  UserExamProgress 
} from '../model/types';

interface ExamLandingProps {
  modelPapers?: ExamPaperMetadata[];
  pastPapers?: ExamPaperMetadata[];
  userProgress?: UserExamProgress;
}

export const ExamLanding: React.FC<ExamLandingProps> = ({ 
  modelPapers = [], 
  pastPapers = [], 
  userProgress = {
    completedPapers: [],
    premium_access: false,
    papers_progress: []
  }
}) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [difficulty, setDifficulty] = useState<string | null>(null);

  const filterPapers = (papers: ExamPaperMetadata[]) => {
    return papers.filter(paper => {
      if (!paper || !paper.title || !paper.topics_covered) return false;
      return (searchTerm === '' || 
        (paper.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        paper.topics_covered?.some(topic => 
          topic?.toLowerCase().includes(searchTerm.toLowerCase())
        ))
      ) &&
      (difficulty === null || paper.difficulty === difficulty);
    });
  };

  const handleStartPaper = (paper: ExamPaperMetadata) => {
    if (paper.is_premium && !userProgress?.premium_access) {
      router.push('/pricing');
      return;
    }
    router.push(`/exam/${paper.id}`);
  };

  const difficultiesAvailable = useMemo(() => {
    const difficulties = new Set<string>();
    modelPapers?.forEach(p => p?.difficulty && difficulties.add(p.difficulty));
    pastPapers?.forEach(p => p?.difficulty && difficulties.add(p.difficulty));
    return Array.from(difficulties);
  }, [modelPapers, pastPapers]);

  const capitalize = (str?: string) => 
    str ? str.charAt(0).toUpperCase() + str.slice(1) : '';

  const renderPaperSection = (
    title: string, 
    description: string, 
    papers: ExamPaperMetadata[]
  ) => {
    const filteredPapers = filterPapers(papers);
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
          <p className="text-muted-foreground">{description}</p>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: BookOpen, label: 'Total Papers', value: papers.length },
            { icon: Clock, label: 'Avg. Duration', value: '180 mins' },
            { icon: BarChart, label: 'Completion Rate', value: '75%' },
            { icon: Users, label: 'Active Users', value: '2.5k' }
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPapers.length > 0 ? (
            filteredPapers.map(paper => paper && (
              <ExamPaperCard 
                key={paper.id}
                paper={paper}
                progress={
                  userProgress?.papers_progress?.find(p => p.paperId === paper.id)
                }
                onStart={handleStartPaper}
              />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
              <Search className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">No papers found</p>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search or filter settings
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center md:space-y-0">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Exam Practice</h1>
          <p className="text-muted-foreground">
            Prepare for your pharmacy exams with our comprehensive question bank
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search papers by title or topics" 
              className="pl-10 w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select 
            onValueChange={(value) => 
              setDifficulty(value === 'all' ? null : value)
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Difficulties</SelectItem>
              {difficultiesAvailable.map(diff => (
                <SelectItem key={diff} value={diff}>
                  {capitalize(diff)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="model" className="space-y-8">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
          <TabsTrigger value="model">Model Papers</TabsTrigger>
          <TabsTrigger value="past">Past Papers</TabsTrigger>
        </TabsList>

        <TabsContent value="model" className="space-y-8">
          {renderPaperSection(
            'Model Papers', 
            'Practice with our curated model papers to prepare for your exam.', 
            modelPapers
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-8">
          {renderPaperSection(
            'Past Papers', 
            'Review actual exam papers from previous years.', 
            pastPapers
          )}
        </TabsContent>
      </Tabs>

      {!userProgress?.premium_access && (
        <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-0 overflow-hidden relative">
          <div className="absolute inset-0 bg-grid-white/10" />
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="h-6 w-6 text-yellow-500" />
              <span>Unlock Premium Access</span>
            </CardTitle>
            <CardDescription className="text-base">
              Get access to all model papers and past papers with detailed explanations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-6">
              <ul className="space-y-3">
                {[
                  "Unlimited access to all model papers",
                  "Complete past paper archive",
                  "Comprehensive answer explanations",
                  "Advanced progress tracking & analytics"
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
      )}
    </div>
  );
};