'use client';

import React, { useState } from 'react';
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
import { Separator } from "@/components/ui/separator";
import {
  Clock,
  BookMarked,
  Settings,
  Zap,
  Dices,
  Calendar,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { ExamPaperMetadata } from '@/features/exams/model/standardTypes';
import { ExamPaperCard } from '@/features/exams/ui/ExamPaperCard';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

export default function PracticeExamsPage() {
  const [activeTab, setActiveTab] = useState('timed');
  const router = useRouter();
  
  const handleStartPaper = (paper: ExamPaperMetadata) => {
    router.push(`/exam/${paper.id}`);
  };
  
  return (
    <Container>
      <div className="py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Practice Exams</h1>
          <p className="text-gray-600">Improve your skills with practice exams tailored to your needs</p>
        </div>
        
        <Tabs defaultValue="timed" value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="timed" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Timed Exams
            </TabsTrigger>
            <TabsTrigger value="topic" className="flex items-center gap-2">
              <BookMarked className="h-4 w-4" />
              Topic Based
            </TabsTrigger>
            <TabsTrigger value="custom" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Custom Exam
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="timed">
            <TimedExamsTab onStartPaper={handleStartPaper} />
          </TabsContent>
          
          <TabsContent value="topic">
            <TopicBasedExamsTab onStartPaper={handleStartPaper} />
          </TabsContent>
          
          <TabsContent value="custom">
            <CustomExamTab onStartPaper={handleStartPaper} />
          </TabsContent>
        </Tabs>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center">
              <Zap className="mr-2 h-5 w-5 text-yellow-600" />
              Quick Practice
            </CardTitle>
            <CardDescription>
              Start a quick practice session based on your needs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-blue-50 border-blue-200 hover:border-blue-300 hover:bg-blue-100 transition-colors">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-blue-800">Daily Challenge</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-blue-700 mb-2">
                    <Calendar className="h-4 w-4" />
                    <span>10 Questions</span>
                  </div>
                  <p className="text-sm text-blue-700">New questions every day to test your knowledge</p>
                </CardContent>
                <CardFooter>
                  <Button variant="secondary" className="w-full bg-blue-600 text-white hover:bg-blue-700">
                    Start Challenge
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="bg-purple-50 border-purple-200 hover:border-purple-300 hover:bg-purple-100 transition-colors">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-purple-800">Mistake Review</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-purple-700 mb-2">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Focus on mistakes</span>
                  </div>
                  <p className="text-sm text-purple-700">Review questions you've answered incorrectly</p>
                </CardContent>
                <CardFooter>
                  <Button variant="secondary" className="w-full bg-purple-600 text-white hover:bg-purple-700">
                    Start Review
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="bg-green-50 border-green-200 hover:border-green-300 hover:bg-green-100 transition-colors">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-green-800">Random Quiz</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-green-700 mb-2">
                    <Dices className="h-4 w-4" />
                    <span>20 Random Questions</span>
                  </div>
                  <p className="text-sm text-green-700">Quick quiz with randomly selected questions</p>
                </CardContent>
                <CardFooter>
                  <Button variant="secondary" className="w-full bg-green-600 text-white hover:bg-green-700">
                    Start Quiz
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}

/**
 * Timed Exams Tab Component
 */
function TimedExamsTab({ onStartPaper }: { onStartPaper: (paper: ExamPaperMetadata) => void }) {
  const timedExams: ExamPaperMetadata[] = [
    {
      id: 'tp-001',
      title: '30-Minute Quick Review',
      description: 'A quick practice session covering key topics',
      difficulty: 'easy',
      topics_covered: ['Key Concepts', 'Basic Principles', 'Common Medications'],
      total_questions: 30,
      time_limit: 30,
      is_premium: false,
      source: 'practice'
    },
    {
      id: 'tp-002',
      title: 'Full-Length Practice Exam',
      description: 'Comprehensive practice exam simulating the real thing',
      difficulty: 'hard',
      topics_covered: ['Comprehensive', 'Timed Practice', 'Exam Simulation'],
      total_questions: 100,
      time_limit: 180,
      is_premium: true,
      source: 'practice'
    },
    {
      id: 'tp-003',
      title: '60-Minute Mixed Topics',
      description: 'Medium difficulty practice on varied topics',
      difficulty: 'medium',
      topics_covered: ['Mixed Topics', 'Practice', 'Timed Session'],
      total_questions: 50,
      time_limit: 60,
      is_premium: false,
      source: 'practice'
    }
  ];
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Timed Practice Exams</h2>
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          Best for exam simulation
        </Badge>
      </div>
      
      <p className="mb-6 text-gray-600">
        Timed exams simulate the actual testing environment with a countdown timer and full-length tests.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {timedExams.map((paper) => (
          <ExamPaperCard
            key={paper.id}
            paper={paper}
            onStart={onStartPaper}
          />
        ))}
      </div>
      
      <div className="flex justify-center">
        <Button variant="outline" className="gap-2">
          View All Timed Exams
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

/**
 * Topic Based Exams Tab Component
 */
function TopicBasedExamsTab({ onStartPaper }: { onStartPaper: (paper: ExamPaperMetadata) => void }) {
  const topics = [
    { id: 'pharmacology', name: 'Pharmacology', count: 120 },
    { id: 'medicinal-chemistry', name: 'Medicinal Chemistry', count: 85 },
    { id: 'pharmacy-practice', name: 'Pharmacy Practice', count: 150 },
    { id: 'pharmaceutics', name: 'Pharmaceutics', count: 75 },
    { id: 'pharmacognosy', name: 'Pharmacognosy', count: 60 },
    { id: 'clinical-pharmacy', name: 'Clinical Pharmacy', count: 110 }
  ];
  
  const topicExams: ExamPaperMetadata[] = [
    {
      id: 'tp-101',
      title: 'Pharmaceutical Calculations',
      description: 'Focus on pharmacy math and calculations',
      difficulty: 'medium',
      topics_covered: ['Calculations', 'Dosing', 'Compounding Math'],
      total_questions: 40,
      time_limit: 60,
      is_premium: false,
      source: 'practice'
    },
    {
      id: 'tp-102',
      title: 'Drug Interactions',
      description: 'Important drug interactions and contraindications',
      difficulty: 'hard',
      topics_covered: ['Interactions', 'Pharmacokinetics', 'Safety'],
      total_questions: 35,
      time_limit: 45,
      is_premium: true,
      source: 'practice'
    },
    {
      id: 'tp-103',
      title: 'OTC Medications',
      description: 'Over-the-counter drugs and counseling',
      difficulty: 'easy',
      topics_covered: ['OTC', 'Self-Care', 'Patient Counseling'],
      total_questions: 30,
      time_limit: 30,
      is_premium: false,
      source: 'practice'
    }
  ];
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Topic-Based Practice</h2>
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          Great for targeted study
        </Badge>
      </div>
      
      <p className="mb-6 text-gray-600">
        Focus your study on specific topics to strengthen your knowledge in particular areas.
      </p>
      
      <div className="mb-8 p-4 bg-slate-50 rounded-lg">
        <h3 className="font-medium mb-4">Popular Topics</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {topics.map(topic => (
            <Button 
              key={topic.id} 
              variant="outline" 
              className="justify-between bg-white border-slate-200 hover:bg-slate-100"
            >
              <span>{topic.name}</span>
              <Badge variant="secondary" className="ml-2">{topic.count}</Badge>
            </Button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {topicExams.map((paper) => (
          <ExamPaperCard
            key={paper.id}
            paper={paper}
            onStart={onStartPaper}
          />
        ))}
      </div>
      
      <div className="flex justify-center">
        <Button variant="outline" className="gap-2">
          Browse All Topics
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

/**
 * Custom Exam Builder Tab Component
 */
function CustomExamTab({ onStartPaper }: { onStartPaper: (paper: ExamPaperMetadata) => void }) {
  const [questionCount, setQuestionCount] = useState(50);
  const [timeLimit, setTimeLimit] = useState(60);
  const [difficulty, setDifficulty] = useState('medium');
  const [includePreviousMistakes, setIncludePreviousMistakes] = useState(true);
  
  const topics = [
    { id: 'pharmacology', label: 'Pharmacology' },
    { id: 'medicinal-chemistry', label: 'Medicinal Chemistry' },
    { id: 'pharmacy-practice', label: 'Pharmacy Practice' },
    { id: 'pharmaceutics', label: 'Pharmaceutics' },
    { id: 'pharmacognosy', label: 'Pharmacognosy' },
    { id: 'clinical-pharmacy', label: 'Clinical Pharmacy' }
  ];
  
  const handleCreateExam = () => {
    // Create a custom exam object
    const customExam: ExamPaperMetadata = {
      id: `custom-${Date.now()}`,
      title: 'Custom Practice Exam',
      description: `A custom ${timeLimit}-minute exam with ${questionCount} questions`,
      difficulty: difficulty,
      topics_covered: topics.slice(0, 3).map(t => t.label), // Just an example
      total_questions: questionCount,
      time_limit: timeLimit,
      is_premium: false,
      source: 'practice'
    };
    
    onStartPaper(customExam);
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Custom Exam Builder</h2>
        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
          Tailored to your needs
        </Badge>
      </div>
      
      <p className="mb-6 text-gray-600">
        Create a custom practice exam by selecting your preferences below.
      </p>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Configure Your Exam</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Number of Questions */}
          <div>
            <div className="flex justify-between mb-2">
              <Label>Number of Questions</Label>
              <span className="font-medium">{questionCount} questions</span>
            </div>
            <Slider
              value={[questionCount]}
              min={10}
              max={100}
              step={5}
              onValueChange={(value) => setQuestionCount(value[0])}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>10</span>
              <span>50</span>
              <span>100</span>
            </div>
          </div>
          
          <Separator />
          
          {/* Time Limit */}
          <div>
            <div className="flex justify-between mb-2">
              <Label>Time Limit</Label>
              <span className="font-medium">{timeLimit} minutes</span>
            </div>
            <Slider
              value={[timeLimit]}
              min={10}
              max={180}
              step={5}
              onValueChange={(value) => setTimeLimit(value[0])}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>10 min</span>
              <span>1 hour</span>
              <span>3 hours</span>
            </div>
          </div>
          
          <Separator />
          
          {/* Difficulty */}
          <div>
            <Label className="mb-3 block">Difficulty Level</Label>
            <div className="grid grid-cols-3 gap-4">
              <Button
                variant={difficulty === 'easy' ? 'default' : 'outline'}
                className={`flex flex-col py-3 ${difficulty === 'easy' ? '' : 'border-green-200 text-green-700 hover:bg-green-50'}`}
                onClick={() => setDifficulty('easy')}
              >
                <span className="text-lg font-bold mb-1">Easy</span>
                <span className="text-xs">Introductory concepts</span>
              </Button>
              
              <Button
                variant={difficulty === 'medium' ? 'default' : 'outline'}
                className={`flex flex-col py-3 ${difficulty === 'medium' ? '' : 'border-yellow-200 text-yellow-700 hover:bg-yellow-50'}`}
                onClick={() => setDifficulty('medium')}
              >
                <span className="text-lg font-bold mb-1">Medium</span>
                <span className="text-xs">Intermediate practice</span>
              </Button>
              
              <Button
                variant={difficulty === 'hard' ? 'default' : 'outline'}
                className={`flex flex-col py-3 ${difficulty === 'hard' ? '' : 'border-red-200 text-red-700 hover:bg-red-50'}`}
                onClick={() => setDifficulty('hard')}
              >
                <span className="text-lg font-bold mb-1">Hard</span>
                <span className="text-xs">Advanced concepts</span>
              </Button>
            </div>
          </div>
          
          <Separator />
          
          {/* Topics */}
          <div>
            <Label className="mb-3 block">Topics to Include</Label>
            <div className="grid grid-cols-2 gap-4">
              {topics.map(topic => (
                <div 
                  key={topic.id} 
                  className="flex items-center space-x-2 bg-white p-3 rounded-md border"
                >
                  <Checkbox id={`topic-${topic.id}`} defaultChecked={topic.id === 'pharmacology' || topic.id === 'pharmacy-practice'} />
                  <Label htmlFor={`topic-${topic.id}`} className="flex-1 cursor-pointer">
                    {topic.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <Separator />
          
          {/* Additional Options */}
          <div>
            <Label className="mb-3 block">Additional Options</Label>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="prev-mistakes">Include previous mistakes</Label>
                  <p className="text-sm text-gray-500">
                    Include questions you've answered incorrectly before
                  </p>
                </div>
                <Switch
                  id="prev-mistakes"
                  checked={includePreviousMistakes}
                  onCheckedChange={setIncludePreviousMistakes}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="immediate-feedback">Immediate feedback</Label>
                  <p className="text-sm text-gray-500">
                    Show correct answers immediately after answering
                  </p>
                </div>
                <Switch id="immediate-feedback" />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-gray-50 flex justify-between">
          <Button variant="outline">
            Reset Defaults
          </Button>
          <Button onClick={handleCreateExam}>
            Create & Start Exam
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}