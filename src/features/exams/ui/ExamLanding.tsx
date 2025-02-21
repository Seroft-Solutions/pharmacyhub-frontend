"use client";

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Star, 
  Filter, 
  CheckCircle2 
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
      // Ensure paper is not undefined and has required properties
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
      <div className="space-y-4">
        <h2 className="text-3xl font-bold">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
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
            <div className="col-span-full text-center py-8 text-muted-foreground">
              No papers found matching your search.
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="container py-8 space-y-8">
      <div className="flex space-x-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search papers by title or topics" 
            className="pl-10"
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

      <Tabs defaultValue="model">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="model">Model Papers</TabsTrigger>
          <TabsTrigger value="past">Past Papers</TabsTrigger>
        </TabsList>

        <TabsContent value="model">
          {renderPaperSection(
            'Model Papers', 
            'Practice with our curated model papers to prepare for your exam.', 
            modelPapers
          )}
        </TabsContent>

        <TabsContent value="past">
          {renderPaperSection(
            'Past Papers', 
            'Review actual exam papers from previous years.', 
            pastPapers
          )}
        </TabsContent>
      </Tabs>

      {!userProgress?.premium_access && (
        <Card className="bg-gradient-to-r from-purple-100 to-indigo-100 border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="h-6 w-6 text-yellow-500" />
              <span>Unlock Premium Access</span>
            </CardTitle>
            <CardDescription>
              Get access to all model papers and past papers with detailed explanations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {[
                "Unlimited access to all model papers",
                "Complete past paper archive",
                "Comprehensive answer explanations",
                "Advanced progress tracking & analytics"
              ].map((benefit, index) => (
                <li key={index} className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button 
              size="lg" 
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
              onClick={() => router.push('/pricing')}
            >
              Upgrade to Premium
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};